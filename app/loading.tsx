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
        <div>
        <ScaleLoader
            color="#E76F51"
            loading={true}
            cssOverride={override}
            aria-label="Loading...."
            data-testid="loader"
        />
        <span>Зачекайте, будь ласка. Завантаження даних...</span>
        </div>
    );
}
