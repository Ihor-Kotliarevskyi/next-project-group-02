"use client";

import { ScaleLoader } from "react-spinners";
import type { CSSProperties } from "react";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#E76F51",
};

export default function Loading() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        minHeight: "50vh",
      }}
    >
      <ScaleLoader
        color="#E76F51"
        loading
        cssOverride={override}
        aria-label="Завантаження"
        data-testid="loader"
      />
      <span>Зачекайте, будь ласка...</span>
    </div>
  );
}
