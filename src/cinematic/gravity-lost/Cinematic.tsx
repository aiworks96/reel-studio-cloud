// Cinematic documentary composition: "gravity-lost".
//
// What if Earth lost its gravity for exactly 5 seconds?
//
// Format: 16:9 landscape, 1280x720, 30 fps.
// Look: AI-generated stills moved with a slow Ken Burns push/pan, 20-frame cross-fades
// between scenes, a vignette and a slight grade over the whole thing, and one continuous
// ambient bed mixed under the narration.
//
// Scene cuts are taken from the real word timings (public/gravity-lost/captions.words.json),
// so each image starts on the sentence it belongs to.
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../../timing";
import words from "../../../public/gravity-lost/captions.words.json";

export const WIDTH = 1280;
export const HEIGHT = 720;
export const FPS = 30;
const FADE = 20; // frames of cross-fade between scenes

type Move = { s: [number, number]; x: [number, number]; y: [number, number] };

/** Scene start times in seconds, read off the caption timings. */
const SCENES: { file: string; start: number; move: Move }[] = [
  { file: "scene-01.jpg", start: 0.11, move: { s: [1.02, 1.14], x: [0, -1.2], y: [0.6, -0.6] } },
  { file: "scene-02.jpg", start: 11.53, move: { s: [1.14, 1.02], x: [-1, 1], y: [-0.5, 0.5] } },
  { file: "scene-03.jpg", start: 26.62, move: { s: [1.02, 1.12], x: [1.2, -1.2], y: [0, 0.4] } },
  { file: "scene-04.jpg", start: 38.74, move: { s: [1.13, 1.02], x: [-1.2, 1.2], y: [0.5, -0.5] } },
  { file: "scene-05.jpg", start: 50.21, move: { s: [1.02, 1.15], x: [1, -1], y: [-0.4, 0.4] } },
  { file: "scene-06.jpg", start: 61.17, move: { s: [1.12, 1.02], x: [-1, 1], y: [0, -0.4] } },
  { file: "scene-07.jpg", start: 73.83, move: { s: [1.02, 1.13], x: [-0.8, 0.8], y: [0.8, -0.8] } },
  { file: "scene-08.jpg", start: 87.19, move: { s: [1.1, 1.02], x: [0.6, -0.6], y: [-0.4, 0.4] } },
];

export const durationInFrames = Math.ceil((97.71 + 1.0) * FPS);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

/** One still, moved slowly. */
const Shot: React.FC<{ file: string; start: number; until: number; move: Move }> = ({ file, start, until, move }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const span = until - start;
  const p = clamp01(local / span);

  const opacity = Math.min(smooth(clamp01(local / FADE)), smooth(clamp01((span - local) / FADE)));
  if (opacity <= 0.001) return null;

  const ease = Easing.inOut(Easing.quad);
  const scale = interpolate(p, [0, 1], move.s, { easing: ease });
  const x = interpolate(p, [0, 1], move.x);
  const y = interpolate(p, [0, 1], move.y);

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#05070C" }}>
        <Img
          src={staticFile(`gravity-lost/${file}`)}
          style={{
            width: "110%",
            height: "110%",
            left: "-5%",
            top: "-5%",
            objectFit: "cover",
            transform: `translate(${x}%, ${y}%) scale(${scale})`,
            transformOrigin: "center center",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Small, low captions - no box, just a shadow over a soft scrim. */
const Captions: React.FC<{ words: Word[] }> = ({ words: ws }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const per = 6;

  let current = -1;
  for (let i = 0; i < ws.length; i++) {
    if (ws[i].start <= t) current = i;
    else break;
  }
  if (current < 0) return null;

  const from = Math.floor(current / per) * per;
  const chunk = ws.slice(from, from + per);
  const last = chunk[chunk.length - 1];
  if (!last) return null;

  const fadeIn = clamp01((t - from * 0 - chunk[0].start) / 0.25);
  const fadeOut = clamp01((last.end + 0.45 - t) / 0.35);
  const opacity = Math.min(fadeIn, fadeOut);
  if (opacity <= 0.01) return null;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 46, opacity }}>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 27,
          fontWeight: 500,
          letterSpacing: 0.6,
          color: "#FFFFFF",
          textAlign: "center",
          maxWidth: 900,
          textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)",
        }}
      >
        {chunk.map((w, i) => (
          <span key={from + i} style={{ opacity: from + i <= current ? 1 : 0.42 }}>
            {w.word}{" "}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const GravityLost: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070C" }}>
      {SCENES.map((s, i) => (
        <Shot key={s.file} file={s.file} start={s.start} until={SCENES[i + 1]?.start ?? durationInFrames / FPS} move={s.move} />
      ))}

      {/* grade + vignette, so eight different AI stills read as one film */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.30) 72%, rgba(0,0,0,0.62) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(8,12,22,0.30) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 62%, rgba(6,9,16,0.45) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      <Captions words={words} />

      <Audio src={staticFile("gravity-lost/mix.wav")} />
      <div style={{ display: "none" }}>{frame}</div>
    </AbsoluteFill>
  );
};
