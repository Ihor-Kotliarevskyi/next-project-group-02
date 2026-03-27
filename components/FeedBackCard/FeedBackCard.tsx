import styles from "./FeedBackCard.module.css";
type Props = {
  userName: string;
  description: string;
  rate: number;
};
export const FeedBackCard = ({ userName, description, rate }: Props) => {
  return (
    <div className={styles.card}>
      <div>⭐ {rate}</div>
      <p>{description}</p>
      <span>{userName}</span>
    </div>
  );
};
