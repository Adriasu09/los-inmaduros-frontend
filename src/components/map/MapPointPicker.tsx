"use client";

import { useCallback } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import LeafletMap from "./LeafletMap";

// Custom marker icon (default Leaflet icon has broken paths in Next.js)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapClickHandlerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function MapClickHandler({ onLocationSelect }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapPointPickerProps {
  markerPosition?: [number, number] | null;
  onLocationSelect: (lat: number, lng: number) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
  interactive?: boolean;
}

export default function MapPointPicker({
  markerPosition,
  onLocationSelect,
  center,
  zoom = 14,
  className = "h-50 w-full rounded-lg overflow-hidden",
  interactive = true,
}: MapPointPickerProps) {
  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      if (interactive) {
        onLocationSelect(lat, lng);
      }
    },
    [interactive, onLocationSelect],
  );

  const mapCenter = markerPosition || center || [40.4168, -3.7038];

  return (
    <div className={className}>
      <LeafletMap
        center={mapCenter as [number, number]}
        zoom={zoom}
      >
        {interactive && (
          <MapClickHandler onLocationSelect={handleLocationSelect} />
        )}
        {markerPosition && (
          <Marker position={markerPosition} icon={markerIcon} />
        )}
      </LeafletMap>
    </div>
  );
}
