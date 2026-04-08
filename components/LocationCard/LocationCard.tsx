"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./LocationCard.module.css";
import Icon from "@/components/Icon/Icon";
import { Location } from "@/types/location";

const TrashIcon = ({ width = 24, height = 24 }: { width?: number; height?: number }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.75 1A2.75 2.75 0 0 0 6 3.75V4H3.5a.75.75 0 0 0 0 1.5h.616l.74 11.107A2.25 2.25 0 0 0 7.1 18.75h5.8a2.25 2.25 0 0 0 2.245-2.143L15.884 5.5H16.5a.75.75 0 0 0 0-1.5H14v-.25A2.75 2.75 0 0 0 11.25 1h-2.5ZM7.5 4v-.25c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25V4h-5ZM7.25 8a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5A.75.75 0 0 1 7.25 8Zm5.5 0a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5a.75.75 0 0 1 .75-.75Z"
    />
  </svg>
);

type LocationCardProps = Pick<
  Location,
  "_id" | "image" | "name" | "locationType" | "rate"
> & {
  isEditable?: boolean;
  onDelete?: (id: string, name: string) => void;
};

export default function LocationCard({
  _id,
  image,
  name,
  locationType,
  rate,
  isEditable,
  onDelete,
}: LocationCardProps) {
  const roundedRate = Math.round(rate);

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={name}
          loading="eager"
          fill
          sizes="(min-width: 1440px) 389px, (min-width: 768px) calc((100vw - 88px) / 2), 100vw"
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <p className={styles.type}>{locationType}</p>
        <div className={styles.rating} aria-label={`Рейтинг: ${rate} з 5`}>
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={styles.star}>
              {index < roundedRate ? "★" : "☆"}
            </span>
          ))}
        </div>
        <h3 className={styles.title}>{name}</h3>

        <div className={styles.actions}>
          <Link href={`/locations/${_id}`} className={styles.button}>
            Переглянути локацію
          </Link>

          {isEditable && (
            <Link href={`/locations/${_id}/edit`} className={styles.editLink}>
              <Icon name="edit" width={24} height={24} aria-label="Редагувати" />
            </Link>
          )}

          {isEditable && onDelete && (
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => onDelete(_id, name)}
              aria-label="Видалити локацію"
            >
              <TrashIcon width={24} height={24} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
