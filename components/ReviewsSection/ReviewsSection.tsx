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
 
const API_URL = process.env.NEXT_PUBLIC_API_URL;
 
async function fetchReviews(locationId: string): Promise<Review[]> {
  const res = await fetch(`${API_URL}/locations/${locationId}/feedbacks`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? json ?? [];
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
}
 
export default function ReviewsSection({ locationId, isAuthorized }: Props) {
  const router = useRouter();
 
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["reviews", locationId],
    queryFn: () => fetchReviews(locationId),
  });
 
  function handleLeaveReview() {
    if (!isAuthorized) {
      router.push("/@modal/auth-prompt");
    } else {
      router.push(`/@modal/add-review?locationId=${locationId}`);
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