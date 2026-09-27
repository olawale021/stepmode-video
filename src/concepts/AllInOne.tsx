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

type FakeApp = {
  name: string;
  emoji: string;
  color: string;
  price: string;
};

const FAKE_APPS: FakeApp[] = [
  { name: "WorkoutPro", emoji: "🏋️", color: "#ff3b6e", price: "$9.99" },
  { name: "MealMate", emoji: "🥗", color: "#3fb6ff", price: "$7.99" },
  { name: "Runly", emoji: "🏃", color: "#ffcc3b", price: "$4.99" },
];

const TOTAL_PRICE = "$22.97";

const AppChaos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labelIn = spring({ frame, fps, config: { damping: 14 } });
  const headlineIn = spring({ frame: frame - 8, fps, config: { damping: 12 } });
  const priceIn = spring({ frame: frame - 60, fps, config: { damping: 10 } });
  const out = interpolate(frame, [108, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        fontFamily: theme.font,
        opacity: out,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "rgba(255,100,100,0.8)",
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 6,
          opacity: labelIn,
          transform: `translateY(${(1 - labelIn) * -12}px)`,
        }}
      >
        TOO MANY APPS?
      </div>

      <div
        style={{
          color: theme.white,
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.0,
          marginTop: 16,
          opacity: headlineIn,
          transform: `translateY(${(1 - headlineIn) * 20}px) scale(${0.92 + 0.08 * headlineIn})`,
          maxWidth: 900,
        }}
      >
        One for
        <br />
        everything?
      </div>

      <div
        style={{
          marginTop: 70,
          display: "flex",
          gap: 36,
          justifyContent: "center",
        }}
      >
        {FAKE_APPS.map((app, i) => {
          const delay = 20 + i * 7;
          const appIn = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, mass: 0.6 },
          });
          const shake = Math.sin(frame / 4 + i) * 2;
          return (
            <div
              key={app.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: appIn,
                transform: `scale(${0.7 + 0.3 * appIn}) translateY(${shake}px)`,
              }}
            >
              <div
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: 40,
                  background: `linear-gradient(135deg, ${app.color}, ${app.color}99)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 94,
                  boxShadow: `0 20px 40px ${app.color}40`,
                }}
              >
                {app.emoji}
              </div>
              <div
                style={{
                  color: theme.white,
                  fontSize: 20,
                  fontWeight: 700,
                  marginTop: 12,
                }}
              >
                {app.name}
              </div>
              <div
                style={{
                  color: "rgba(255,100,100,0.85)",
                  fontSize: 18,
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                {app.price}/mo
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          opacity: priceIn,
          transform: `scale(${0.8 + 0.2 * priceIn})`,
        }}
      >
        <div
          style={{
            color: theme.muted,
            fontSize: 24,
            letterSpacing: 4,
            fontWeight: 700,
          }}
        >
          TOTAL
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <div
            style={{
              color: "#ff3b6e",
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
              textShadow: "0 0 40px rgba(255,59,110,0.5)",
            }}
          >
            {TOTAL_PRICE}
          </div>
          <div
            style={{
              color: "rgba(255,100,100,0.7)",
              fontSize: 32,
              fontWeight: 600,
            }}
          >
            /mo
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Collapse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const collapse = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const logoIn = spring({ frame: frame - 22, fps, config: { damping: 10, mass: 0.5 } });
  const textIn = spring({ frame: frame - 32, fps, config: { damping: 14 } });
  const out = interpolate(frame, [56, 64], [1, 0], {
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
      {FAKE_APPS.map((app, i) => {
        const angle = (i / FAKE_APPS.length) * Math.PI * 2;
        const startX = Math.cos(angle) * 500;
        const startY = Math.sin(angle) * 500;
        return (
          <div
            key={app.name}
            style={{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: 28,
              background: `linear-gradient(135deg, ${app.color}, ${app.color}88)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              transform: `translate(${startX * (1 - collapse)}px, ${startY * (1 - collapse)}px) scale(${1 - collapse * 0.8}) rotate(${collapse * 360}deg)`,
              opacity: 1 - collapse,
            }}
          >
            {app.emoji}
          </div>
        );
      })}

      <div
        style={{
          width: 260,
          height: 260,
          borderRadius: 60,
          overflow: "hidden",
          opacity: logoIn,
          transform: `scale(${0.5 + 0.5 * logoIn})`,
          boxShadow: "0 0 120px rgba(0,255,136,0.6)",
        }}
      >
        <Img
          src={staticFile("brand/stepmode-icon.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: textIn,
          transform: `translateY(${(1 - textIn) * 30}px)`,
        }}
      >
        <div
          style={{
            color: theme.white,
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.0,
          }}
        >
          One <span style={{ color: theme.neon }}>Stepmode.</span>
        </div>
        <div
          style={{
            color: theme.muted,
            fontSize: 38,
            fontWeight: 500,
            marginTop: 20,
            letterSpacing: -0.3,
          }}
        >
          Replaces every app above.
        </div>
      </div>
    </AbsoluteFill>
  );
};

