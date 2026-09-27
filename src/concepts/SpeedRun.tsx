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

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inAnim = spring({ frame, fps, config: { damping: 10, mass: 0.4 } });
  const out = interpolate(frame, [40, 50], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme.font,
        opacity: out,
      }}
    >
      <div
        style={{
          color: theme.neon,
          fontSize: 200,
          fontWeight: 800,
          letterSpacing: -6,
          opacity: inAnim,
          transform: `scale(${0.7 + 0.3 * inAnim})`,
        }}
      >
        STEPMODE
      </div>
      <div
        style={{
          color: theme.muted,
          fontSize: 36,
          marginTop: 24,
          opacity: inAnim,
        }}
      >
        in 20 seconds.
      </div>
    </AbsoluteFill>
  );
};

type Beat = {
  word: string;
  caption: string;
  image: string;
};

const BEATS: Beat[] = [
  { word: "SCAN", caption: "any machine", image: "features/scan-image.png" },
  { word: "PLAN", caption: "built for you", image: "features/plan-details.png" },
  { word: "EAT", caption: "snap a photo", image: "features/meal-scan.jpg" },
  { word: "RUN", caption: "voice coached", image: "features/run.jpg" },
  { word: "ASK", caption: "your AI coach", image: "features/ai-couch.png" },
];

const BEAT_FRAMES = 70;

const BeatSlide: React.FC<{ beat: Beat; index: number }> = ({ beat, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dir = index % 2 === 0 ? 1 : -1;

  const wordIn = spring({ frame, fps, config: { damping: 9, mass: 0.4 } });
  const phoneIn = spring({ frame: frame - 8, fps, config: { damping: 12, mass: 0.5 } });
  const captionIn = spring({ frame: frame - 16, fps, config: { damping: 14 } });

  const out = interpolate(frame, [BEAT_FRAMES - 8, BEAT_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ken = 1.05 + interpolate(frame, [0, BEAT_FRAMES], [0, 0.06]);

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
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 5,
        }}
      >
        <div
          style={{
            color: theme.neon,
            fontSize: 240,
            fontWeight: 800,
            letterSpacing: -8,
            lineHeight: 1,
            opacity: wordIn,
            transform: `translateX(${dir * (1 - wordIn) * 200}px) scale(${0.7 + 0.3 * wordIn})`,
            textShadow: "0 0 60px rgba(0,255,136,0.5)",
          }}
        >
          {beat.word}
        </div>
        <div
          style={{
            color: theme.white,
            fontSize: 38,
            fontWeight: 600,
            letterSpacing: -0.5,
            marginTop: 16,
            opacity: captionIn,
          }}
        >
          {beat.caption}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: phoneIn,
          transform: `translateY(${(1 - phoneIn) * 100}px) translateX(${dir * (1 - phoneIn) * -120}px) rotate(${dir * (1 - phoneIn) * -8}deg) scale(${0.85 + 0.15 * phoneIn})`,
        }}
      >
        <PhoneFrame width={560} height={1100}>
          <div style={{ width: "100%", height: "100%", transform: `scale(${ken})` }}>
            <Img
              src={staticFile(beat.image)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </div>
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

const SpeedCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 12 } });
  const c = spring({ frame: frame - 14, fps, config: { damping: 14 } });
  const sub = spring({ frame: frame - 28, fps, config: { damping: 16 } });
  const pulse = 1 + Math.sin(frame / 4) * 0.025;
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
          fontSize: 130,
          fontWeight: 800,
          letterSpacing: -4,
          textAlign: "center",
          lineHeight: 0.98,
          opacity: t,
        }}
      >
        Get
        <br />
        <span style={{ color: theme.neon }}>Stepmode.</span>
      </div>
      <div
        style={{
          marginTop: 60,
          background: theme.neon,
          color: theme.bg,
          fontSize: 50,
          fontWeight: 800,
          padding: "30px 70px",
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
          marginTop: 30,
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

export const SpeedRun: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Sequence from={0} durationInFrames={50}>
        <Hook />
      </Sequence>
      {BEATS.map((b, i) => (
        <Sequence
          key={b.word}
          from={50 + i * BEAT_FRAMES}
          durationInFrames={BEAT_FRAMES}
        >
          <BeatSlide beat={b} index={i} />
        </Sequence>
      ))}
      <Sequence from={400} durationInFrames={200}>
        <SpeedCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
