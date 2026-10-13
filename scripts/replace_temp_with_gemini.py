#!/usr/bin/env python3
"""
Replace temporarily generated audio files with Gemini 3.8 Flash TTS.
Reads target cards from scripts/temp_audio_cards.json.

Designed for Paid Tier (従量課金/有料枠):
- Features exponential backoff & auto-retry on HTTP 429 (Rate Limit) / 503 / 500
- Gentle pacing (default 2.0s delay = ~30 RPM) to prevent burst rate limit errors
- Real-time progress saving (updates temp_audio_cards.json after every successful card)
- Processes all remaining cards in a single seamless run by default
"""

import argparse
import base64
import getpass
import json
import os
import struct
import subprocess
import sys
import time
import urllib.error
import urllib.request

def pcm_to_wav(pcm_data: bytes, sample_rate: int = 24000, num_channels: int = 1, bits_per_sample: int = 16) -> bytes:
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

def call_gemini_tts_with_retry(text: str, api_key: str, model: str = "gemini-3.8-flash-tts", voice: str = "Kore", lang: str = "en", max_retries: int = 5) -> bytes:
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

    for attempt in range(1, max_retries + 1):
        req = urllib.request.Request(
            url,
            data=req_data,
            headers={"Content-Type": "application/json"}
        )

        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                res_data = json.loads(response.read().decode("utf-8"))

            candidate = res_data.get("candidates", [{}])[0]
            part = candidate.get("content", {}).get("parts", [{}])[0]
            inline = part.get("inlineData", {})
            b64_data = inline.get("data")
            if not b64_data:
                raise ValueError("No audio data returned in Gemini response")

            raw_bytes = base64.b64decode(b64_data)
            mime = inline.get("mimeType", "audio/wav")
            if "pcm" in mime or "raw" in mime or not mime.startswith("audio/"):
                return pcm_to_wav(raw_bytes, sample_rate=24000)
            return raw_bytes

        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8", errors="replace")
            try:
                err_json = json.loads(error_body)
                detail = err_json.get("error", {}).get("message", error_body)
            except Exception:
                detail = error_body

            if e.code in (429, 500, 502, 503, 504):
                wait_sec = attempt * 12  # 12s, 24s, 36s, 48s, 60s
                print(f"\n  ⚠️ 一時的リミット/サーバー待機 (HTTP {e.code}: {detail[:80]}) - {wait_sec}秒待機して再試行 ({attempt}/{max_retries})...")
                time.sleep(wait_sec)
                continue
            else:
                raise RuntimeError(f"HTTP {e.code} ({e.reason}): {detail}")

        except Exception as e:
            wait_sec = attempt * 10
            print(f"\n  ⚠️ ネットワーク/タイムアウト待機 ({e}) - {wait_sec}秒待機して再試行 ({attempt}/{max_retries})...")
            time.sleep(wait_sec)
            continue

    raise RuntimeError(f"最大試行回数（{max_retries}回）を超過しました。")

