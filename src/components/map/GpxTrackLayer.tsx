"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface GpxTrackLayerProps {
  gpxUrl: string;
}

function createPinIcon(color: string) {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.268 21.732 0 14 0z"
            fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="#fff"/>
    </svg>`,
    className: "",
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    tooltipAnchor: [0, -38],
  });
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
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(gpxUrl)
      .then((res) => res.text())
      .then((gpxText) => {
        if (cancelled) return;

        const coords = parseGpxCoordinates(gpxText);
        if (coords.length === 0) return;

        const polyline = L.polyline(coords, {
          color: "#38bdf8",
          weight: 4,
          opacity: 0.9,
          lineCap: "round",
        }).addTo(map);

        const startMarker = L.marker(coords[0], {
          icon: createPinIcon("#22c55e"),
        })
          .bindTooltip("Inicio", { direction: "top" })
          .addTo(map);

        const endMarker = L.marker(coords[coords.length - 1], {
          icon: createPinIcon("#ef4444"),
        })
          .bindTooltip("Fin", { direction: "top" })
          .addTo(map);

        map.fitBounds(polyline.getBounds(), { padding: [20, 20] });

        cleanupRef.current = () => {
          map.removeLayer(polyline);
          map.removeLayer(startMarker);
          map.removeLayer(endMarker);
        };
      });

    return () => {
      cancelled = true;
      cleanupRef.current?.();
    };
  }, [map, gpxUrl]);

  return null;
}
