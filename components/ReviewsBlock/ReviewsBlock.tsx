"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FeedBackCard } from "@/components/FeedBackCard/FeedBackCard";
import { Feedback } from "@/types/feedBackCard";
import clientApi from "@/lib/api/clientApi";
import styles from "./ReviewsBlock.module.css";

export default function ReviewsBlock() {
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Responsive slides count
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1440) setSlidesPerView(3);
      else if (w >= 768) setSlidesPerView(2);
      else setSlidesPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get locations list first
        const locRes = await clientApi.get("/locations", {
          params: { page: 1, limit: 20 },
        });
        const locations: { _id: string }[] = locRes.data?.data ?? [];

        // Collect feedbacks from each location until we have 9
        const collected: Feedback[] = [];
        for (const loc of locations) {
          if (collected.length >= 9) break;
          try {
            const fbRes = await clientApi.get(
              `/locations/${loc._id}/feedbacks`,
              { params: { page: 1, limit: 9 - collected.length } },
            );
            const feedbacks: Feedback[] = fbRes.data?.data ?? [];
            collected.push(...feedbacks);
          } catch {
            // no feedbacks for this location, skip
          }
        }

        setReviews(collected);
      } catch {
        setError("Не вдалося завантажити відгуки");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const maxIndex = Math.max(0, reviews.length - slidesPerView);

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(maxIndex, i + 1));
  }, [maxIndex]);

  // Correct pixel-based translation
  const getTranslateX = (): number => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return 0;
    const gap = 16;
    const totalGaps = slidesPerView - 1;
    const slideWidth = (wrapper.offsetWidth - gap * totalGaps) / slidesPerView;
    return currentIndex * (slideWidth + gap);
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Останні відгуки</h2>
        <div className={styles.controls}>
          <button
            className={styles.arrowBtn}
            onClick={prev}
            disabled={currentIndex === 0}
            aria-label="Попередній відгук"
          >
            ‹
          </button>
          <button
            className={styles.arrowBtn}
            onClick={next}
            disabled={currentIndex >= maxIndex}
            aria-label="Наступний відгук"
          >
            ›
          </button>
        </div>
      </div>

      {loading && <p className={styles.loading}>Завантаження відгуків...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && reviews.length === 0 && (
        <p className={styles.empty}>Відгуків поки немає</p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className={styles.sliderWrapper} ref={wrapperRef}>
          <div
            className={styles.sliderTrack}
            style={{ transform: `translateX(-${getTranslateX()}px)` }}
          >
            {reviews.map((review) => (
              <div key={review._id} className={styles.slide}>
                <FeedBackCard
                  userName={review.userName}
                  description={review.description}
                  rate={review.rate}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
