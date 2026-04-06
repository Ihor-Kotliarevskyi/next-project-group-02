"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import { FeedBackCard } from "@/components/FeedBackCard/FeedBackCard";
import { Feedback } from "@/types/feedBackCard";
import { ReviewAddedDetail } from "@/types/reviewEvents";
import { getFeedbacks } from "@/lib/api/feedbacks";
import styles from "./ReviewsSection.module.css";
import Icon from "@/components/Icon/Icon";

const LIMIT = 3;

type Props = {
  locationId: string;
  isAuthenticated?: boolean;
  initialReviews?: Feedback[];
};

function dedupeReviews(reviews: Feedback[]): Feedback[] {
  const uniqueReviews = new Map<string, Feedback>();

  reviews.forEach((review) => {
    uniqueReviews.set(review._id, review);
  });

  return Array.from(uniqueReviews.values());
}

function sortByNewest(reviews: Feedback[]): Feedback[] {
  return [...reviews].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
  );
}

function prependReview(reviews: Feedback[], review: Feedback): Feedback[] {
  return sortByNewest(dedupeReviews([review, ...reviews]));
}

function extractPageReviews(payload: unknown): Feedback[] {
  if (Array.isArray(payload)) return dedupeReviews(payload as Feedback[]);

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) {
      return dedupeReviews(record.data as Feedback[]);
    }
  }

  return [];
}

function extractTotalPages(payload: unknown): number | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const pagination = (payload as { pagination?: { totalPages?: number } })
    .pagination;

  return typeof pagination?.totalPages === "number"
    ? pagination.totalPages
    : null;
}

