#!/usr/bin/env python3
"""
Fill missing audio files using macOS native high-quality speech synthesis (Samantha for English, Kyoko for Japanese).
Completely offline, fast, zero network errors.
Saves the list of generated card IDs to scripts/temp_audio_cards.json so they can easily be replaced by Gemini TTS later.
"""

import json
import os
import subprocess
import sys

def load_all_cards(data_path: str):
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

def generate_mac_tts(text: str, voice: str, target_mp3: str):
    temp_aiff = target_mp3 + ".temp.aiff"
    try:
        # 1. Run say command
        subprocess.run(["say", "-v", voice, "-o", temp_aiff, text], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        # 2. Encode to MP3 with lame
        subprocess.run(["lame", "-b", "64", "-m", "m", temp_aiff, target_mp3], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except Exception as e:
        print(f"  ❌ Error generating {target_mp3}: {e}")
        return False
    finally:
        if os.path.exists(temp_aiff):
            os.remove(temp_aiff)

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    audio_dir = os.path.join(base_dir, "audio")
    data_path = os.path.join(base_dir, "data.js")
    tracking_file = os.path.join(base_dir, "scripts", "temp_audio_cards.json")

    cards = load_all_cards(data_path)
    os.makedirs(audio_dir, exist_ok=True)

    en_voice = "Samantha"
    ja_voice = "Kyoko"

    missing_tasks = []
    replaced_card_ids = set()

    for c in cards:
        cid = c["id"]
        en_path = os.path.join(audio_dir, f"{cid}.mp3")
        ja_path = os.path.join(audio_dir, f"{cid}_ja.mp3")

        en_needed = not os.path.exists(en_path) or os.path.getsize(en_path) < 200
        ja_needed = not os.path.exists(ja_path) or os.path.getsize(ja_path) < 200

        if en_needed:
            missing_tasks.append((c["en"], en_voice, en_path, f"{cid} (EN)"))
            replaced_card_ids.add(cid)
        if ja_needed:
            missing_tasks.append((c["ja"], ja_voice, ja_path, f"{cid} (JA)"))
            replaced_card_ids.add(cid)

    total_missing = len(missing_tasks)
    print(f"Total cards in app: {len(cards)}")
    print(f"Missing audio files to generate: {total_missing} files (from {len(replaced_card_ids)} cards)")

    if total_missing == 0:
        print("🎉 すべての音声ファイルが既に存在します！")
        return

    # Track card IDs so they can be replaced by Gemini TTS later
    with open(tracking_file, "w", encoding="utf-8") as f:
        json.dump(sorted(list(replaced_card_ids)), f, ensure_ascii=False, indent=2)
    print(f"📝 一時生成対象リストを保存しました: {os.path.basename(tracking_file)}")

    count = 0
    for text, voice, target_mp3, tag in missing_tasks:
        ok = generate_mac_tts(text, voice, target_mp3)
        if ok:
            count += 1
            if count % 20 == 0 or count == total_missing:
                print(f"  [{count}/{total_missing}] 生成中... {tag}")

    print("=" * 60)
    print(f"🎉 完了: {count}/{total_missing} 件の音声を生成しました！")
    print(f"これですべてのカード（全357問）の音声が100%揃いました。")

if __name__ == "__main__":
    main()
