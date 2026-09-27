import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 18 } });
  const subIn = spring({ frame: frame - 22, fps, config: { damping: 18 } });
  const pulse = 1 + Math.sin(frame / 6) * 0.012;
  const fadeOut = interpolate(frame, [48, 60], [1, 0], {
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
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          color: theme.neonTint,
          fontSize: 32,
          letterSpacing: 6,
          textTransform: "uppercase",
          fontWeight: 600,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 20}px)`,
          marginBottom: 36,
        }}
      >
        StepMode
      </div>
      <div
        style={{
          color: theme.white,
          fontSize: 110,
          fontWeight: 800,
          letterSpacing: -2,
          lineHeight: 1.05,
          textAlign: "center",
          opacity: titleIn,
          transform: `scale(${0.92 + 0.08 * titleIn}) scale(${pulse})`,
          padding: "0 80px",
        }}
      >
        Your <span style={{ color: theme.neon }}>AI</span>
        <br />
        fitness coach.
      </div>
      <div
        style={{
          marginTop: 56,
          color: theme.muted,
          fontSize: 36,
          fontWeight: 400,
          textAlign: "center",
          opacity: subIn,
          transform: `translateY(${(1 - subIn) * 20}px)`,
        }}
      >
        Plans, meals, progress &mdash; one app.
      </div>
    </AbsoluteFill>
  );
};
