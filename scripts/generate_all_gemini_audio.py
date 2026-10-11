#!/usr/bin/env python3
"""
Generate all 210 questions (420 audio files: English & Japanese)
using Gemini 3.8 Flash TTS API and save directly to audio/ directory.

Usage:
  python3 scripts/generate_all_gemini_audio.py --api-key AIzaSy...
  python3 scripts/generate_all_gemini_audio.py --api-key AIzaSy... --voice Kore --model gemini-3.8-flash-tts
"""

import argparse
import base64
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
import struct

def pcm_to_wav(pcm_data: bytes, sample_rate: int = 24000, num_channels: int = 1, bits_per_sample: int = 16) -> bytes:
    byte_rate = (sample_rate * num_channels * bits_per_sample) // 8
    block_align = (num_channels * bits_per_sample) // 8
    data_size = len(pcm_data)
    
    header = bytearray(44)
    struct.pack_into('<4sI4s4sIHHIIHH4sI', header, 0,
        b'RIFF',
        36 + data_size,
        b'WAVE',
        b'fmt ',
        16,
        1, # PCM
        num_channels,
        sample_rate,
        byte_rate,
        block_align,
        bits_per_sample,
        b'data',
        data_size
    )
    return bytes(header) + pcm_data

ACCENT_STYLE_PROMPTS = {
    "us": "natural, authentic native General American English with distinct American rhoticity, flap 't', and smooth conversational American connected speech",
    "uk": "authentic, distinctly British English with crisp Received Pronunciation (RP), clear non-rhotic pronunciation, sharp consonants, and characteristic refined British intonation",
    "in": "deep, strong, and unmistakably authentic native Indian English accent. Prominent Indian phonetics: distinct retroflex 't' and 'd' consonants with curled tongue, dental stops, syllable-timed cadence, characteristic melodic musical pitch inflection, light tapped 'r', crisp unaspirated consonants, rich and natural Indian subcontinent speaker pronunciation",
    "au": "authentic, distinctly Australian English with broad Aussie vowels and diphthongs, characteristic vocal warmth, and friendly rising intonation at phrase endings"
}

def get_effective_accent(card_id: str, setting_accent: str = "us") -> str:
    if setting_accent != "global":
        return setting_accent or "us"
    accents = ["us", "uk", "in", "au"]
    h = 0
    for ch in card_id:
        h = ((h * 31) + ord(ch)) & 0xFFFFFFFF
    return accents[h % len(accents)]

def call_gemini_tts(text: str, api_key: str, model: str = "gemini-3.8-flash-tts", voice: str = "Kore", lang: str = "en", accent: str = "us") -> bytes:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    style_prompt = (
        "natural, clear, polite and warm Japanese narration by a native speaker with authentic standard Tokyo intonation"
        if lang == "ja" else
        ACCENT_STYLE_PROMPTS.get(accent, ACCENT_STYLE_PROMPTS["us"])
    )

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": text,
                        "speechMetadata": {
                            "style": style_prompt
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
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode("utf-8"))

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

def load_all_cards(data_path: str):
    import subprocess
    cmd = [
        "node", "-e",
        """
const fs = require('fs');
global.window = global;
eval(fs.readFileSync(process.argv[1], 'utf8'));
const cards = [
  ...window.PATTERNS.flatMap(p => p.examples.map((ex, i) => ({id: p.id+'-'+i, course:'conversation', en: ex.en, ja: ex.ja}))),
  ...(window.GRIT_PATTERNS || []).flatMap(p => p.examples.map((ex, i) => ({id: 'grit-'+p.id+'-'+i, course:'grit', en: ex.en, ja: ex.ja})))
];
console.log(JSON.stringify(cards));
        """,
        data_path
    ]
    raw = subprocess.check_output(cmd, encoding="utf-8")
    return json.loads(raw)

def main():
    parser = argparse.ArgumentParser(description="Generate all Gemini TTS audio files")
    parser.add_argument("--api-key", required=True, help="Gemini API Key")
    parser.add_argument("--model", default="gemini-3.8-flash-tts", help="Gemini model")
    parser.add_argument("--voice", default="Kore", help="Voice name (Kore, Puck, Aoede, Fenrir, Charon)")
    parser.add_argument("--accent", default="us", choices=["us", "uk", "in", "au", "global"], help="Accent: us, uk, in, au, global")
    parser.add_argument("--output-dir", default=None, help="Output directory (defaults to audio/)")
    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = args.output_dir or os.path.join(base_dir, "audio")
    data_path = os.path.join(base_dir, "data.js")

    os.makedirs(output_dir, exist_ok=True)
    cards = load_all_cards(data_path)
    total_cards = len(cards)

    print(f"Loaded {total_cards} cards. Total files to generate: {total_cards * 2} (English + Japanese)")
    print(f"Model: {args.model}, Voice: {args.voice}, Accent: {args.accent}")
    print(f"Output directory: {output_dir}")
    print("=" * 60)

    success_count = 0
    start_time = time.time()

    for idx, card in enumerate(cards, 1):
        cid = card["id"]
        course_tag = "GRIT" if card["course"] == "grit" else "口語"
        eff_accent = get_effective_accent(cid, args.accent)
        en_file = os.path.join(output_dir, f"{cid}.wav")
        ja_file = os.path.join(output_dir, f"{cid}_ja.wav")

        print(f"[{idx}/{total_cards}] ({course_tag}・{eff_accent.upper()}) {cid}: {card['en'][:30]}...")

        # 1. English
        if not os.path.exists(en_file) or os.path.getsize(en_file) == 0:
            try:
                wav_bytes = call_gemini_tts(card["en"], args.api_key, args.model, args.voice, "en", eff_accent)
                with open(en_file, "wb") as f:
                    f.write(wav_bytes)
                success_count += 1
                time.sleep(0.8) # rate-limit pause
            except Exception as e:
                print(f"  ❌ Error EN: {e}")
                if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                    time.sleep(10)
        else:
            success_count += 1

        # 2. Japanese
        if not os.path.exists(ja_file) or os.path.getsize(ja_file) == 0:
            try:
                wav_bytes = call_gemini_tts(card["ja"], args.api_key, args.model, args.voice, "ja")
                with open(ja_file, "wb") as f:
                    f.write(wav_bytes)
                success_count += 1
                time.sleep(0.8)
            except Exception as e:
                print(f"  ❌ Error JA: {e}")
                if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                    time.sleep(10)
        else:
            success_count += 1

    elapsed = time.time() - start_time
    print("=" * 60)
    print(f"🎉 Complete! Processed {success_count}/{total_cards * 2} files in {elapsed:.1f}s.")

if __name__ == "__main__":
    main()
