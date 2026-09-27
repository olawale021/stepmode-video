import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { theme } from "../theme";

const PAINS = [
  "Tired of\nguessing your\nworkouts?",
  "No clue how\nmany calories\nyou ate?",
  "Losing\nmotivation\nby day 3?",
];

const SOLUTIONS = [
  {
    label: "SCAN EQUIPMENT",
    caption: "Scan any\nmachine.",
    sub: "Point your camera, get every exercise.",
    image: "features/scan-image.png",
  },
  {
    label: "WORKOUT PLANS",
    caption: "Plans built\nfor you.",
    sub: "Tailored to your goals, level, and gym.",
    image: "features/plan-details.png",
  },
  {
    label: "NUTRITION",
    caption: "Track meals\nin a snap.",
    sub: "Photo in. Calories, protein, carbs out.",
    image: "features/meal-scan.jpg",
  },
  {
    label: "RUNNING",
    caption: "Runs with a\nvoice coach.",
    sub: "GPS, pace, and real-time coaching.",
    image: "features/run.jpg",
  },
  {
    label: "AI COACH",
    caption: "Your coach,\n24/7.",
    sub: "Ask anything. Get a personal answer.",
    image: "features/ai-couch.png",
  },
];

const WORD_STAGGER = 5;

const PainSlide: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(frame, [32, 42], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lines = text.split("\n");
  let cumulativeWordIndex = 0;

  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme.font,
        opacity: out,
        padding: "0 60px",
      }}
    >
      <div
        style={{
          color: theme.white,
          fontSize: 130,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.0,
          textAlign: "center",
        }}
      >
        {lines.map((line, li) => {
          const words = line.split(" ");
          const renderedLine = (
            <div key={li}>
              {words.map((word, wi) => {
                const delay = (cumulativeWordIndex + wi) * WORD_STAGGER;
                const wIn = spring({
                  frame: frame - delay,
                  fps,
                  config: { damping: 10, mass: 0.4 },
                });
                return (
                  <span
                    key={wi}
                    style={{
                      display: "inline-block",
                      marginRight: wi < words.length - 1 ? "0.28em" : 0,
                      opacity: wIn,
                      transform: `translateY(${(1 - wIn) * 24}px) scale(${0.8 + 0.2 * wIn})`,
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          );
          cumulativeWordIndex += words.length;
          return renderedLine;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Bridge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inAnim = spring({ frame, fps, config: { damping: 12 } });
  const sub = spring({ frame: frame - 16, fps, config: { damping: 16 } });
  const pulse = 1 + Math.sin(frame / 5) * 0.02;
  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme.font,
      }}
    >
      <div
        style={{
          color: theme.neon,
          fontSize: 180,
          fontWeight: 800,
          letterSpacing: -4,
          opacity: inAnim,
          transform: `scale(${0.8 + 0.2 * inAnim}) scale(${pulse})`,
        }}
      >
        Stepmode.
      </div>
      <div
        style={{
          color: theme.muted,
          fontSize: 36,
          marginTop: 30,
          opacity: sub,
        }}
      >
        Fixes all of it.
      </div>
    </AbsoluteFill>
  );
};

const SolutionSlide: React.FC<{
  s: (typeof SOLUTIONS)[number];
  index: number;
}> = ({ s, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneIn = spring({ frame, fps, config: { damping: 16, mass: 0.6 } });
  const labelIn = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  const captionIn = spring({ frame: frame - 8, fps, config: { damping: 14 } });
  const subIn = spring({ frame: frame - 18, fps, config: { damping: 16 } });
  const out = interpolate(frame, [60, 72], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phoneSide = index % 2 === 0 ? 1 : -1;
  const tilt = phoneSide * 6 * phoneIn;
  const enterX = phoneSide * 900 * (1 - phoneIn);
  const restX = phoneSide * 120;

  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        fontFamily: theme.font,
        opacity: out,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 60,
          right: 60,
          textAlign: "center",
          zIndex: 5,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: theme.neon,
            color: theme.bg,
            padding: "10px 22px",
            borderRadius: 10,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 2.5,
            marginBottom: 26,
            opacity: labelIn,
            transform: `translateY(${(1 - labelIn) * -20}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {s.label}
        </div>
        <div
          style={{
            color: theme.white,
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -2.5,
            lineHeight: 0.98,
            whiteSpace: "pre-line",
            opacity: captionIn,
            transform: `translateY(${(1 - captionIn) * 24}px)`,
          }}
        >
          {s.caption}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 680,
          left: "50%",
          transform: `translateX(calc(-50% + ${restX + enterX}px)) rotate(${tilt}deg) scale(${0.94 + 0.06 * phoneIn})`,
        }}
      >
        <PhoneFrame width={460} height={900}>
          <Img
            src={staticFile(s.image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </PhoneFrame>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 80,
          right: 80,
          textAlign: "center",
          zIndex: 5,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.3,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 16}px)`,
          }}
        >
          {s.sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FinalCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 14 } });
  const c = spring({ frame: frame - 18, fps, config: { damping: 16 } });
  const pulse = 1 + Math.sin(frame / 5) * 0.02;
  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme.font,
      }}
    >
      <div
        style={{
          color: theme.white,
          fontSize: 110,
          fontWeight: 800,
          letterSpacing: -3,
          textAlign: "center",
          lineHeight: 1.05,
          opacity: t,
        }}
      >
        Get <span style={{ color: theme.neon }}>Stepmode.</span>
      </div>
      <div
        style={{
          marginTop: 60,
          background: theme.neon,
          color: theme.bg,
          fontSize: 44,
          fontWeight: 800,
          padding: "26px 64px",
          borderRadius: 100,
          opacity: c,
          transform: `scale(${pulse})`,
          boxShadow: "0 0 80px rgba(0,255,136,0.5)",
        }}
      >
        Start Free Trial
      </div>
      <div
        style={{
          marginTop: 24,
          color: theme.muted,
          fontSize: 24,
          opacity: c,
        }}
      >
        3-day free trial &middot; cancel anytime
      </div>
    </AbsoluteFill>
  );
};

export const ProblemSolution: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {PAINS.map((p, i) => (
        <Sequence key={i} from={i * 36} durationInFrames={36}>
          <PainSlide text={p} />
        </Sequence>
      ))}
      <Sequence from={108} durationInFrames={48}>
        <Bridge />
      </Sequence>
      {SOLUTIONS.map((s, i) => (
        <Sequence key={i} from={156 + i * 72} durationInFrames={72}>
          <SolutionSlide s={s} index={i} />
        </Sequence>
      ))}
      <Sequence from={516} durationInFrames={84}>
        <FinalCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
