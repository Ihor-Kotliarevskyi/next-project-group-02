"use client";

import { useRef } from "react";
import css from "./FocalPointPicker.module.css";

type Props = {
  src: string;
  value: string; // CSS object-position, e.g. "42% 67%"
  onChange: (value: string) => void;
};

export default function FocalPointPicker({ src, value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [rawX, rawY] = value.split(" ");
  const x = parseFloat(rawX ?? "50");
  const y = parseFloat(rawY ?? "50");

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    pick(e);
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    pick(e);
  };

  const pick = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const xPct = Math.min(100, Math.max(0, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const yPct = Math.min(100, Math.max(0, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    onChange(`${xPct}% ${yPct}%`);
  };

  return (
    <div className={css.wrapper}>
      <p className={css.hint}>
        Натисніть або перетягніть, щоб встановити фокус.
        Рамка показує як фото відображатиметься на сторінці локації.
      </p>

      <div
        ref={containerRef}
        className={css.container}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        style={{ backgroundImage: `url(${src})`, backgroundPosition: value }}
      >
        {/* Light overlay over the whole image */}
        <div className={css.overlay} />

        {/* Detail-page frame (760×580). box-shadow dims the area outside it */}
        <div className={css.detailFrame}>
          <span className={css.frameLabel}>Сторінка локації</span>
        </div>

        {/* Crosshair */}
        <div className={css.crossH} style={{ top: `${y}%` }} aria-hidden="true" />
        <div className={css.crossV} style={{ left: `${x}%` }} aria-hidden="true" />

        {/* Focal point dot */}
        <div
          className={css.dot}
          style={{ left: `${x}%`, top: `${y}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
