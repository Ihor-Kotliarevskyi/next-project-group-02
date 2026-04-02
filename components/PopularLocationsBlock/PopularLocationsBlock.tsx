"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getLocations, getLocationTypes } from "@/lib/api/clientApi";
import LocationCard from "@/components/LocationCard/LocationCard";
import type { Location } from "@/types/location";
import styles from "./PopularLocationsBlock.module.css";
import { useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

export default function PopularLocationsBlock() {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["popularLocations"],
    queryFn: () => getLocations({ page: 1, limit: 6 }),
  });

  const { data: locationTypes = [] } = useQuery<
    { slug: string; type: string }[]
  >({
    queryKey: ["locationTypes"],
    queryFn: getLocationTypes,
  });

  const locationTypeLabels = useMemo(
    () => new Map(locationTypes.map((lt) => [lt.slug, lt.type])),
    [locationTypes],
  );

  const locations = useMemo(() => {
    const list = (data?.locations as Location[]) ?? [];
    return [...list].sort((a, b) => b.rate - a.rate);
  }, [data]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <h2 className={styles.title}>Популярні локації</h2>

          <Link href="/locations" className={styles.ctaBtn}>
            Всі локації
          </Link>
        </div>

        <div className={styles.swiperWrap}>
          {isLoading ? (
            <p className={styles.loader}>Завантаження...</p>
          ) : (
            <>
              <Swiper
                modules={[Navigation]}
                slidesPerView={1}
                spaceBetween={24}
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
                {locations.map((location: Location) => (
                  <SwiperSlide key={location._id}>
                    <LocationCard
                      _id={location._id}
                      image={location.image}
                      name={location.name}
                      locationType={
                        locationTypeLabels.get(location.locationType) ??
                        "Тип не вказано"
                      }
                      rate={location.rate}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.arrowBtn}
                  onClick={() => swiperRef.current?.slidePrev()}
                  disabled={isBeginning}
                  aria-label="Попередня локація"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.9855 8.6525L8.41825 14.1667C8.5885 14.3371 8.8005 14.4195 9.05425 14.4141C9.308 14.4087 9.52 14.3214 9.69025 14.1521C9.85958 13.982 9.94425 13.7723 9.94425 13.523C9.94425 13.2737 9.85958 13.064 9.69025 12.8939L5.714 8.861H12.3823C12.6221 8.861 12.8233 8.78017 12.986 8.6185C13.1487 8.45683 13.23 8.25708 13.23 8.01925C13.23 7.78142 13.1487 7.58167 12.986 7.42C12.8233 7.25833 12.6221 7.1775 12.3823 7.1775H5.714L9.69025 3.14458C9.86042 2.97442 9.94508 2.76296 9.94425 2.51021C9.94342 2.25746 9.85875 2.046 9.69025 1.87583C9.52 1.7065 9.30754 1.62183 9.05288 1.62183C8.79821 1.62183 8.58575 1.7065 8.4155 1.87583L2.9855 7.39C2.89467 7.48083 2.83017 7.57417 2.792 7.67C2.75383 7.76583 2.73475 7.88225 2.73475 8.01925C2.73475 8.15625 2.75383 8.27267 2.792 8.3685C2.83017 8.46433 2.89467 8.55833 2.9855 8.6525Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className={styles.arrowBtn}
                  onClick={() => swiperRef.current?.slideNext()}
                  disabled={isEnd}
                  aria-label="Наступна локація"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    style={{ transform: "scaleX(-1)" }}
                  >
                    <path
                      d="M2.9855 8.6525L8.41825 14.1667C8.5885 14.3371 8.8005 14.4195 9.05425 14.4141C9.308 14.4087 9.52 14.3214 9.69025 14.1521C9.85958 13.982 9.94425 13.7723 9.94425 13.523C9.94425 13.2737 9.85958 13.064 9.69025 12.8939L5.714 8.861H12.3823C12.6221 8.861 12.8233 8.78017 12.986 8.6185C13.1487 8.45683 13.23 8.25708 13.23 8.01925C13.23 7.78142 13.1487 7.58167 12.986 7.42C12.8233 7.25833 12.6221 7.1775 12.3823 7.1775H5.714L9.69025 3.14458C9.86042 2.97442 9.94508 2.76296 9.94425 2.51021C9.94342 2.25746 9.85875 2.046 9.69025 1.87583C9.52 1.7065 9.30754 1.62183 9.05288 1.62183C8.79821 1.62183 8.58575 1.7065 8.4155 1.87583L2.9855 7.39C2.89467 7.48083 2.83017 7.57417 2.792 7.67C2.75383 7.76583 2.73475 7.88225 2.73475 8.01925C2.73475 8.15625 2.75383 8.27267 2.792 8.3685C2.83017 8.46433 2.89467 8.55833 2.9855 8.6525Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
