#!/usr/bin/env python3
"""
Regenerate all 270 English audio files (120 baseline + 150 preset)
with authentic conversational American English (connected speech, linking,
reductions, flapped T, natural elision) using Microsoft Edge Neural TTS
voice 'en-US-BrianNeural' at conversational rate (+8%).
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

def to_spoken(text):
    """
    Transform written standard English to authentic spoken connected speech
    representations that trigger native reductions and elisions in TTS.
    """
    t = text.replace('"', '').strip()
    # Conversational reductions
    t = re.sub(r'\bkind of\b', 'kinda', t, flags=re.IGNORECASE)
    t = re.sub(r'\bsort of\b', 'sorta', t, flags=re.IGNORECASE)
    t = re.sub(r'\bout of\b', 'outta', t, flags=re.IGNORECASE)
    t = re.sub(r'\ba lot of\b', 'a lotta', t, flags=re.IGNORECASE)
    t = re.sub(r'\bwant to\b', 'wanna', t, flags=re.IGNORECASE)
    t = re.sub(r'\bgoing to\b', 'gonna', t, flags=re.IGNORECASE)
    t = re.sub(r'\bgot to\b', 'gotta', t, flags=re.IGNORECASE)
    t = re.sub(r'\bhave to\b', 'hafta', t, flags=re.IGNORECASE)
    t = re.sub(r'\bLet me\b', 'Lemme', t)
    t = re.sub(r'\blet me\b', 'lemme', t)
    return t

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
                "en": ex["en"],
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
                "en": item["en"],
            })
    return cards

async def generate_file(text, out_file, voice, rate, sem, edge_bin):
    async with sem:
        spoken_text = to_spoken(text)
        cmd = [
            edge_bin,
            "--voice", voice,
            "--rate", rate,
            "--text", spoken_text,
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
    voice = sys.argv[1] if len(sys.argv) > 1 else "en-US-BrianNeural"
    rate = sys.argv[2] if len(sys.argv) > 2 else "+8%"
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    data_path = os.path.join(base_dir, "data.js")
    json_path = os.path.join(base_dir, "scripts", "preset_sentences.json")
    out_dir = os.path.join(base_dir, "audio")
    os.makedirs(out_dir, exist_ok=True)

    edge_bin = "/Users/gaku/Library/Python/3.9/bin/edge-tts"
    if not os.path.exists(edge_bin):
        edge_bin = "edge-tts"

    baseline_cards = load_baseline_cards(data_path)
    preset_cards = load_preset_cards(json_path)
    all_cards = baseline_cards + preset_cards

    print(f"Replacing all {len(all_cards)} English audio files with authentic conversational speech...")
    print(f"Voice: {voice} (Category: Conversation / Casual)")
    print(f"Rate: {rate}")
    print(f"Reductions applied: linking, gotta/wanna/gonna/outta/kinda/hafta/lemme")

    sem = asyncio.Semaphore(6)
    tasks = []
    for c in all_cards:
        out_file = os.path.join(out_dir, f"{c['id']}.mp3")
        tasks.append(generate_file(c["en"], out_file, voice, rate, sem, edge_bin))

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
            if done % 15 == 0 or done == total:
                print(f"[{done}/{total}] ✓ Progress ({name})")

    print(f"\nAll done! Successful: {total - len(errors)} / {total}, Errors: {len(errors)}")

if __name__ == "__main__":
    asyncio.run(main())
