"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import MapLoadingPlaceholder from "./MapLoadingPlaceholder";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />,
});

const GpxTrackLayer = dynamic(() => import("./GpxTrackLayer"), {
  ssr: false,
});

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  gpxUrl: string;
  title?: string;
}

export default function MapModal({
  isOpen,
  onClose,
  gpxUrl,
  title = "Mapa Interactivo",
}: MapModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-foreground text-subheading">{title}</h3>
          <button
            onClick={onClose}
            className="text-faint-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map */}
        <div className="flex-1">
          <LeafletMap className="w-full h-full">
            <GpxTrackLayer gpxUrl={gpxUrl} />
          </LeafletMap>
        </div>
      </div>
    </div>
  );
}