type Feat = {
  label: string;
  emoji: string;
  image: string;
  x: number;
  y: number;
  headline: string;
  desc: string;
};

const FEATS: Feat[] = [
  { label: "SCAN EQUIPMENT", emoji: "📸", image: "features/scan-image.png", x: -340, y: -400, headline: "Scan any machine.", desc: "Point your camera, get every exercise." },
  { label: "WORKOUT PLANS", emoji: "🏋️", image: "features/plan-details.png", x: 340, y: -400, headline: "Plans built for you.", desc: "Tailored to your goals, level, and gym." },
  { label: "MEAL TRACKING", emoji: "🥗", image: "features/meal-scan.jpg", x: -340, y: 240, headline: "Track meals in a snap.", desc: "Photo in. Calories, protein, carbs out." },
  { label: "RUN COACHING", emoji: "🏃", image: "features/run.jpg", x: 340, y: 240, headline: "Runs with a voice coach.", desc: "GPS, pace, and real-time coaching." },
  { label: "AI COACH", emoji: "🤖", image: "features/ai-couch.png", x: 0, y: 600, headline: "Your coach, 24/7.", desc: "Ask anything. Get a personal answer." },
];

const OrbitBadge: React.FC<{
  feat: Feat;
  index: number;
  frame: number;
  fps: number;
}> = ({ feat, index, frame, fps }) => {
  const delay = 10 + index * 32;
  const inAnim = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  const pulse = 1 + Math.sin((frame - delay) / 6) * 0.03;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(${feat.x}px, ${feat.y}px) translate(-50%, -50%) scale(${(0.6 + 0.4 * inAnim) * pulse})`,
        opacity: inAnim,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: 36,
          background: theme.neonChipBg,
          border: "3px solid rgba(0,255,136,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 72,
          boxShadow: "0 0 30px rgba(0,255,136,0.4)",
        }}
      >
        {feat.emoji}
      </div>
      <div
        style={{
          background: theme.neon,
          color: theme.bg,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 1.5,
          padding: "6px 14px",
          borderRadius: 8,
          whiteSpace: "nowrap",
        }}
      >
        {feat.label}
      </div>
    </div>
  );
};

const OrbitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({ frame, fps, config: { damping: 14 } });
  const phoneIn = spring({ frame: frame - 6, fps, config: { damping: 16 } });
  const out = interpolate(frame, [300, 315], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentFeat = Math.min(
    FEATS.length - 1,
    Math.max(0, Math.floor((frame - 10) / 32))
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, rgba(0,255,136,0.12), ${theme.bg} 60%)`,
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
            fontSize: 26,
            letterSpacing: 6,
            fontWeight: 800,
          }}
        >
          STEPMODE
        </div>
        <div
          style={{
            color: theme.white,
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2,
            marginTop: 8,
          }}
        >
          All in one.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${0.88 + 0.12 * phoneIn})`,
          opacity: phoneIn,
        }}
      >
        <PhoneFrame width={440} height={860}>
          <Img
            key={currentFeat}
            src={staticFile(FEATS[currentFeat].image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </PhoneFrame>
      </div>

      {FEATS.map((f, i) => (
        <OrbitBadge key={f.label} feat={f} index={i} frame={frame} fps={fps} />
      ))}

      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 60,
          right: 60,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            color: theme.white,
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: -1.5,
            lineHeight: 1.1,
          }}
        >
          {FEATS[currentFeat].headline}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 30,
            fontWeight: 500,
            marginTop: 16,
          }}
        >
          {FEATS[currentFeat].desc}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const AllInOneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 14 } });
  const price = spring({ frame: frame - 16, fps, config: { damping: 14 } });
  const c = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const sub = spring({ frame: frame - 44, fps, config: { damping: 16 } });
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
          fontSize: 110,
          fontWeight: 800,
          letterSpacing: -4,
          textAlign: "center",
          lineHeight: 0.98,
          opacity: t,
        }}
      >
        3 apps.
        <br />
        <span style={{ color: theme.neon }}>1 subscription.</span>
      </div>

      <div
        style={{
          marginTop: 50,
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          opacity: price,
        }}
      >
        <span
          style={{
            color: theme.muted,
            fontSize: 44,
            fontWeight: 600,
            textDecoration: "line-through",
          }}
        >
          $22.97
        </span>
        <span
          style={{
            color: theme.neon,
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          Free
        </span>
      </div>

      <div
        style={{
          marginTop: 40,
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
          marginTop: 22,
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

export const AllInOne: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Sequence from={0} durationInFrames={120}>
        <AppChaos />
      </Sequence>
      <Sequence from={120} durationInFrames={64}>
        <Collapse />
      </Sequence>
      <Sequence from={184} durationInFrames={315}>
        <OrbitScene />
      </Sequence>
      <Sequence from={499} durationInFrames={101}>
        <AllInOneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
