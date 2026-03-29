"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FeedBackCard } from "@/components/FeedBackCard/FeedBackCard";
import { Feedback } from "@/types/feedBackCard";
import clientApi from "@/lib/api/clientApi";
import styles from "./ReviewsSection.module.css";

const LIMIT = 3;

type Props = {
  locationId: string;
  isAuthenticated?: boolean;
};

export default function ReviewsSection({
  locationId,
  isAuthenticated = false,
}: Props) {
  const [reviews, setReviews] = useState<Feedback[]>([]);
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
    fetchReviews(1);
  }, [fetchReviews]);

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
      router.push(`/locations/${locationId}?modal=auth`);
    } else {
      router.push(`/locations/${locationId}?modal=review`);
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
        <>
          <div className={styles.grid}>
            {reviews.map((review) => (
              <FeedBackCard
                key={review._id}
                userName={review.userName}
                description={review.description}
                rate={review.rate}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.controls}>
              <button
                className={styles.arrowBtn}
                onClick={handlePrev}
                disabled={page <= 1}
                aria-label="Попередня сторінка відгуків"
              >
                ←
              </button>
              <button
                className={styles.arrowBtn}
                onClick={handleNext}
                disabled={page >= totalPages}
                aria-label="Наступна сторінка відгуків"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
