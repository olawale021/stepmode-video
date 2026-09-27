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

const TOTAL_DAYS = 30;
const COLS = 6;

const CalendarGrid: React.FC<{ filledDays: number; pulseDay?: number }> = ({
  filledDays,
  pulseDay,
}) => {
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const isFilled = i < filledDays;
    const isPulsing = pulseDay === i;
    cells.push(
      <div
        key={i}
        style={{
          width: 110,
          height: 110,
          borderRadius: 18,
          background: isFilled ? theme.neon : "rgba(255,255,255,0.05)",
          boxShadow: isFilled
            ? `0 0 ${isPulsing ? 40 : 12}px rgba(0,255,136,${isPulsing ? 0.9 : 0.3})`
            : "none",
          transform: isPulsing ? "scale(1.18)" : "scale(1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isFilled ? theme.bg : "rgba(255,255,255,0.2)",
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        {isFilled ? "✓" : i + 1}
      </div>
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gap: 14,
        width: COLS * 110 + (COLS - 1) * 14,
      }}
    >
      {cells}
    </div>
  );
};

const Day1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 14 } });
  const sub = spring({ frame: frame - 14, fps, config: { damping: 16 } });
  const grid = spring({ frame: frame - 28, fps, config: { damping: 16 } });
  const out = interpolate(frame, [80, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        fontFamily: theme.font,
        padding: "120px 60px 60px",
        opacity: out,
      }}
    >
      <div
        style={{
          color: "rgba(255,100,100,0.7)",
          fontSize: 30,
          letterSpacing: 6,
          fontWeight: 800,
          opacity: t,
        }}
      >
        DAY 1
      </div>
      <div
        style={{
          color: theme.white,
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.0,
          marginTop: 16,
          opacity: t,
        }}
      >
        Empty
        <br />
        calendar.
      </div>
      <div
        style={{
          color: theme.muted,
          fontSize: 32,
          marginTop: 20,
          opacity: sub,
        }}
      >
        Sound familiar?
      </div>

      <div
        style={{
          marginTop: 80,
          opacity: grid,
          transform: `translateY(${(1 - grid) * 30}px)`,
          alignSelf: "center",
        }}
      >
        <CalendarGrid filledDays={0} />
      </div>
    </AbsoluteFill>
  );
};

const Montage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const filledDays = Math.floor(
    interpolate(frame, [10, 240], [0, TOTAL_DAYS], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const dayNumber = Math.max(1, filledDays);

  const titleIn = spring({ frame, fps, config: { damping: 14 } });
  const out = interpolate(frame, [260, 270], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const images = [
    "features/scan-image.png",
    "features/plan-details.png",
    "features/meal-scan.jpg",
    "features/run.jpg",
    "features/ai-couch.png",
  ];
  const imageIndex = Math.min(images.length - 1, Math.floor(frame / 50));
  const phoneKey = Math.floor(frame / 50);
  const phoneIn = spring({
    frame: frame - phoneKey * 50,
    fps,
    config: { damping: 18, mass: 0.5 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 30%, rgba(0,255,136,0.1), ${theme.bg} 70%)`,
        fontFamily: theme.font,
        opacity: out,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleIn,
        }}
      >
        <div
          style={{
            color: theme.neon,
            fontSize: 30,
            letterSpacing: 6,
            fontWeight: 800,
          }}
        >
          + STEPMODE
        </div>
        <div
          style={{
            color: theme.white,
            fontSize: 180,
            fontWeight: 800,
            letterSpacing: -6,
            lineHeight: 1.0,
            marginTop: 8,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          DAY {dayNumber}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 540,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: phoneIn,
          transform: `scale(${0.85 + 0.15 * phoneIn})`,
        }}
      >
        <PhoneFrame width={460} height={880}>
          <Img
            key={imageIndex}
            src={staticFile(images[imageIndex])}
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
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ transform: "scale(0.65)" }}>
          <CalendarGrid filledDays={filledDays} pulseDay={filledDays - 1} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Day30: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 14 } });
  const grid = spring({ frame: frame - 12, fps, config: { damping: 16 } });
  const out = interpolate(frame, [110, 124], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stats = [
    { label: "WORKOUTS", value: "22", delay: 30 },
    { label: "STREAK", value: "30 DAYS", delay: 44 },
    { label: "WEIGHT", value: "-4 KG", delay: 58 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 30%, rgba(0,255,136,0.18), ${theme.bg} 70%)`,
        fontFamily: theme.font,
        padding: "120px 60px 60px",
        opacity: out,
      }}
    >
      <div
        style={{
          color: theme.neon,
          fontSize: 30,
          letterSpacing: 6,
          fontWeight: 800,
          opacity: t,
        }}
      >
        DAY 30
      </div>
      <div
        style={{
          color: theme.white,
          fontSize: 110,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.0,
          marginTop: 16,
          opacity: t,
        }}
      >
        Different
        <br />
        person.
      </div>

      <div
        style={{
          marginTop: 60,
          opacity: grid,
          transform: `translateY(${(1 - grid) * 30}px)`,
          alignSelf: "center",
        }}
      >
        <CalendarGrid filledDays={TOTAL_DAYS} />
      </div>

      <div
        style={{
          marginTop: 50,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {stats.map((s) => {
          const inAnim = spring({
            frame: frame - s.delay,
            fps,
            config: { damping: 18 },
          });
          return (
            <div
              key={s.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                opacity: inAnim,
                transform: `translateX(${(1 - inAnim) * -30}px)`,
              }}
            >
              <span style={{ color: theme.muted, fontSize: 28, fontWeight: 600, letterSpacing: 2 }}>
                {s.label}
              </span>
              <span
                style={{
                  color: theme.neon,
                  fontSize: 64,
                  fontWeight: 800,
                  letterSpacing: -1,
                  textShadow: "0 0 30px rgba(0,255,136,0.5)",
                }}
              >
                {s.value}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TransformCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 14 } });
  const c = spring({ frame: frame - 14, fps, config: { damping: 14 } });
  const sub = spring({ frame: frame - 28, fps, config: { damping: 16 } });
  const pulse = 1 + Math.sin(frame / 5) * 0.025;
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
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: -4,
          textAlign: "center",
          lineHeight: 0.98,
          opacity: t,
        }}
      >
        Your
        <br />
        <span style={{ color: theme.neon }}>30 days</span>
        <br />
        start now.
      </div>
      <div
        style={{
          marginTop: 60,
          background: theme.neon,
          color: theme.bg,
          fontSize: 46,
          fontWeight: 800,
          padding: "28px 68px",
          borderRadius: 100,
          opacity: c,
          transform: `scale(${pulse})`,
          boxShadow: "0 0 100px rgba(0,255,136,0.6)",
        }}
      >
        Start Free Trial
      </div>
      <div
        style={{
          marginTop: 24,
          color: theme.muted,
          fontSize: 26,
          opacity: sub,
        }}
      >
        3-day free trial &middot; cancel anytime
      </div>
    </AbsoluteFill>
  );
};

export const BeforeAfter: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Sequence from={0} durationInFrames={90}>
        <Day1 />
      </Sequence>
      <Sequence from={90} durationInFrames={270}>
        <Montage />
      </Sequence>
      <Sequence from={360} durationInFrames={124}>
        <Day30 />
      </Sequence>
      <Sequence from={484} durationInFrames={116}>
        <TransformCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
