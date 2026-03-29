"use client";

import { useLocationStore } from "@/lib/store/locationStore";
import styles from "./SearchBox.module.css";

type SearchBoxProps = {
  regions: { value: string; label: string }[];
  locationTypes: { value: string; label: string }[];
};

export default function SearchBox({ regions, locationTypes }: SearchBoxProps) {
  const { filters, setSearch, setRegion, setLocationType, setSort } =
    useLocationStore();

  return (
    <div className={styles.wrapper}>
      <input
        className={`${styles.control} ${styles.search}`}
        type="text"
        placeholder="Пошук"
        value={filters.search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <select
        className={`${styles.control} ${styles.select}`}
        value={filters.region}
        onChange={(event) => setRegion(event.target.value)}
      >
        <option value="">Регіон</option>
        {regions.map((region) => (
          <option key={region.value} value={region.value}>
            {region.label}
          </option>
        ))}
      </select>
      <select
        className={`${styles.control} ${styles.select}`}
        value={filters.locationType}
        onChange={(event) => setLocationType(event.target.value)}
      >
        <option value="">Тип локації</option>
        {locationTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      <select
        className={`${styles.control} ${styles.select}`}
        value={filters.sort}
        onChange={(event) => setSort(event.target.value)}
      >
        <option value="">Сортування</option>
        <option value="name">За назвою</option>
        <option value="rate">За рейтингом</option>
      </select>
    </div>
  );
}
