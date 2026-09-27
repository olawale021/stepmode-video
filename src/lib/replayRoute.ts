// Ported from stepmode-mobile/services/replayRouteService.ts (keep the two in
// sync by hand — there is no shared package between the repos).

const R_EARTH = 6371000;

export const haversineDistance = (
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number => {
  const dLat = toRadH(lat2 - lat1);
  const dLon = toRadH(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadH(lat1)) * Math.cos(toRadH(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R_EARTH * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
const toRadH = (deg: number): number => (deg * Math.PI) / 180;


// Shape of a stored route_polyline point (subset of live GpsPoint — no
// accuracy/speed, so outlier filtering is purely kinematic).
export interface RoutePoint {
  lat: number;
  lng: number;
  alt?: number;
  timestamp: string;
}

export interface ReplaySample {
  coord: [number, number]; // [lng, lat] — Mapbox order
  bearing: number; // degrees, 0..360
  tSec: number; // run seconds elapsed at this distance
  paceSecKm: number; // NaN until enough distance covered
  elevGain: number; // cumulative meters
  index: number;
  frac: number;
}

export interface ReplayRoute {
  coords: [number, number][]; // [lng, lat]
  cumDist: number[]; // meters from start
  tSec: number[]; // seconds from start
  bearing: number[]; // smoothed look-ahead bearing per point
  paceSecKm: number[]; // rolling pace per point (NaN early on)
  cumElevGain: number[]; // meters
  totalDist: number;
  totalTime: number;
  bounds: { ne: [number, number]; sw: [number, number] };
  lineString: GeoJSON.Feature<GeoJSON.LineString>;
}

const MAX_POINTS = 1500;
const MIN_SPACING_M = 5;
// Wide look-ahead + smoothing so the camera banks into turns early and
// gradually — tight values make street corners whip the view around.
const BEARING_LOOKAHEAD_M = 120;
const BEARING_SMOOTH_WINDOW = 10; // ± indices
const PACE_WINDOW_M = 200;
const PACE_MIN_DIST_M = 100;
const ELEV_NOISE_FLOOR_M = 1;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

const bearingBetween = (
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number => {
  const dLon = toRad(lng2 - lng1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

// Kinematic outlier filter (mirrors isValidGpsPoint thresholds, minus the
// accuracy checks since stored polylines don't carry accuracy).
const filterOutliers = (points: RoutePoint[]): RoutePoint[] => {
  const kept: RoutePoint[] = [];
  for (const p of points) {
    if (
      typeof p?.lat !== 'number' || typeof p?.lng !== 'number' ||
      !isFinite(p.lat) || !isFinite(p.lng) || !p.timestamp
    ) continue;
    const last = kept[kept.length - 1];
    if (!last) {
      kept.push(p);
      continue;
    }
    const dist = haversineDistance(last.lat, last.lng, p.lat, p.lng);
    if (dist === 0) continue;
    const dt = (new Date(p.timestamp).getTime() - new Date(last.timestamp).getTime()) / 1000;
    if (dt > 0 && dt < 2 && dist > 50) continue;
    if (dt > 0 && dist / dt > 25) continue;
    kept.push(p);
  }
  return kept;
};

const movingAverage = (values: (number | undefined)[], window: number): number[] => {
  const out: number[] = new Array(values.length).fill(0);
  const half = Math.floor(window / 2);
  for (let i = 0; i < values.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = Math.max(0, i - half); j <= Math.min(values.length - 1, i + half); j++) {
      const v = values[j];
      if (typeof v === 'number' && isFinite(v)) {
        sum += v;
        count++;
      }
    }
    out[i] = count > 0 ? sum / count : 0;
  }
  return out;
};

export function preprocessRoute(points: RoutePoint[]): ReplayRoute | null {
  const clean = filterOutliers(points ?? []);
  if (clean.length < 2) return null;

  // Cumulative distance/time over the cleaned original points
  const rawCum: number[] = [0];
  const t0 = new Date(clean[0].timestamp).getTime();
  const rawT: number[] = [0];
  for (let i = 1; i < clean.length; i++) {
    rawCum.push(
      rawCum[i - 1] +
        haversineDistance(clean[i - 1].lat, clean[i - 1].lng, clean[i].lat, clean[i].lng)
    );
    rawT.push(Math.max(rawT[i - 1], (new Date(clean[i].timestamp).getTime() - t0) / 1000));
  }
  const totalDist = rawCum[rawCum.length - 1];
  if (totalDist <= 0) return null;
  const totalTime = rawT[rawT.length - 1];

  // Resample to evenly distance-spaced points
  const spacing = Math.max(MIN_SPACING_M, totalDist / MAX_POINTS);
  const n = Math.max(2, Math.floor(totalDist / spacing) + 1);
  const coords: [number, number][] = [];
  const cumDist: number[] = [];
  const tSec: number[] = [];
  const altRaw: (number | undefined)[] = [];

  let src = 0;
  for (let i = 0; i < n; i++) {
    const d = i === n - 1 ? totalDist : i * spacing;
    while (src < clean.length - 2 && rawCum[src + 1] < d) src++;
    const segLen = rawCum[src + 1] - rawCum[src];
    const f = segLen > 0 ? (d - rawCum[src]) / segLen : 0;
    const a = clean[src];
    const b = clean[src + 1];
    coords.push([a.lng + (b.lng - a.lng) * f, a.lat + (b.lat - a.lat) * f]);
    cumDist.push(d);
    tSec.push(rawT[src] + (rawT[src + 1] - rawT[src]) * f);
    altRaw.push(
      typeof a.alt === 'number' && typeof b.alt === 'number'
        ? a.alt + (b.alt - a.alt) * f
        : typeof a.alt === 'number' ? a.alt : b.alt
    );
  }

  // Elevation: smooth, then accumulate rises with hysteresis — a per-step
  // threshold would zero out gradual climbs (resampled steps rise well under
  // 1 m each), so instead count whenever altitude exceeds the last counted
  // level by the noise floor, and let descents lower that reference.
  const altSamples = altRaw.filter((v) => typeof v === 'number').length;
  const alt = movingAverage(altRaw, 5);
  const cumElevGain: number[] = [0];
  let elevRef = alt[0];
  let gain = 0;
  for (let i = 1; i < n; i++) {
    if (altSamples >= 3) {
      if (alt[i] > elevRef + ELEV_NOISE_FLOOR_M) {
        gain += alt[i] - elevRef;
        elevRef = alt[i];
      } else if (alt[i] < elevRef) {
        elevRef = alt[i];
      }
    }
    cumElevGain.push(gain);
  }

  // Look-ahead bearing, then circular smoothing (sin/cos to handle 359°→1°)
  const lookaheadIdx = Math.max(1, Math.round(BEARING_LOOKAHEAD_M / spacing));
  const bearingRaw: number[] = [];
  for (let i = 0; i < n; i++) {
    const j = Math.min(n - 1, i + lookaheadIdx);
    const k = j === i ? Math.max(0, i - 1) : i;
    const [lngA, latA] = coords[k];
    const [lngB, latB] = coords[j === i ? i : j];
    bearingRaw.push(bearingBetween(latA, lngA, latB, lngB));
  }
  const bearing: number[] = [];
  for (let i = 0; i < n; i++) {
    let sinSum = 0;
    let cosSum = 0;
    for (
      let j = Math.max(0, i - BEARING_SMOOTH_WINDOW);
      j <= Math.min(n - 1, i + BEARING_SMOOTH_WINDOW);
      j++
    ) {
      sinSum += Math.sin(toRad(bearingRaw[j]));
      cosSum += Math.cos(toRad(bearingRaw[j]));
    }
    bearing.push((toDeg(Math.atan2(sinSum, cosSum)) + 360) % 360);
  }

  // Rolling pace over the trailing PACE_WINDOW_M
  const paceSecKm: number[] = [];
  let back = 0;
  for (let i = 0; i < n; i++) {
    while (cumDist[i] - cumDist[back] > PACE_WINDOW_M) back++;
    const dDist = cumDist[i] - cumDist[back];
    const dT = tSec[i] - tSec[back];
    paceSecKm.push(
      cumDist[i] >= PACE_MIN_DIST_M && dDist > 0 ? (dT / dDist) * 1000 : NaN
    );
  }

  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);

  return {
    coords,
    cumDist,
    tSec,
    bearing,
    paceSecKm,
    cumElevGain,
    totalDist,
    totalTime,
    bounds: {
      ne: [Math.max(...lngs), Math.max(...lats)],
      sw: [Math.min(...lngs), Math.min(...lats)],
    },
    lineString: {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: coords },
    },
  };
}

export function sampleAtDistance(route: ReplayRoute, d: number): ReplaySample {
  const { coords, cumDist, tSec, bearing, paceSecKm, cumElevGain } = route;
  const n = coords.length;
  const dist = Math.min(Math.max(d, 0), route.totalDist);

  // Binary search for the segment containing dist
  let lo = 0;
  let hi = n - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cumDist[mid] <= dist) lo = mid;
    else hi = mid;
  }
  const segLen = cumDist[hi] - cumDist[lo];
  const f = segLen > 0 ? (dist - cumDist[lo]) / segLen : 0;

  const lerp = (a: number, b: number) => a + (b - a) * f;
  // Shortest-arc bearing interpolation
  const bA = bearing[lo];
  const bB = bearing[hi];
  let diff = ((bB - bA + 540) % 360) - 180;

  return {
    coord: [lerp(coords[lo][0], coords[hi][0]), lerp(coords[lo][1], coords[hi][1])],
    bearing: (bA + diff * f + 360) % 360,
    tSec: lerp(tSec[lo], tSec[hi]),
    paceSecKm: isNaN(paceSecKm[lo]) || isNaN(paceSecKm[hi])
      ? NaN
      : lerp(paceSecKm[lo], paceSecKm[hi]),
    elevGain: lerp(cumElevGain[lo], cumElevGain[hi]),
    index: lo,
    frac: f,
  };
}
