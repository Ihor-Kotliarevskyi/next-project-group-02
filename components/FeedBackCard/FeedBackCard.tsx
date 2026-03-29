import ReactStars from "react-rating-stars-component";
import styles from "./FeedBackCard.module.css";

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
      <div className={styles.rating}>
        <ReactStars
          count={5}
          value={rate}
          isHalf={true}
          edit={false}
          size={18}
          activeColor="#FFC107"
        />
      </div>
      <p className={styles.description}>{description}</p>
      <span className={styles.author}>{userName}</span>
      {locationType && (
        <span className={styles.locationType}>{locationType}</span>
      )}
    </div>
  );
};
