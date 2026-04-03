import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMeServer } from "@/lib/api/serverApi";
import styles from "./page.module.css";
import ReviewsSection from "@/components/ReviewsSection/ReviewsSection";
import { Feedback } from "@/types/feedBackCard";
import { api } from "@/lib/api/api";
import { locationTypeLabels, regionLabels } from "@/utils/labels";

type Owner = {
  _id?: string;
  name?: string;
  avatar?: string;
};

type LocationDetails = {
  _id: string;
  image: string;
  name: string;
  locationType: string | { type: string; slug: string };  
  region: string;
  rate: number;
  description: string;
  ownerId?: string | Owner;
  feedbacksId?: string[];
};
type PageProps = {
  params: Promise<{ locationId: string }>;
};

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2.5L14.9363 8.45047L21.5 9.4042L16.75 14.0336L17.8713 20.5708L12 17.4842L6.12868 20.5708L7.25 14.0336L2.5 9.4042L9.06374 8.45047L12 2.5Z"
        fill={filled ? "#1D241D" : "#F4D9CD"}
        stroke="#1D241D"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function normalizeFeedbacks(payload: unknown): Feedback[] {
  if (Array.isArray(payload)) return payload as Feedback[];

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as Feedback[];
    if (Array.isArray(record.feedbacks)) return record.feedbacks as Feedback[];
    if (Array.isArray(record.items)) return record.items as Feedback[];
  }

  return [];
}

function normalizeFeedback(payload: unknown): Feedback | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const candidate =
    (record.data as Feedback | undefined) ??
    (record.feedback as Feedback | undefined) ??
    (record.item as Feedback | undefined) ??
    (payload as Feedback);

  return candidate && typeof candidate === "object" && "_id" in candidate
    ? candidate
    : null;
}

async function getLocationById(id: string): Promise<LocationDetails | null> {
  try {
    const { data } = await api.get<LocationDetails>(`/locations/${id}`);
    return data;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return null;
    }
    throw error;
  }
}

async function getLocationFeedbacks(id: string, feedbackIds: string[] = []): Promise<Feedback[]> {
  try {
    const { data } = await api.get(`/feedbacks/${id}`);
    const reviews = normalizeFeedbacks(data);

    if (reviews.length > 0 || feedbackIds.length === 0) {
      return reviews;
    }

    const fallbackFeedbacks = await Promise.all(
      feedbackIds.map(async (feedbackId) => {
        try {
          const { data: feedbackData } = await api.get(`/feedbacks/${feedbackId}`);
          return normalizeFeedback(feedbackData);
        } catch {
          return null;
        }
      })
    );

    return fallbackFeedbacks.filter((review): review is Feedback => review !== null);
  } catch {
    return [];
  }
}

async function getIsAuthorized(): Promise<boolean> {
  try {
    await getMeServer();
    return true;
  } catch {
    return false;
  }
}
export default async function LocationPage({ params }: PageProps) {
  const { locationId } = await params;
  const [location, isAuthorized] = await Promise.all([
    getLocationById(locationId),
    getIsAuthorized(),
  ]);

  if (!location) {
    notFound();
  }

  const initialReviews = await getLocationFeedbacks(locationId, location.feedbacksId ?? []);
  const ownerName =
    typeof location.ownerId === "object" && location.ownerId?.name
      ? location.ownerId.name
      : "Невідомий автор";
  const ownerId =
    typeof location.ownerId === "object"
      ? location.ownerId?._id
      : location.ownerId;
  const roundedRate = Math.round(location.rate);
  const clampedRate = Math.max(0, Math.min(5, roundedRate));
  const stars = "★".repeat(clampedRate) + "☆".repeat(5 - clampedRate);
  void stars;

  return (
    <main className={styles.page}>
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
            <span className={styles.stars} aria-label={`Рейтинг: ${location.rate} з 5`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= clampedRate} />
              ))}
            </span>
            <span>{location.rate}</span>
          </div>
          <div className={styles.meta}>
            <h1 className={styles.title}>{location.name}</h1>
          </div>
          <div className={styles.details}>
            <p>
              <strong>Регіон:</strong> {regionLabels[location.region] ?? location.region}
            </p>
            <p>
              <strong>Тип локації:</strong> {locationTypeLabels[location.locationType as string] ?? location.locationType}
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
          <p className={styles.description}>{location.description}</p>
        </div>
      </article>
      <ReviewsSection
        locationId={locationId}
        isAuthenticated={isAuthorized}
        initialReviews={initialReviews}
      />
    </main>
  );
}
