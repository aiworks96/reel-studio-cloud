# gravity-lost

**What if Earth lost its gravity for exactly 5 seconds?**

Format: 16:9 landscape, 1280x720, 30 fps, 98.7 s.
Voice: `edge-tts` / `en-US-GuyNeural` with `--rate="-10%" --pitch="-2Hz"`.
Look: AI-generated stills with slow Ken Burns moves, 20-frame cross-fades, vignette and
grade, one continuous ambient bed under the narration.

## Formula: Hypothesis -> Deduction -> Conclusion

| # | Beat | Words | Starts |
|---|---|---|---|
| 1 | **Hypothesis** - for five seconds Earth lets go | 23 | 0.11 s |
| 2 | **Deduction** - the ocean breaks first | 31 | 11.53 s |
| 3 | **Deduction** - the arithmetic of a uniform shell | 31 | 26.62 s |
| 4 | **Deduction** - the sea level falls, the continents drown | 24 | 38.74 s |
| 5 | **Deduction** - the air blooms, nothing falls | 20 | 50.21 s |
| 6 | **Deduction** - the Sun still holds the Earth | 26 | 61.17 s |
| 7 | **Deduction** - five seconds to undo | 29 | 73.83 s |
| 8 | **Conclusion** - gravity is the structure we are made of | 32 | 87.19 s |

The exact words are in `voice.txt`. `prompts.txt` holds the image prompt for each scene.

## Facts and sources

| Claim | Source |
|---|---|
| Ocean volume 1,335,000,000 km3 | NOAA NGDC |
| Average ocean depth 3,688 m | Britannica |
| Land mean elevation ~840 m, land is 29% of the surface | Britannica |
| Earth radius 6,371 km | NASA *Compare Earth and the Moon* |
| Sound in seawater ~1,500 m/s | standard constant |

The two derived figures the film turns on:

- Spreading 1.335e9 km3 over the whole globe (4*pi*R^2 = 5.10e8 km2) gives a uniform
  shell **2.62 km** deep. Against the current 3.69 km mean depth, sea level **drops
  1.07 km** as the water spreads out.
- Land averages 840 m above today's sea level, so the continents end up under
  840 m + 1071 m = **1.9 km** of water - they drown even though the sea level falls.
- Pressure crosses a 3,688 m ocean in 3688/1500 = **2.5 s**, so the ocean equalises
  inside the five seconds.

## How it was built

```bash
# voice
edge-tts --voice en-US-GuyNeural --rate="-10%" --pitch="-2Hz" \
  --text "$(cat projects/gravity-lost/voice.txt)" --write-media gravity-lost-voice.mp3
python3 tools/edge-words.py --id gravity-lost --voice en-US-GuyNeural \
  --rate=-10% --pitch=-2Hz --out-dir public/gravity-lost

# images (Pollinations' free tier is rate limited - space the requests out)
python3 tools/fetch-images.py --id gravity-lost --width 1920 --height 1080 --pause 16

# sound design: the bed sits exactly 22 dB under the voice, ducked by the voice
ffmpeg -i vo.wav -i music/blown-wide-worlds.ogg -filter_complex "..." mix.wav
```

## Notes from the build

- Pollinations' anonymous tier rejects `nologo`, `enhance` and `model` with **402**,
  and burst requests with **402/503**. A 16 s pause between requests fixes it, and the
  returned images are 1024x576.
- The free tier also stamps a **pollinations.ai watermark** into the bottom right of
  every image. The bottom 36 px are cropped off each still after download.
- `en-US-GuyNeural` at -10% rate runs at about 2.0 words/sec, so the script was
  trimmed to 213 words to land near 1:39.

## Music

`music/blown-wide-worlds.ogg` - **"Blown Wide Worlds" by John Bartmann**, released under
**CC0 1.0** (public domain dedication) via Wikimedia Commons:
<https://commons.wikimedia.org/wiki/File:John_Bartmann_-_blown-wide-worlds-master.ogg>

CC0 requires no attribution, but the credit is recorded here anyway.
