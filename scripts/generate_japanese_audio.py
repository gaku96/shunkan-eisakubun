#!/usr/bin/env python3
"""
Generate ultra-natural Japanese neural MP3 audio files for all 270 sentences
(120 baseline + 150 preset) using Microsoft Edge Neural TTS (ja-JP-NanamiNeural).
"""

import asyncio
import json
import os
import re
import sys

PREFIX_MAP = {
    "ITエンジニア・プログラミング": "it",
    "ビジネス・営業・職場": "biz",
    "海外旅行・一人旅・観光": "travel",
    "カフェ巡り・日常会話": "cafe",
    "筋トレ・フィットネス・健康": "fitness",
}

def load_baseline_cards(data_path):
    with open(data_path, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r"window\.PATTERNS\s*=\s*(\[[\s\S]*?\]);\s*$", content)
    if not match:
        raise ValueError("Could not parse window.PATTERNS from data.js")

    raw = match.group(1)
    raw = re.sub(r"//.*$", "", raw, flags=re.MULTILINE)
    raw = re.sub(r'(\s*)([a-zA-Z0-9_]+):', r'\1"\2":', raw)
    raw = re.sub(r',\s*([}\]])', r'\1', raw)

    patterns = json.loads(raw)
    cards = []
    for p in patterns:
        for i, ex in enumerate(p["examples"]):
            cards.append({
                "id": f"{p['id']}-{i}",
                "ja": ex["ja"]
            })
    return cards

def load_preset_cards(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        presets = json.load(f)

    cards = []
    for theme, patterns in presets.items():
        prefix = PREFIX_MAP.get(theme)
        if not prefix:
            continue
        for pid_str, item in patterns.items():
            cards.append({
                "id": f"{prefix}-{pid_str}",
                "ja": item["ja"]
            })
    return cards

async def generate_file(text, out_file, voice, sem, edge_bin):
    async with sem:
        if os.path.exists(out_file) and os.path.getsize(out_file) > 500:
            return True, out_file, "already exists"

        clean_text = text.replace('"', '').strip()
        cmd = [
            edge_bin,
            "--voice", voice,
            "--text", clean_text,
            "--write-media", out_file
        ]
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        if proc.returncode == 0:
            return True, out_file, "created"
        else:
            return False, out_file, stderr.decode().strip()

async def main():
    voice = sys.argv[1] if len(sys.argv) > 1 else "ja-JP-NanamiNeural"
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    data_path = os.path.join(base_dir, "data.js")
    json_path = os.path.join(base_dir, "scripts", "preset_sentences.json")
    out_dir = os.path.join(base_dir, "audio")
    os.makedirs(out_dir, exist_ok=True)

    edge_bin = "/Users/gaku/Library/Python/3.9/bin/edge-tts"
    if not os.path.exists(edge_bin):
        # Fallback to PATH
        edge_bin = "edge-tts"

    baseline_cards = load_baseline_cards(data_path)
    preset_cards = load_preset_cards(json_path)
    all_cards = baseline_cards + preset_cards

    print(f"Loaded {len(baseline_cards)} baseline + {len(preset_cards)} preset = {len(all_cards)} total Japanese sentences.")
    print(f"Voice: {voice}")
    print(f"Output directory: {out_dir}")

    sem = asyncio.Semaphore(6)
    tasks = []
    for c in all_cards:
        out_file = os.path.join(out_dir, f"{c['id']}_ja.mp3")
        tasks.append(generate_file(c["ja"], out_file, voice, sem, edge_bin))

    total = len(tasks)
    done = 0
    errors = []
    for f in asyncio.as_completed(tasks):
        ok, path, status = await f
        done += 1
        name = os.path.basename(path)
        if not ok:
            print(f"[{done}/{total}] ✕ Error {name}: {status}")
            errors.append((name, status))
        else:
            if status == "created":
                print(f"[{done}/{total}] ✓ {name}")

    print(f"\nCompleted! Successful: {total - len(errors)} / {total}, Errors: {len(errors)}")

if __name__ == "__main__":
    asyncio.run(main())
