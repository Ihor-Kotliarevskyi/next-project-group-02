import styles from "./Pagination.module.css";

type PaginationProps = {
  onLoadMore: () => void;
};

export default function Pagination({ onLoadMore }: PaginationProps) {
  return (
    <div className={styles.wrapper}>
      <button className={styles.button} onClick={onLoadMore}>
        Показати ще
      </button>
    </div>
  );
}
