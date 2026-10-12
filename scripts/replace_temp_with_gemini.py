#!/usr/bin/env python3
"""
Replace temporarily generated audio files with Gemini 3.8 Flash TTS.
Reads target cards from scripts/temp_audio_cards.json.
Respects Gemini 3.8 Flash TTS rate limits (10 RPM / 100 RPD).
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

def call_gemini_tts(text: str, api_key: str, model: str = "gemini-3.8-flash-tts", voice: str = "Kore", lang: str = "en") -> bytes:
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

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            res_data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        try:
            err_json = json.loads(error_body)
            detail = err_json.get("error", {}).get("message", error_body)
        except Exception:
            detail = error_body
        raise RuntimeError(f"HTTP {e.code} ({e.reason}): {detail}")

    candidate = res_data.get("candidates", [{}])[0]
    part = candidate.get("content", {}).get("parts", [{}])[0]
    inline = part.get("inlineData", {})
    b64_data = inline.get("data")
    if not b64_data:
        raise ValueError("No audio data returned from Gemini API")

    raw_bytes = base64.b64decode(b64_data)
    mime = inline.get("mimeType", "audio/wav")
    if "pcm" in mime or "raw" in mime or not mime.startswith("audio/"):
        return pcm_to_wav(raw_bytes, sample_rate=24000)
    return raw_bytes

def main():
    parser = argparse.ArgumentParser(description="Replace temporary audio with Gemini TTS")
    parser.add_argument("--api-key", default=None, help="Gemini API Key")
    parser.add_argument("--model", default="gemini-3.8-flash-tts", help="Gemini model")
    parser.add_argument("--voice", default="Kore", help="Voice name (Kore)")
    parser.add_argument("--limit", type=int, default=50, help="Max cards to process in this run (default: 50, to stay within 100 RPD)")
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

    # Load card text
    import subprocess
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

    to_process = target_ids[:args.limit]
    remaining = target_ids[args.limit:]

    print(f"一時生成カードの残り: {len(target_ids)} 件")
    print(f"今回の処理予定: {len(to_process)} 件 (英語+日本語 = {len(to_process)*2} リクエスト)")
    print(f"※ Gemini 3.8 Flash TTS の 1日100回制限を守るため、安全なペース（毎分8回以下）で置換します。")
    print("=" * 60)

    replaced_successfully = []

    for idx, cid in enumerate(to_process, 1):
        if cid not in all_cards:
            continue
        card = all_cards[cid]
        print(f"[{idx}/{len(to_process)}] 置換中: {cid} ({card['en'][:30]}...)")

        en_mp3 = os.path.join(audio_dir, f"{cid}.mp3")
        ja_mp3 = os.path.join(audio_dir, f"{cid}_ja.mp3")

        try:
            # 1. EN
            wav_bytes = call_gemini_tts(card["en"], api_key, args.model, args.voice, "en")
            temp_wav = en_mp3 + ".temp.wav"
            with open(temp_wav, "wb") as f:
                f.write(wav_bytes)
            subprocess.run(["lame", "-b", "64", "-m", "m", temp_wav, en_mp3], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(temp_wav): os.remove(temp_wav)
            print("  ✓ EN 置換完了")
            time.sleep(7) # Keep under 10 RPM (approx 8.5 RPM)

            # 2. JA
            wav_bytes = call_gemini_tts(card["ja"], api_key, args.model, args.voice, "ja")
            temp_wav = ja_mp3 + ".temp.wav"
            with open(temp_wav, "wb") as f:
                f.write(wav_bytes)
            subprocess.run(["lame", "-b", "64", "-m", "m", temp_wav, ja_mp3], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(temp_wav): os.remove(temp_wav)
            print("  ✓ JA 置換完了")
            time.sleep(7)

            replaced_successfully.append(cid)
        except Exception as e:
            print(f"  ❌ エラー発生のため中断します: {e}")
            break

    # Update tracking file with what remains
    unreplaced = [cid for cid in target_ids if cid not in replaced_successfully]
    with open(tracking_file, "w", encoding="utf-8") as f:
        json.dump(unreplaced, f, ensure_ascii=False, indent=2)

    print("=" * 60)
    print(f"🎉 今回の置換完了: {len(replaced_successfully)} 件")
    print(f"残りの一時カード: {len(unreplaced)} 件")
    if unreplaced:
        print("💡 次回（明日など制限リセット後）に再度実行すれば、残りのカードを続きから置換できます。")
    else:
        print("🌟 全カードが Gemini 3.8 Flash TTS の音声に統一されました！")

if __name__ == "__main__":
    main()
