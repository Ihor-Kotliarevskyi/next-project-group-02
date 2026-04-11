"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Icon from "@/components/Icon/Icon";
import css from "./PhotoLightbox.module.css";

type Props = {
  photos: string[];
  initialIndex: number;
  onClose: () => void;
};

export default function PhotoLightbox({ photos, initialIndex, onClose }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
      if (e.key === "ArrowRight") swiperRef.current?.slideNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className={css.overlay} onClick={onClose} role="dialog" aria-modal>
      <div className={css.inner} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose} aria-label="Закрити">
          <Icon name="x" width={24} height={24} aria-hidden />
        </button>

        <Swiper
          modules={[Navigation]}
          initialSlide={initialIndex}
          loop={photos.length > 1}
          className={css.swiper}
          onSwiper={(s) => { swiperRef.current = s; }}
          onRealIndexChange={(s) => setCurrentIndex(s.realIndex)}
        >
          {photos.map((url, i) => (
            <SwiperSlide key={i} className={css.slide}>
              <div className={css.imgWrap}>
                <Image
                  src={url}
                  alt=""
                  fill
                  className={css.img}
                  sizes="100vw"
                  priority={i === initialIndex}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {photos.length > 1 && (
          <>
            <button
              className={`${css.navBtn} ${css.prevBtn}`}
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Попереднє фото"
            >
              <Icon name="arrow-left" width={20} height={20} aria-hidden />
            </button>
            <button
              className={`${css.navBtn} ${css.nextBtn}`}
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Наступне фото"
            >
              <Icon name="arrow-left" width={20} height={20} style={{ transform: "scaleX(-1)" }} aria-hidden />
            </button>
          </>
        )}

        {photos.length > 1 && (
          <p className={css.counter}>
            {currentIndex + 1} / {photos.length}
          </p>
        )}
      </div>
    </div>
  );
}
