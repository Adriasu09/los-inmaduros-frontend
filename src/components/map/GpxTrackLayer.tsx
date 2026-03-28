"use client";

import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface GpxTrackLayerProps {
  gpxUrl: string;
}

// Parse GPX XML and extract track coordinates
function parseGpxCoordinates(gpxText: string): [number, number][] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxText, "application/xml");
  const trackPoints = doc.querySelectorAll("trkpt");

  const coords: [number, number][] = [];
  trackPoints.forEach((pt) => {
    const lat = parseFloat(pt.getAttribute("lat") ?? "0");
    const lon = parseFloat(pt.getAttribute("lon") ?? "0");
    if (lat && lon) coords.push([lat, lon]);
  });

  return coords;
}

export default function GpxTrackLayer({ gpxUrl }: GpxTrackLayerProps) {
  const map = useMap();
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(gpxUrl)
      .then((res) => res.text())
      .then((gpxText) => {
        if (cancelled) return;

        const coords = parseGpxCoordinates(gpxText);
        if (coords.length === 0) {
          setError(true);
          return;
        }

        const polyline = L.polyline(coords, {
          color: "#38bdf8",
          weight: 4,
          opacity: 0.9,
          lineCap: "round",
        }).addTo(map);

        // Start marker (green) and end marker (red)
        const startMarker = L.circleMarker(coords[0], {
          radius: 7,
          color: "#fff",
          weight: 2,
          fillColor: "#22c55e",
          fillOpacity: 1,
        })
          .bindTooltip("Inicio", { direction: "top", offset: [0, -8] })
          .addTo(map);

        const endMarker = L.circleMarker(coords[coords.length - 1], {
          radius: 7,
          color: "#fff",
          weight: 2,
          fillColor: "#ef4444",
          fillOpacity: 1,
        })
          .bindTooltip("Fin", { direction: "top", offset: [0, -8] })
          .addTo(map);

        map.fitBounds(polyline.getBounds(), { padding: [20, 20] });

        cleanupRef = () => {
          map.removeLayer(polyline);
          map.removeLayer(startMarker);
          map.removeLayer(endMarker);
        };
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    let cleanupRef: (() => void) | null = null;

    return () => {
      cancelled = true;
      cleanupRef?.();
    };
  }, [map, gpxUrl]);

  if (error) {
    return null;
  }

  return null;
}
