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

type Moment = {
  time: string;
  caption: string;
  image: string;
  ambientColor: string;
};

const MOMENTS: Moment[] = [
  {
    time: "7:00 AM",
    caption: "Today's plan, ready.",
    image: "features/plan-details.png",
    ambientColor: "rgba(255,180,80,0.18)",
  },
  {
    time: "12:30 PM",
    caption: "Lunch logged in 1 second.",
    image: "features/meal-scan.jpg",
    ambientColor: "rgba(120,200,255,0.18)",
  },
  {
    time: "5:30 PM",
    caption: "5K with my voice coach.",
    image: "features/run.jpg",
    ambientColor: "rgba(255,100,150,0.18)",
  },
  {
    time: "9:00 PM",
    caption: "Coach in my pocket.",
    image: "features/ai-couch.png",
    ambientColor: "rgba(0,255,136,0.18)",
  },
];

const MomentSlide: React.FC<{ moment: Moment; isLast: boolean }> = ({
  moment,
  isLast,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneIn = spring({ frame, fps, config: { damping: 18, mass: 0.6 } });
  const timeIn = spring({ frame: frame - 4, fps, config: { damping: 18 } });
  const captionIn = spring({ frame: frame - 14, fps, config: { damping: 18 } });
  const ken = 1 + interpolate(frame, [0, 130], [0, 0.06]);
  const out = interpolate(frame, [120, 132], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 30%, ${moment.ambientColor}, ${theme.bg} 70%)`,
        fontFamily: theme.font,
        opacity: isLast ? 1 : out,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          color: theme.neon,
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: 6,
          opacity: timeIn,
          transform: `translateY(${(1 - timeIn) * -16}px)`,
        }}
      >
        {moment.time}
      </div>

      <div
        style={{
          position: "absolute",
          top: 180,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: phoneIn,
          transform: `scale(${0.9 + 0.1 * phoneIn})`,
        }}
      >
        <PhoneFrame width={620} height={1240}>
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${ken})`,
            }}
          >
            <Img
              src={staticFile(moment.image)}
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
          bottom: 140,
          left: 80,
          right: 80,
          textAlign: "center",
          color: theme.white,
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: -1.5,
          lineHeight: 1.1,
          opacity: captionIn,
          transform: `translateY(${(1 - captionIn) * 24}px)`,
        }}
      >
        {moment.caption}
      </div>
    </AbsoluteFill>
  );
};

const DayCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 14 } });
  const c = spring({ frame: frame - 16, fps, config: { damping: 16 } });
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
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: -3,
          textAlign: "center",
          lineHeight: 1.05,
          opacity: t,
        }}
      >
        Make today
        <br />
        <span style={{ color: theme.neon }}>your day.</span>
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
    </AbsoluteFill>
  );
};

export const DayInLife: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {MOMENTS.map((m, i) => (
        <Sequence key={m.time} from={i * 132} durationInFrames={132}>
          <MomentSlide moment={m} isLast={false} />
        </Sequence>
      ))}
      <Sequence from={528} durationInFrames={72}>
        <DayCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
