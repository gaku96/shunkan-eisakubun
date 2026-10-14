#!/usr/bin/env python3
"""
safe_gemini_audio_generator.py

Google AI Studioの制限（10 RPM）に絶対に引っかからない
完全安全ペース制御付き Gemini 3.8 Flash TTS 音声生成スクリプト。

特徴:
1. スライディングウィンドウ方式による厳密なレートリミッター（デフォルト 8 RPM = 60秒間に最大8回）
   -> 429 エラー（クォータ超過・一時停止）の発生を数学的に防止。
2. 既存の正常な音声ファイル（>1KB）は自動スキップ（無駄なAPI呼び出しゼロ）。
3. 万一のネットワーク一時障害に対する自動指数バックオフ。
4. 途中中断・再開に完全対応（中断しても生成済みファイルは保持）。
"""

import argparse
import base64
import collections
import getpass
import json
import os
import re
import struct
import subprocess
import sys
import time
import urllib.error
import urllib.request

class SlidingWindowRateLimiter:
    """60秒間に許可される最大リクエスト数を超えないよう正確に制御するレートリミッター"""
    def __init__(self, max_per_minute: int = 8):
        self.max_per_minute = max_per_minute
        self.window = 60.0
        self.timestamps = collections.deque()

    def wait(self):
        now = time.time()
        # 60秒以上前のタイムスタンプを削除
        while self.timestamps and self.timestamps[0] <= now - self.window:
            self.timestamps.popleft()

        # 制限枠に達している場合は、最も古いリクエストが60秒経過するまで待機
        if len(self.timestamps) >= self.max_per_minute:
            oldest = self.timestamps[0]
            sleep_needed = (oldest + self.window) - now + 0.15
            if sleep_needed > 0:
                print(f"   ⏱️ レート制限保護待機: {sleep_needed:.1f}秒 (安全枠: {self.max_per_minute} RPM)...", end="\r", flush=True)
                time.sleep(sleep_needed)
                print(" " * 60, end="\r", flush=True)

        self.timestamps.append(time.time())

def pcm_to_wav(pcm_data: bytes, sample_rate: int = 24000, num_channels: int = 1, bits_per_sample: int = 16) -> bytes:
    """PCM生データをWAVヘッダー付きバイナリに変換"""
    byte_rate = (sample_rate * num_channels * bits_per_sample) // 8
    block_align = (num_channels * bits_per_sample) // 8
    data_size = len(pcm_data)
    header = bytearray(44)
    struct.pack_into('<4sI4s4sIHHIIHH4sI', header, 0,
        b'RIFF', 36 + data_size, b'WAVE', b'fmt ',
        16, 1, num_channels, sample_rate, byte_rate, block_align, bits_per_sample,
        b'data', data_size
    )
    return bytes(header) + pcm_data

def call_gemini_tts(text: str, api_key: str, limiter: SlidingWindowRateLimiter, model: str = "gemini-3.8-flash-tts", voice: str = "Kore", lang: str = "en") -> bytes:
    """レートリミッターを通過させてGemini TTS APIを呼び出す"""
    limiter.wait()

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    style_prompt = (
        "natural, clear, polite and warm Japanese narration by a native speaker with authentic standard Tokyo intonation"
        if lang == "ja" else
        "natural, authentic native General American English with distinct American rhoticity, flap 't', and smooth conversational American connected speech at a brisk, natural conversational native pace"
    )

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": text, "speechMetadata": {"style": style_prompt}}]
            }
        ],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}
            }
        }
    }

    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"})

    for attempt in range(1, 5):
        try:
            with urllib.request.urlopen(req, timeout=45) as response:
                res_data = json.loads(response.read().decode("utf-8"))

            candidate = res_data.get("candidates", [{}])[0]
            part = candidate.get("content", {}).get("parts", [{}])[0]
            inline = part.get("inlineData", {})
            b64_data = inline.get("data")
            if not b64_data:
                raise ValueError("No audio data returned in response")

            raw_bytes = base64.b64decode(b64_data)
            mime = inline.get("mimeType", "audio/wav")
            if "pcm" in mime or "raw" in mime or not mime.startswith("audio/"):
                return pcm_to_wav(raw_bytes, sample_rate=24000)
            return raw_bytes

        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            if e.code == 429:
                wait_sec = attempt * 25
                print(f"\n   ⚠️ 外部レートリミット検知 (429) -> {wait_sec}秒待機後に再試行...")
                time.sleep(wait_sec)
            else:
                raise RuntimeError(f"HTTP {e.code}: {body}")
        except Exception as e:
            if attempt == 4: raise
            time.sleep(3)

    raise RuntimeError("API呼び出しがリトライ上限を超過しました")

