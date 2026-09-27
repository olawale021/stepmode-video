import { RoutePoint } from "../lib/replayRoute";

// Deterministic synthetic 5 km loop near Chamonix (dramatic terrain for
// Studio previews). 1 point/second at ~5 m/s with rolling altitude.
const CENTER = { lat: 45.9237, lng: 6.8694 };
const R_EARTH = 6371000;
const LOOP_RADIUS = 5000 / (2 * Math.PI);
const SECONDS = 1000;
const T0 = Date.parse("2026-07-01T07:00:00Z");

export const sampleRoute: RoutePoint[] = Array.from(
  { length: SECONDS + 1 },
  (_, s) => {
    const theta = (s / SECONDS) * 2 * Math.PI;
    const dLat = ((LOOP_RADIUS * Math.cos(theta)) / R_EARTH) * (180 / Math.PI);
    const dLng =
      (((LOOP_RADIUS * Math.sin(theta)) / R_EARTH) * (180 / Math.PI)) /
      Math.cos((CENTER.lat * Math.PI) / 180);
    return {
      lat: CENTER.lat + dLat,
      lng: CENTER.lng + dLng,
      alt: 1050 + 25 * Math.sin(theta * 3),
      timestamp: new Date(T0 + s * 1000).toISOString(),
    };
  }
);

export const sampleStats = {
  distanceMeters: 5000,
  durationSeconds: 1000,
  avgPaceSecKm: 200,
  elevationGainM: 68,
  startedAt: new Date(T0).toISOString(),
  activityType: "run",
};
