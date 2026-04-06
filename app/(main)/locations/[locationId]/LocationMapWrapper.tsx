"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(
  () => import("@/components/LocationMap/LocationMap"),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: 320, background: "#f2f5f0", borderRadius: 20 }} />
    ),
  }
);

export default LocationMap;
