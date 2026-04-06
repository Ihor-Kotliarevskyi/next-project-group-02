"use client";

import L from "leaflet";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect } from "react";
import styles from "./MapPicker.module.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const UKRAINE_CENTER: [number, number] = [49.0, 32.0];

type Props = {
  lat: number;
  lon: number;
  onChange: (lat: number, lon: number) => void;
};

function ClickHandler({
  onChange,
}: {
  onChange: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapController({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target, 13);
    }
  }, [target, map]);
  return null;
}

export default function MapPicker({ lat, lon, onChange }: Props) {
  const hasCoords = lat !== 0 || lon !== 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTarget, setSearchTarget] = useState<[number, number] | null>(
    null,
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
      );
      const data = await res.json();
      if (data.length > 0) {
        const latNum = parseFloat(data[0].lat);
        const lonNum = parseFloat(data[0].lon);
        onChange(latNum, lonNum);
        setSearchTarget([latNum, lonNum]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchRow}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Введіть назву місця..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={styles.searchButton}
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? <span className={styles.loader} /> : "Пошук"}
        </button>
      </div>
      <MapContainer
        center={hasCoords ? [lat, lon] : UKRAINE_CENTER}
        zoom={8}
        className={styles.mapContainer}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <ClickHandler onChange={onChange} />
        <MapController target={searchTarget} />
        {hasCoords && <Marker position={[lat, lon]} />}
      </MapContainer>
    </div>
  );
}
