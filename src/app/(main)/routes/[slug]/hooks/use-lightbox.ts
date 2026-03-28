"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Photo } from "@/types";

export const ZOOM_LEVELS = [1, 1.5, 2, 3, 4];

export function useLightbox(photos: Photo[]) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomIdx, setZoomIdx] = useState(0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const zoom = ZOOM_LEVELS[zoomIdx];
  const currentPhoto: Photo | null =
    lightboxIndex !== null ? (photos[lightboxIndex] ?? null) : null;

  const resetView = useCallback(() => {
    setZoomIdx(0);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const open = useCallback(
    (index: number) => {
      setLightboxIndex(index);
      resetView();
    },
    [resetView],
  );

  const close = useCallback(() => {
    setLightboxIndex(null);
    resetView();
  }, [resetView]);

  const goTo = useCallback(
    (index: number) => {
      const total = photos.length;
      if (total === 0) return;
      setLightboxIndex(((index % total) + total) % total);
      resetView();
    },
    [photos.length, resetView],
  );

  const zoomIn = useCallback(() => {
    setZoomIdx((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const zoomOut = useCallback(() => {
    setZoomIdx((prev) => {
      const next = Math.max(prev - 1, 0);
      if (next === 0) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!lightboxRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      lightboxRef.current.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(lightboxIndex - 1);
      else if (e.key === "ArrowRight") goTo(lightboxIndex + 1);
      else if (e.key === "Escape") close();
      else if (e.key === "+" || e.key === "=") zoomIn();
      else if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, goTo, close, zoomIn, zoomOut]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    dragRef.current = {
      sx: e.clientX,
      sy: e.clientY,
      ox: panOffset.x,
      oy: panOffset.y,
    };
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    setPanOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.sx),
      y: dragRef.current.oy + (e.clientY - dragRef.current.sy),
    });
  };

  const onMouseUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  return {
    currentPhoto,
    lightboxIndex,
    zoom,
    zoomIdx,
    panOffset,
    isDragging,
    isFullscreen,
    lightboxRef,
    open,
    close,
    goTo,
    zoomIn,
    zoomOut,
    toggleFullscreen,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}
