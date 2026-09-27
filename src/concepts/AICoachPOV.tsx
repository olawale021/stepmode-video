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

const useTypewriter = (text: string, startFrame = 0, charsPerFrame = 0.6) => {
  const frame = useCurrentFrame();
  const visible = Math.max(0, Math.min(text.length, Math.floor((frame - startFrame) * charsPerFrame)));
  return text.slice(0, visible);
};

const Caret: React.FC = () => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 8) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: "0.9em",
        background: theme.neon,
        marginLeft: 6,
        transform: "translateY(4px)",
        opacity: on ? 1 : 0,
      }}
    />
  );
};

const INTRO_TEXT = "Hi, I'm Stepmode. I help you not get confused at the gym.";
const STEPMODE_START = 8;
const STEPMODE_END = 16;

const IntroText: React.FC<{ visible: string }> = ({ visible }) => {
  const before = visible.slice(0, STEPMODE_START);
  const brand = visible.slice(STEPMODE_START, Math.min(visible.length, STEPMODE_END));
  const after = visible.length > STEPMODE_END ? visible.slice(STEPMODE_END) : "";

  return (
    <>
      {before}
      {brand && <span style={{ color: theme.neon }}>{brand}</span>}
      {after}
    </>
  );
};

const Intro: React.FC = () => {
  const text = useTypewriter(INTRO_TEXT, 0, 0.85);
  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme.font,
        padding: 80,
      }}
    >
      <div
        style={{
          color: theme.neon,
          fontSize: 28,
          letterSpacing: 6,
          fontWeight: 700,
          marginBottom: 36,
        }}
      >
        STEPMODE
      </div>
      <div
        style={{
          color: theme.white,
          fontSize: 82,
          fontWeight: 800,
          letterSpacing: -2,
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        <IntroText visible={text} />
        <Caret />
      </div>
    </AbsoluteFill>
  );
};

type Beat = {
  message: string;
  image: string;
};

const BEATS: Beat[] = [
  { message: "Show me the machine, I'll show you the workout.", image: "features/scan-image.png" },
  { message: "Tell me your goals, I'll handle the rest.", image: "features/plan-details.png" },
  { message: "Show me your meal, I'll count every macro.", image: "features/meal-scan.jpg" },
  { message: "I run with you. Every step, every mile.", image: "features/run.jpg" },
];

const BeatSlide: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = useTypewriter(beat.message, 0, 0.7);
  const phoneIn = spring({ frame: frame - 6, fps, config: { damping: 18 } });
  const out = interpolate(frame, [63, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        fontFamily: theme.font,
        opacity: out,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 60,
          right: 60,
          background: theme.neonChipBg,
          border: "2px solid rgba(0,255,136,0.3)",
          borderRadius: 32,
          borderBottomLeftRadius: 8,
          padding: "32px 36px",
          color: theme.white,
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: -1,
          zIndex: 10,
        }}
      >
        <div
          style={{
            color: theme.neon,
            fontSize: 18,
            letterSpacing: 4,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          STEPMODE
        </div>
        {text}
        <Caret />
      </div>

      <div
        style={{
          position: "absolute",
          top: 560,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: phoneIn,
          transform: `translateY(${(1 - phoneIn) * 60}px) scale(${0.94 + 0.06 * phoneIn})`,
        }}
      >
        <PhoneFrame width={660} height={1280}>
          <Img
            src={staticFile(beat.image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

const AskAnything: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = useTypewriter("Training, nutrition, fitness — ask me anything.", 0, 0.7);
  const phoneIn = spring({ frame: frame - 6, fps, config: { damping: 18 } });
  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        fontFamily: theme.font,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 60,
          right: 60,
          background: theme.neonChipBg,
          border: "2px solid rgba(0,255,136,0.3)",
          borderRadius: 32,
          borderBottomLeftRadius: 8,
          padding: "32px 36px",
          color: theme.white,
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: -1,
        }}
      >
        <div
          style={{
            color: theme.neon,
            fontSize: 18,
            letterSpacing: 4,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          STEPMODE
        </div>
        {text}
        <Caret />
      </div>
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: phoneIn,
          transform: `translateY(${(1 - phoneIn) * 60}px) scale(${0.94 + 0.06 * phoneIn})`,
        }}
      >
        <PhoneFrame width={660} height={1280}>
          <Img
            src={staticFile("features/ai-couch.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

const AppStoreBadge: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      background: theme.white,
      borderRadius: 18,
      padding: "18px 36px",
    }}
  >
    <svg width="44" height="54" viewBox="0 0 814 1000">
      <path
        d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.3-81.4-105.6-207.4-105.6-327.4 0-192.8 125.6-295 249-295 65.7 0 120.4 43.2 161.5 43.2 39.5 0 101.1-45.9 176.4-45.9 28.5 0 130.9 2.6 198.3 99.5zm-169.5-145c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8.6 15.6 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.3 0 103-30.4 139.5-71.4z"
        fill="#000"
      />
    </svg>
    <div>
      <div
        style={{
          color: "#000",
          fontSize: 18,
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        Download on the
      </div>
      <div
        style={{
          color: "#000",
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: -0.5,
        }}
      >
        App Store
      </div>
    </div>
  </div>
);

const CoachCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 14 } });
  const c = spring({ frame: frame - 16, fps, config: { damping: 16 } });
  const badgeIn = spring({ frame: frame - 32, fps, config: { damping: 18 } });
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
          fontSize: 100,
          fontWeight: 800,
          letterSpacing: -3,
          textAlign: "center",
          lineHeight: 1.05,
          opacity: t,
        }}
      >
        Download
        <br />
        <span style={{ color: theme.neon }}>Stepmode.</span>
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
          marginTop: 48,
          opacity: badgeIn,
          transform: `translateY(${(1 - badgeIn) * 20}px)`,
        }}
      >
        <AppStoreBadge />
      </div>
    </AbsoluteFill>
  );
};

export const AICoachPOV: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Sequence from={0} durationInFrames={105}>
        <Intro />
      </Sequence>
      {BEATS.map((b, i) => (
        <Sequence key={i} from={105 + i * 76} durationInFrames={76}>
          <BeatSlide beat={b} />
        </Sequence>
      ))}
      <Sequence from={409} durationInFrames={107}>
        <AskAnything />
      </Sequence>
      <Sequence from={516} durationInFrames={84}>
        <CoachCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
