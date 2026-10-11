#!/usr/bin/env python3
"""
Generate high-quality MP3 audio files for all 150 preset sentences using edge-tts.
Voice: en-US-GuyNeural (consistent with the 120 baseline sentences).
"""

import asyncio
import json
import os
import sys

PREFIX_MAP = {
    "ITエンジニア・プログラミング": "it",
    "ビジネス・営業・職場": "biz",
    "海外旅行・一人旅・観光": "travel",
    "カフェ巡り・日常会話": "cafe",
    "筋トレ・フィットネス・健康": "fitness",
}

async def generate_file(text, out_file, voice, sem):
    async with sem:
        if os.path.exists(out_file) and os.path.getsize(out_file) > 200:
            return True, out_file, "already exists"

        clean_text = text.replace('"', '').strip()
        cmd = [
            "/Users/gaku/Library/Python/3.9/bin/edge-tts",
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
    voice = sys.argv[1] if len(sys.argv) > 1 else "en-US-GuyNeural"
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    json_path = os.path.join(base_dir, "scripts", "preset_sentences.json")
    out_dir = os.path.join(base_dir, "audio")
    os.makedirs(out_dir, exist_ok=True)

    with open(json_path, "r", encoding="utf-8") as f:
        presets = json.load(f)

    tasks = []
    sem = asyncio.Semaphore(5)

    item_count = 0
    for theme, patterns in presets.items():
        prefix = PREFIX_MAP.get(theme)
        if not prefix:
            continue
        for pid_str, item in patterns.items():
            out_file = os.path.join(out_dir, f"{prefix}-{pid_str}.mp3")
            tasks.append(generate_file(item["en"], out_file, voice, sem))
            item_count += 1

    print(f"Generating {item_count} audio files with voice '{voice}'...")

    done = 0
    errors = []
    for f in asyncio.as_completed(tasks):
        ok, path, status = await f
        done += 1
        name = os.path.basename(path)
        if not ok:
            print(f"[{done}/{item_count}] ✕ Error {name}: {status}")
            errors.append((name, status))
        else:
            if status == "created":
                print(f"[{done}/{item_count}] ✓ {name}")

    print(f"\nDone! Success: {done - len(errors)} / {item_count}, Errors: {len(errors)}")

if __name__ == "__main__":
    asyncio.run(main())
