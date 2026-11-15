// Minimalist 2D primitives for the "What If" style.
// Flat shapes, thin outlines, clean backgrounds. No gradients, no photos, no realistic art.
// Every colour is derived from the brand so the reel re-skins with the kit.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../../brand-context";

/** Blend two hex colours. t=0 -> a, t=1 -> b. */
export const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/** Pop-in for a group of shapes that should appear on a word. */
export const useIn = (at: number, dist = 26) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 150, mass: 0.7 } });
  return {
    opacity: interpolate(frame - at, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    dy: (1 - p) * dist,
    scale: 0.9 + 0.1 * p,
  };
};

/** Same as useIn, but a plain function, so it can be used inside .map() without breaking the rules of hooks. */
export const popIn = (frame: number, at: number, fps = 30, dist = 26) => {
  const p = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 150, mass: 0.7 } });
  return {
    opacity: interpolate(frame - at, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    dy: (1 - p) * dist,
  };
};

/** Continuous 0..1 ramp, for loops (rotating moons, travelling pulses). */
export const useRamp = (from: number, to: number, frames: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

/* ------------------------------------------------------------------ text */

export type TxtProps = {
  x: number;
  y: number;
  w?: number;
  size: number;
  weight?: number;
  color?: string;
  align?: "left" | "center" | "right";
  children: React.ReactNode;
};

export const Txt: React.FC<TxtProps> = ({ x, y, w = 900, size, weight = 800, color, align = "center", children }) => {
  const b = useBrand();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        fontFamily: b.fontFamily,
        fontSize: size,
        fontWeight: weight,
        color: color ?? b.colors.text,
        textAlign: align,
        lineHeight: 1.1,
        letterSpacing: -1,
      }}
    >
      {children}
    </div>
  );
};

/* --------------------------------------------------------------- figures */

export type Pose = "stand" | "wave" | "reach" | "sit" | "float";

/**
 * A stick figure standing on (x, y). Total height h.
 * Built from plain lines and a circle - the whole point of the style.
 */
export const Figure: React.FC<{
  x: number;
  y: number;
  h: number;
  color: string;
  weight?: number;
  pose?: Pose;
  flip?: boolean;
}> = ({ x, y, h, color, weight = Math.max(3, h * 0.055), pose = "stand", flip = false }) => {
  const r = h * 0.11;
  const headY = y - h + r;
  const neckY = y - h + r * 2.1;
  const hipY = y - h * 0.46;
  const shoulderY = neckY + h * 0.05;
  const s = flip ? -1 : 1;
  const arm = (up: number, out: number) => `${x + s * out * h * 0.2},${shoulderY - up * h * 0.2}`;

  let arms: string;
  switch (pose) {
    case "wave":
      arms = `M ${x},${shoulderY} L ${arm(0.35, 0.55)} M ${x},${shoulderY} L ${arm(-0.1, 0.45)}`;
      break;
    case "reach":
      arms = `M ${x},${shoulderY} L ${arm(0.75, 0.2)} M ${x},${shoulderY} L ${arm(0.7, 0.3)}`;
      break;
    case "sit":
      arms = `M ${x},${shoulderY} L ${x + s * h * 0.12},${shoulderY + h * 0.1} M ${x},${shoulderY} L ${x - s * h * 0.12},${shoulderY + h * 0.1}`;
      break;
    case "float":
      arms = `M ${x},${shoulderY} L ${arm(0.5, 0.5)} M ${x},${shoulderY} L ${arm(0.45, -0.4)}`;
      break;
    default:
      arms = `M ${x},${shoulderY} L ${arm(-0.12, 0.42)} M ${x},${shoulderY} L ${arm(-0.12, -0.42)}`;
  }

  const legs =
    pose === "sit"
      ? `M ${x},${hipY} L ${x + s * h * 0.2},${hipY} L ${x + s * h * 0.2},${y}`
      : `M ${x},${hipY} L ${x - s * h * 0.11},${y} M ${x},${hipY} L ${x + s * h * 0.11},${y}`;

  return (
    <g stroke={color} strokeWidth={weight} strokeLinecap="round" fill="none">
      <circle cx={x} cy={headY} r={r} fill={color} stroke="none" />
      <path d={`M ${x},${neckY} L ${x},${hipY}`} />
      <path d={legs} />
      <path d={arms} />
    </g>
  );
};

