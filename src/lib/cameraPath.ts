import { ReplayRoute, sampleAtDistance } from "./replayRoute";

// Mirrors the Phase 1 in-app camera (stepmode-mobile hooks/useReplayEngine.ts):
// same follow pitch/zoom and the same distance-parameterized duration formula,
// but computed per frame — video rendering needs a deterministic camera, not
// keyframes interpolated by the map.

export const FPS = 30;
const METERS_PER_SECOND = 200; // 5 km ≈ 25 s of follow
const MIN_FOLLOW_S = 20;
const MAX_FOLLOW_S = 75;

const INTRO_S = 2.5;
const DIVE_S = 2.5;
const OUTRO_S = 2.5;
const ENDCARD_S = 2.0;

const FOLLOW_PITCH = 60;
const FOLLOW_ZOOM = 16;
const OVERVIEW_PITCH_END = 30;
const OUTRO_PITCH = 45;

export interface CameraFrame {
  center: [number, number]; // [lng, lat]
  zoom: number;
  pitch: number;
  bearing: number;
  progress: number; // 0..1 of route drawn
  distance: number; // meters along route
}

export interface ReplayTimeline {
  introFrames: number;
  diveFrames: number;
  followFrames: number;
  outroFrames: number;
  endcardFrames: number;
  totalFrames: number;
  followStart: number;
  followEnd: number;
  endcardStart: number;
  followDurationS: number;
}

export function computeTimeline(route: ReplayRoute, fps: number): ReplayTimeline {
  const followDurationS = Math.min(
    MAX_FOLLOW_S,
    Math.max(MIN_FOLLOW_S, route.totalDist / METERS_PER_SECOND)
  );
  const introFrames = Math.round(INTRO_S * fps);
  const diveFrames = Math.round(DIVE_S * fps);
  const followFrames = Math.round(followDurationS * fps);
  const outroFrames = Math.round(OUTRO_S * fps);
  const endcardFrames = Math.round(ENDCARD_S * fps);
  const totalFrames =
    introFrames + diveFrames + followFrames + outroFrames + endcardFrames;
  return {
    introFrames,
    diveFrames,
    followFrames,
    outroFrames,
    endcardFrames,
    totalFrames,
    followStart: introFrames + diveFrames,
    followEnd: introFrames + diveFrames + followFrames,
    endcardStart: totalFrames - endcardFrames,
    followDurationS,
  };
}

// Zoom that fits the route bounds inside the viewport with padding.
// Mapbox: at zoom z a 512px tile spans 360° of longitude.
function overviewZoom(
  route: ReplayRoute,
  width: number,
  height: number
): number {
  const [neLng, neLat] = route.bounds.ne;
  const [swLng, swLat] = route.bounds.sw;
  const centerLat = (neLat + swLat) / 2;
  const lngSpan = Math.max(neLng - swLng, 1e-5);
  // Latitude span expressed as an equivalent longitude span at this latitude
  const latSpanAsLng =
    Math.max(neLat - swLat, 1e-5) / Math.cos((centerLat * Math.PI) / 180);
  const usableW = width * 0.7;
  const usableH = height * 0.55; // stats card + top chrome eat vertical space
  const zLng = Math.log2((usableW * 360) / (512 * lngSpan));
  const zLat = Math.log2((usableH * 360) / (512 * latSpanAsLng));
  return Math.min(15, Math.max(10, Math.min(zLng, zLat)));
}

const easeInOut = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpBearing = (a: number, b: number, t: number) => {
  const diff = ((b - a + 540) % 360) - 180;
  return (a + diff * t + 360) % 360;
};

export function cameraAtFrame(
  route: ReplayRoute,
  timeline: ReplayTimeline,
  width: number,
  height: number,
  frame: number
): CameraFrame {
  const { introFrames, diveFrames, followFrames, followStart, followEnd } =
    timeline;
  const boundsCenter: [number, number] = [
    (route.bounds.ne[0] + route.bounds.sw[0]) / 2,
    (route.bounds.ne[1] + route.bounds.sw[1]) / 2,
  ];
  const ovZoom = overviewZoom(route, width, height);
  const start = sampleAtDistance(route, 0);
  const end = sampleAtDistance(route, route.totalDist);

  if (frame < introFrames) {
    // Overview: slow tilt-in and drift while the full route is framed
    const t = introFrames <= 1 ? 1 : frame / (introFrames - 1);
    return {
      center: boundsCenter,
      zoom: ovZoom,
      pitch: lerp(0, OVERVIEW_PITCH_END, easeInOut(t)),
      bearing: lerp(0, 12, t),
      progress: 0,
      distance: 0,
    };
  }

  if (frame < followStart) {
    // Dive from overview down to the start point
    const t = diveFrames <= 1 ? 1 : (frame - introFrames) / (diveFrames - 1);
    const e = easeInOut(t);
    return {
      center: [
        lerp(boundsCenter[0], start.coord[0], e),
        lerp(boundsCenter[1], start.coord[1], e),
      ],
      zoom: lerp(ovZoom, FOLLOW_ZOOM, e),
      pitch: lerp(OVERVIEW_PITCH_END, FOLLOW_PITCH, e),
      bearing: lerpBearing(12, start.bearing, e),
      progress: 0,
      distance: 0,
    };
  }

  if (frame < followEnd) {
    // Follow the runner at constant ground speed
    const t = followFrames <= 1 ? 1 : (frame - followStart) / (followFrames - 1);
    const d = t * route.totalDist;
    const sample = sampleAtDistance(route, d);
    return {
      center: sample.coord,
      zoom: FOLLOW_ZOOM,
      pitch: FOLLOW_PITCH,
      bearing: sample.bearing,
      progress: t,
      distance: d,
    };
  }

  // Outro + endcard: pull back to the full route and hold
  const outroT = Math.min(
    1,
    timeline.outroFrames <= 1 ? 1 : (frame - followEnd) / (timeline.outroFrames - 1)
  );
  const e = easeInOut(outroT);
  return {
    center: [
      lerp(end.coord[0], boundsCenter[0], e),
      lerp(end.coord[1], boundsCenter[1], e),
    ],
    zoom: lerp(FOLLOW_ZOOM, ovZoom, e),
    pitch: lerp(FOLLOW_PITCH, OUTRO_PITCH, e),
    bearing: lerpBearing(end.bearing, 0, e),
    progress: 1,
    distance: route.totalDist,
  };
}
