"use client";
 
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import styles from "./ReviewsSection.module.css";
 
type Review = {
  _id: string;
  userId?: { name?: string };
  rating: number;
  comment: string;
};

export type { Review };

function normalizeReviews(payload: unknown): Review[] {
  if (Array.isArray(payload)) return payload as Review[];

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as Review[];
    if (Array.isArray(record.feedbacks)) return record.feedbacks as Review[];
    if (Array.isArray(record.items)) return record.items as Review[];
  }

  return [];
}

async function fetchReviews(locationId: string): Promise<Review[]> {
  const res = await fetch(`/api/locations/${locationId}/feedbacks`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return normalizeReviews(json);
}
 
function Stars({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className={styles.stars}>
      {"★".repeat(filled)}
      <span className={styles.starsEmpty}>{"★".repeat(5 - filled)}</span>
    </span>
  );
}
 
interface Props {
  locationId: string;
  isAuthorized: boolean;
  initialReviews?: Review[];
}

export default function ReviewsSection({
  locationId,
  isAuthorized,
  initialReviews = [],
}: Props) {
  const router = useRouter();

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["reviews", locationId],
    queryFn: () => fetchReviews(locationId),
    initialData: initialReviews,
  });
 
  function handleLeaveReview() {
    if (!isAuthorized) {
      router.push("/login");
    } else {
      router.push(`/add-review?locationId=${locationId}`);
    }
  }
 
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Відгуки</h2>
        <button className={styles.btn} onClick={handleLeaveReview}>
          Залишити відгук
        </button>
      </div>
 
      {isLoading ? (
        <p className={styles.empty}>Завантаження…</p>
      ) : reviews.length === 0 ? (
        <p className={styles.empty}>Поки немає відгуків. Будьте першим!</p>
      ) : (
        <ul className={styles.list}>
          {reviews.map((r) => (
            <li key={r._id} className={styles.card}>
              <Stars rating={r.rating} />
              <p className={styles.comment}>{r.comment}</p>
              <span className={styles.author}>{r.userId?.name ?? "Анонім"}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
