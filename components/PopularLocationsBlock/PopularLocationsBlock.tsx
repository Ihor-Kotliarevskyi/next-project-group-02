"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getLocations, getLocationTypes } from "@/lib/api/clientApi";
import LocationCard from "@/components/LocationCard/LocationCard";
import type { Location } from "@/types/location";
import styles from "./PopularLocationsBlock.module.css";

export default function PopularLocationsBlock() {
  const { data, isLoading } = useQuery({
    queryKey: ["popularLocations"],
    queryFn: () => getLocations({ page: 1, limit: 6 }),
  });

  const { data: locationTypes = [] } = useQuery<{ slug: string; type: string }[]>({
    queryKey: ["locationTypes"],
    queryFn: getLocationTypes,
  });

  const locationTypeLabels = useMemo(
    () => new Map(locationTypes.map((lt) => [lt.slug, lt.type])),
    [locationTypes],
  );

  const locations = useMemo(() => {
    const list = (data?.locations as Location[]) ?? [];
    return [...list].sort((a, b) => b.rate - a.rate);
  }, [data]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Популярні місця відпочинку</h2>

        {isLoading ? (
          <p className={styles.loader}>Завантаження...</p>
        ) : (
          <div className={styles.grid}>
            {locations.map((location: Location) => (
              <LocationCard
                key={location._id}
                _id={location._id}
                image={location.image}
                name={location.name}
                locationType={
                  locationTypeLabels.get(location.locationType) ?? "Тип не вказано"
                }
                rate={location.rate}
              />
            ))}
          </div>
        )}

        <div className={styles.cta}>
          <Link href="/locations" className={styles.ctaBtn}>
            Переглянути всі локації
          </Link>
        </div>
      </div>
    </section>
  );
}
