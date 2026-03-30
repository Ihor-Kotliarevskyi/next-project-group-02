"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchReviews = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await clientApi.get(
          `/locations/${locationId}/feedbacks`,
          { params: { page: pageNum, limit: LIMIT } },
        );
        setReviews(data.data || data);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages ?? 1);
        }
      } catch {
        setError("Не вдалося завантажити відгуки");
      } finally {
        setLoading(false);
      }
    },
    [locationId],
  );

  useEffect(() => {
    // Only fetch if initialReviews were not provided (length 0)
    // or if we need to ensure we have the pagination info on first mount
    if (initialReviews.length === 0) {
      fetchReviews(1);
    }
  }, [fetchReviews, initialReviews.length]);

  const handlePrev = () => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    fetchReviews(newPage);
  };

  const handleNext = () => {
    const newPage = Math.min(totalPages, page + 1);
    setPage(newPage);
    fetchReviews(newPage);
  };

  const handleAddReview = () => {
    if (!isAuthenticated) {
      router.push('/auth-prompt');
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

      {loading && <p className={styles.loading}>Завантаження відгуків...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && reviews.length === 0 && (
        <p className={styles.empty}>Відгуків поки немає. Будьте першим!</p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: `.${styles.prevBtn}`,
              nextEl: `.${styles.nextBtn}`,
            }}
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={{
              704: { slidesPerView: 2, spaceBetween: 24 },
              1312: { slidesPerView: 3, spaceBetween: 24 },
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

          {totalPages > 1 && (
            <div className={styles.controls}>
              <button
                className={`${styles.arrowBtn} ${styles.prevBtn}`}
                onClick={handlePrev}
                disabled={page <= 1}
                aria-label="Попередня сторінка відгуків"
              >
                ←
              </button>
              <button
                className={`${styles.arrowBtn} ${styles.nextBtn}`}
                onClick={handleNext}
                disabled={page >= totalPages}
                aria-label="Наступна сторінка відгуків"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
