import LocationCard from "@/components/LocationCard/LocationCard";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./LocationList.module.css";
import { Location } from "@/types/location";

type LocationListProps = {
  locations: Location[];
  regions: string[];
  locationTypes: string[];
};

export default function LocationList({
  locations,
  regions,
  locationTypes,
}: LocationListProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Усі місця відпочинку</h2>
      <SearchBox regions={regions} locationTypes={locationTypes} />
      <div className={styles.grid}>
        {locations.length === 0 ? (
          <p className={styles.empty}>Нічого не знайдено</p>
        ) : (
          locations.map((location) => (
            <LocationCard
              key={location._id}
              _id={location._id}
              image={location.image}
              name={location.name}
              locationType={location.locationType}
              rate={location.rate}
            />
          ))
        )}
      </div>
      <Pagination onLoadMore={() => {}} />
    </section>
  );
}
