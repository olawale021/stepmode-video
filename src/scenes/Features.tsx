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

type Feature = {
  label: string;
  headline: string;
  accent: string;
  image: string;
};

const FEATURES: Feature[] = [
  {
    label: "EQUIPMENT",
    headline: "Scan any\nmachine.",
    accent: "scan",
    image: "features/scan-image.png",
  },
  {
    label: "WORKOUT PLANS",
    headline: "Built for\nyou.",
    accent: "plans",
    image: "features/plan-details.png",
  },
  {
    label: "NUTRITION",
    headline: "Snap.\nLogged.",
    accent: "nutrition",
    image: "features/meal-scan.jpg",
  },
  {
    label: "RUNNING",
    headline: "GPS +\nvoice coach.",
    accent: "running",
    image: "features/run.jpg",
  },
  {
    label: "AI COACH",
    headline: "Ask\nanything.",
    accent: "coach",
    image: "features/ai-couch.png",
  },
];

const SLIDE_FRAMES = 84;

const FeatureSlide: React.FC<{ feature: Feature; index: number }> = ({
  feature,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgIn = spring({ frame, fps, config: { damping: 20, mass: 0.5 } });
  const labelIn = spring({ frame: frame - 4, fps, config: { damping: 18 } });
  const headlineIn = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const fadeOut = interpolate(frame, [SLIDE_FRAMES - 8, SLIDE_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const kenBurns = 1 + interpolate(frame, [0, SLIDE_FRAMES], [0, 0.08]);
  const driftX = interpolate(frame, [0, SLIDE_FRAMES], [0, index % 2 === 0 ? -20 : 20]);
  const slideInX = (1 - imgIn) * (index % 2 === 0 ? 80 : -80);

  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        opacity: fadeOut,
        fontFamily: theme.font,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: imgIn,
          transform: `translateX(${slideInX}px) scale(${0.94 + 0.06 * imgIn})`,
        }}
      >
        <PhoneFrame width={720} height={1380}>
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${kenBurns}) translateX(${driftX}px)`,
            }}
          >
            <Img
              src={staticFile(feature.image)}
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

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 140,
          padding: "0 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            color: theme.bg,
            background: theme.neon,
            fontSize: 26,
            letterSpacing: 4,
            fontWeight: 800,
            padding: "10px 22px",
            borderRadius: 8,
            opacity: labelIn,
            transform: `translateX(${(1 - labelIn) * -40}px)`,
            marginBottom: 32,
          }}
        >
          {feature.label}
        </div>
        <div
          style={{
            color: theme.white,
            fontSize: 130,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 0.98,
            opacity: headlineIn,
            transform: `translateY(${(1 - headlineIn) * 30}px) scale(${0.92 + 0.08 * headlineIn})`,
            whiteSpace: "pre-line",
          }}
        >
          {feature.headline}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          right: 80,
          display: "flex",
          gap: 8,
        }}
      >
        {FEATURES.map((f, i) => (
          <div
            key={f.label}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background:
                i < index
                  ? theme.neon
                  : i === index
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.08)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {i === index && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${(frame / SLIDE_FRAMES) * 100}%`,
                  background: theme.neon,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Features: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {FEATURES.map((feature, i) => (
        <Sequence
          key={feature.label}
          from={i * SLIDE_FRAMES}
          durationInFrames={SLIDE_FRAMES}
        >
          <FeatureSlide feature={feature} index={i} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
