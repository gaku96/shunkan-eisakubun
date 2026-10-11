#!/usr/bin/env python3
"""
Generate all 120 audio files completely free (0 yen) using Edge Neural TTS.
No API key required!
"""

import asyncio
import json
import os
import re
import sys
import edge_tts

def load_cards():
    data_path = os.path.join(os.path.dirname(__file__), "..", "data.js")
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
                "ja": ex["ja"]
            })
    return cards

async def generate_card(card, out_dir, voice="en-US-GuyNeural", sem=None):
    async with sem:
        out_file = os.path.join(out_dir, f"{card['id']}.mp3")
        if os.path.exists(out_file) and os.path.getsize(out_file) > 200:
            return True, card['id'], "already exists"

        try:
            # Clean text for speaking: remove quotes around direct speech
            text = card["en"].replace('"', '')
            communicate = edge_tts.Communicate(text, voice, rate="+0%")
            await communicate.save(out_file)
            return True, card['id'], "created"
        except Exception as e:
            return False, card['id'], str(e)

async def main():
    voice = sys.argv[1] if len(sys.argv) > 1 else "en-US-GuyNeural"
    out_dir = os.path.join(os.path.dirname(__file__), "..", "audio")
    os.makedirs(out_dir, exist_ok=True)

    cards = load_cards()
    print(f"Generating {len(cards)} audio files with voice '{voice}'...")

    sem = asyncio.Semaphore(5) # 5 concurrent downloads
    tasks = [generate_card(c, out_dir, voice, sem) for c in cards]

    done = 0
    errors = []
    for f in asyncio.as_completed(tasks):
        ok, cid, status = await f
        done += 1
        if not ok:
            print(f"[{done}/{len(cards)}] ✕ Error {cid}: {status}")
            errors.append((cid, status))
        else:
            if status == "created":
                print(f"[{done}/{len(cards)}] ✓ {cid}")

    print(f"\n完了！ 全{len(cards)}問中 正常: {done - len(errors)}件, エラー: {len(errors)}件")
    print(f"保存先: {out_dir}")

if __name__ == "__main__":
    asyncio.run(main())
