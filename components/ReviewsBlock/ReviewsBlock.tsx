"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ScaleLoader } from "react-spinners";

import { FeedBackCard } from "@/components/FeedBackCard/FeedBackCard";
import { Feedback } from "@/types/feedBackCard";
import clientApi from "@/lib/api/clientApi";
import styles from "./ReviewsBlock.module.css";
import Icon from "@/components/Icon/Icon";

const MAX_REVIEWS = 9;

async function fetchReviews(): Promise<Feedback[]> {
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
      /* skip failed location feedbacks */
    }
  }

  const unique = Array.from(new Map(collected.map((r) => [r._id, r])).values());

  return unique.sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );
}

export default function ReviewsBlock() {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["latestReviews"],
    queryFn: fetchReviews,
  });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Останні відгуки</h2>
        {isLoading && (
          <div className={styles.loading}>
            <ScaleLoader color="#E76F51" aria-label="Завантаження" />
          </div>
        )}
        {isError && (
          <p className={styles.error}>Не вдалося завантажити відгуки</p>
        )}
        {!isLoading && !isError && reviews.length === 0 && (
          <p className={styles.empty}>Відгуків поки немає</p>
        )}
        {!isLoading && !isError && reviews.length > 0 && (
          <div className={styles.swiperContainer}>
            <Swiper
              modules={[Navigation]}
              slidesPerView={1}
              spaceBetween={16}
              speed={400}
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
                <Icon name="arrow-left" width={16} height={16} aria-hidden={true} />
              </button>
              <button
                className={styles.arrowBtn}
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
                aria-label="Наступний відгук"
              >
                <Icon name="arrow-left" width={16} height={16} style={{ transform: "scaleX(-1)" }} aria-hidden={true} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
