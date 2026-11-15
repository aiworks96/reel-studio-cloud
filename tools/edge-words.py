#!/usr/bin/env python3
"""Word-level caption timings straight from the edge-tts service (no Whisper needed).

    python3 tools/edge-words.py --id moon-living --voice en-US-ChristopherNeural

Reads  projects/<id>/voice.txt
Writes public/reels/<id>/captions.words.json  ->  [{"word", "start", "end"}] in seconds.

The service returns a WordBoundary event per word with an exact offset and duration,
so the timings match the audio the CLI produced for the same text and voice.
"""
import argparse
import asyncio
import json
import pathlib

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent


async def run(args: argparse.Namespace) -> None:
    text = (ROOT / "projects" / args.id / "voice.txt").read_text(encoding="utf-8").strip()
    if not text:
        raise SystemExit(f"projects/{args.id}/voice.txt is empty")

    comm = edge_tts.Communicate(
        text,
        args.voice,
        rate=args.rate,
        volume=args.volume,
        pitch=args.pitch,
        boundary="WordBoundary",
    )

    words = []
    async for chunk in comm.stream():
        if chunk.get("type") != "WordBoundary":
            continue
        start = chunk["offset"] / 1e7  # 100-nanosecond ticks -> seconds
        end = start + chunk["duration"] / 1e7
        words.append({"word": chunk["text"], "start": round(start, 3), "end": round(end, 3)})

    if not words:
        raise SystemExit("no word boundaries returned")

    out_dir = pathlib.Path(args.out_dir) if args.out_dir else ROOT / "public" / "reels" / args.id
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / "captions.words.json"
    out.write_text(json.dumps(words, indent=2) + "\n", encoding="utf-8")
    try:
        shown = out.relative_to(ROOT)
    except ValueError:
        shown = out
    print(f"{shown}: {len(words)} words, last ends at {words[-1]['end']:.2f}s")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--id", required=True)
    ap.add_argument("--voice", default="en-US-ChristopherNeural")
    ap.add_argument("--rate", default="+0%")
    ap.add_argument("--volume", default="+0%")
    ap.add_argument("--pitch", default="+0Hz")
    ap.add_argument("--out-dir", default=None, help="output folder (default: public/reels/<id>)")
    asyncio.run(run(ap.parse_args()))


if __name__ == "__main__":
    main()
