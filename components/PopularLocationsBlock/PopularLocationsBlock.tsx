"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getLocations, getLocationTypes } from "@/lib/api/clientApi";
import { ScaleLoader } from "react-spinners";
import LocationCard from "@/components/LocationCard/LocationCard";
import type { Location } from "@/types/location";
import styles from "./PopularLocationsBlock.module.css";
import Icon from "@/components/Icon/Icon";
import { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

export default function PopularLocationsBlock() {
  const swiperRef = useRef<SwiperType | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["popularLocations"],
    queryFn: () => getLocations({ page: 1, limit: 12, sortBy: "rate", order: "desc" }),
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
    return [...list]
      .filter((loc) => loc.rate >= 3.5)
      .sort((a, b) => b.rate - a.rate);
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
            <div className={styles.loader}>
              <ScaleLoader color="#E76F51" aria-label="Завантаження" />
            </div>
          ) : isError ? (
            <p className={styles.loader}>Не вдалося завантажити локації.</p>
          ) : (
            <>
              <Swiper
                modules={[Navigation]}
                loop={true}
                className={styles.swiper}
                wrapperClass={styles.swiperInner}
                autoHeight={true}
                slidesPerView={1}
                spaceBetween={24}
                breakpoints={{
                  768: { slidesPerView: 2, spaceBetween: 24 },
                  1440: { slidesPerView: 3, spaceBetween: 24 },
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
              >
                {locations.map((location: Location) => (
                  <SwiperSlide key={location._id} className={styles.slide}>
                    <LocationCard
                      _id={location._id}
                      image={location.image}
                      imagePosition={location.imagePosition}
                      name={location.name}
                      locationType={
                        locationTypeLabels.get(location.locationType) ??
                        location.locationType
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
                  aria-label="Попередня локація"
                >
                  <Icon name="arrow-left" width={16} height={16} aria-hidden={true} />
                </button>

                <button
                  type="button"
                  className={styles.arrowBtn}
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Наступна локація"
                >
                  <Icon name="arrow-left" width={16} height={16} style={{ transform: "scaleX(-1)" }} aria-hidden={true} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
