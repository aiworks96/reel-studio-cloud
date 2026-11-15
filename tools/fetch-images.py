#!/usr/bin/env python3
"""Download the scene images for a cinematic reel from Pollinations.ai.

    python3 tools/fetch-images.py --id gravity-lost

Reads  projects/<id>/prompts.txt   (one "SCENE|prompt" per line)
Writes public/<id>/scene-NN.jpg    (verified to be a real image)

The anonymous Pollinations tier is aggressively rate limited: burst requests come back
402 Payment Required or 503 Service Unavailable. So the requests are spaced out and
anything that is not a real image is retried after a long pause.
"""
import argparse
import json
import os
import pathlib
import subprocess
import sys
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = "https://image.pollinations.ai/prompt/"


def fetch(url: str, timeout: int = 240) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "curl/8"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def is_jpeg(data: bytes) -> bool:
    return data[:3] == b"\xff\xd8\xff" or data[:8] == b"\x89PNG\r\n\x1a\n"


def dimensions(path: pathlib.Path) -> str:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
         "stream=width,height", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True,
    )
    return r.stdout.strip() or "?"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--id", required=True)
    ap.add_argument("--width", type=int, default=1920)
    ap.add_argument("--height", type=int, default=1080)
    ap.add_argument("--retries", type=int, default=6)
    ap.add_argument("--pause", type=float, default=14.0, help="seconds between requests")
    ap.add_argument("--skip-existing", action="store_true")
    a = ap.parse_args()

    prompts_file = ROOT / "projects" / a.id / "prompts.txt"
    out_dir = ROOT / "public" / a.id
    out_dir.mkdir(parents=True, exist_ok=True)

    scenes = []
    for line in prompts_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or "|" not in line:
            continue
        label, prompt = line.split("|", 1)
        scenes.append((label.strip(), prompt.strip()))

    if not scenes:
        sys.exit(f"no prompts found in {prompts_file}")

    manifest = []
    for i, (label, prompt) in enumerate(scenes, 1):
        out = out_dir / f"scene-{i:02d}.jpg"
        if a.skip_existing and out.exists() and out.stat().st_size > 20_000:
            print(f"  {label} -> {out.name} (kept, {dimensions(out)})")
            manifest.append({"scene": label, "file": out.name, "prompt": prompt, "ok": True})
            continue
        url = (
            BASE
            + urllib.parse.quote(prompt, safe="")
            + f"?width={a.width}&height={a.height}&seed={1000 + i}"
        )
        ok = False
        for attempt in range(1, a.retries + 1):
            try:
                data = fetch(url)
            except Exception as e:  # noqa: BLE001 - network errors are expected here
                print(f"  {label} attempt {attempt}: {e}")
                time.sleep(a.pause * (attempt + 1))
                continue
            if len(data) < 20_000 or not is_jpeg(data):
                print(f"  {label} attempt {attempt}: rate limited or not an image ({len(data)} bytes), backing off")
                time.sleep(a.pause * (attempt + 1))
                continue
            out.write_bytes(data)
            print(f"  {label} -> {out.name} ({len(data) // 1024} KB, {dimensions(out)})")
            ok = True
            break
        manifest.append({"scene": label, "file": out.name, "prompt": prompt, "ok": ok})
        if not ok:
            print(f"  {label} FAILED after {a.retries} attempts")
        else:
            time.sleep(a.pause)

    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    bad = [m for m in manifest if not m["ok"]]
    print(f"\n{len(manifest) - len(bad)}/{len(manifest)} images ready in {out_dir}")
    if bad:
        print("failed:", ", ".join(m["scene"] for m in bad))
        sys.exit(1)


if __name__ == "__main__":
    main()
