// Reel "moon-living": What if humans started living on the Moon and Earth at the same time?
//
// Style: minimalist 2D. Flat shapes, thin outlines, clean background. Stick figures and
// geometric forms only - no realistic imagery, no gradients, no photos.
// Script formula: Setup -> Consequence -> Conclusion.
//
//   words -> when each word is spoken (public/reels/moon-living/captions.words.json)
//   t.at(n) -> the frame word number n starts on, so shapes pop exactly with the narration.
//   Word numbers are used instead of word text because the same word ("the", "one", "two")
//   appears many times, and matching on text alone would land on the wrong occurrence.
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
  popIn,
  useIn,
} from "./shapes";
import words from "../../../public/reels/moon-living/captions.words.json";

export const t = timing(words);
export const AUDIO = "reels/moon-living/vo.wav";
export const durationInFrames = t.duration(1.0);

/* ------------------------------------------------------------- scene map */
// Cut points are the sentence starts, taken from the real word timings.
const S = {
  hook: [0, t.at(20)],
  twoWorlds: [t.at(20), t.at(42)],
  oneSixth: [t.at(42), t.at(61)],
  noAir: [t.at(61), t.at(75)],
  blackSky: [t.at(75), t.at(83)],
  twentySeven: [t.at(83), t.at(91)],
  twoWeeks: [t.at(91), t.at(103)],
  temperatures: [t.at(103), t.at(125)],
  oneRock: [t.at(125), t.at(129)],
  distance: [t.at(129), t.at(142)],
  onePointThree: [t.at(142), t.at(156)],
  reachHer: [t.at(156), t.at(175)],
  halfAsleep: [t.at(175), t.at(195)],
  fromHome: [t.at(195), t.at(207)],
  aFactory: [t.at(207), t.at(221)],
  bornThere: [t.at(221), t.at(238)],
  lighter: [t.at(238), t.at(248)],
  twoSpecies: [t.at(248), t.at(261)],
  theImpact: [t.at(261), t.at(283)],
  noField: [t.at(283), t.at(293)],
  fieldStronger: [t.at(293), t.at(306)],
  nobody: [t.at(306), t.at(314)],
  timeline: [t.at(314), t.at(333)],
  yourSun: [t.at(333), t.at(359)],
  humanity: [t.at(359), t.at(375)],
  standOn: [t.at(375), t.duration(1.0)],
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
  // scene 3: the figure hops in one-sixth gravity. The path is the same parabola as the
  // dashed arc above it (y = base - 4*h*u*(1-u)), so the figure lands exactly on the arc.
  const hopU = ((frame - S.oneSixth[0]) % 46) / 46;
  const hopX = 615 + 120 * hopU;
  const hopY = 574 - 500 * hopU * (1 - hopU);
  // scene 26: the figure drifts in low gravity.
  const bobY = 786 - Math.abs(Math.sin((frame - S.standOn[0]) / 34)) * 7;
  // scene 19: the impactor actually travels into the Earth.
  const impactProg = Math.min(1, Math.max(0, (frame - S.theImpact[0]) / (S.theImpact[1] - S.theImpact[0])));
  const impactX = 740 - 160 * impactProg;
  // scene 16: the child hops, because down there is one sixth gravity.
  const bornU = ((frame - S.bornThere[0]) % 42) / 42;
  const bornHopY = 524 - 54 * bornU * (1 - bornU);
  // scene 17: the ocean swells.
  const swell = Math.sin((frame - S.lighter[0]) / 48) * 16;
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

  // ---- 1 hook -------------------------------------------------------------
  const s1a = useIn(t.at(6));
  const s1b = useIn(t.at(9));
  const s1c = useIn(t.at(14));
  const s1d = useIn(t.at(17));
  // ---- 2 two worlds --------------------------------------------------------
  const s2a = useIn(t.at(20));
  const s2b = useIn(t.at(31));
  // ---- 3 one sixth ---------------------------------------------------------
  const s3a = useIn(t.at(42));
  const s3b = useIn(t.at(48));
  const s3c = useIn(t.at(54));
  // ---- 4 no air / 5 black sky ---------------------------------------------
  const s4a = useIn(t.at(61));
  const s4b = useIn(t.at(70));
  const s4c = useIn(t.at(72));
  const s4d = useIn(t.at(74));
  const s5a = useIn(t.at(75));
  const s5b = useIn(t.at(78));
  const s5c = useIn(t.at(80));
  // ---- 6 twenty seven / 7 two weeks ---------------------------------------
  const s6a = useIn(t.at(83));
  const s6b = useIn(t.at(85));
  const s6c = useIn(t.at(89));
  const s7a = useIn(t.at(91));
  const s7b = useIn(t.at(102));
  // ---- 8 temperatures / 9 one rock ---------------------------------------
  const s8a = useIn(t.at(103));
  const s8b = useIn(t.at(114));
  const s8c = useIn(t.at(115));
  const s8d = useIn(t.at(124));
  const s9a = useIn(t.at(125));
  const s9b = useIn(t.at(127));
  // ---- 10 distance / 11 light / 12 reach her -------------------------------
  const s10a = useIn(t.at(129));
  const s10b = useIn(t.at(140));
  const s11a = useIn(t.at(142));
  const s11b = useIn(t.at(148));
  const s11c = useIn(t.at(155));
  const s12a = useIn(t.at(156));
  const s12b = useIn(t.at(160));
  const s12c = useIn(t.at(172));
  // ---- 13 asleep / 14 from home / 15 factory ------------------------------
  const s13a = useIn(t.at(175));
  const s13b = useIn(t.at(185));
  const s13c = useIn(t.at(191));
  const s14a = useIn(t.at(195));
  const s14b = useIn(t.at(201));
  const s14c = useIn(t.at(203));
  const s14d = useIn(t.at(206));
  const s15a = useIn(t.at(207));
  const s15b = useIn(t.at(216));
  // ---- 16 born there / 17 lighter / 18 two species -------------------------
  const s16a = useIn(t.at(221));
  const s16b = useIn(t.at(227));
  const s16c = useIn(t.at(237));
  const s17a = useIn(t.at(238));
  const s17b = useIn(t.at(240));
  const s17c = useIn(t.at(247));
  const s18a = useIn(t.at(248));
  const s18b = useIn(t.at(256));
  const s18c = useIn(t.at(260));
  // ---- 19 impact / 20 no field / 21 field stronger -------------------------
  const s19a = useIn(t.at(261));
  const s19b = useIn(t.at(270));
  const s19c = useIn(t.at(276));
  const s20a = useIn(t.at(283));
  const s20b = useIn(t.at(287));
  const s20c = useIn(t.at(290));
  const s21a = useIn(t.at(293));
  const s21b = useIn(t.at(300));
  const s21c = useIn(t.at(301));
  // ---- 22 nobody / 23 timeline ---------------------------------------------
  const s22a = useIn(t.at(306));
  const s23a = useIn(t.at(314));
  const s23b = useIn(t.at(316));
  // ---- 24 your sun / 25 humanity / 26 stand on -----------------------------
  const s24a = useIn(t.at(333));
  const s24b = useIn(t.at(348));
  const s24c = useIn(t.at(350));
  const s25a = useIn(t.at(359));
  const s25b = useIn(t.at(366));
  const s25c = useIn(t.at(373));
  const s26a = useIn(t.at(375));
  const s26b = useIn(t.at(379));
  const s26c = useIn(t.at(386));

  return (
    <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
      {/* 1 - hook: two worlds */}
      <Scene name="hook" from={S.hook[0]} to={S.hook[1]}>
        <Txt x={0} y={20} size={104} weight={800}>
          What if we lived on <span style={{ color: pal.earth }}>both</span>?
        </Txt>
        <Art>
          <g opacity={s1a.opacity} transform={`translate(0 ${s1a.dy})`}>
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
            <House x={600} y={482} w={54} fill={pal.bg} edge={pal.ink} lit />
            <House x={690} y={494} w={44} fill={pal.bg} edge={pal.ink} />
            <House x={742} y={488} w={38} fill={pal.bg} edge={pal.ink} />
          </g>
          <g opacity={s2b.opacity} transform={`translate(0 ${s2b.dy})`}>
            <Figure x={200} y={486} h={98} color={pal.ink} weight={5} />
            <Figure x={278} y={492} h={70} color={pal.ink} weight={4} pose="wave" />
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
          </g>
          <g opacity={s3b.opacity}>
            <Figure x={hopX} y={hopY} h={86} color={pal.ink} weight={5} />
          </g>
          <g opacity={s3c.opacity}>
            <circle cx={675} cy={324} r={26} fill={pal.ink} />
            <path
              d="M 675,290 L 675,270 M 675,358 L 675,378 M 641,324 L 621,324 M 709,324 L 729,324"
              stroke={pal.ink}
              strokeWidth={5}
              strokeLinecap="round"
            />
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
          <rect x={40} y={60} width={820} height={820} rx={44} fill={pal.dark} opacity={s4a.opacity} />
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
            <Figure x={450} y={790} h={110} color={pal.bg} weight={6} />
          </g>
        </Art>
        <Txt x={0} y={910} size={42} weight={800}>
          almost no atmosphere
        </Txt>
      </Scene>

      {/* 5 - the sky is black */}
      <Scene name="black-sky" from={S.blackSky[0]} to={S.blackSky[1]}>
        <Art>
          <rect x={40} y={60} width={820} height={820} rx={44} fill={pal.dark} opacity={s5a.opacity} />
          <Stars color={pal.bg} opacity={s5a.opacity * 0.9} />
          <g opacity={s5b.opacity}>
            <circle cx={700} cy={210} r={54} fill={pal.lit} />
            <path
              d="M 700,140 L 700,120 M 700,280 L 700,300 M 630,210 L 610,210 M 770,210 L 790,210 M 652,162 L 638,148 M 748,258 L 762,272 M 748,162 L 762,148 M 652,258 L 638,272"
              stroke={pal.lit}
              strokeWidth={7}
              strokeLinecap="round"
            />
          </g>
          <g opacity={s5c.opacity}>
            <path d="M 120,800 Q 450,760 780,800 L 780,880 L 120,880 Z" fill={pal.moonEdge} />
            <Figure x={450} y={790} h={110} color={pal.bg} weight={6} />
          </g>
        </Art>
        <Txt x={0} y={910} size={42} weight={800}>
          the sky there is <span style={{ color: pal.earth }}>black</span> — even at noon
        </Txt>
      </Scene>

      {/* 6 - twenty seven days */}
      <Scene name="twenty-seven" from={S.twentySeven[0]} to={S.twentySeven[1]}>
        <Art>
          <g opacity={s6a.opacity} transform={`translate(0 ${s6a.dy})`}>
            <Moon
              cx={450}
              cy={430}
              r={180}
              fill={pal.moon}
              crater={pal.crater}
              edge={pal.moonEdge}
              spin={((frame - S.twentySeven[0]) * 0.32) % 360}
            />
          </g>
          <g opacity={s6b.opacity}>
            <path d="M 262,430 A 188,188 0 0 1 560,268" fill="none" stroke={pal.ink} strokeWidth={4} strokeLinecap="round" />
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
          <g opacity={s7a.opacity} transform={`translate(0 ${s7a.dy})`}>
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
          <g opacity={s8a.opacity}>
            <circle cx={190} cy={250} r={60} fill={pal.lit} />
            <path d="M 190,170 L 190,146 M 190,330 L 190,354 M 110,250 L 86,250 M 270,250 L 294,250" stroke={pal.lit} strokeWidth={8} strokeLinecap="round" />
            <path d="M 60,700 L 840,700 L 840,790 L 60,790 Z" fill={pal.moonEdge} />
          </g>
          <g opacity={s8b.opacity}>
            <Chip x={110} y={540} w={280} h={84} text="127°C" bg={pal.lit} fg={pal.bg} size={44} />
          </g>
          <g opacity={s8c.opacity}>
            {/* the rock, and the shadow it throws away from the sun */}
            <path d="M 455,700 L 478,642 L 535,642 L 558,700 Z" fill={pal.bg} stroke={pal.ink} strokeWidth={3} />
            <path d="M 558,700 L 840,700 L 840,790 L 528,790 Z" fill={pal.ink} opacity={0.17} />
          </g>
          <g opacity={s8d.opacity}>
            <Chip x={560} y={540} w={300} h={84} text="−173°C" bg={pal.dark} fg={pal.bg} size={44} />
          </g>
        </Art>
        <Txt x={0} y={840} size={40} weight={700}>
          <span style={{ opacity: 0.55 }}>in full sun · in one rock&apos;s shadow</span>
        </Txt>
      </Scene>

      {/* 9 - one rock, two worlds */}
      <Scene name="one-rock" from={S.oneRock[0]} to={S.oneRock[1]}>
        <Art>
          <g opacity={s9a.opacity} transform={`translate(0 ${s9a.dy})`}>
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
          <g opacity={s10a.opacity} transform={`translate(0 ${s10a.dy})`}>
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
          <g opacity={s11a.opacity}>
            <Earth cx={120} cy={400} r={80} color={pal.earth} land={pal.land} />
            <Moon cx={790} cy={400} r={50} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
            <path d="M 210,400 L 730,400" stroke={pal.ink} strokeWidth={2} strokeDasharray="9 11" opacity={0.4} />
          </g>
          <g opacity={s11b.opacity}>
            <circle cx={210 + (((frame - S.onePointThree[0]) % 110) / 110) * 520} cy={400} r={16} fill={pal.lit} />
          </g>
          <g opacity={s11c.opacity}>
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
          <g opacity={s12a.opacity}>
            <path d="M 250,430 Q 380,300 500,390" fill="none" stroke={pal.ink} strokeWidth={3} strokeDasharray="9 11" opacity={0.35} />
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
          <g opacity={s13a.opacity}>
            <Moon
              cx={450}
              cy={620}
              r={230}
              fill={pal.moon}
              crater={pal.crater}
              edge={pal.moonEdge}
              spin={((frame - S.halfAsleep[0]) * 0.13) % 360}
            />
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
          <g opacity={s14a.opacity}>
            <Earth cx={110} cy={520} r={84} color={pal.earth} land={pal.land} />
            <Moon cx={790} cy={520} r={68} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
            <Arrow x1={210} y1={420} x2={700} y2={420} color={pal.ink} width={3} flow />
            <Arrow x1={210} y1={520} x2={700} y2={520} color={pal.ink} width={3} flow />
            <Arrow x1={210} y1={620} x2={700} y2={620} color={pal.ink} width={3} flow />
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
          <g opacity={s15a.opacity}>
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
          <g opacity={s16a.opacity}>
            <Earth cx={150} cy={740} r={96} color={pal.earth} land={pal.land} />
            <Figure x={110} y={655} h={70} color={pal.ink} weight={4} />
            <Figure x={165} y={648} h={62} color={pal.ink} weight={4} />
            <Moon cx={640} cy={700} r={180} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
          </g>
          <g opacity={s16b.opacity}>
            <Figure x={610} y={bornHopY} h={76} color={pal.ink} weight={4} />
          </g>
          <g opacity={s16c.opacity}>
            <Chip x={300} y={200} w={300} h={84} text="1/6 g" bg={pal.earth} fg={pal.bg} size={44} />
          </g>
        </Art>
        <Txt x={0} y={910} size={44} weight={800}>
          born on the Moon
        </Txt>
      </Scene>

      {/* 17 - lighter bones, different lungs */}
      <Scene name="lighter" from={S.lighter[0]} to={S.lighter[1]}>
        <Art>
          <g opacity={s17a.opacity}>
            <Chip x={60} y={140} w={330} h={72} text="LIGHTER BONES" bg={pal.bg} fg={pal.ink} size={32} />
          </g>
          <g opacity={s17b.opacity}>
            <Chip x={440} y={140} w={380} h={72} text="DIFFERENT LUNGS" bg={pal.bg} fg={pal.ink} size={32} />
          </g>
          <g opacity={s17c.opacity}>
            <g transform={`translate(${swell} 0)`}>
              <path
                d="M 40,700 Q 160,620 280,700 Q 400,780 520,700 Q 640,620 760,700 L 860,700 L 860,880 L 40,880 Z"
                fill={pal.earth}
                opacity={0.85}
              />
            </g>
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
          <g opacity={s18a.opacity}>
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
          <g opacity={s19a.opacity}>
            <Earth cx={300} cy={520} r={170} color={pal.earth} land={pal.land} />
          </g>
          <g opacity={s19b.opacity}>
            <Moon cx={impactX} cy={430} r={104} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
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
          <g opacity={s20a.opacity}>
            <Moon cx={450} cy={560} r={210} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
          </g>
          <g opacity={s20b.opacity}>
            <Chip x={120} y={160} w={280} h={68} text="NO AIR" bg={pal.bg} fg={pal.ink} size={32} />
          </g>
          <g opacity={s20c.opacity}>
            <path d="M 280,420 A 190,190 0 0 1 620,420" fill="none" stroke={pal.ink} strokeWidth={3} strokeDasharray="14 16" opacity={0.35} />
            <path d="M 260,490 A 210,210 0 0 1 640,490" fill="none" stroke={pal.ink} strokeWidth={3} strokeDasharray="14 16" opacity={0.22} />
            <Chip x={500} y={160} w={300} h={68} text="NO FIELD" bg={pal.bg} fg={pal.ink} size={32} />
          </g>
        </Art>
      </Scene>

      {/* 21 - the Earth's field is thousands of times stronger */}
      <Scene name="field-stronger" from={S.fieldStronger[0]} to={S.fieldStronger[1]}>
        <Art>
          <g opacity={s21a.opacity}>
            <Earth cx={250} cy={540} r={140} color={pal.earth} land={pal.land} />
            <path d="M 90,420 A 190,190 0 0 1 410,420" fill="none" stroke={pal.earth} strokeWidth={5} opacity={0.75} />
            <path d="M 70,480 A 220,220 0 0 1 430,480" fill="none" stroke={pal.earth} strokeWidth={5} opacity={0.45} />
          </g>
          <g opacity={s21b.opacity}>
            <Moon cx={690} cy={540} r={120} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
            <path d="M 580,450 A 130,130 0 0 1 800,450" fill="none" stroke={pal.ink} strokeWidth={3} strokeDasharray="12 14" opacity={0.3} />
            <Chip x={80} y={760} w={320} h={66} text="THOUSANDS STRONGER" bg={pal.earth} fg={pal.bg} size={26} />
          </g>
          <g opacity={s21c.opacity}>
            <Chip x={560} y={760} w={260} h={66} text="NO SHIELD" bg={pal.dark} fg={pal.bg} size={30} />
          </g>
        </Art>
      </Scene>

      {/* 22 - no one has ever lived there */}
      <Scene name="nobody" from={S.nobody[0]} to={S.nobody[1]}>
        <Art>
          <g opacity={s22a.opacity} transform={`translate(0 ${s22a.dy})`}>
            <Moon cx={450} cy={520} r={200} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
          </g>
        </Art>
        <Txt x={0} y={360} size={280} weight={800} color={pal.ink}>
          0
        </Txt>
        <Txt x={0} y={780} size={48} weight={800}>
          no one has ever lived there
        </Txt>
      </Scene>

      {/* 23 - the timeline */}
      <Scene name="timeline" from={S.timeline[0]} to={S.timeline[1]}>
        <Art>
          <g opacity={s23a.opacity}>
            <path d="M 70,360 L 830,360" stroke={pal.ink} strokeWidth={3} opacity={0.35} />
            {[
              [90, "1968"],
              [230, "1972"],
              [600, "2026"],
              [700, "2027"],
              [810, "2028"],
            ].map(([x, label]) => (
              <g key={label as string}>
                <circle cx={x as number} cy={360} r={13} fill={pal.ink} />
                <text
                  x={x as number}
                  y={410}
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
            <circle cx={600} cy={360} r={22} fill={pal.earth} />
            <Chip x={470} y={150} w={260} h={72} text="ARTEMIS II" bg={pal.earth} fg={pal.bg} size={30} />
          </g>
          {/* the twelve who have walked on it, one by one */}
          {Array.from({ length: 12 }).map((_, i) => {
            const p = popIn(frame, t.at(328) + i * 3);
            const x = 155 + (i % 6) * 120;
            const y = 560 + Math.floor(i / 6) * 150;
            return (
              <g key={i} opacity={p.opacity} transform={`translate(0 ${p.dy})`}>
                <Figure x={x} y={y} h={78} color={pal.ink} weight={4} />
              </g>
            );
          })}
        </Art>
        <Txt x={0} y={810} size={44} weight={800}>
          twelve have walked on it
        </Txt>
      </Scene>

      {/* 24 - the Earth becomes your sun */}
      <Scene name="your-sun" from={S.yourSun[0]} to={S.yourSun[1]}>
        <Art>
          <rect x={40} y={40} width={820} height={800} rx={44} fill={pal.dark} opacity={s24a.opacity} />
          <Stars color={pal.bg} opacity={s24a.opacity * 0.9} />
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

      {/* 25 - living on the Earth, together */}
      <Scene name="humanity" from={S.humanity[0]} to={S.humanity[1]}>
        <Art>
          <g opacity={s25a.opacity}>
            <Earth cx={210} cy={520} r={130} color={pal.earth} land={pal.land} />
            <Moon cx={690} cy={520} r={130} fill={pal.moon} crater={pal.crater} edge={pal.moonEdge} />
            <Figure x={210} y={392} h={92} color={pal.ink} weight={5} pose="wave" />
            <Figure x={690} y={392} h={92} color={pal.ink} weight={5} pose="wave" />
          </g>
          <g opacity={s25b.opacity}>
            <path d="M 352,520 L 548,520" stroke={pal.ink} strokeWidth={2} strokeDasharray="9 11" opacity={0.45} />
            <Chip x={320} y={452} w={260} h={70} text="TOGETHER" bg={pal.lit} fg={pal.bg} size={32} />
          </g>
          <g opacity={s25c.opacity}>
            <Chip x={300} y={700} w={300} h={70} text="384,000 km apart" bg={pal.bg} fg={pal.ink} size={30} />
          </g>
        </Art>
        <Txt x={0} y={840} size={46} weight={800}>
          living on the Earth, together
        </Txt>
      </Scene>

      {/* 26 - humanity is a place you can stand on */}
      <Scene name="stand-on" from={S.standOn[0]} to={S.standOn[1]}>
        <Txt x={0} y={0} size={132} weight={800}>
          humanity
        </Txt>
        <Txt x={0} y={170} size={46} weight={700}>
          <span style={{ opacity: 0.6 }}>is a place you can stand on</span>
        </Txt>
        <Art>
          <rect x={40} y={280} width={820} height={640} rx={44} fill={pal.dark} opacity={s26a.opacity} />
          <Stars color={pal.bg} opacity={s26a.opacity * 0.85} />
          <g opacity={s26b.opacity}>
            <circle cx={590} cy={470} r={112} fill={pal.earth} />
            <circle cx={590} cy={470} r={112} fill="none" stroke={pal.lit} strokeWidth={3} opacity={0.5} />
            <path d="M 490,556 L 330,790" stroke={pal.lit} strokeWidth={2} strokeDasharray="9 11" opacity={0.45} />
          </g>
          <g opacity={s26a.opacity}>
            <path d="M 70,800 Q 300,750 520,800 L 520,920 L 70,920 Z" fill={pal.moonEdge} />
          </g>
          <g opacity={s26c.opacity}>
            <Figure x={300} y={bobY} h={130} color={pal.bg} weight={7} />
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