/* ---------------------------------------------------------------- worlds */

/** A flat blue Earth disc with a couple of continent blobs. */
export const Earth: React.FC<{ cx: number; cy: number; r: number; color: string; land: string }> = ({ cx, cy, r, color, land }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={color} />
    <path
      d={`M ${cx - r * 0.72},${cy - r * 0.18} q ${r * 0.34},${-r * 0.42} ${r * 0.72},${-r * 0.06} q ${r * 0.12},${r * 0.3} ${-r * 0.2},${r * 0.44} q ${-r * 0.4},${r * 0.16} ${-r * 0.52},${-r * 0.38} z`}
      fill={land}
    />
    <path
      d={`M ${cx + r * 0.04},${cy + r * 0.12} q ${r * 0.42},${-r * 0.1} ${r * 0.5},${r * 0.24} q ${r * 0.04},${r * 0.32} ${-r * 0.26},${r * 0.3} q ${-r * 0.3},${-r * 0.04} ${-r * 0.24},${-r * 0.54} z`}
      fill={land}
    />
  </g>
);

/** A grey Moon disc with a few craters. `dark` fills the shadowed side. */
export const Moon: React.FC<{
  cx: number;
  cy: number;
  r: number;
  fill: string;
  crater: string;
  edge?: string;
  dark?: number;
  spin?: number;
}> = ({ cx, cy, r, fill, crater, edge, dark = 0, spin = 0 }) => {
  const craters = [
    [-0.34, -0.26, 0.17],
    [0.24, -0.1, 0.12],
    [-0.12, 0.3, 0.2],
    [0.38, 0.34, 0.1],
    [0.06, -0.5, 0.09],
  ];
  return (
    <g transform={spin ? `rotate(${spin} ${cx} ${cy})` : undefined}>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={edge} strokeWidth={2} />
      {craters.map(([dx, dy, dr], i) => (
        <circle key={i} cx={cx + dx * r} cy={cy + dy * r} r={dr * r} fill={crater} />
      ))}
      {dark > 0 ? <path d={`M ${cx},${cy - r} A ${r},${r} 0 0 1 ${cx},${cy + r} Z`} fill={crater} opacity={dark} /> : null}
    </g>
  );
};

/* ----------------------------------------------------------------- bits */

/** Dashed arc, used for jump trajectories. */
export const JumpArc: React.FC<{ x: number; y: number; w: number; h: number; color: string; width?: number }> = ({
  x,
  y,
  w,
  h,
  color,
  width = 3,
}) => (
  <path
    d={`M ${x},${y} Q ${x + w / 2},${y - h} ${x + w},${y}`}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeDasharray="10 12"
    strokeLinecap="round"
  />
);

/** A rounded label chip. */
export const Chip: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  bg: string;
  fg: string;
  size?: number;
  radius?: number;
  weight?: number;
}> = ({ x, y, w, h = 56, text, bg, fg, size = 30, radius = 28, weight = 800 }) => {
  const b = useBrand();
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={radius} fill={bg} />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={fg}
        fontFamily={b.fontFamily}
        fontSize={size}
        fontWeight={weight}
        letterSpacing={0.5}
      >
        {text}
      </text>
    </g>
  );
};

/** A straight arrow from (x1,y1) to (x2,y2). `flow` makes the line run like a conveyor. */
export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
  head?: number;
  flow?: boolean;
}> = ({ x1, y1, x2, y2, color, width = 3, head = 14, flow = false }) => {
  const frame = useCurrentFrame();
  const a = Math.atan2(y2 - y1, x2 - x1);
  const b1 = [x2 - head * Math.cos(a - 0.42), y2 - head * Math.sin(a - 0.42)];
  const b2 = [x2 - head * Math.cos(a + 0.42), y2 - head * Math.sin(a + 0.42)];
  return (
    <g stroke={color} strokeWidth={width} fill="none" strokeLinecap="round">
      <path d={`M ${x1},${y1} L ${x2},${y2}`} strokeDasharray={flow ? "14 16" : undefined} strokeDashoffset={flow ? -((frame * 1.4) % 30) : undefined} />
      <path d={`M ${b1[0]},${b1[1]} L ${x2},${y2} L ${b2[0]},${b2[1]}`} />
    </g>
  );
};

