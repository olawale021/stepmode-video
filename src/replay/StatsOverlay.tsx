import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { theme } from "../theme";
import { ReplayRoute, sampleAtDistance } from "../lib/replayRoute";
import { cameraAtFrame, ReplayTimeline } from "../lib/cameraPath";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
});

const formatDistance = (m: number) =>
  m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(2)} km`;
const formatDuration = (s: number) => {
  const secs = Math.max(0, Math.floor(s));
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const ss = secs % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};
const formatPace = (secKm: number) => {
  if (!isFinite(secKm) || secKm <= 0) return "--:--";
  const t = Math.round(secKm);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

interface Props {
  route: ReplayRoute;
  timeline: ReplayTimeline;
  startedAt: string;
  activityType?: string;
}

export const StatsOverlay: React.FC<Props> = ({
  route,
  timeline,
  startedAt,
  activityType,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cam = cameraAtFrame(route, timeline, width, height, frame);
  const sample = sampleAtDistance(route, cam.distance);

  const dateLabel = new Date(startedAt)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();

  // Card slides in as the dive completes, fades out with the outro
  const cardIn = interpolate(
    frame,
    [timeline.followStart - 12, timeline.followStart + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const overlayOut = interpolate(
    frame,
    [timeline.followEnd + 8, timeline.endcardStart],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const stats: Array<[string, string, boolean?]> = [
    ["DISTANCE", formatDistance(cam.progress * route.totalDist), true],
    ["TIME", formatDuration(sample.tSec)],
    ["PACE", formatPace(sample.paceSecKm)],
    ["ELEV", `+${Math.round(sample.elevGain)}m`],
  ];

  return (
    <AbsoluteFill style={{ fontFamily, opacity: overlayOut }}>
      {/* Top brand bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "72px 56px 120px",
          background:
            "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 6,
            color: theme.white,
          }}
        >
          STEP<span style={{ color: theme.neon }}>MODE</span>
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 3,
            color: theme.muted,
          }}
        >
          {(activityType === "walk" ? "WALK · " : "RUN · ") + dateLabel}
        </div>
      </div>

      {/* Bottom stats card */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          bottom: 72,
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 40}px)`,
          background: "rgba(10,10,10,0.82)",
          border: `1px solid ${theme.hairline}`,
          borderRadius: 36,
          padding: "44px 24px 40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {stats.map(([label, value, accent], i) => (
          <React.Fragment key={label}>
            {i > 0 && (
              <div
                style={{
                  width: 1,
                  height: 64,
                  background: theme.hairline,
                }}
              />
            )}
            <div style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: 3,
                  color: theme.muted,
                  marginBottom: 8,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  color: accent ? theme.neon : theme.white,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {value}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};
