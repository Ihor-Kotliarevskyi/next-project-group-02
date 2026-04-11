"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ReviewsSection from "@/components/ReviewsSection/ReviewsSection";
import PhotoLightbox from "@/components/PhotoLightbox/PhotoLightbox";
import { Feedback } from "@/types/feedBackCard";
import LocationMapWrapper from "./LocationMapWrapper";
import { ReviewAddedDetail } from "@/types/reviewEvents";
import { locationTypeLabels, regionLabels } from "@/utils/labels";
import Icon from "@/components/Icon/Icon";
import styles from "./page.module.css";

type Owner = {
  _id?: string;
  name?: string;
  avatar?: string;
};

type LocationPhoto = {
  _id: string;
  url: string;
  publicId: string;
};

type LocationDetailsViewModel = {
  _id: string;
  image: string;
  imagePosition?: string;
  name: string;
  locationType: string | { type: string; slug: string };
  region: string;
  rate: number;
  description: string;
  ownerId?: string | Owner;
  feedbacksId?: string[];
  photos?: LocationPhoto[];
  coordinates?: { lat: number; lon: number };
};

type Props = {
  location: LocationDetailsViewModel;
  locationId: string;
  isAuthenticated: boolean;
  initialReviews: Feedback[];
};

function StarIcon({ type }: { type: "full" | "half" | "empty" }) {
  const starPath =
    "M12 2.5L14.9363 8.45047L21.5 9.4042L16.75 14.0336L17.8713 20.5708L12 17.4842L6.12868 20.5708L7.25 14.0336L2.5 9.4042L9.06374 8.45047L12 2.5Z";

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`half-star-${type}`}>
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>
      <path
        d={starPath}
        style={{ fill: "var(--color-star-empty, #F4D9CD)", stroke: "var(--color-star-stroke, #1D241D)" }}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {type === "full" && (
        <path
          d={starPath}
          style={{ fill: "var(--color-star-full, #1D241D)", stroke: "var(--color-star-full, #1D241D)" }}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}
      {type === "half" && (
        <path
          d={starPath}
          style={{ fill: "var(--color-star-full, #1D241D)", stroke: "var(--color-star-full, #1D241D)" }}
          strokeWidth="1.5"
          strokeLinejoin="round"
          clipPath={`url(#half-star-${type})`}
        />
      )}
    </svg>
  );
}

function clampRate(rate: number) {
  return Math.max(0, Math.min(5, rate));
}

function roundToHalf(rate: number) {
  return Math.round(clampRate(rate) * 2) / 2;
}

