import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ReplayRoute, sampleAtDistance } from "../lib/replayRoute";
import { cameraAtFrame, CameraFrame, ReplayTimeline } from "../lib/cameraPath";

const DELAY_OPTS = { timeoutInMilliseconds: 120_000 };
const NEON = "#00ff88";

const puckFeature = (coord: [number, number]): GeoJSON.Feature<GeoJSON.Point> => ({
  type: "Feature",
  properties: {},
  geometry: { type: "Point", coordinates: coord },
});

const applyCamera = (
  map: mapboxgl.Map,
  route: ReplayRoute,
  cam: CameraFrame
) => {
  map.jumpTo({
    center: cam.center,
    zoom: cam.zoom,
    pitch: cam.pitch,
    bearing: cam.bearing,
  });
  map.setPaintProperty("route-progress", "line-trim-offset", [
    cam.progress,
    1,
  ]);
  const puck = map.getSource("puck") as mapboxgl.GeoJSONSource | undefined;
  puck?.setData(puckFeature(sampleAtDistance(route, cam.distance).coord));
};

interface Props {
  route: ReplayRoute;
  timeline: ReplayTimeline;
  mapboxToken: string;
}

// Deterministic Mapbox rendering for Remotion: every camera move is a jumpTo
// derived purely from the current frame, and each frame blocks (delayRender)
// until the map reports 'idle' — i.e. all tiles and terrain are fully loaded —
// before Remotion screenshots it.
export const ReplayMap: React.FC<Props> = ({ route, timeline, mapboxToken }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const styleReadyRef = useRef(false);
  const lastCamKeyRef = useRef<string | null>(null);
  // Renders may start mid-video (frame chunks), so the map must initialize at
  // whatever frame it mounts on, not frame 0.
  const mountFrameRef = useRef(frame);

  useEffect(() => {
    if (!containerRef.current) return;
    const handle = delayRender("mapbox-init", DELAY_OPTS);
    mapboxgl.accessToken = mapboxToken;

    const initCam = cameraAtFrame(
      route,
      timeline,
      width,
      height,
      mountFrameRef.current
    );

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      interactive: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      antialias: true,
      center: initCam.center,
      zoom: initCam.zoom,
      pitch: initCam.pitch,
      bearing: initCam.bearing,
    });
    mapRef.current = map;

    map.on("load", () => {
      // Declutter: drop POI/transit icons, keep roads and place names
      for (const layer of map.getStyle()?.layers ?? []) {
        if (layer.type === "symbol" && /poi|transit/.test(layer.id)) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      map.addSource("dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "dem", exaggeration: 1.3 });

      map.addSource("route", {
        type: "geojson",
        data: route.lineString,
        lineMetrics: true,
      });
      // Dark casing + bright core so the route reads on any imagery
      map.addLayer({
        id: "route-casing",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "rgba(0,0,0,0.55)", "line-width": 9 },
      });
      map.addLayer({
        id: "route-bg",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "rgba(255,255,255,0.75)", "line-width": 5 },
      });
      map.addLayer({
        id: "route-progress",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": NEON,
          "line-width": 6,
          "line-trim-offset": [initCam.progress, 1],
        },
      });

      map.addSource("puck", {
        type: "geojson",
        data: puckFeature(sampleAtDistance(route, initCam.distance).coord),
      });
      map.addLayer({
        id: "puck-halo",
        type: "circle",
        source: "puck",
        paint: {
          "circle-radius": 16,
          "circle-color": "rgba(0,255,136,0.3)",
          "circle-pitch-alignment": "map",
        },
      });
      map.addLayer({
        id: "puck-dot",
        type: "circle",
        source: "puck",
        paint: {
          "circle-radius": 8,
          "circle-color": NEON,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#000000",
          "circle-pitch-alignment": "map",
        },
      });

      lastCamKeyRef.current = JSON.stringify(initCam);
      map.once("idle", () => {
        styleReadyRef.current = true;
        continueRender(handle);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
      styleReadyRef.current = false;
    };
    // Map lives for the whole render; per-frame updates happen below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReadyRef.current) return; // init effect covers the mount frame
    const cam = cameraAtFrame(route, timeline, width, height, frame);
    const key = JSON.stringify(cam);
    if (key === lastCamKeyRef.current) return; // static frame (endcard hold) — no map change, no idle to wait for
    const handle = delayRender(`map-frame-${frame}`, DELAY_OPTS);
    applyCamera(map, route, cam);
    lastCamKeyRef.current = key;
    map.once("idle", () => continueRender(handle));
  }, [frame, route, timeline, width, height]);

  return (
    <AbsoluteFill>
      <div ref={containerRef} style={{ width, height }} />
    </AbsoluteFill>
  );
};
