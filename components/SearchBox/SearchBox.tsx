"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./SearchBox.module.css";

type SearchBoxProps = {
  regions: { value: string; label: string }[];
  locationTypes: { value: string; label: string }[];
};

const sortOptions = [
  { value: "name:asc", label: "За назвою" },
  { value: "rate:desc", label: "За рейтингом" },
  { value: "createdAt:desc", label: "Новіші спочатку" },
];

export default function SearchBox({ regions, locationTypes }: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locationTypeRef = useRef<HTMLDivElement | null>(null);
  const regionRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);
  const [isLocationTypeOpen, setIsLocationTypeOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const search = searchParams.get("search") ?? "";
  const region = searchParams.get("region") ?? "";
  const selectedTypes = searchParams.getAll("locationType");
  const sortBy = searchParams.get("sortBy") || "name";
  const order = searchParams.get("order") || "asc";

  const currentSort = `${sortBy}:${order}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationTypeRef.current &&
        event.target instanceof Node &&
        !locationTypeRef.current.contains(event.target)
      ) {
        setIsLocationTypeOpen(false);
      }

      if (
        regionRef.current &&
        event.target instanceof Node &&
        !regionRef.current.contains(event.target)
      ) {
        setIsRegionOpen(false);
      }

      if (
        sortRef.current &&
        event.target instanceof Node &&
        !sortRef.current.contains(event.target)
      ) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleType = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentOnes = params.getAll("locationType");

    if (currentOnes.includes(value)) {
      const remaining = currentOnes.filter((t) => t !== value);
      params.delete("locationType");
      remaining.forEach((t) => params.append("locationType", t));
    } else {
      params.append("locationType", value);
    }

    params.delete("page");
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "sort") {
      const [newSortBy, newOrder] = value.split(":");
      params.set("sortBy", newSortBy);
      params.set("order", newOrder);
    } else if (value.trim()) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const activeSortLabel =
    sortOptions.find((option) => option.value === currentSort)?.label ?? "За назвою";
  const activeLocationTypeLabel =
    selectedTypes.length > 0
      ? `Тип: ${selectedTypes.length}`
      : "Тип локації";
  const activeRegionLabel =
    regions.find((option) => option.value === region)?.label ?? "Регіон";

  return (
    <div className={styles.wrapper}>
      <input
        className={`${styles.control} ${styles.search}`}
        type="text"
        placeholder="Пошук"
        value={search}
        onChange={(event) => updateParam("search", event.target.value)}
      />

      <div className={styles.filtersRow}>
        <div
          ref={locationTypeRef}
          className={`${styles.control} ${styles.customSelect} ${
            isLocationTypeOpen ? styles.open : ""
          }`}
        >
          <button
            type="button"
            className={styles.selectTrigger}
            onClick={() => {
              setIsLocationTypeOpen((prev) => !prev);
              setIsRegionOpen(false);
              setIsSortOpen(false);
            }}
            aria-haspopup="listbox"
            aria-expanded={isLocationTypeOpen}
          >
            <span>{activeLocationTypeLabel}</span>
            <svg
              className={styles.selectIcon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.9998 15.2019C11.8878 15.2019 11.7824 15.1832 11.6838 15.1459C11.5851 15.1085 11.4891 15.0432 11.3958 14.9499L5.79581 9.34991C5.62715 9.18124 5.54315 8.96724 5.54381 8.70791C5.54448 8.44858 5.63315 8.23458 5.80981 8.06591C5.98648 7.89724 6.19881 7.81291 6.44681 7.81291C6.69481 7.81291 6.90715 7.89724 7.08381 8.06591L11.9998 12.9819L16.9158 8.06591C17.0845 7.89724 17.2941 7.81291 17.5448 7.81291C17.7955 7.81291 18.0091 7.89724 18.1858 8.06591C18.3625 8.23458 18.4508 8.44558 18.4508 8.69891C18.4508 8.95224 18.3625 9.16324 18.1858 9.33191L12.5858 14.9319C12.4925 15.0252 12.3965 15.0939 12.2978 15.1379C12.1991 15.1819 12.0998 15.2032 11.9998 15.2019Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {isLocationTypeOpen ? (
            <div className={styles.selectMenu} role="listbox">
              {selectedTypes.length > 0 && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => updateParam("locationType", "")}
                >
                  Очистити все
                </button>
              )}
              {locationTypes.map((type) => (
                <label
                  key={type.value}
                  className={styles.checkboxOption}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.value)}
                      onChange={() => toggleType(type.value)}
                      className={styles.checkboxHidden}
                    />
                    <div className={styles.checkboxCustom}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                  <span className={styles.checkboxLabel}>{type.label}</span>
                </label>
              ))}
            </div>
          ) : null}
        </div>

        <div
          ref={regionRef}
          className={`${styles.control} ${styles.customSelect} ${
            isRegionOpen ? styles.open : ""
          }`}
        >
          <button
            type="button"
            className={styles.selectTrigger}
            onClick={() => {
              setIsRegionOpen((prev) => !prev);
              setIsLocationTypeOpen(false);
              setIsSortOpen(false);
            }}
            aria-haspopup="listbox"
            aria-expanded={isRegionOpen}
          >
            <span>{activeRegionLabel}</span>
            <svg
              className={styles.selectIcon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.9998 15.2019C11.8878 15.2019 11.7824 15.1832 11.6838 15.1459C11.5851 15.1085 11.4891 15.0432 11.3958 14.9499L5.79581 9.34991C5.62715 9.18124 5.54315 8.96724 5.54381 8.70791C5.54448 8.44858 5.63315 8.23458 5.80981 8.06591C5.98648 7.89724 6.19881 7.81291 6.44681 7.81291C6.69481 7.81291 6.90715 7.89724 7.08381 8.06591L11.9998 12.9819L16.9158 8.06591C17.0845 7.89724 17.2941 7.81291 17.5448 7.81291C17.7955 7.81291 18.0091 7.89724 18.1858 8.06591C18.3625 8.23458 18.4508 8.44558 18.4508 8.69891C18.4508 8.95224 18.3625 9.16324 18.1858 9.33191L12.5858 14.9319C12.4925 15.0252 12.3965 15.0939 12.2978 15.1379C12.1991 15.1819 12.0998 15.2032 11.9998 15.2019Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {isRegionOpen ? (
            <div className={styles.selectMenu} role="listbox">
              <button
                type="button"
                className={`${styles.selectOption} ${
                  region === "" ? styles.selectedOption : ""
                }`}
                onClick={() => {
                  updateParam("region", "");
                  setIsRegionOpen(false);
                }}
              >
                Регіон
              </button>
              {regions.map((regionOption) => (
                <button
                  key={regionOption.value}
                  type="button"
                  className={`${styles.selectOption} ${
                    regionOption.value === region ? styles.selectedOption : ""
                  }`}
                  onClick={() => {
                    updateParam("region", regionOption.value);
                    setIsRegionOpen(false);
                  }}
                >
                  {regionOption.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div
          ref={sortRef}
          className={`${styles.control} ${styles.customSelect} ${
            isSortOpen ? styles.open : ""
          }`}
        >
          <button
            type="button"
            className={styles.selectTrigger}
            onClick={() => {
              setIsSortOpen((prev) => !prev);
              setIsLocationTypeOpen(false);
              setIsRegionOpen(false);
            }}
            aria-haspopup="listbox"
            aria-expanded={isSortOpen}
          >
            <span>{activeSortLabel}</span>
            <svg
              className={styles.selectIcon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.9998 15.2019C11.8878 15.2019 11.7824 15.1832 11.6838 15.1459C11.5851 15.1085 11.4891 15.0432 11.3958 14.9499L5.79581 9.34991C5.62715 9.18124 5.54315 8.96724 5.54381 8.70791C5.54448 8.44858 5.63315 8.23458 5.80981 8.06591C5.98648 7.89724 6.19881 7.81291 6.44681 7.81291C6.69481 7.81291 6.90715 7.89724 7.08381 8.06591L11.9998 12.9819L16.9158 8.06591C17.0845 7.89724 17.2941 7.81291 17.5448 7.81291C17.7955 7.81291 18.0091 7.89724 18.1858 8.06591C18.3625 8.23458 18.4508 8.44558 18.4508 8.69891C18.4508 8.95224 18.3625 9.16324 18.1858 9.33191L12.5858 14.9319C12.4925 15.0252 12.3965 15.0939 12.2978 15.1379C12.1991 15.1819 12.0998 15.2032 11.9998 15.2019Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {isSortOpen ? (
            <div className={styles.selectMenu} role="listbox">
              {sortOptions.map((option) => (
                <button
                  key={option.value || "default"}
                  type="button"
                  className={`${styles.selectOption} ${
                    option.value === currentSort ? styles.selectedOption : ""
                  }`}
                  onClick={() => {
                    updateParam("sort", option.value);
                    setIsSortOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
