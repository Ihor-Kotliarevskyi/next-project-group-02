import styles from "./SearchBox.module.css";

type SearchBoxProps = {
  regions: string[];
  locationTypes: string[];
  onSearch: (value: string) => void;
  onRegionChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export default function SearchBox({
  regions,
  locationTypes,
  onSearch,
  onRegionChange,
  onTypeChange,
  onSortChange,
}: SearchBoxProps) {
  return (
    <div className={styles.wrapper}>
      <input
        className={styles.search}
        type="text"
        placeholder="Пошук"
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        className={styles.select}
        onChange={(e) => onRegionChange(e.target.value)}
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
        onChange={(e) => onTypeChange(e.target.value)}
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
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="">Сортування</option>
        <option value="name">За назвою</option>
        <option value="rate">За рейтингом</option>
      </select>
    </div>
  );
}
