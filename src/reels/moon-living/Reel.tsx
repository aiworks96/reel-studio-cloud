// Reel "moon-living": What if humans started living on the Moon and Earth at the same time?
//
// Style: minimalist 2D. Flat shapes, thin outlines, clean background. Stick figures and
// geometric forms only - no realistic imagery, no gradients, no photos.
// Script formula: Setup -> Consequence -> Conclusion.
//
//   words -> when each word is spoken (public/reels/moon-living/captions.words.json)
//   t.atText -> the frame a word starts on, so shapes pop exactly with the narration
import React from "react";
import { useCurrentFrame } from "remotion";
import { brand as myBrand } from "../../brand";
import { Karaoke, ReelFrame, SceneBlock, type ReelProps } from "../../components";
import { FONTS } from "../../fonts";
import { CAPTION_BOTTOM, SAFE_BOX } from "../../layout";
import { timing } from "../../timing";
import {
  Arrow,
  Chip,
  Earth,
  Factory,
  Figure,
  House,
  JumpArc,
  Moon,
  Rocket,
  Stars,
  Txt,
  mix,
  useIn,
} from "./shapes";
import words from "../../../public/reels/moon-living/captions.words.json";

export const t = timing(words);
export const AUDIO = "reels/moon-living/vo.wav";
export const durationInFrames = t.duration(1.0);

/* ------------------------------------------------------------- scene map */
// Cut points are the sentence starts, taken from the real word timings.
const S = {
  hook: [0, t.atText("People", 7.34)],
  twoWorlds: [t.atText("People", 7.34), t.atText("Gravity", 15.12)],
  oneSixth: [t.atText("Gravity", 15.12), t.atText("It", 21.21)],
  noAir: [t.atText("It", 21.21), t.atText("The", 26.93)],
  blackSky: [t.atText("The", 26.93), t.atText("The", 30.99, 1)],
  twentySeven: [t.atText("The", 30.99, 1), t.atText("One", 34.52)],
  twoWeeks: [t.atText("One", 34.52), t.atText("In", 39.45)],
  temperatures: [t.atText("In", 39.45), t.atText("One", 47.92)],
  oneRock: [t.atText("One", 47.92), t.atText("The", 51.40, 2)],
  distance: [t.atText("The", 51.40, 2), t.atText("Light", 56.4)],
  onePointThree: [t.atText("Light", 56.4), t.atText("A", 61.62)],
  reachHer: [t.atText("A", 61.62), t.atText("The", 68.34)],
  halfAsleep: [t.atText("The", 68.34), t.atText("Everything", 75.51)],
  fromHome: [t.atText("Everything", 75.51), t.atText("Your", 82.94)],
  aFactory: [t.atText("Your", 82.94), t.atText("And", 88.1)],
  bornThere: [t.atText("And", 88.1), t.atText("Lighter", 94.61)],
  lighter: [t.atText("Lighter", 94.61), t.atText("Earth", 98.31)],
  twoSpecies: [t.atText("Earth", 98.31), t.atText("Here", 105.96)],
  theImpact: [t.atText("Here", 105.96), t.atText("It", 113.39)],
  noField: [t.atText("It", 113.39), t.atText("The", 117.39)],
  fieldStronger: [t.atText("The", 117.39), t.atText("And", 123.25)],
  nobody: [t.atText("And", 123.25), t.atText("In", 126.08)],
  timeline: [t.atText("In", 126.08), t.atText("When", 134.22)],
  yourSun: [t.atText("When", 134.22), t.atText("We", 142.69)],
  humanity: [t.atText("We", 142.69), t.duration(1.0)],
} as const;

/* ------------------------------------------------------------- primitives */

const Scene: React.FC<{ name: string; from: number; to: number; children: React.ReactNode }> = ({ name, from, to, children }) => (
  <SceneBlock name={name} from={from} to={to}>
    <div
      data-el={`s-${name}`}
      data-kind="content"
      style={{ position: "absolute", left: SAFE_BOX.x, top: 240, width: 900, height: 1060 }}
    >
      {children}
    </div>
  </SceneBlock>
);

/** The SVG layer every scene draws into. */
const Art: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={900} height={1060} viewBox="0 0 900 1060" style={{ position: "absolute", left: 0, top: 0 }}>
    {children}
  </svg>
);

type Pal = {
  ink: string;
  bg: string;
  earth: string;
  land: string;
  moon: string;
  crater: string;
  moonEdge: string;
  dark: string;
  darkSoft: string;
  lit: string;
};

/* ------------------------------------------------------------------ reel */