def save_as_mp3(wav_bytes: bytes, out_path: str):
    """WAVバイナリを軽量高音質MP3にエンコード"""
    temp_wav = out_path + ".tmp.wav"
    try:
        with open(temp_wav, "wb") as f:
            f.write(wav_bytes)
        subprocess.run(["lame", "-b", "64", "-m", "m", temp_wav, out_path], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    finally:
        if os.path.exists(temp_wav):
            os.remove(temp_wav)

def load_all_cards(root_dir: str):
    """data.jsから口語構文(267問)とGRIT構文(90問)の全357問を確実にロード"""
    node_script = """
    const fs = require('fs');
    const vm = require('vm');
    const path = require('path');
    const dataJs = fs.readFileSync(path.join(process.argv[1], 'data.js'), 'utf8');
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(dataJs, sandbox);
    const cards = [];
    for (const p of sandbox.window.PATTERNS || []) {
      for (let i = 0; i < p.examples.length; i++) {
        cards.push({ id: `${p.id}-${i}`, en: p.examples[i].en, ja: p.examples[i].ja });
      }
    }
    for (const p of sandbox.window.GRIT_PATTERNS || []) {
      for (let i = 0; i < p.examples.length; i++) {
        cards.push({ id: `grit-${p.id}-${i}`, en: p.examples[i].en, ja: p.examples[i].ja });
      }
    }
    console.log(JSON.stringify(cards));
    """
    try:
        res = subprocess.check_output(["node", "-e", node_script, root_dir], universal_newlines=True)
        return json.loads(res.strip())
    except Exception as e:
        print(f"⚠️ node経由でのdata.js読み込みに失敗しました: {e}")
        return []

def main():
    parser = argparse.ArgumentParser(description="レート制限にかからない安全なGemini 3.8 Flash TTS一括生成ツール")
    parser.add_argument("--api-key", help="Gemini APIキー (省略時は環境変数または入力プロンプト)")
    parser.add_argument("--rpm", type=int, default=8, help="1分あたりの最大リクエスト数 (デフォルト: 8 / Google上限10に対して安全マージン確保)")
    parser.add_argument("--card-id", help="指定した1つのカードIDのみ生成 (例: 1-0)")
    parser.add_argument("--force", action="store_true", help="既存のファイルを上書きして再生成")
    parser.add_argument("--dry-run", action="store_true", help="APIを呼び出さずに処理対象のみ確認")
    args = parser.parse_args()

    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    audio_dir = os.path.join(root_dir, "audio")
    os.makedirs(audio_dir, exist_ok=True)

    all_cards = load_all_cards(root_dir)
    if not all_cards:
        print("❌ data.js からカードデータを取得できませんでした。")
        return

    # 対象フィルタリング
    if args.card_id:
        targets = [c for c in all_cards if c["id"] == args.card_id]
        if not targets:
            print(f"❌ 指定されたカードID ({args.card_id}) が見つかりません。")
            return
    else:
        targets = all_cards

    # 未作成・旧Edge TTS判定（2026-10-12以前の古い初期音声を確実に検知）
    import datetime
    GEMINI_CUTOFF = datetime.datetime(2026, 10, 12, 0, 0, 0).timestamp()

    pending = []
    for c in targets:
        en_file = os.path.join(audio_dir, f"{c['id']}.mp3")
        ja_file = os.path.join(audio_dir, f"{c['id']}_ja.mp3")
        en_is_gemini = os.path.exists(en_file) and os.path.getsize(en_file) > 1000 and os.path.getmtime(en_file) >= GEMINI_CUTOFF
        ja_is_gemini = os.path.exists(ja_file) and os.path.getsize(ja_file) > 1000 and os.path.getmtime(ja_file) >= GEMINI_CUTOFF
        if args.force or not (en_is_gemini and ja_is_gemini):
            pending.append((c, not en_is_gemini or args.force, not ja_is_gemini or args.force))

    print("=================================================================")
    print("🛡️ Gemini 3.8 Flash TTS 安全音声生成ツール (レートリミット完全保護)")
    print("=================================================================")
    print(f"・対象総カード数   : {len(targets)} 問")
    print(f"・要生成カード数   : {len(pending)} 問 (既存完了済み: {len(targets) - len(pending)} 問)")
    print(f"・安全レート設定   : {args.rpm} RPM (60秒間に最大{args.rpm}回 / 制限10未満を厳格維持)")
    print("=================================================================")

    if not pending:
        print("✨ すべての音声ファイルがすでに高音質Gemini TTSで完成しています！生成不要です。")
        return

    if args.dry_run:
        print(f"🔍 Dry-run完了: 生成が必要なカードは {len(pending)} 件です。")
        return

    api_key = args.api_key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        api_key = getpass.getpass("🔑 Gemini APIキーを入力してください: ").strip()
    if not api_key:
        print("❌ APIキーが入力されませんでした。")
        return

    limiter = SlidingWindowRateLimiter(max_per_minute=args.rpm)

    completed = 0
    for idx, (card, need_en, need_ja) in enumerate(pending, 1):
        cid = card["id"]
        print(f"[{idx}/{len(pending)}] 🎙️ 生成中: {cid} | \"{card['en'][:35]}...\"")

        en_mp3 = os.path.join(audio_dir, f"{cid}.mp3")
        ja_mp3 = os.path.join(audio_dir, f"{cid}_ja.mp3")

        try:
            if need_en:
                wav = call_gemini_tts(card["en"], api_key, limiter, lang="en")
                save_as_mp3(wav, en_mp3)
                print("   ✓ EN 音声完了")

            if need_ja:
                wav = call_gemini_tts(card["ja"], api_key, limiter, lang="ja")
                save_as_mp3(wav, ja_mp3)
                print("   ✓ JA 音声完了")

            completed += 1
        except Exception as e:
            print(f"\n❌ エラー発生 ({cid}): {e}")
            print("直前までのファイルは安全に保存されています。再実行すると続きから自動再開します。")
            break

    print("=================================================================")
    print(f"🎉 処理完了: {completed} / {len(pending)} 問")
    print("=================================================================")

if __name__ == "__main__":
    main()
