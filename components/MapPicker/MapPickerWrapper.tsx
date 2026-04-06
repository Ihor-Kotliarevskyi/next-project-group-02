"use client";

import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 280,
        background: "#f2f5f0",
        borderRadius: 6,
        border: "1px solid rgba(0,0,0,0.15)",
      }}
    />
  ),
});

export default MapPicker;
