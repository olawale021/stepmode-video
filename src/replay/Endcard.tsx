import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { theme } from "../theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "700"] });

export const Endcard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        background: `rgba(0,0,0,${fadeIn * 0.9})`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity: fadeIn,
          transform: `scale(${0.8 + pop * 0.2})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        <Img
          src={staticFile("brand/stepmode-icon.png")}
          style={{ width: 200, height: 200, borderRadius: 48 }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: 8,
            color: theme.white,
          }}
        >
          STEP<span style={{ color: theme.neon }}>MODE</span>
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: 4,
            color: theme.muted,
          }}
        >
          EVERY RUN, RELIVED IN 3D
        </div>
      </div>
    </AbsoluteFill>
  );
};
