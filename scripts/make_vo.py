"""ElevenLabs narration with word timestamps: one take per line.

usage:
  python make_vo.py --lines lines.json --out <project>/assets [--voice VOICE_ID] [--speed 0.95]
                    [--model eleven_multilingual_v2] [--env path/to/.env] [--force]

lines.json: ["first narration line", "second line", ...]
   or       [{"text": "spoken text with N-eight-N", "display": {"N-eight-N": "n8n"}}, ...]
Writes assets/vo_<n>.mp3 and assets/vo_<n>.json ({text, words:[{w,t,end}], duration}).
Existing takes are kept (cached) unless --force. Prints characters used.
"""
import argparse, base64, json, os, sys
from pathlib import Path

import requests

ap = argparse.ArgumentParser()
ap.add_argument("--lines", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--voice", default="cjVigY5qzO86Huf0OWal")  # Eric: smooth, natural (premade)
ap.add_argument("--model", default="eleven_multilingual_v2")
ap.add_argument("--speed", type=float, default=0.95)
ap.add_argument("--env", default=None)
ap.add_argument("--force", action="store_true")
a = ap.parse_args()

try:
    from dotenv import load_dotenv
    load_dotenv(a.env) if a.env else load_dotenv()
except ImportError:
    pass
KEY = (os.environ.get("ELEVENLABS_API_KEY") or "").strip()
if not KEY:
    sys.exit("ELEVENLABS_API_KEY missing (put it in .env or the environment)")

out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
lines = json.loads(Path(a.lines).read_text(encoding="utf-8"))
lines = [l if isinstance(l, dict) else {"text": l} for l in lines]


def words_from_alignment(al, display):
    chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    res, cur, t0, t1 = [], "", None, None
    for c, s, e in zip(chars, st, en):
        if c.isspace():
            if cur:
                res.append({"w": cur, "t": t0, "end": t1})
            cur, t0 = "", None
            continue
        if t0 is None:
            t0 = s
        cur += c
        t1 = e
    if cur:
        res.append({"w": cur, "t": t0, "end": t1})
    for w in res:
        for k, v in display.items():
            w["w"] = w["w"].replace(k, v)
        w["t"], w["end"] = round(w["t"], 3), round(w["end"], 3)
    return res


used = 0
for i, l in enumerate(lines, 1):
    mp3, js = out / f"vo_{i}.mp3", out / f"vo_{i}.json"
    if mp3.exists() and js.exists() and not a.force:
        print("cached", mp3.name); continue
    disp = l.get("display", {})
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{a.voice}/with-timestamps",
        params={"output_format": "mp3_44100_128"},
        headers={"xi-api-key": KEY, "Content-Type": "application/json"},
        json={"text": l["text"], "model_id": a.model,
              "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.15, "use_speaker_boost": True, "speed": a.speed}},
        timeout=180,
    )
    if not r.ok:
        sys.exit(f"line {i}: HTTP {r.status_code} {r.text[:300]}")
    d = r.json()
    mp3.write_bytes(base64.b64decode(d["audio_base64"]))
    words = words_from_alignment(d["alignment"], disp)
    shown = l["text"]
    for k, v in disp.items():
        shown = shown.replace(k, v)
    js.write_text(json.dumps({"text": shown, "words": words, "duration": words[-1]["end"]}, indent=1), encoding="utf-8")
    used += len(l["text"])
    print(f"vo_{i}: {len(words)} words, {words[-1]['end']:.2f}s")
print(f"characters used this run: {used}")
