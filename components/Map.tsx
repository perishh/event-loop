"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";

export type LatLng = [number, number];

interface MapProps {
  initialPosition?: LatLng;
  initialZoom?: number;
  onClick?: (location: LatLng) => void;
  marker?: LatLng | undefined;
  onMarkerClick?: () => void;
  className?: string;
}

const DEFAULT_CENTER: LatLng = [37.9756, 23.7347]; // Athens

export default function Map({
  initialPosition = DEFAULT_CENTER,
  initialZoom = 13,
  onClick,
  marker: markerCoords,
  onMarkerClick,
  className,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!markerCoords || !mapReady || !mapRef.current) return;

    const marker = new maplibregl.Marker({ color: "#d97706" }).setLngLat([
      markerCoords[1],
      markerCoords[0],
    ]);

    marker.addTo(mapRef.current);

    const callback = (e: PointerEvent) => {
      e.stopPropagation();
      onMarkerClick?.();
    };

    if (onMarkerClick) {
      marker.getElement().addEventListener("click", callback);
    }

    return () => {
      marker.remove();
      if (onMarkerClick) {
        marker.getElement().removeEventListener("click", callback);
      }
    };
  }, [markerCoords, mapReady, onMarkerClick]);

  useEffect(() => {
    if (!onClick || !mapReady || !mapRef.current) return;

    const map = mapRef.current;

    const handleClick = (event: maplibregl.MapMouseEvent) => {
      const { lat, lng } = event.lngLat;
      onClick([lat, lng]);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [onClick, mapReady]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [initialPosition[1], initialPosition[0]],
      zoom: initialZoom,
      attributionControl: { compact: true },
    });

    mapRef.current = map;

    map.on("load", () => {
      setMapReady(true);
    });

    return () => {
      setMapReady(false);
      map.remove();
      mapRef.current = null;
    };
  }, [initialPosition, initialZoom]);

  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-90 rounded-3xl border border-violet-100 overflow-hidden shadow-sm ${className ?? ""}`}
    />
  );
}
