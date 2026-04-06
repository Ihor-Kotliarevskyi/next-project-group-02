"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./SearchBox.module.css";

type SearchBoxProps = {
  regions: { value: string; label: string }[];
  locationTypes: { value: string; label: string }[];
};

export default function SearchBox({ regions, locationTypes }: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const region = searchParams.get("region") ?? "";
  const locationType = searchParams.get("locationType") ?? "";
  const sort = searchParams.get("sort") ?? "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

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
        <select
          className={`${styles.control} ${styles.select}`}
          value={locationType}
          onChange={(event) => updateParam("locationType", event.target.value)}
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
          value={region}
          onChange={(event) => updateParam("region", event.target.value)}
        >
          <option value="">Регіон</option>
          {regions.map((regionOption) => (
            <option key={regionOption.value} value={regionOption.value}>
              {regionOption.label}
            </option>
          ))}
        </select>

        <select
          className={`${styles.control} ${styles.select}`}
          value={sort}
          onChange={(event) => updateParam("sort", event.target.value)}
        >
          <option value="">Сортування</option>
          <option value="name">За назвою</option>
          <option value="rate">За рейтингом</option>
        </select>
      </div>
    </div>
  );
}
