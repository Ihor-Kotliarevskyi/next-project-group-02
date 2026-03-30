import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Owner = {
  _id?: string;
  name?: string;
  avatar?: string;
};

type LocationDetails = {
  _id: string;
  image: string;
  name: string;
  locationType: string;
  region: string;
  rate: number;
  description: string;
  ownerId?: string | Owner;
  feedbacksId?: string[];
};

type PageProps = {
  params: {
    id: string;
  }
};

async function getLocationById(id: string): Promise<LocationDetails | null> {
  const res = await fetch(`${API_URL}/locations/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error("Failed to fetch location");
  }

  const json = await res.json();
  return json.data ?? json;
}

export default async function LocationPage({ params }: PageProps) {
  const { id } = await params;
  const location = await getLocationById(id);

  if (!location) {
    notFound();
  }

  const ownerName =
    typeof location.ownerId === "object" && location.ownerId?.name
      ? location.ownerId.name
      : "Невідомий автор";
  const roundedRate = Math.round(location.rate);
  const clampedRate = Math.max(0, Math.min(5, roundedRate));
  const stars = '★'.repeat(clampedRate) + '☆'.repeat(5 - clampedRate);

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.backLink}>
        Назад до всіх локацій
      </Link>

      <article className={styles.card}>
        <div className={styles.imageWrap}>
          <Image
            src={location.image}
            alt={location.name}
            fill
            priority
            sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 640px"
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.ratingRow}>
            <span>{stars}</span>
            <span>{location.rate}</span>
          </div>

          <div className={styles.meta}>
            <p className={styles.type}>{location.locationType}</p>
            <h1 className={styles.title}>{location.name}</h1>
          </div>

          <div className={styles.details}>
            <p>
              <strong>Регіон:</strong> {location.region}
            </p>
            <p>
              <strong>Тип локації:</strong> {location.locationType}
            </p>
            <p>
              <strong>Автор статті:</strong> {ownerName}
            </p>
          </div>

          <p className={styles.description}>{location.description}</p>
        </div>
      </article>
    </main>
  );
}
