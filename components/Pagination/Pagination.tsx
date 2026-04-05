"use client";

import styles from "./Pagination.module.css";

type PaginationProps = {
  onLoadMore: () => void;
  isLoading?: boolean;
};

export default function Pagination({
  onLoadMore,
  isLoading = false,
}: PaginationProps) {
  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        onClick={onLoadMore}
        disabled={isLoading}
        type="button"
      >
        {isLoading ? "Завантаження..." : "Показати ще"}
      </button>
    </div>
  );
}