/** A simple house, for the settlement on the Moon. */
export const House: React.FC<{ x: number; y: number; w: number; fill: string; edge: string; lit?: boolean }> = ({
  x,
  y,
  w,
  fill,
  edge,
  lit,
}) => (
  <g>
    <rect x={x - w / 2} y={y - w * 0.55} width={w} height={w * 0.55} fill={fill} stroke={edge} strokeWidth={2} />
    <path d={`M ${x - w * 0.62},${y - w * 0.55} L ${x},${y - w * 1.05} L ${x + w * 0.62},${y - w * 0.55} Z`} fill={fill} stroke={edge} strokeWidth={2} />
    {lit ? <rect x={x - w * 0.14} y={y - w * 0.4} width={w * 0.28} height={w * 0.22} fill={edge} opacity={0.75} /> : null}
  </g>
);

/** A factory block, for Earth as the supplier. */
export const Factory: React.FC<{ x: number; y: number; w: number; fill: string; edge: string }> = ({ x, y, w, fill, edge }) => (
  <g>
    <rect x={x - w / 2} y={y - w * 0.42} width={w} height={w * 0.42} fill={fill} stroke={edge} strokeWidth={2} />
    <path
      d={`M ${x - w * 0.5},${y - w * 0.42} l 0,${-w * 0.22} l ${w * 0.16},${w * 0.14} l 0,${-w * 0.14} l ${w * 0.16},${w * 0.14} l 0,${-w * 0.14} l ${w * 0.16},${w * 0.14} l 0,${-w * 0.12} l ${w * 0.16},${w * 0.12} l 0,${-w * 0.12} l ${w * 0.16},${w * 0.12} l 0,${-w * 0.12} l ${w * 0.2},${w * 0.12} l 0,${-w * 0.1} z`}
      fill={fill}
      stroke={edge}
      strokeWidth={2}
    />
  </g>
);

/** A rocket, for the trip between the worlds. */
export const Rocket: React.FC<{ x: number; y: number; s: number; color: string; edge: string; tilt?: number }> = ({
  x,
  y,
  s,
  color,
  edge,
  tilt = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
    <path d="M 0,-60 C 22,-32 24,8 24,34 L 4,34 L 4,50 L -4,50 L -4,34 L -24,34 C -24,8 -22,-32 0,-60 Z" fill={color} stroke={edge} strokeWidth={3} />
    <circle cx={0} cy={-18} r={9} fill={edge} stroke="none" />
  </g>
);

/** A deterministic starfield, so every render is identical. */
const STARS: [number, number, number][] = [
  [40, 60, 3], [120, 190, 2], [210, 80, 2.5], [300, 150, 2], [380, 50, 3], [470, 210, 2],
  [560, 100, 2], [650, 180, 2.5], [740, 70, 2], [830, 160, 3], [90, 320, 2], [200, 400, 2.5],
  [330, 350, 2], [460, 420, 3], [600, 330, 2], [720, 420, 2.5], [800, 300, 2], [60, 460, 2.5],
  [280, 470, 2], [520, 480, 2], [680, 500, 2.5], [770, 470, 2], [160, 560, 2], [400, 560, 2.5],
  [600, 580, 2], [860, 540, 2], [40, 640, 2], [240, 660, 2], [460, 660, 2.5], [700, 660, 2],
];

export const Stars: React.FC<{ color: string; opacity?: number }> = ({ color, opacity = 1 }) => (
  <g opacity={opacity}>
    {STARS.map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill={color} />
    ))}
  </g>
);
