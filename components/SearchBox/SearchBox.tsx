"use client";

import { useLocationStore } from "@/lib/store/locationStore";
import styles from "./SearchBox.module.css";

type SearchBoxProps = {
  regions: string[];
  locationTypes: string[];
};

export default function SearchBox({ regions, locationTypes }: SearchBoxProps) {
  const { filters, setSearch, setRegion, setLocationType, setSort } =
    useLocationStore();

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.search}
        type="text"
        placeholder="Пошук"
        value={filters.search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className={styles.select}
        value={filters.region}
        onChange={(e) => setRegion(e.target.value)}
      >
        <option value="">Регіон</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      <select
        className={styles.select}
        value={filters.locationType}
        onChange={(e) => setLocationType(e.target.value)}
      >
        <option value="">Тип локації</option>
        {locationTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <select
        className={styles.select}
        value={filters.sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="">Сортування</option>
        <option value="name">За назвою</option>
        <option value="rate">За рейтингом</option>
      </select>
    </div>
  );
}
