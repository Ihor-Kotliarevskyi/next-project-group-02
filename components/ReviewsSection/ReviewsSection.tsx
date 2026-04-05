"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import { FeedBackCard } from "@/components/FeedBackCard/FeedBackCard";
import { Feedback } from "@/types/feedBackCard";
import { getFeedbacks } from "@/lib/api/feedbacks";
import styles from "./ReviewsSection.module.css";

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
      new Date(a.createdAt ?? 0).getTime(),
  );
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
    [initialReviews],
  );
  const [reviews, setReviews] = useState<Feedback[]>(initialUniqueReviews);
  const [loadedPages, setLoadedPages] = useState<number[]>(
    initialUniqueReviews.length > 0 ? [1] : [],
  );
  const [totalPages, setTotalPages] = useState<number | null>(
    initialUniqueReviews.length > 0 && initialUniqueReviews.length <= LIMIT
      ? 1
      : null,
  );
  const [, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(initialUniqueReviews.length > 0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const isFetchingRef = useRef(false);
  const loadedPagesRef = useRef<number[]>(
    initialUniqueReviews.length > 0 ? [1] : [],
  );
  const totalPagesRef = useRef<number | null>(
    initialUniqueReviews.length > 0 && initialUniqueReviews.length <= LIMIT
      ? 1
      : null,
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
    [],
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
            sortByNewest(dedupeReviews([...prev, ...nextPageReviews])),
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
    [locationId],
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
    const handler = () => {
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.82129 0.5C7.90691 0.500059 7.98026 0.526325 8.0625 0.608398C8.1448 0.694341 8.1709 0.771445 8.1709 0.857422C8.17081 0.944261 8.14426 1.01826 8.0625 1.10059L1.70117 7.46191H15.1113C15.2328 7.46193 15.3079 7.49726 15.3721 7.56055C15.4342 7.6219 15.4687 7.69362 15.4688 7.81348C15.4688 7.93333 15.4342 8.00505 15.3721 8.06641C15.3079 8.12969 15.2328 8.16502 15.1113 8.16504H1.70117L8.05664 14.5205V14.5195C8.1389 14.602 8.16719 14.6788 8.16797 14.7705V14.7715C8.16849 14.838 8.15383 14.8964 8.1123 14.9561L8.06055 15.0176C7.9806 15.0985 7.90742 15.1248 7.81836 15.124C7.72391 15.1231 7.6456 15.0931 7.5625 15.0107L0.614258 8.0625C0.561096 8.00833 0.5354 7.9662 0.523438 7.9375V7.93652C0.50833 7.90019 0.5 7.8601 0.5 7.8125C0.50003 7.76491 0.508641 7.72576 0.523438 7.69043V7.68945C0.535302 7.66099 0.560769 7.61862 0.614258 7.56445L7.56445 0.614258C7.65485 0.527034 7.73453 0.5 7.82129 0.5Z"
                  fill="currentColor"
                  stroke="currentColor"
                />
              </svg>
            </button>
            <button
              className={styles.arrowBtn}
              onClick={handleNext}
              disabled={isEnd && !hasMorePages}
              aria-label="Наступний відгук"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.14453 0.5C8.21548 0.500668 8.27733 0.517317 8.33887 0.560547L8.40039 0.613281L15.3486 7.56152C15.4018 7.61569 15.4275 7.65782 15.4395 7.68652V7.6875C15.4546 7.72385 15.4629 7.7639 15.4629 7.81152C15.4629 7.85913 15.4543 7.89825 15.4395 7.93359V7.93457C15.4276 7.96304 15.4022 8.00538 15.3486 8.05957L8.39453 15.0078C8.30318 15.0981 8.22456 15.124 8.1416 15.124C8.0609 15.1239 7.98874 15.0994 7.90527 15.0137L7.90039 15.0088L7.84863 14.9482C7.80653 14.8886 7.79201 14.8306 7.79199 14.7656C7.79199 14.701 7.80676 14.6433 7.84863 14.584L7.90039 14.5234L14.2617 8.16211H0.851562C0.729469 8.16207 0.657228 8.12693 0.59668 8.06641H0.595703C0.53483 8.0055 0.500002 7.93257 0.5 7.81055C0.5 7.68853 0.534835 7.6156 0.595703 7.55469H0.59668C0.657231 7.49416 0.729461 7.45902 0.851562 7.45898H14.2617L7.90625 1.10352C7.84494 1.04216 7.81315 0.983763 7.80078 0.918945L7.79492 0.851562C7.79401 0.761613 7.82017 0.688031 7.90039 0.607422L7.90137 0.606445C7.98151 0.525858 8.05487 0.499224 8.14453 0.5Z"
                  fill="currentColor"
                  stroke="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
