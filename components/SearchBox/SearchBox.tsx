"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./SearchBox.module.css";
import Icon from "@/components/Icon/Icon";

type SearchBoxProps = {
  regions: { value: string; label: string }[];
  locationTypes: { value: string; label: string }[];
};

const sortOptions = [
  { value: "name:asc", label: "Від А до Я" },
  { value: "name:desc", label: "Від Я до А" },
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
  const [searchInput, setSearchInput] = useState(search);
  const isFirstSearchSync = useRef(true);
  const region = searchParams.get("region") ?? "";
  const selectedTypes = searchParams.getAll("locationType");
  const sortBy = searchParams.get("sortBy") || "rate";
  const order = searchParams.get("order") || "desc";

  const currentSort = `${sortBy}:${order}`;

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (isFirstSearchSync.current) {
      isFirstSearchSync.current = false;
      return;
    }
    if (searchInput === search) return;

    const timer = setTimeout(() => {
      updateParam("search", searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

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
    sortOptions.find((option) => option.value === currentSort)?.label ?? "від А до Я";
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
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
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
            <Icon name="chevron-down" width={24} height={24} className={styles.selectIcon} aria-hidden={true} />
          </button>

          {isLocationTypeOpen ? (
            <div
              className={`${styles.selectMenu} ${styles.selectMenuScrollable}`}
              role="listbox"
            >
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
                      <Icon name="checkmark" width={24} height={24} aria-hidden={true} />
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
            <Icon name="chevron-down" width={24} height={24} className={styles.selectIcon} aria-hidden={true} />
          </button>

          {isRegionOpen ? (
            <div
              className={`${styles.selectMenu} ${styles.selectMenuScrollable}`}
              role="listbox"
            >
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
            <Icon name="chevron-down" width={24} height={24} className={styles.selectIcon} aria-hidden={true} />
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
