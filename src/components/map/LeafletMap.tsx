"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  children?: React.ReactNode;
}

// Default center: Madrid (where the skating routes are)
const DEFAULT_CENTER: [number, number] = [40.4168, -3.7038];
const DEFAULT_ZOOM = 13;

export default function LeafletMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = "",
  children,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
