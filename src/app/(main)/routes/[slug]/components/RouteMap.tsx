"use client";

import dynamic from "next/dynamic";
import MapLoadingPlaceholder from "@/components/map/MapLoadingPlaceholder";

// Dynamic imports with ssr: false — Leaflet accesses `window` which doesn't
// exist during server-side rendering. This ensures these components only
// load in the browser.
const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />,
});

const GpxTrackLayer = dynamic(
  () => import("@/components/map/GpxTrackLayer"),
  { ssr: false },
);

interface RouteMapProps {
  gpxUrl: string;
}

export default function RouteMap({ gpxUrl }: RouteMapProps) {
  return (
    <LeafletMap className="w-full h-full">
      <GpxTrackLayer gpxUrl={gpxUrl} />
    </LeafletMap>
  );
}
