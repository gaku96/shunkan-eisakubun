#!/usr/bin/env python3
"""
Gemini TTSを使って、構文の全例文の音声ファイルを生成するスクリプト。

使用方法:
    export GEMINI_API_KEY="your_api_key_here"
    python3 scripts/generate_audio.py

または:
    python3 scripts/generate_audio.py --api-key "your_api_key_here" --model gemini-3.8-flash-tts --voice Kore
"""

import argparse
import base64
import json
import os
import re
import struct
import sys
import time
import urllib.request
import urllib.error

def parse_args():
    parser = argparse.ArgumentParser(description="Generate audio files using Gemini 3.8 TTS.")
    parser.add_argument("--api-key", default=os.environ.get("GEMINI_API_KEY"), help="Gemini API Key")
    parser.add_argument("--model", default="gemini-3.8-flash-tts", choices=["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"])
    parser.add_argument("--voice", default="Kore", choices=["Kore", "Puck", "Aoede", "Fenrir", "Charon"])
    parser.add_argument("--output-dir", default=os.path.join(os.path.dirname(__file__), "..", "audio"))
    return parser.parse_args()

def load_cards():
    data_path = os.path.join(os.path.dirname(__file__), "..", "data.js")
    with open(data_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract JSON-like window.PATTERNS
    match = re.search(r"window\.PATTERNS\s*=\s*(\[[\s\S]*?\]);\s*$", content)
    if not match:
        raise ValueError("Could not parse window.PATTERNS from data.js")

    # Clean up JS syntax to valid JSON
    raw = match.group(1)
    # Remove single-line comments
    raw = re.sub(r"//.*$", "", raw, flags=re.MULTILINE)
    # Quote unquoted keys (e.g. id:, part:, en:)
    raw = re.sub(r'(\s*)([a-zA-Z0-9_]+):', r'\1"\2":', raw)
    # Remove trailing commas
    raw = re.sub(r',\s*([}\]])', r'\1', raw)

    patterns = json.loads(raw)
    cards = []
    for p in patterns:
        for i, ex in enumerate(p["examples"]):
            cards.append({
                "id": f"{p['id']}-{i}",
                "en": ex["en"],
                "ja": ex["ja"]
            })
    return cards

def pcm_to_wav(pcm_bytes, sample_rate=24000, num_channels=1, bits_per_sample=16):
    byte_rate = (sample_rate * num_channels * bits_per_sample) // 8
    block_align = (num_channels * bits_per_sample) // 8
    data_size = len(pcm_bytes)

    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        36 + data_size,
        b"WAVE",
        b"fmt ",
        16,              # Subchunk1Size (16 for PCM)
        1,               # AudioFormat (1 for PCM)
        num_channels,
        sample_rate,
        byte_rate,
        block_align,
        bits_per_sample,
        b"data",
        data_size,
    )
    return header + pcm_bytes

def generate_speech(text, api_key, model="gemini-3.8-flash-tts", voice="Kore"):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": text,
                        "speechMetadata": {
                            "style": "natural, friendly, conversational native American English"
                        }
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {
                    "prebuiltVoiceConfig": {
                        "voiceName": voice
                    }
                }
            }
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    part = data["candidates"][0]["content"]["parts"][0]["inlineData"]
    audio_bytes = base64.b64decode(part["data"])
    mime_type = part.get("mimeType", "")

    if "pcm" in mime_type or "raw" in mime_type or not mime_type.startswith("audio/"):
        rate_m = re.search(r"rate=(\d+)", mime_type)
        rate = int(rate_m.group(1)) if rate_m else 24000
        return pcm_to_wav(audio_bytes, sample_rate=rate)
    return audio_bytes

def main():
    args = parse_args()
    if not args.api_key:
        print("エラー: Gemini APIキーが指定されていません。")
        print("GEMINI_API_KEY環境変数を設定するか、--api-key オプションを指定してください。")
        sys.exit(1)

    os.makedirs(args.output_dir, exist_ok=True)
    cards = load_cards()
    print(f"Loaded {len(cards)} example sentences. Generating with {args.model} (Voice: {args.voice})...")

    success = 0
    skipped = 0
    for idx, c in enumerate(cards, 1):
        out_file = os.path.join(args.output_dir, f"{c['id']}.wav")
        if os.path.exists(out_file) and os.path.getsize(out_file) > 100:
            skipped += 1
            continue

        print(f"[{idx}/{len(cards)}] Generating {c['id']}: {c['en']}")
        try:
            wav_data = generate_speech(c["en"], args.api_key, args.model, args.voice)
            with open(out_file, "wb") as f:
                f.write(wav_data)
            success += 1
            time.sleep(0.4) # rate limit prevention
        except Exception as e:
            print(f"  Error generating {c['id']}: {e}")

    print(f"\n完了！ 新規生成: {success}件, 既存スキップ: {skipped}件, 保存先: {args.output_dir}")

if __name__ == "__main__":
    main()
