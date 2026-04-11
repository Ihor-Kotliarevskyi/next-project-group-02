"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUsers } from "@/lib/api/clientApi";
import Pagination from "@/components/Pagination/Pagination";
import Icon from "@/components/Icon/Icon";
import { User } from "@/types/user";
import styles from "./UserList.module.css";

const SORT_OPTIONS = [
  { label: "Від А до Я", sortBy: "name", order: "asc" },
  { label: "Від Я до А", sortBy: "name", order: "desc" },
  { label: "Найактивніші першими", sortBy: "articlesAmount", order: "desc" },
  { label: "Найменше статей", sortBy: "articlesAmount", order: "asc" },
] as const;

export default function UserList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") ?? "1");
  const sortBy = (searchParams.get("sortBy") ?? "articlesAmount") as "name" | "articlesAmount";
  const order = (searchParams.get("order") ?? "desc") as "asc" | "desc";

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [limit, setLimit] = useState(4);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1440px)").matches) setLimit(8);
      else if (window.matchMedia("(min-width: 768px)").matches) setLimit(6);
      else setLimit(4);
    };
    update();
    const mqlMd = window.matchMedia("(min-width: 768px)");
    const mqlLg = window.matchMedia("(min-width: 1440px)");
    mqlMd.addEventListener("change", update);
    mqlLg.addEventListener("change", update);
    return () => {
      mqlMd.removeEventListener("change", update);
      mqlLg.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["users", page, sortBy, order, limit],
    queryFn: () => getUsers({ page, limit, sortBy, order }),
  });

  const users: User[] = data?.users ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const currentPage = data?.pagination?.page ?? 1;

  const currentSortIndex = SORT_OPTIONS.findIndex(
    (o) => o.sortBy === sortBy && o.order === order,
  );
  const activeLabel =
    currentSortIndex !== -1 ? SORT_OPTIONS[currentSortIndex].label : SORT_OPTIONS[0].label;

  const handleSortSelect = (index: number) => {
    const selected = SORT_OPTIONS[index];
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", selected.sortBy);
    params.set("order", selected.order);
    params.delete("page");
    router.replace(`/users?${params.toString()}`);
    setIsSortOpen(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <h2 className={styles.title}>Мандрівники</h2>

          <div
            ref={sortRef}
            className={`${styles.control} ${styles.customSelect} ${isSortOpen ? styles.open : ""}`}
          >
            <button
              type="button"
              className={styles.selectTrigger}
              onClick={() => setIsSortOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
            >
              <span>{activeLabel}</span>
              <Icon
                name="chevron-down"
                width={24}
                height={24}
                className={styles.selectIcon}
                aria-hidden
              />
            </button>

            {isSortOpen && (
              <div className={styles.selectMenu} role="listbox">
                {SORT_OPTIONS.map((option, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.selectOption} ${
                      i === currentSortIndex ? styles.selectedOption : ""
                    }`}
                    onClick={() => handleSortSelect(i)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isLoading || isFetching ? (
          <p className={styles.loader}>Завантаження...</p>
        ) : users.length === 0 ? (
          <p className={styles.empty}>Користувачів не знайдено</p>
        ) : (
          <ul className={styles.grid}>
            {users.map((user) => (
              <li key={user._id}>
                <Link href={`/profile/${user._id}`} className={styles.card}>
                  <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          className={styles.avatar}
                          fill
                          sizes="(min-width: 1440px) 160px, (min-width: 768px) 140px, 120px"
                        />
                      ) : (
                        <span className={styles.avatarFallback}>
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.name}>{user.name}</p>
                    <p className={styles.articles}>Статей: {user.articlesAmount}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        )}
      </div>
    </section>
  );
}
