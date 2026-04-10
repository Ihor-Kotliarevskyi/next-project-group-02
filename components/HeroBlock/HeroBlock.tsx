"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Image from "next/image";

import styles from "./HeroBlock.module.css";

export default function HeroBlock() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    router.push(`/locations?search=${encodeURIComponent(trimmedQuery)}`);
  }, [query, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch],
  );

  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <Image
          src="/images/hero-bg.png"
          alt="Nature"
          fill
          priority
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1>Рідна. Незвідана. Твоя.</h1>
          <h3>Кожен куточок твоєї країни - це історія, яку варто пережити. Україна більша, ніж ти думаєш. Переконайся сам. Знайди ідеальне місце для відпочинку
            серед тисяч перевірених локацій з реальними фото та відгуками.</h3>
          <div className={styles.heroSearch}>
            <input
              type="text"
              placeholder="Введіть назву, тип або регіон..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>Знайти місце</button>
          </div>
        </div>
      </div>
    </section>
  );
}
