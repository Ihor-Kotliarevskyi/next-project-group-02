"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getLocations, getLocationTypes } from "@/lib/api/clientApi";
import LocationCard from "@/components/LocationCard/LocationCard";
import type { Location } from "@/types/location";
import styles from "./PopularLocationsBlock.module.css";
import { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

export default function PopularLocationsBlock() {
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
                loop={true}
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
                  <SwiperSlide key={location._id}>
                    <LocationCard
                      _id={location._id}
                      image={location.image}
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
                  type="button"
                  className={styles.arrowBtn}
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Наступна локація"
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
