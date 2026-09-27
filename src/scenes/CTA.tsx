import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 16 } });
  const ctaIn = spring({ frame: frame - 20, fps, config: { damping: 16 } });
  const trialIn = spring({ frame: frame - 38, fps, config: { damping: 18 } });
  const ctaPulse = 1 + Math.sin(frame / 5) * 0.02;

  const glow = interpolate(Math.sin(frame / 10), [-1, 1], [0.3, 0.7]);

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
          color: theme.neonTint,
          fontSize: 28,
          letterSpacing: 6,
          textTransform: "uppercase",
          fontWeight: 600,
          opacity: titleIn,
          marginBottom: 40,
        }}
      >
        StepMode
      </div>

      <div
        style={{
          color: theme.white,
          fontSize: 130,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.0,
          textAlign: "center",
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 30}px)`,
        }}
      >
        Train <span style={{ color: theme.neon }}>smarter.</span>
        <br />
        Eat better.
      </div>

      <div
        style={{
          marginTop: 80,
          opacity: ctaIn,
          transform: `translateY(${(1 - ctaIn) * 30}px) scale(${ctaPulse})`,
        }}
      >
        <div
          style={{
            background: theme.neon,
            color: theme.bg,
            fontSize: 52,
            fontWeight: 800,
            padding: "32px 80px",
            borderRadius: 100,
            boxShadow: `0 0 80px rgba(0,255,136,${glow})`,
          }}
        >
          Start Free Trial
        </div>
      </div>

      <div
        style={{
          marginTop: 36,
          color: theme.muted,
          fontSize: 30,
          opacity: trialIn,
          textAlign: "center",
        }}
      >
        3-day free trial &middot; cancel anytime
      </div>
    </AbsoluteFill>
  );
};
