"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import { FeedBackCard } from "@/components/FeedBackCard/FeedBackCard";
import { Feedback } from "@/types/feedBackCard";
import clientApi from "@/lib/api/clientApi";
import styles from "./ReviewsBlock.module.css";

const MAX_REVIEWS = 9;

export default function ReviewsBlock() {
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all locations, then collect their latest reviews
      const locRes = await clientApi.get("/locations", {
        params: { page: 1, limit: 20 },
      });
      const locations: { _id: string }[] = locRes.data?.data ?? [];

      const collected: Feedback[] = [];

      for (const loc of locations) {
        if (collected.length >= MAX_REVIEWS) break;
        try {
          const fbRes = await clientApi.get(`/locations/${loc._id}/feedbacks`, {
            params: { page: 1, limit: MAX_REVIEWS - collected.length },
          });
          const feedbacks: Feedback[] = fbRes.data?.data ?? [];
          collected.push(...feedbacks);
        } catch {
          // skip locations with no reviews
        }
      }

      const unique = Array.from(
        new Map(collected.map((r) => [r._id, r])).values(),
      );
      setReviews(unique);
    } catch {
      setError("Не вдалося завантажити відгуки");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Re-fetch when a new review is submitted anywhere in the app
  useEffect(() => {
    const handler = () => fetchReviews();
    window.addEventListener("review-added", handler);
    return () => window.removeEventListener("review-added", handler);
  }, [fetchReviews]);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Останні відгуки</h2>

      {loading && <p className={styles.loading}>Завантаження відгуків...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && reviews.length === 0 && (
        <p className={styles.empty}>Відгуків поки немає</p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={16}
            speed={400}
            breakpoints={{
              704: { slidesPerView: 2, spaceBetween: 24 },
              1312: { slidesPerView: 3, spaceBetween: 24 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id}>
                <FeedBackCard
                  userName={review.userName}
                  description={review.description}
                  rate={review.rate}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.controls}>
            <button
              className={styles.arrowBtn}
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              aria-label="Попередній відгук"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 32 32"
                fill="currentColor"
              >
                <path d="M15.643 1c0.171 0 0.318 0.053 0.482 0.217 0.165 0.172 0.217 0.326 0.217 0.498-0 0.174-0.053 0.322-0.217 0.486l-12.723 12.723h26.82c0.243 0 0.393 0.071 0.522 0.197 0.124 0.123 0.193 0.266 0.193 0.506s-0.069 0.383-0.193 0.506c-0.128 0.127-0.279 0.197-0.522 0.197h-26.82l12.711 12.709c0.165 0.165 0.221 0.319 0.223 0.502v0.002c0.001 0.133-0.028 0.25-0.111 0.369l-0.104 0.123c-0.16 0.162-0.306 0.214-0.484 0.213-0.189-0.002-0.346-0.062-0.512-0.227l-13.896-13.896c-0.106-0.108-0.158-0.193-0.182-0.25v-0.002c-0.030-0.073-0.047-0.153-0.047-0.248s0.017-0.173 0.047-0.244v-0.002c0.024-0.057 0.075-0.142 0.182-0.25l13.9-13.9c0.181-0.174 0.34-0.229 0.514-0.229z" />
              </svg>
            </button>
            <button
              className={styles.arrowBtn}
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              aria-label="Наступний відгук"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 32 32"
                fill="currentColor"
              >
                <path d="M16.289 1c0.142 0.001 0.266 0.035 0.389 0.121l0.123 0.105 13.896 13.896c0.106 0.108 0.158 0.193 0.182 0.25v0.002c0.030 0.073 0.047 0.153 0.047 0.248s-0.017 0.173-0.047 0.244v-0.002c-0.024 0.057-0.075 0.142-0.182 0.25l-13.908 13.896c-0.183 0.181-0.34 0.232-0.506 0.232-0.161-0-0.306-0.049-0.473-0.221l-0.010-0.010-0.104-0.121c-0.084-0.119-0.113-0.235-0.113-0.365s0.030-0.245 0.113-0.363l0.104-0.121 12.723-12.723h-26.82c-0.244-0-0.389-0.070-0.51-0.191h-0.002c-0.122-0.122-0.191-0.268-0.191-0.512s0.070-0.39 0.191-0.512h0.002c0.121-0.121 0.266-0.191 0.51-0.191h26.82l-12.711-12.711c-0.123-0.123-0.186-0.24-0.211-0.369l-0.012-0.135c-0.002-0.18 0.050-0.327 0.211-0.488l0.002-0.002c0.16-0.161 0.307-0.214 0.486-0.213z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
