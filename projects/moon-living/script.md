# moon-living

**What if humans started living on the Moon and on Earth at the same time?**

Format: 9:16 vertical, 2:33 (153.8 s), 30 fps, 4619 frames.
Voice: `edge-tts` / `en-US-ChristopherNeural` (deep, authoritative).
Style: minimalist 2D - flat shapes, thin outlines, clean background, stick figures only.

## Formula: Setup -> Consequence -> Conclusion

### Setup - the hook

> What if humans lived on the Moon and on Earth at the same time? Not a trip. A second home. People who work there, raise families there, and never come back. But you would no longer be the only one of you.

### Consequence - escalating

1. **The sky** - one sixth gravity, and no air, so the sky is black even at noon.
2. **The day** - 27 days to spin; 14 days of sun, 14 of dark; 127 C in the light, -173 C in one rock's shadow.
3. **The distance** - 384,000 km, but light takes only 1.3 s while a ship takes days.
4. **The factory** - half the settlement asleep, half blind; the air, the food and the parts all come from Earth.
5. **Two species** - a child born there grows up in one sixth gravity and Earth feels like an ocean.

### Conclusion - the science, then the final thought

6. **The science** - a Mars sized impact, no air, no magnetic field, no radiation shield.
7. **How close we are** - 24 Americans flew to the Moon, 12 walked, and in April 2026 four more flew around it. Nobody has ever lived there.
8. **Final thought** - the Earth stops being your planet and becomes your sun. Humanity becomes a place you can stand on.

## Spoken script

The exact words are in `voice.txt` (and `captions.txt`, same words, same order).

## Facts and sources

Every number in the script was opened and checked:

| Claim | Source |
|---|---|
| Gravity one sixth of Earth's; 127 C in full sun, -173 C in shadow; 27 day spin; thin exosphere; very weak magnetic field; tidally locked | https://science.nasa.gov/moon/facts/ |
| 384,400 km; escape velocity 11.19 km/s (Earth) vs 2.38 km/s (Moon); surface gravity 1.624 vs 9.807 m/s2 | https://science.nasa.gov/moon/by-the-numbers/ |
| 12 walked on the Moon; 24 Americans flew there 1968-1972; Artemis II crew of 4 travelled around it in 2026 | https://science.nasa.gov/moon/moon-walkers/ |
| Artemis II: launched 1 Apr 2026, splashdown 10 Apr 2026, 9 d 1 h 32 m, crewed lunar flyby | https://www.nasa.gov/mission/artemis-ii/ |
| Artemis III: 2027, crewed LEO demo of the lander; landing deferred to Artemis IV | https://www.nasa.gov/mission/artemis-iii/ |
| $1M Moon Base Challenge, announced 8 Nov 2026; six categories; lunar south pole | https://www.nasa.gov/news-release/nasa-announces-1-million-to-students-for-moon-base-challenge/ |
| NASA is building Moon Base at the lunar south pole | https://www.nasa.gov/moon-base/ |

Derived: light travel time = 384,400 km / 299,792 km/s = 1.28 s one way.

## How it was built

```bash
npm run new -- moon-living                                   # scaffold

edge-tts --voice en-US-ChristopherNeural \
  --text "$(cat projects/moon-living/voice.txt)" \
  --write-media temp.mp3

ffmpeg -y -v error -i temp.mp3 -ac 1 -ar 44100 public/reels/moon-living/vo.wav

python3 tools/edge-words.py --id moon-living --voice en-US-ChristopherNeural
# -> public/reels/moon-living/captions.words.json (word-level timings, no Whisper)
```

`tools/edge-words.py` asks the edge-tts service for WordBoundary events, so the caption
timings come from the same synthesis as the audio and line up exactly (last word ends at
152.96 s, audio runs 153.80 s).

## Scenes

| # | Scene | Shows |
|---|---|---|
| 1 | hook | Title + Earth and Moon discs with a figure on each |
| 2 | two-worlds | Houses on the Moon, a second figure on Earth |
| 3 | one-sixth | Giant 1/6, a short jump on Earth and a tall one on the Moon |
| 4 | no-air | Black panel, NO WIND / NO RAIN / NO CLOUDS chips |
| 5 | black-sky | Stars, a sun with rays, a black sky at noon |
| 6 | twenty-seven | The Moon with a rotation arrow, 27 DAYS |
| 7 | two-weeks | A split bar: 14 DAYS SUN / 14 DAYS DARK |
| 8 | temperatures | Sunlit ground at 127 C, a rock's shadow at -173 C |
| 9 | one-rock | One rock split into two halves - ONE ROCK / TWO WORLDS |
| 10 | distance | Earth and Moon far apart, 384,000 km |
| 11 | one-point-three | A light pulse crossing the gap in 1.3 s |
| 12 | reach-her | A rocket (3 DAYS) next to a screen with a waving figure |
| 13 | half-asleep | A moon lit on one side, dark on the other, houses asleep |
| 14 | from-home | Arrows from Earth to the Moon: AIR / FOOD / PARTS |
| 15 | a-factory | Earth with a factory on it, the Moon with a clock |
| 16 | born-there | A child on the Moon in 1/6 g, a family on Earth |
| 17 | lighter | LIGHTER BONES / DIFFERENT LUNGS over an ocean-like Earth |
| 18 | two-species | Two figures, one species or two |
| 19 | the-impact | A Mars sized body heading for the Earth |
| 20 | no-field | The Moon with broken field arcs, NO AIR / NO FIELD |
| 21 | field-stronger | Earth's strong field vs the Moon's missing shield |
| 22 | nobody | A big 0 on the Moon |
| 23 | timeline | 1968 / 1972 / 2026 / 2027 / 2028, and 12 who walked |
| 24 | your-sun | The Earth hanging in a black sky, a figure reaching up |
| 25 | humanity | HUMANITY, and a figure standing on the Moon |

## Rendering

Remotion's bundler needs the native `@rspack` binding, which has no Android/arm64 build,
so this video cannot be bundled on a phone. It renders on GitHub Actions:

```bash
gh workflow run render.yml -f reel=moon-living
gh run watch
```

`.github/workflows/render.yml` runs the self-check, then the render, then uploads both the
mp4 and the check report + contact sheet as artifacts.

## Note on length

`npm run check` flags any reel longer than 90 s as a blocking problem, because the kit is
built for social reels. This one is a 2:33 documentary deep dive by design, so that single
finding is expected and accepted. Every other finding should be clean.
