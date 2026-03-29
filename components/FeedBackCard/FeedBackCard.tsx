import styles from "./FeedBackCard.module.css";

function Stars({ rate }: { rate: number }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rate >= star;
        const half = !filled && rate >= star - 0.5;
        return (
          <span key={star} className={styles.star}>
            {filled ? "★" : half ? "⯨" : "☆"}
          </span>
        );
      })}
    </div>
  );
}

type Props = {
  userName: string;
  description: string;
  rate: number;
  locationType?: string;
};

export const FeedBackCard = ({
  userName,
  description,
  rate,
  locationType,
}: Props) => {
  return (
    <div className={styles.card}>
      <Stars rate={rate} />
      <p className={styles.description}>{description}</p>
      <span className={styles.author}>{userName}</span>
      {locationType && (
        <span className={styles.locationType}>{locationType}</span>
      )}
    </div>
  );
};
