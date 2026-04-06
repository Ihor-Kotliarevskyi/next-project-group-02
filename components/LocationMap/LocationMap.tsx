"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import styles from "./LocationMap.module.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

type Props = {
  coordinates?: { lat: number; lon: number };
  locationName: string;
};

export default function LocationMap({ coordinates, locationName }: Props) {
  const hasCoords =
    coordinates && !(coordinates.lat === 0 && coordinates.lon === 0);

  if (!hasCoords) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Розташування</h2>
      <MapContainer
        center={[coordinates.lat, coordinates.lon]}
        zoom={8}
        className={styles.mapContainer}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lon]}>
          <Popup>{locationName}</Popup>
        </Marker>
      </MapContainer>
    </section>
  );
}
