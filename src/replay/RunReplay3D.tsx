import React, { useMemo } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { preprocessRoute } from "../lib/replayRoute";
import { computeTimeline, FPS } from "../lib/cameraPath";
import { theme } from "../theme";
import { ReplayVideoProps } from "./schema";
import { ReplayMap } from "./ReplayMap";
import { StatsOverlay } from "./StatsOverlay";
import { Endcard } from "./Endcard";

export const RunReplay3D: React.FC<ReplayVideoProps> = ({
  route: rawRoute,
  stats,
  mapboxToken,
}) => {
  const route = useMemo(() => preprocessRoute(rawRoute), [rawRoute]);
  const timeline = useMemo(
    () => (route ? computeTimeline(route, FPS) : null),
    [route]
  );

  if (!route || !timeline) {
    // Backend validates route length before enqueueing; brand-only fallback
    return (
      <AbsoluteFill style={{ background: theme.bg }}>
        <Endcard />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <ReplayMap route={route} timeline={timeline} mapboxToken={mapboxToken} />
      <StatsOverlay
        route={route}
        timeline={timeline}
        startedAt={stats.startedAt}
        activityType={stats.activityType}
      />
      <Sequence from={timeline.endcardStart} name="Endcard">
        <Endcard />
      </Sequence>
    </AbsoluteFill>
  );
};
