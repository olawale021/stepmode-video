import { z } from "zod";
import { CalculateMetadataFunction } from "remotion";
import { preprocessRoute } from "../lib/replayRoute";
import { computeTimeline, FPS } from "../lib/cameraPath";

export const replayVideoSchema = z.object({
  // Raw runs.route_polyline from the backend, untouched
  route: z.array(
    z.object({
      lat: z.number(),
      lng: z.number(),
      alt: z.number().optional(),
      timestamp: z.string(),
    })
  ),
  stats: z.object({
    distanceMeters: z.number(),
    durationSeconds: z.number(),
    avgPaceSecKm: z.number(),
    elevationGainM: z.number().optional(),
    startedAt: z.string(),
    activityType: z.string().optional(),
  }),
  mapboxToken: z.string(),
});

export type ReplayVideoProps = z.infer<typeof replayVideoSchema>;

export const calculateReplayMetadata: CalculateMetadataFunction<
  ReplayVideoProps
> = ({ props }) => {
  const route = preprocessRoute(props.route);
  if (!route) {
    // Backend validates before rendering; this keeps Studio alive on bad props
    return { durationInFrames: 10 * FPS, fps: FPS };
  }
  return {
    durationInFrames: computeTimeline(route, FPS).totalFrames,
    fps: FPS,
  };
};