function formatRate(rate: number) {
  const rounded = Number(rate.toFixed(1));
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export default function LocationDetailsClient({
  location,
  locationId,
  isAuthenticated,
  initialReviews,
}: Props) {
  const initialReviewCount = Math.max(
    location.feedbacksId?.length ?? 0,
    initialReviews.length
  );
  const [averageRate, setAverageRate] = useState(location.rate);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const gallerySwiperRef = useRef<SwiperType | null>(null);

  // All photos: main + additional
  const allPhotos = useMemo(
    () => [location.image, ...(location.photos?.map((p) => p.url) ?? [])],
    [location.image, location.photos]
  );

  const hasMultiplePhotos = allPhotos.length > 1;
  // Additional photos for gallery strip (excluding main cover)
  const galleryPhotos = location.photos ?? [];

  useEffect(() => {
    let reviewCount = initialReviewCount;

    const handleReviewAdded = (event: Event) => {
      const detail = (event as CustomEvent<ReviewAddedDetail | undefined>).detail;
      const newRate = detail?.review?.rate;
      if (typeof newRate !== "number") return;
      setAverageRate((prevAverage) => {
        const nextCount = reviewCount + 1;
        const nextAverage = (prevAverage * reviewCount + newRate) / nextCount;
        reviewCount = nextCount;
        return nextAverage;
      });
    };

    window.addEventListener("review-added", handleReviewAdded);
    return () => window.removeEventListener("review-added", handleReviewAdded);
  }, [initialReviewCount]);

  const ownerName =
    typeof location.ownerId === "object" && location.ownerId?.name
      ? location.ownerId.name
      : "Невідомий автор";
  const ownerId =
    typeof location.ownerId === "object"
      ? location.ownerId?._id
      : location.ownerId;
  const roundedRate = useMemo(() => roundToHalf(averageRate), [averageRate]);
  const router = useRouter();

  return (
    <>
      <article className={styles.card}>
        {/* Back button — col 1, row 1 on desktop */}
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.backBtn}
        >
          <Icon name="arrow-left" width={16} height={16} aria-hidden={true} />
          Назад до локацій
        </button>

        {/* Main photo — col 2, all rows on desktop. Swiper if multiple photos */}
        <div className={styles.imageWrap}>
          {hasMultiplePhotos ? (
            <div className={styles.mainSwiperWrap}>
              <Swiper
                modules={[Navigation]}
                loop={true}
                className={styles.mainSwiper}
                onSwiper={(s) => { mainSwiperRef.current = s; }}
              >
                {allPhotos.map((url, i) => (
                  <SwiperSlide key={i}>
                    <div
                      className={styles.mainSwiperSlide}
                      onClick={() => setLightboxIndex(i)}
                      role="button"
                      tabIndex={0}
                      aria-label="Відкрити фото"
                    >
                      <Image
                        src={url}
                        alt={location.name}
                        fill
                        priority={i === 0}
                        quality={90}
                        sizes="(min-width: 1440px) 760px, (min-width: 768px) calc(100vw - 20px), calc(100vw - 40px)"
                        className={styles.image}
                        style={i === 0 && location.imagePosition ? { objectPosition: location.imagePosition } : undefined}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                className={`${styles.photoNavBtn} ${styles.photoNavPrev}`}
                onClick={() => mainSwiperRef.current?.slidePrev()}
                aria-label="Попереднє фото"
              >
                <Icon name="arrow-left" width={18} height={18} aria-hidden />
              </button>
              <button
                className={`${styles.photoNavBtn} ${styles.photoNavNext}`}
                onClick={() => mainSwiperRef.current?.slideNext()}
                aria-label="Наступне фото"
              >
                <Icon name="arrow-left" width={18} height={18} style={{ transform: "scaleX(-1)" }} aria-hidden />
              </button>
            </div>
          ) : (
            <Image
              src={location.image}
              alt={location.name}
              fill
              priority
              quality={90}
              sizes="(min-width: 1440px) 760px, (min-width: 768px) calc(100vw - 20px), calc(100vw - 40px)"
              className={styles.image}
              onClick={() => setLightboxIndex(0)}
              style={{
                cursor: "pointer",
                ...(location.imagePosition ? { objectPosition: location.imagePosition } : {}),
              }}
            />
          )}
        </div>

        {/* Rating — col 1, row 2 */}
        <div className={styles.content}>
          <div className={styles.ratingRow}>
            <span
              className={styles.stars}
              aria-label={`Рейтинг: ${formatRate(averageRate)} з 5`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  type={
                    roundedRate >= star
                      ? "full"
                      : roundedRate >= star - 0.5
                        ? "half"
                        : "empty"
                  }
                />
              ))}
            </span>
            <span className={styles.ratingDot} aria-hidden="true" />
            <span>{formatRate(averageRate)}</span>
          </div>

          <div className={styles.meta}>
            <h1 className={styles.title}>{location.name}</h1>
          </div>

          <div className={styles.details}>
            <p>
              <strong>Регіон:</strong>{" "}
              {regionLabels[location.region] ?? location.region}
            </p>
            <p>
              <strong>Тип локації:</strong>{" "}
              {locationTypeLabels[location.locationType as string] ??
                location.locationType}
            </p>
            <p>
              <strong>Автор статті:</strong>{" "}
              {ownerId ? (
                <Link href={`/profile/${ownerId}`} className={styles.authorLink}>
                  {ownerName}
                </Link>
              ) : (
                ownerName
              )}
            </p>
          </div>

          {/* Gallery strip — shown on desktop below info, on mobile after photo */}
          {galleryPhotos.length > 0 && (
            <div className={styles.galleryStrip}>
              <Swiper
                modules={[Navigation]}
                slidesPerView={2}
                spaceBetween={8}
                className={styles.gallerySwiper}
                onSwiper={(s) => { gallerySwiperRef.current = s; }}
              >
                {galleryPhotos.map((photo, i) => (
                  <SwiperSlide key={photo._id}>
                    <div
                      className={styles.galleryThumb}
                      onClick={() => setLightboxIndex(i + 1)}
                      role="button"
                      tabIndex={0}
                      aria-label="Відкрити фото"
                    >
                      <Image
                        src={photo.url}
                        alt={location.name}
                        fill
                        className={styles.galleryImg}
                        sizes="160px"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {galleryPhotos.length > 2 && (
                <div className={styles.galleryControls}>
                  <button
                    className={styles.galleryBtn}
                    onClick={() => gallerySwiperRef.current?.slidePrev()}
                    aria-label="Попереднє"
                  >
                    <Icon name="arrow-left" width={14} height={14} aria-hidden />
                  </button>
                  <button
                    className={styles.galleryBtn}
                    onClick={() => gallerySwiperRef.current?.slideNext()}
                    aria-label="Наступне"
                  >
                    <Icon name="arrow-left" width={14} height={14} style={{ transform: "scaleX(-1)" }} aria-hidden />
                  </button>
                </div>
              )}
            </div>
          )}

          <p className={styles.description}>{location.description}</p>
        </div>
      </article>

      <LocationMapWrapper
        coordinates={location.coordinates}
        locationName={location.name}
      />
      <ReviewsSection
        locationId={locationId}
        isAuthenticated={isAuthenticated}
        initialReviews={initialReviews}
      />

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={allPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
