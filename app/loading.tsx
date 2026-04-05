"use client";

import { ScaleLoader } from "react-spinners";
import type { CSSProperties } from "react";
import styles from "./loading.module.css";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#E76F51",
};

export default function Loading() {
  return (
    <div className={styles.wrapper}>
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