export const Reel: React.FC<ReelProps> = ({ brand = myBrand, debugSafeZones, probe }) => {
  const frame = useCurrentFrame();
  const b = brand;
  const pal: Pal = {
    ink: b.colors.text,
    bg: b.colors.bg,
    earth: b.colors.accent,
    land: mix(b.colors.accent, "#FFFFFF", 0.62),
    moon: mix(b.colors.bg, b.colors.text, 0.17),
    crater: mix(b.colors.bg, b.colors.text, 0.09),
    moonEdge: mix(b.colors.bg, b.colors.text, 0.3),
    dark: mix(b.colors.bg, b.colors.text, 0.93),
    darkSoft: mix(b.colors.bg, b.colors.text, 0.78),
    lit: b.colors.accent2,
  };

  // ---- scene 1: the hook -----------------------------------------------
  const s1 = useIn(t.atText("Moon", 1.24));
  const s1b = useIn(t.atText("Earth", 1.85));
  const s1c = useIn(t.atText("Not", 3.89));
  const s1d = useIn(t.atText("A", 5.54));

  // ---- scene 2: people on both worlds -----------------------------------
  const s2a = useIn(t.atText("People", 7.34));
  const s2b = useIn(t.atText("But", 11.99));

  // ---- scene 3: one sixth -----------------------------------------------
  const s3a = useIn(t.atText("Gravity", 15.12));
  const s3b = useIn(t.atText("one", 16.6));
  const s3c = useIn(t.atText("jump", 18.4));

  // ---- scene 4/5: no atmosphere, black sky -------------------------------
  const s4 = useIn(t.atText("It", 21.21));
  const s4b = useIn(t.atText("wind", 23.1));
  const s4c = useIn(t.atText("rain", 24.4));
  const s4d = useIn(t.atText("clouds", 25.6));
  const s5 = useIn(t.atText("The", 26.93));
  const s5b = useIn(t.atText("Even", 29.18));

  // ---- scene 6/7: twenty seven days, two weeks --------------------------
  const s6 = useIn(t.atText("The", 30.99, 1));
  const s6b = useIn(t.atText("spins", 32.2));
  const s7 = useIn(t.atText("One", 34.52));
  const s7b = useIn(t.atText("darkness", 38.2));

  // ---- scene 8/9: temperatures, one rock ---------------------------------
  const s8 = useIn(t.atText("In", 39.45));
  const s8b = useIn(t.atText("degrees", 42.6));
  const s8c = useIn(t.atText("In", 43.74));
  const s8d = useIn(t.atText("minus", 45.6));
  const s9 = useIn(t.atText("One", 47.92));
  const s9b = useIn(t.atText("Two", 49.6));

  // ---- scene 10/11/12: distance, 1.3 s, reaching her ---------------------
  const s10 = useIn(t.atText("The", 51.4, 2));
  const s10b = useIn(t.atText("kilometres", 54.3));
  const s11 = useIn(t.atText("Light", 56.4));
  const s11b = useIn(t.atText("behind", 59.6));
  const s12 = useIn(t.atText("A", 61.62));
  const s12b = useIn(t.atText("Your", 63.84));
  const s12c = useIn(t.atText("reach", 67.0));

  // ---- scene 13/14/15: asleep, from home, a factory ----------------------
  const s13 = useIn(t.atText("The", 68.34));
  const s13b = useIn(t.atText("asleep", 71.6));
  const s13c = useIn(t.atText("dark", 74.2));
  const s14 = useIn(t.atText("Everything", 75.51));
  const s14b = useIn(t.atText("air", 77.9));
  const s14c = useIn(t.atText("food", 79.4));
  const s14d = useIn(t.atText("parts", 80.97));
  const s15 = useIn(t.atText("Your", 82.94));
  const s15b = useIn(t.atText("factory", 86.2));

  // ---- scene 16/17/18: born there, lighter, two species ------------------
  const s16 = useIn(t.atText("And", 88.1));
  const s16b = useIn(t.atText("child", 90.6));
  const s16c = useIn(t.atText("gravity", 93.0));
  const s17 = useIn(t.atText("Lighter", 94.61));
  const s17b = useIn(t.atText("lungs", 96.51));
  const s17c = useIn(t.atText("ocean", 98.31));
  const s18 = useIn(t.atText("Earth", 98.31));
  const s18b = useIn(t.atText("worlds", 102.4));
  const s18c = useIn(t.atText("two", 104.14));

  // ---- scene 19/20/21: impact, no field, field stronger ------------------
  const s19 = useIn(t.atText("Here", 105.96));
  const s19b = useIn(t.atText("made", 108.9));
  const s19c = useIn(t.atText("ago", 111.4));
  const s20 = useIn(t.atText("It", 113.39));
  const s20b = useIn(t.atText("magnetic", 115.6));
  const s21 = useIn(t.atText("The", 117.39));
  const s21b = useIn(t.atText("stronger", 119.3));
  const s21c = useIn(t.atText("shield", 120.94));

  // ---- scene 22/23: nobody, the timeline --------------------------------
  const s22 = useIn(t.atText("And", 123.25));
  const s23 = useIn(t.atText("In", 126.08));
  const s23b = useIn(t.atText("2026", 127.0));
  const s23c = useIn(t.atText("Twelve", 132.11));

  // ---- scene 24/25: your sun, humanity -----------------------------------
  const s24 = useIn(t.atText("When", 134.22));
  const s24b = useIn(t.atText("sun", 137.8));
  const s24c = useIn(t.atText("thing", 139.11));
  const s25 = useIn(t.atText("We", 142.69));
  const s25b = useIn(t.atText("apart", 146.5));
  const s25c = useIn(t.atText("first", 148.46));
  const s25d = useIn(t.atText("stand", 150.6));

  return (
    <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
      {/* 1 - hook: two worlds */}
      <Scene name="hook" from={S.hook[0]} to={S.hook[1]}>
        <Txt x={0} y={20} size={104} weight={800}>
          What if we lived on <span style={{ color: pal.earth }}>both</span>?
        </Txt>
        <Art>
          <g opacity={s1.opacity} transform={`translate(0 ${s1.dy})`}>
            <Moon cx={660} cy={560} r={128} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
          </g>
          <g opacity={s1b.opacity} transform={`translate(0 ${s1b.dy})`}>
            <Earth cx={250} cy={560} r={128} color={pal.earth} land={pal.land} />
          </g>
          <path d="M 386,560 L 524,560" stroke={pal.ink} strokeWidth={2} strokeDasharray="8 10" opacity={s1c.opacity * 0.5} />
          <g opacity={s1c.opacity} transform={`translate(0 ${s1c.dy})`}>
            <Figure x={660} y={432} h={92} color={pal.ink} weight={5} pose="wave" />
          </g>
          <g opacity={s1d.opacity} transform={`translate(0 ${s1d.dy})`}>
            <Figure x={250} y={432} h={92} color={pal.ink} weight={5} />
          </g>
        </Art>
        <Txt x={0} y={720} size={40} weight={700} color={pal.ink}>
          <span style={{ opacity: 0.55 }}>a second home</span>
        </Txt>
      </Scene>

      {/* 2 - people on both worlds */}
      <Scene name="two-worlds" from={S.twoWorlds[0]} to={S.twoWorlds[1]}>
        <Art>
          <g opacity={s2a.opacity} transform={`translate(0 ${s2a.dy})`}>
            <Earth cx={230} cy={620} r={140} color={pal.earth} land={pal.land} />
            <Moon cx={670} cy={620} r={140} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
            <House x={600} y={480} w={54} fill={pal.bg} edge={pal.ink} lit />
            <House x={690} y={492} w={44} fill={pal.bg} edge={pal.ink} />
            <House x={742} y={486} w={38} fill={pal.bg} edge={pal.ink} />
          </g>
          <g opacity={s2b.opacity} transform={`translate(0 ${s2b.dy})`}>
            <Figure x={200} y={486} h={98} color={pal.ink} weight={5} />
            <Figure x={278} y={500} h={70} color={pal.ink} weight={4} pose="wave" />
          </g>
        </Art>
        <Txt x={0} y={840} size={46} weight={800}>
          no longer the only one of you
        </Txt>
      </Scene>

      {/* 3 - one sixth */}
      <Scene name="one-sixth" from={S.oneSixth[0]} to={S.oneSixth[1]}>
        <Txt x={0} y={0} size={230} weight={800} color={pal.earth}>
          1/6
        </Txt>
        <Txt x={0} y={272} size={38} weight={700}>
          <span style={{ opacity: 0.55 }}>OF EARTH&apos;S GRAVITY</span>
        </Txt>
        <Art>
          <g opacity={s3a.opacity} transform={`translate(0 ${s3a.dy})`}>
            <Earth cx={225} cy={700} r={132} color={pal.earth} land={pal.land} />
            <Moon cx={675} cy={700} r={132} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
          </g>
          <g opacity={s3b.opacity}>
            <JumpArc x={165} y={574} w={120} h={62} color={pal.ink} />
            <JumpArc x={615} y={574} w={120} h={250} color={pal.ink} />
            <Figure x={225} y={574} h={86} color={pal.ink} weight={5} />
            <Figure x={675} y={574} h={86} color={pal.ink} weight={5} />
          </g>
          <g opacity={s3c.opacity}>
            <circle cx={675} cy={324} r={26} fill={pal.ink} />
            <path d="M 675,290 L 675,270 M 675,358 L 675,378 M 641,324 L 621,324 M 709,324 L 729,324" stroke={pal.ink} strokeWidth={5} strokeLinecap="round" />
          </g>
        </Art>
        <Txt x={60} y={860} w={330} size={32} weight={800}>
          EARTH
        </Txt>
        <Txt x={510} y={860} w={330} size={32} weight={800}>
          MOON
        </Txt>
      </Scene>

      {/* 4 - no atmosphere */}
      <Scene name="no-air" from={S.noAir[0]} to={S.noAir[1]}>
        <Art>
          <rect x={40} y={60} width={820} height={820} rx={44} fill={pal.dark} opacity={s4.opacity} />
          <g opacity={s4b.opacity}>
            <Chip x={80} y={120} w={220} h={64} text="NO WIND" bg={pal.darkSoft} fg={pal.bg} size={32} />
          </g>
          <g opacity={s4c.opacity}>
            <Chip x={330} y={120} w={220} h={64} text="NO RAIN" bg={pal.darkSoft} fg={pal.bg} size={32} />
          </g>
          <g opacity={s4d.opacity}>
            <Chip x={580} y={120} w={220} h={64} text="NO CLOUDS" bg={pal.darkSoft} fg={pal.bg} size={32} />
          </g>
          <g opacity={s4d.opacity}>
            <path d="M 120,800 Q 450,760 780,800 L 780,880 L 120,880 Z" fill={pal.moonEdge} />
            <Figure x={450} y={792} h={110} color={pal.bg} weight={6} />
          </g>
        </Art>
        <Txt x={0} y={900} size={42} weight={800}>
          almost no atmosphere
        </Txt>
      </Scene>

      {/* 5 - the sky is black */}
      <Scene name="black-sky" from={S.blackSky[0]} to={S.blackSky[1]}>
        <Art>
          <rect x={40} y={60} width={820} height={820} rx={44} fill={pal.dark} opacity={s5.opacity} />
          <Stars color={pal.bg} opacity={s5.opacity * 0.9} />
          <g opacity={s5.opacity}>
            <circle cx={700} cy={210} r={54} fill={pal.lit} />
            <path
              d="M 700,140 L 700,120 M 700,280 L 700,300 M 630,210 L 610,210 M 770,210 L 790,210 M 652,162 L 638,148 M 748,258 L 762,272 M 748,162 L 762,148 M 652,258 L 638,272"
              stroke={pal.lit}
              strokeWidth={7}
              strokeLinecap="round"
            />
          </g>
          <g opacity={s5b.opacity}>
            <path d="M 120,800 Q 450,760 780,800 L 780,880 L 120,880 Z" fill={pal.moonEdge} />
            <Figure x={450} y={792} h={110} color={pal.bg} weight={6} />
          </g>
        </Art>
        <Txt x={0} y={900} size={42} weight={800}>
          the sky there is <span style={{ color: pal.earth }}>black</span> — even at noon
        </Txt>
      </Scene>

      {/* 6 - twenty seven days */}
      <Scene name="twenty-seven" from={S.twentySeven[0]} to={S.twentySeven[1]}>
        <Art>
          <g opacity={s6.opacity} transform={`translate(0 ${s6.dy})`}>
            <Moon cx={450} cy={430} r={180} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
          </g>
          <g opacity={s6b.opacity}>
            <path
              d="M 262,430 A 188,188 0 0 1 560,268"
              fill="none"
              stroke={pal.ink}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <path d="M 560,268 L 548,246 M 560,268 L 582,278" stroke={pal.ink} strokeWidth={4} strokeLinecap="round" />
          </g>
        </Art>
        <Txt x={0} y={680} size={150} weight={800} color={pal.earth}>
          27 days
        </Txt>
        <Txt x={0} y={860} size={40} weight={700}>
          <span style={{ opacity: 0.55 }}>for one full spin</span>
        </Txt>
      </Scene>

      {/* 7 - two weeks of light, two of dark */}
      <Scene name="two-weeks" from={S.twoWeeks[0]} to={S.twoWeeks[1]}>
        <Art>
          <g opacity={s7.opacity} transform={`translate(0 ${s7.dy})`}>
            <rect x={60} y={300} width={390} height={160} rx={24} fill={pal.lit} />
            <rect x={450} y={300} width={390} height={160} rx={24} fill={pal.dark} />
            <circle cx={255} cy={232} r={44} fill={pal.lit} />
            <path d="M 645,214 A 44,44 0 0 0 645,306 A 56,56 0 0 1 645,214 Z" fill={pal.moonEdge} />
          </g>
          <g opacity={s7b.opacity}>
            <Chip x={120} y={520} w={270} h={70} text="14 DAYS SUN" bg={pal.lit} fg={pal.bg} size={34} />
            <Chip x={510} y={520} w={270} h={70} text="14 DAYS DARK" bg={pal.dark} fg={pal.bg} size={34} />
          </g>
        </Art>
        <Txt x={0} y={680} size={54} weight={800}>
          one sunrise, one whole month
        </Txt>
      </Scene>

      {/* 8 - temperatures */}
      <Scene name="temperatures" from={S.temperatures[0]} to={S.temperatures[1]}>
        <Art>
          <g opacity={s8.opacity}>
            <circle cx={190} cy={230} r={60} fill={pal.lit} />
            <path d="M 190,150 L 190,126 M 190,310 L 190,334 M 110,230 L 86,230 M 270,230 L 294,230" stroke={pal.lit} strokeWidth={8} strokeLinecap="round" />
          </g>
          <rect x={470} y={120} width={390} height={520} rx={28} fill={pal.ink} opacity={s8c.opacity * 0.1} />
          <g opacity={s8b.opacity}>
            <Chip x={110} y={430} w={280} h={84} text="127°C" bg={pal.lit} fg={pal.bg} size={44} />
          </g>
          <g opacity={s8d.opacity}>
            <Chip x={520} y={430} w={300} h={84} text="−173°C" bg={pal.dark} fg={pal.bg} size={44} />
          </g>
          <g opacity={s8c.opacity}>
            <path d="M 60,700 L 470,700 L 500,660 L 530,700 L 840,700 L 840,760 L 60,760 Z" fill={pal.moonEdge} />
            <path d="M 530,700 L 530,760" stroke={pal.dark} strokeWidth={3} strokeDasharray="8 8" opacity={0.35} />
          </g>
        </Art>
        <Txt x={0} y={830} size={40} weight={700}>
          <span style={{ opacity: 0.55 }}>in full sun · in one rock&apos;s shadow</span>
        </Txt>
      </Scene>

      {/* 9 - one rock, two worlds */}
      <Scene name="one-rock" from={S.oneRock[0]} to={S.oneRock[1]}>
        <Art>
          <g opacity={s9.opacity} transform={`translate(0 ${s9.dy})`}>
            <path d="M 260,640 L 330,420 L 450,360 L 580,430 L 640,640 Z" fill={pal.moonEdge} stroke={pal.ink} strokeWidth={3} />
            <path d="M 450,360 L 450,640" stroke={pal.ink} strokeWidth={3} opacity={0.3} />
            <circle cx={330} cy={500} r={26} fill={pal.bg} opacity={0.5} />
          </g>
          <g opacity={s9b.opacity}>
            <path d="M 450,360 L 580,430 L 640,640 L 450,640 Z" fill={pal.dark} opacity={0.34} />
          </g>
        </Art>
        <Txt x={0} y={120} size={86} weight={800}>
          one rock
        </Txt>
        <Txt x={0} y={740} size={86} weight={800} color={pal.earth}>
          two worlds
        </Txt>
      </Scene>

      {/* 10 - the distance */}
      <Scene name="distance" from={S.distance[0]} to={S.distance[1]}>
        <Art>
          <g opacity={s10.opacity} transform={`translate(0 ${s10.dy})`}>
            <Earth cx={140} cy={440} r={96} color={pal.earth} land={pal.land} />
            <Moon cx={760} cy={440} r={58} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
            <path d="M 250,440 L 692,440" stroke={pal.ink} strokeWidth={2} strokeDasharray="9 11" opacity={0.45} />
          </g>
          <g opacity={s10b.opacity}>
            <Chip x={290} y={560} w={320} h={80} text="384,000 km" bg={pal.bg} fg={pal.ink} size={42} />
          </g>
        </Art>
        <Txt x={40} y={590} w={200} size={30} weight={800} align="center">
          EARTH
        </Txt>
        <Txt x={660} y={520} w={200} size={30} weight={800} align="center">
          MOON
        </Txt>
        <Txt x={0} y={780} size={44} weight={800}>
          the Earth is right there
        </Txt>
      </Scene>

      {/* 11 - light takes 1.3 seconds */}
      <Scene name="one-point-three" from={S.onePointThree[0]} to={S.onePointThree[1]}>
        <Art>
          <g opacity={s11.opacity}>
            <Earth cx={120} cy={400} r={80} color={pal.earth} land={pal.land} />
            <Moon cx={790} cy={400} r={50} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
            <path d="M 210,400 L 730,400" stroke={pal.ink} strokeWidth={2} strokeDasharray="9 11" opacity={0.4} />
            <circle cx={210 + (((frame - S.onePointThree[0]) % 110) / 110) * 520} cy={400} r={16} fill={pal.lit} opacity={s11b.opacity} />
          </g>
          <g opacity={s11b.opacity}>
            <Chip x={330} y={500} w={240} h={76} text="1.3 s" bg={pal.lit} fg={pal.bg} size={40} />
          </g>
        </Art>
        <Txt x={0} y={700} size={46} weight={800}>
          light crosses it in a second and a third
        </Txt>
      </Scene>

      {/* 12 - a ship takes days */}
      <Scene name="reach-her" from={S.reachHer[0]} to={S.reachHer[1]}>
        <Art>
          <g opacity={s12.opacity}>
            <Rocket x={180} y={480} s={1.3} color={pal.bg} edge={pal.ink} />
            <Chip x={60} y={610} w={240} h={66} text="3 DAYS" bg={pal.dark} fg={pal.bg} size={32} />
          </g>
          <g opacity={s12b.opacity}>
            <rect x={500} y={250} width={330} height={330} rx={30} fill={pal.bg} stroke={pal.ink} strokeWidth={3} />
            <Figure x={665} y={520} h={180} color={pal.ink} weight={8} pose="wave" />
          </g>
          <g opacity={s12c.opacity}>
            <Chip x={520} y={640} w={290} h={70} text="CANNOT REACH HER" bg={pal.earth} fg={pal.bg} size={28} />
          </g>
        </Art>
        <Txt x={0} y={810} size={40} weight={700}>
          <span style={{ opacity: 0.55 }}>she can wave. you cannot reach.</span>
        </Txt>
      </Scene>

      {/* 13 - half asleep, half in the dark */}
      <Scene name="half-asleep" from={S.halfAsleep[0]} to={S.halfAsleep[1]}>
        <Art>
          <g opacity={s13.opacity}>
            <Moon cx={450} cy={620} r={230} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
          </g>
          <g opacity={s13b.opacity}>
            <House x={300} y={420} w={58} fill={pal.bg} edge={pal.ink} lit />
            <House x={370} y={400} w={50} fill={pal.bg} edge={pal.ink} lit />
            <House x={560} y={408} w={54} fill={pal.bg} edge={pal.ink} />
            <House x={630} y={430} w={46} fill={pal.bg} edge={pal.ink} />
            <path d="M 300,398 L 370,378" stroke={pal.ink} strokeWidth={3} opacity={0.25} />
            <path d="M 560,386 L 630,408" stroke={pal.ink} strokeWidth={3} opacity={0.25} />
          </g>
          <g opacity={s13c.opacity}>
            <path d="M 450,390 A 230,230 0 0 1 450,850 L 450,390 Z" fill={pal.dark} opacity={0.3} />
          </g>
        </Art>
        <Txt x={40} y={880} w={380} size={34} weight={800} align="left">
          ASLEEP
        </Txt>
        <Txt x={480} y={880} w={380} size={34} weight={800} align="right">
          IN THE DARK
        </Txt>
      </Scene>

      {/* 14 - everything comes from home */}
      <Scene name="from-home" from={S.fromHome[0]} to={S.fromHome[1]}>
        <Art>
          <g opacity={s14.opacity}>
            <Earth cx={110} cy={520} r={84} color={pal.earth} land={pal.land} />
            <Moon cx={790} cy={520} r={68} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
            <Arrow x1={210} y1={420} x2={700} y2={420} color={pal.ink} width={3} />
            <Arrow x1={210} y1={520} x2={700} y2={520} color={pal.ink} width={3} />
            <Arrow x1={210} y1={620} x2={700} y2={620} color={pal.ink} width={3} />
          </g>
          <g opacity={s14b.opacity}>
            <Chip x={370} y={300} w={160} h={62} text="AIR" bg={pal.bg} fg={pal.ink} size={32} />
          </g>
          <g opacity={s14c.opacity}>
            <Chip x={370} y={440} w={160} h={62} text="FOOD" bg={pal.bg} fg={pal.ink} size={32} />
          </g>
          <g opacity={s14d.opacity}>
            <Chip x={370} y={580} w={160} h={62} text="PARTS" bg={pal.bg} fg={pal.ink} size={32} />
          </g>
        </Art>
        <Txt x={0} y={760} size={46} weight={800}>
          everything would come from home
        </Txt>
      </Scene>

      {/* 15 - a factory, on their schedule */}
      <Scene name="a-factory" from={S.aFactory[0]} to={S.aFactory[1]}>
        <Art>
          <g opacity={s15.opacity}>
            <Earth cx={270} cy={540} r={150} color={pal.earth} land={pal.land} />
            <Factory x={270} y={392} w={150} fill={pal.bg} edge={pal.ink} />
            <Arrow x1={440} y1={500} x2={610} y2={500} color={pal.ink} width={3} />
            <Moon cx={730} cy={540} r={110} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
            <circle cx={730} cy={540} r={52} fill={pal.bg} stroke={pal.ink} strokeWidth={3} />
            <path d="M 730,540 L 730,505 M 730,540 L 757,552" stroke={pal.ink} strokeWidth={4} strokeLinecap="round" />
          </g>
          <g opacity={s15b.opacity}>
            <Chip x={520} y={700} w={280} h={66} text="A FACTORY" bg={pal.earth} fg={pal.bg} size={32} />
          </g>
        </Art>
        <Txt x={0} y={830} size={40} weight={700}>
          <span style={{ opacity: 0.55 }}>on someone else&apos;s schedule</span>
        </Txt>
      </Scene>

      {/* 16 - a child born there */}
      <Scene name="born-there" from={S.bornThere[0]} to={S.bornThere[1]}>
        <Art>
          <g opacity={s16.opacity}>
            <Earth cx={150} cy={760} r={96} color={pal.earth} land={pal.land} />
            <Figure x={110} y={676} h={70} color={pal.ink} weight={4} />
            <Figure x={165} y={682} h={62} color={pal.ink} weight={4} />
            <Moon cx={640} cy={740} r={190} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
          </g>
          <g opacity={s16b.opacity}>
            <Figure x={610} y={556} h={76} color={pal.ink} weight={4} />
          </g>
          <g opacity={s16c.opacity}>
            <Chip x={300} y={200} w={300} h={84} text="1/6 g" bg={pal.earth} fg={pal.bg} size={44} />
          </g>
        </Art>
        <Txt x={0} y={880} size={44} weight={800}>
          born on the Moon
        </Txt>
      </Scene>

      {/* 17 - lighter bones, different lungs */}
      <Scene name="lighter" from={S.lighter[0]} to={S.lighter[1]}>
        <Art>
          <g opacity={s17.opacity}>
            <Chip x={60} y={140} w={330} h={72} text="LIGHTER BONES" bg={pal.bg} fg={pal.ink} size={32} />
          </g>
          <g opacity={s17b.opacity}>
            <Chip x={440} y={140} w={380} h={72} text="DIFFERENT LUNGS" bg={pal.bg} fg={pal.ink} size={32} />
          </g>
          <g opacity={s17c.opacity}>
            <path
              d="M 40,700 Q 160,620 280,700 Q 400,780 520,700 Q 640,620 760,700 L 860,700 L 860,880 L 40,880 Z"
              fill={pal.earth}
              opacity={0.85}
            />
            <Figure x={450} y={690} h={120} color={pal.bg} weight={6} />
          </g>
        </Art>
        <Txt x={0} y={300} size={50} weight={800}>
          Earth would feel like an ocean
        </Txt>
      </Scene>

      {/* 18 - two species */}
      <Scene name="two-species" from={S.twoSpecies[0]} to={S.twoSpecies[1]}>
        <Art>
          <path d="M 450,120 L 450,860" stroke={pal.ink} strokeWidth={2} strokeDasharray="10 12" opacity={0.3} />
          <g opacity={s18.opacity}>
            <path d="M 60,620 A 200,200 0 0 1 440,620" fill="none" stroke={pal.earth} strokeWidth={8} />
            <path d="M 470,620 A 200,200 0 0 1 850,620" fill="none" stroke={pal.moonEdge} strokeWidth={8} />
            <Figure x={250} y={484} h={150} color={pal.ink} weight={8} />
            <Figure x={660} y={484} h={104} color={pal.ink} weight={5} pose="wave" />
          </g>
          <g opacity={s18b.opacity}>
            <Chip x={100} y={700} w={300} h={70} text="ONE SPECIES" bg={pal.earth} fg={pal.bg} size={30} />
          </g>
          <g opacity={s18c.opacity}>
            <Chip x={520} y={700} w={280} h={70} text="TWO SPECIES" bg={pal.dark} fg={pal.bg} size={30} />
          </g>
        </Art>
        <Txt x={0} y={840} size={56} weight={800}>
          we would be two
        </Txt>
      </Scene>

      {/* 19 - the giant impact */}
      <Scene name="the-impact" from={S.theImpact[0]} to={S.theImpact[1]}>
        <Art>
          <g opacity={s19.opacity}>
            <Earth cx={300} cy={520} r={170} color={pal.earth} land={pal.land} />
          </g>
          <g opacity={s19b.opacity}>
            <Moon cx={740} cy={430} r={104} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
          </g>
          <g opacity={s19c.opacity}>
            <path d="M 468,512 L 610,406" stroke={pal.ink} strokeWidth={3} strokeDasharray="9 10" opacity={0.4} />
            <path d="M 300,700 Q 450,760 600,700" stroke={pal.ink} strokeWidth={3} opacity={0.3} fill="none" />
          </g>
        </Art>
        <Txt x={0} y={140} size={54} weight={800}>
          a Mars sized body hit the Earth
        </Txt>
        <Txt x={0} y={840} size={40} weight={700}>
          <span style={{ opacity: 0.55 }}>billions of years ago</span>
        </Txt>
      </Scene>

      {/* 20 - no air, no magnetic field */}
      <Scene name="no-field" from={S.noField[0]} to={S.noField[1]}>
        <Art>
          <g opacity={s20.opacity}>
            <Moon cx={450} cy={560} r={210} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
          </g>
          <g opacity={s20b.opacity}>
            <path d="M 280,420 A 190,190 0 0 1 620,420" fill="none" stroke={pal.ink} strokeWidth={3} strokeDasharray="14 16" opacity={0.35} />
            <path d="M 260,490 A 210,210 0 0 1 640,490" fill="none" stroke={pal.ink} strokeWidth={3} strokeDasharray="14 16" opacity={0.22} />
            <Chip x={120} y={160} w={280} h={68} text="NO AIR" bg={pal.bg} fg={pal.ink} size={32} />
            <Chip x={500} y={160} w={300} h={68} text="NO FIELD" bg={pal.bg} fg={pal.ink} size={32} />
          </g>
        </Art>
      </Scene>

      {/* 21 - the Earth's field is thousands of times stronger */}
      <Scene name="field-stronger" from={S.fieldStronger[0]} to={S.fieldStronger[1]}>
        <Art>
          <g opacity={s21.opacity}>
            <Earth cx={250} cy={540} r={140} color={pal.earth} land={pal.land} />
            <path d="M 90,420 A 190,190 0 0 1 410,420" fill="none" stroke={pal.earth} strokeWidth={5} opacity={0.75} />
            <path d="M 70,480 A 220,220 0 0 1 430,480" fill="none" stroke={pal.earth} strokeWidth={5} opacity={0.45} />
          </g>
          <g opacity={s21b.opacity}>
            <Moon cx={690} cy={540} r={120} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
            <path d="M 580,450 A 130,130 0 0 1 800,450" fill="none" stroke={pal.ink} strokeWidth={3} strokeDasharray="12 14" opacity={0.3} />
            <Chip x={560} y={760} w={260} h={66} text="NO SHIELD" bg={pal.dark} fg={pal.bg} size={30} />
          </g>
          <g opacity={s21c.opacity}>
            <Chip x={80} y={760} w={320} h={66} text="THOUSANDS STRONGER" bg={pal.earth} fg={pal.bg} size={26} />
          </g>
        </Art>
      </Scene>

      {/* 22 - no one has ever lived there */}
      <Scene name="nobody" from={S.nobody[0]} to={S.nobody[1]}>
        <Art>
          <g opacity={s22.opacity} transform={`translate(0 ${s22.dy})`}>
            <Moon cx={450} cy={520} r={200} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
          </g>
          <Txt x={0} y={380} size={280} weight={800} color={pal.ink}>
            0
          </Txt>
        </Art>
        <Txt x={0} y={780} size={48} weight={800}>
          no one has ever lived there
        </Txt>
      </Scene>

      {/* 23 - the timeline */}
      <Scene name="timeline" from={S.timeline[0]} to={S.timeline[1]}>
        <Art>
          <g opacity={s23.opacity}>
            <path d="M 70,420 L 830,420" stroke={pal.ink} strokeWidth={3} opacity={0.35} />
            {[
              [90, "1968"],
              [230, "1972"],
              [600, "2026"],
              [700, "2027"],
              [810, "2028"],
            ].map(([x, label]) => (
              <g key={label as string}>
                <circle cx={x as number} cy={420} r={13} fill={pal.ink} />
                <text
                  x={x as number}
                  y={470}
                  textAnchor="middle"
                  fill={pal.ink}
                  fontFamily={FONTS[b.font]}
                  fontSize={30}
                  fontWeight={800}
                >
                  {label as string}
                </text>
              </g>
            ))}
          </g>
          <g opacity={s23b.opacity}>
            <circle cx={600} cy={420} r={22} fill={pal.earth} />
            <Chip x={470} y={230} w={260} h={72} text="ARTEMIS II" bg={pal.earth} fg={pal.bg} size={30} />
          </g>
          <g opacity={s23c.opacity}>
            <Txt x={60} y={560} w={360} size={190} weight={800}>
              12
            </Txt>
            <Txt x={420} y={640} w={400} size={36} weight={700} align="left">
              <span style={{ opacity: 0.6 }}>have walked on it</span>
            </Txt>
          </g>
        </Art>
      </Scene>

      {/* 24 - the Earth becomes your sun */}
      <Scene name="your-sun" from={S.yourSun[0]} to={S.yourSun[1]}>
        <Art>
          <rect x={40} y={40} width={820} height={800} rx={44} fill={pal.dark} opacity={s24.opacity} />
          <Stars color={pal.bg} opacity={s24.opacity * 0.9} />
          <g opacity={s24b.opacity}>
            <circle cx={620} cy={300} r={150} fill={pal.earth} />
            <circle cx={620} cy={300} r={150} fill="none" stroke={pal.lit} strokeWidth={4} opacity={0.6} />
            <circle cx={620} cy={300} r={178} fill="none" stroke={pal.lit} strokeWidth={3} opacity={0.3} />
            <path d="M 500,420 L 300,690" stroke={pal.lit} strokeWidth={2} strokeDasharray="9 11" opacity={0.5} />
          </g>
          <g opacity={s24c.opacity}>
            <path d="M 60,740 Q 300,690 540,740 L 540,840 L 60,840 Z" fill={pal.moonEdge} />
            <Figure x={280} y={726} h={124} color={pal.bg} weight={7} pose="reach" />
          </g>
        </Art>
        <Txt x={0} y={880} size={44} weight={800}>
          the Earth becomes your <span style={{ color: pal.earth }}>sun</span>
        </Txt>
      </Scene>

      {/* 25 - humanity is a place you can stand on */}
      <Scene name="humanity" from={S.humanity[0]} to={S.humanity[1]}>
        <Txt x={0} y={0} size={132} weight={800}>
          humanity
        </Txt>
        <Txt x={0} y={170} size={46} weight={700}>
          <span style={{ opacity: 0.6 }}>is a place you can stand on</span>
        </Txt>
        <Art>
          <rect x={40} y={280} width={820} height={640} rx={44} fill={pal.dark} opacity={s25.opacity} />
          <Stars color={pal.bg} opacity={s25.opacity * 0.85} />
          <g opacity={s25b.opacity}>
            <circle cx={590} cy={470} r={112} fill={pal.earth} />
            <circle cx={590} cy={470} r={112} fill="none" stroke={pal.lit} strokeWidth={3} opacity={0.5} />
            <path d="M 490,556 L 330,790" stroke={pal.lit} strokeWidth={2} strokeDasharray="9 11" opacity={0.45} />
          </g>
          <g opacity={s25c.opacity}>
            <path d="M 70,800 Q 300,750 520,800 L 520,920 L 70,920 Z" fill={pal.moonEdge} />
          </g>
          <g opacity={s25d.opacity}>
            <Figure x={300} y={786} h={130} color={pal.bg} weight={7} pose="stand" flip />
          </g>
        </Art>
        <Txt x={0} y={950} size={38} weight={700} color={pal.ink}>
          <span style={{ opacity: 0.55 }}>not just a word</span>
        </Txt>
      </Scene>

      {/* captions */}
      <div style={{ position: "absolute", left: SAFE_BOX.x, width: SAFE_BOX.width, bottom: CAPTION_BOTTOM }}>
        <Karaoke words={words} perChunk={5} size={46} keywords={["Moon", "Earth", "gravity", "Artemis", "Twelve", "black", "sun"]} />
      </div>
    </ReelFrame>
  );
};