export default function ReviewsSection({
  locationId,
  isAuthenticated = false,
  initialReviews = [],
}: Props) {
  const initialUniqueReviews = useMemo(
    () => sortByNewest(dedupeReviews(initialReviews)),
    [initialReviews]
  );
  const [reviews, setReviews] = useState<Feedback[]>(initialUniqueReviews);
  const [loadedPages, setLoadedPages] = useState<number[]>(
    initialUniqueReviews.length > 0 ? [1] : []
  );
  const [totalPages, setTotalPages] = useState<number | null>(
    initialUniqueReviews.length > 0 && initialUniqueReviews.length <= LIMIT
      ? 1
      : null
  );
  const [, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(initialUniqueReviews.length > 0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const isFetchingRef = useRef(false);
  const loadedPagesRef = useRef<number[]>(
    initialUniqueReviews.length > 0 ? [1] : []
  );
  const totalPagesRef = useRef<number | null>(
    initialUniqueReviews.length > 0 && initialUniqueReviews.length <= LIMIT
      ? 1
      : null
  );
  const router = useRouter();

  const resetWithInitialReviews = useCallback(
    (nextInitialReviews: Feedback[]) => {
      const nextReviews = sortByNewest(dedupeReviews(nextInitialReviews));
      const nextLoadedPages = nextReviews.length > 0 ? [1] : [];
      const nextTotalPages =
        nextReviews.length > 0 && nextReviews.length <= LIMIT ? 1 : null;

      setReviews(nextReviews);
      setLoadedPages(nextLoadedPages);
      setTotalPages(nextTotalPages);
      setError(null);
      setReady(nextReviews.length > 0);
      loadedPagesRef.current = nextLoadedPages;
      totalPagesRef.current = nextTotalPages;

      if (swiperRef.current) {
        swiperRef.current.slideTo(0, 0);
        setIsBeginning(true);
        setIsEnd(swiperRef.current.isEnd);
      }
    },
    []
  );

  const fetchPage = useCallback(
    async (pageNum: number, options?: { replace?: boolean }) => {
      const replace = options?.replace ?? false;

      if (isFetchingRef.current) return;
      if (!replace && loadedPagesRef.current.includes(pageNum)) return;
      if (totalPagesRef.current !== null && pageNum > totalPagesRef.current) {
        return;
      }

      try {
        isFetchingRef.current = true;
        setIsFetching(true);
        setError(null);

        const data = await getFeedbacks(locationId, pageNum);
        const nextPageReviews = extractPageReviews(data);
        const nextTotalPages =
          extractTotalPages(data) ??
          (nextPageReviews.length < LIMIT ? pageNum : totalPagesRef.current);

        setTotalPages(nextTotalPages);
        totalPagesRef.current = nextTotalPages;

        if (replace) {
          const dedupedPage = sortByNewest(nextPageReviews);
          setReviews(dedupedPage);
          setLoadedPages([pageNum]);
          loadedPagesRef.current = [pageNum];
        } else {
          setReviews((prev) =>
            sortByNewest(dedupeReviews([...prev, ...nextPageReviews]))
          );
          setLoadedPages((prev) => {
            if (prev.includes(pageNum)) return prev;

            const nextLoadedPages = [...prev, pageNum].sort((a, b) => a - b);
            loadedPagesRef.current = nextLoadedPages;
            return nextLoadedPages;
          });
        }
      } catch {
        setError("Не вдалося завантажити відгуки");
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
        setReady(true);
      }
    },
    [locationId]
  );

  const refreshReviews = useCallback(async () => {
    await fetchPage(1, { replace: true });

    setTimeout(() => {
      swiperRef.current?.slideTo(0, 300);
    }, 50);
  }, [fetchPage]);

  useEffect(() => {
    resetWithInitialReviews(initialUniqueReviews);

    if (initialUniqueReviews.length === 0) {
      void fetchPage(1);
    }
  }, [locationId, initialUniqueReviews, resetWithInitialReviews, fetchPage]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ReviewAddedDetail | undefined>).detail;
      const newReview = detail?.review;

      if (newReview?._id) {
        setReviews((prev) => prependReview(prev, newReview));
        setError(null);
        setReady(true);
        setTotalPages((prev) => {
          const nextTotalPages = prev === 1 ? null : prev;
          totalPagesRef.current = nextTotalPages;
          return nextTotalPages;
        });

        if (!loadedPagesRef.current.includes(1)) {
          loadedPagesRef.current = [1];
          setLoadedPages([1]);
        }

        requestAnimationFrame(() => {
          swiperRef.current?.slideTo(0, 300);
        });
        return;
      }

      void refreshReviews();
    };

    window.addEventListener("review-added", handler);
    return () => window.removeEventListener("review-added", handler);
  }, [refreshReviews]);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = async () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (!swiper.isEnd) {
      swiper.slideNext();
      return;
    }

    const currentMaxLoadedPage =
      loadedPagesRef.current.length > 0
        ? Math.max(...loadedPagesRef.current)
        : 0;
    const nextPage = currentMaxLoadedPage + 1;
    const hasMorePages =
      totalPagesRef.current === null || nextPage <= totalPagesRef.current;

    if (hasMorePages) {
      await fetchPage(nextPage);
      setTimeout(() => swiper.slideNext(), 50);
    }
  };

  const handleAddReview = () => {
    if (!isAuthenticated) {
      router.push(`/auth-prompt?redirect=/locations/${locationId}`);
    } else {
      router.push(`/add-review?locationId=${locationId}`);
    }
  };

  const currentMaxLoadedPage =
    loadedPages.length > 0 ? Math.max(...loadedPages) : 0;
  const hasMorePages = totalPages === null || currentMaxLoadedPage < totalPages;

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
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={16}
            speed={400}
            observer={true}
            observeParents={true}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 24 },
              1440: { slidesPerView: 3, spaceBetween: 24 },
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
              <Icon name="arrow-left" width={16} height={16} aria-hidden={true} />
            </button>
            <button
              className={styles.arrowBtn}
              onClick={handleNext}
              disabled={isEnd && !hasMorePages}
              aria-label="Наступний відгук"
            >
              <Icon name="arrow-left" width={16} height={16} style={{ transform: "scaleX(-1)" }} aria-hidden={true} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
