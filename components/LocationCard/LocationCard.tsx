<<<<<<< HEAD
=======
"use client";

>>>>>>> origin/main
import Link from "next/link";
import Image from "next/image";
import styles from "./LocationCard.module.css";
import { Location } from "@/types/location";


type LocationCardProps = Pick<
  Location,
  "_id" | "image" | "name" | "locationType" | "rate"
>;

export default function LocationCard({
  _id,
  image,
  name,
  locationType,
  rate,
}: LocationCardProps) {
  const roundedRate = Math.round(rate);

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={name}
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
        <Link href={`/locations/${_id}`} className={styles.button}>
          Переглянути локацію
        </Link>
      </div>
    </article>
  );
}
