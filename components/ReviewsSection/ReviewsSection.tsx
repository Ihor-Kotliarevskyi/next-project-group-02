"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import { FeedBackCard } from "@/components/FeedBackCard/FeedBackCard";
import { Feedback } from "@/types/feedBackCard";
import clientApi from "@/lib/api/clientApi";
import styles from "./ReviewsSection.module.css";

const LIMIT = 3;

type Props = {
  locationId: string;
  isAuthenticated?: boolean;
  initialReviews?: Feedback[];
};

export default function ReviewsSection({
  locationId,
  isAuthenticated = false,
  initialReviews = [],
}: Props) {
  const [reviews, setReviews] = useState<Feedback[]>(initialReviews);
  const [loadedPages, setLoadedPages] = useState<number[]>([1]);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(initialReviews.length > 0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const router = useRouter();

  // Fetch a specific page and append to the flat reviews array
  const fetchPage = useCallback(
    async (pageNum: number) => {
      if (isFetching) return;
      try {
        setIsFetching(true);
        setError(null);
        const { data } = await clientApi.get(
          `/locations/${locationId}/feedbacks`,
          { params: { page: pageNum, limit: LIMIT } },
        );
        const newReviews: Feedback[] = data.data || data;
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages ?? 1);
        }
        setReviews((prev) => {
          // Deduplicate by _id before appending
          const existingIds = new Set(prev.map((r) => r._id));
          const unique = newReviews.filter((r) => !existingIds.has(r._id));
          return [...prev, ...unique];
        });
        setLoadedPages((prev) => [...prev, pageNum]);
      } catch {
        setError("Не вдалося завантажити відгуки");
      } finally {
        setIsFetching(false);
        setReady(true);
      }
    },
    [locationId, isFetching],
  );

  // Full refresh — called after submitting a new review
  const refreshReviews = useCallback(async () => {
    try {
      setError(null);
      const { data } = await clientApi.get(
        `/locations/${locationId}/feedbacks`,
        { params: { page: 1, limit: LIMIT } },
      );
      const fresh: Feedback[] = data.data || data;
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages ?? 1);
      }
      setReviews(fresh);
      setLoadedPages([1]);
      // Slide back to the beginning so the new review is visible
      setTimeout(() => {
        swiperRef.current?.slideTo(0, 300);
      }, 50);
    } catch {
      // silently fail — stale data is still shown
    }
  }, [locationId]);

  // Initial load (only if no SSR initialReviews were provided)
  useEffect(() => {
    if (initialReviews.length === 0) {
      fetchPage(1);
    } else {
      // Still need totalPages from the server
      clientApi
        .get(`/locations/${locationId}/feedbacks`, {
          params: { page: 1, limit: LIMIT },
        })
        .then(({ data }) => {
          if (data.pagination) {
            setTotalPages(data.pagination.totalPages ?? 1);
          }
          // Merge SSR data with fresh data to catch any new reviews
          const fresh: Feedback[] = data.data || data;
          setReviews(fresh);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  // Listen for a custom event fired by the add-review page on success
  useEffect(() => {
    const handler = () => refreshReviews();
    window.addEventListener("review-added", handler);
    return () => window.removeEventListener("review-added", handler);
  }, [refreshReviews]);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = async () => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    // If not yet at the last slide, just slide forward
    if (!swiper.isEnd) {
      swiper.slideNext();
      return;
    }

    // At the end of loaded slides — check if there are more pages to fetch
    const nextPage = loadedPages.length + 1;
    if (nextPage <= totalPages) {
      await fetchPage(nextPage);
      // After state update + re-render, slide to the new slide
      setTimeout(() => swiper.slideNext(), 50);
    }
  };

  const handleAddReview = () => {
    if (!isAuthenticated) {
      router.push("/auth-prompt");
    } else {
      router.push(`/add-review?locationId=${locationId}`);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Відгуки</h2>
        <button className={styles.addButton} onClick={handleAddReview}>
          Залишити відгук
        </button>
      </div>

      {!ready && <p className={styles.loading}>Завантаження відгуків...</p>}
      {ready && error && <p className={styles.error}>{error}</p>}
      {ready && !error && reviews.length === 0 && (
        <p className={styles.empty}>Відгуків поки немає. Будьте першим!</p>
      )}

      {ready && !error && reviews.length > 0 && (
        <div className={styles.swiperContainer}>
          <Swiper
            // No key={page} — we never remount, slides animate smoothly
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={16}
            speed={400} // smooth 400ms CSS transition
            observer={true}
            observeParents={true}
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
                  locationType={review.locationType}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.controls}>
            <button
              className={styles.arrowBtn}
              onClick={handlePrev}
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
              onClick={handleNext}
              disabled={isEnd && loadedPages.length >= totalPages}
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
