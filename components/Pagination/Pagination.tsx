"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./Pagination.module.css";
import Icon from "@/components/Icon/Icon";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const getVisiblePages = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
  };

  const pages = getVisiblePages();

  return (
    <div className={styles.pager}>
      <button
        type="button"
        className={styles.pagerArrow}
        onClick={() => updatePage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Попередня сторінка"
      >
        <Icon name="arrow-left" width={16} height={16} aria-hidden={true} />
      </button>

      <div className={styles.pagerPages}>
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className={styles.dots}>
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`${styles.pageBtn} ${
                page === currentPage ? styles.active : ""
              }`}
              onClick={() => updatePage(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className={styles.pagerArrow}
        onClick={() => updatePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Наступна сторінка"
      >
        <Icon name="arrow-left" width={16} height={16} style={{ transform: "scaleX(-1)" }} aria-hidden={true} />
      </button>
    </div>
  );
}