def main():
    parser = argparse.ArgumentParser(description="Replace temporary audio with Gemini 3.8 Flash TTS (Paid Tier Safe)")
    parser.add_argument("--api-key", default=None, help="Gemini API Key")
    parser.add_argument("--model", default="gemini-3.8-flash-tts", help="Gemini model")
    parser.add_argument("--voice", default="Kore", help="Voice name (Kore)")
    parser.add_argument("--limit", type=int, default=None, help="Max cards to process (default: all remaining cards)")
    parser.add_argument("--delay", type=float, default=3.5, help="Delay between requests in seconds (default: 3.5s = ~15 RPM safe pace)")
    args = parser.parse_args()

    api_key = args.api_key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        try:
            api_key = getpass.getpass("🔑 Gemini APIキーを入力してください: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nキャンセルされました。")
            sys.exit(1)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    audio_dir = os.path.join(base_dir, "audio")
    data_path = os.path.join(base_dir, "data.js")
    tracking_file = os.path.join(base_dir, "scripts", "temp_audio_cards.json")

    if not os.path.exists(tracking_file):
        print("一時生成されたカードリスト（temp_audio_cards.json）が見つかりません。")
        sys.exit(0)

    with open(tracking_file, "r", encoding="utf-8") as f:
        target_ids = json.load(f)

    if not target_ids:
        print("🎉 すべてのカードがすでに Gemini TTS に置き換え済みです！")
        sys.exit(0)

    # Load card definitions
    cmd = [
        "node", "-e",
        """
const fs = require('fs');
global.window = global;
eval(fs.readFileSync(process.argv[1], 'utf8'));
const cards = [
  ...window.PATTERNS.flatMap(p => p.examples.map((ex, i) => ({id: p.id+'-'+i, en: ex.en, ja: ex.ja}))),
  ...(window.GRIT_PATTERNS || []).flatMap(p => p.examples.map((ex, i) => ({id: 'grit-'+p.id+'-'+i, en: ex.en, ja: ex.ja})))
];
console.log(JSON.stringify(cards));
        """,
        data_path
    ]
    all_cards = {c["id"]: c for c in json.loads(subprocess.check_output(cmd, encoding="utf-8"))}

    to_process = target_ids[:args.limit] if args.limit else target_ids

    print("=" * 65)
    print("💎 Gemini 3.8 Flash TTS 音声置換ツール（有料枠・安定バースト制御）")
    print("=" * 65)
    print(f"・残り一時カード総数 : {len(target_ids)} 件")
    print(f"・今回処理予定件数   : {len(to_process)} 件 (英語+日本語 = {len(to_process)*2} リクエスト)")
    print(f"・リクエスト間隔     : {args.delay} 秒 (瞬間リミット429完全回避)")
    print(f"・自動リトライ機能   : 有効 (最大5回バックオフ待機)")
    print(f"・進捗保存           : 1件ごとに即時ファイル更新（中断・再開可能）")
    print("=" * 65)

    replaced_count = 0

    for idx, cid in enumerate(to_process, 1):
        if cid not in all_cards:
            continue
        card = all_cards[cid]
        print(f"[{idx}/{len(to_process)}] 🎙️ 置換中: {cid} | \"{card['en'][:35]}...\"")

        en_mp3 = os.path.join(audio_dir, f"{cid}.mp3")
        ja_mp3 = os.path.join(audio_dir, f"{cid}_ja.mp3")

        try:
            # 1. EN
            wav_bytes = call_gemini_tts_with_retry(card["en"], api_key, args.model, args.voice, "en")
            temp_wav = en_mp3 + ".temp.wav"
            with open(temp_wav, "wb") as f:
                f.write(wav_bytes)
            subprocess.run(["lame", "-b", "64", "-m", "m", temp_wav, en_mp3], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(temp_wav): os.remove(temp_wav)
            print("  ✓ EN 音声完了")
            time.sleep(args.delay)

            # 2. JA
            wav_bytes = call_gemini_tts_with_retry(card["ja"], api_key, args.model, args.voice, "ja")
            temp_wav = ja_mp3 + ".temp.wav"
            with open(temp_wav, "wb") as f:
                f.write(wav_bytes)
            subprocess.run(["lame", "-b", "64", "-m", "m", temp_wav, ja_mp3], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(temp_wav): os.remove(temp_wav)
            print("  ✓ JA 音声完了")
            time.sleep(args.delay)

            replaced_count += 1

            # 即時進捗保存（temp_audio_cards.json から完了したIDを即時除外）
            if cid in target_ids:
                target_ids.remove(cid)
                with open(tracking_file, "w", encoding="utf-8") as f:
                    json.dump(target_ids, f, ensure_ascii=False, indent=2)

        except Exception as e:
            print(f"\n❌ エラーが発生したため中断しました: {e}")
            print(f"※ 直前のカード（{cid}）まで安全に保存されています。")
            break

    print("=" * 65)
    print(f"🎉 今回の置換完了: {replaced_count} 件")
    print(f"残りの一時カード: {len(target_ids)} 件")
    if len(target_ids) == 0:
        print("🌟 すべてのカードが Gemini 3.8 Flash TTS（高音質）に統一されました！")
    else:
        print("💡 次回コマンドを実行すれば、残りのカードからそのまま継続します。")
    print("=" * 65)

if __name__ == "__main__":
    main()
