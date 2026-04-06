"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  getLocations,
  getRegions,
  getLocationTypes,
} from "@/lib/api/clientApi";
import LocationCard from "@/components/LocationCard/LocationCard";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./LocationList.module.css";
import { Location } from "@/types/location";

const getLocationTimestamp = (location: Location) => {
  if (location.createdAt) {
    return new Date(location.createdAt).getTime();
  }

  return Number.parseInt(location._id.slice(0, 8), 16) * 1000;
};

export default function LocationList() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const region = searchParams.get("region") ?? "";
  const locationType = searchParams.get("locationType") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["locations", search, region, locationType, sort, page],
    queryFn: () =>
      getLocations({
        page,
        limit: 9,
        region,
        locationType,
        search,
        sort,
      }),
  });

  const { data: regions = [] } = useQuery<{ slug: string; region: string }[]>({
    queryKey: ["regions"],
    queryFn: getRegions,
  });

  const { data: locationTypes = [] } = useQuery<
    { slug: string; type: string }[]
  >({
    queryKey: ["locationTypes"],
    queryFn: getLocationTypes,
  });

  const locationTypeLabels = useMemo(
    () =>
      new Map(
        locationTypes.map((locationTypeOption) => [
          locationTypeOption.slug,
          locationTypeOption.type,
        ]),
      ),
    [locationTypes],
  );

  const locations = useMemo(() => {
    const currentLocations = (data?.locations as Location[]) ?? [];

    if (sort === "name") {
      return [...currentLocations].sort((a, b) =>
        a.name.localeCompare(b.name, "uk"),
      );
    }

    if (sort === "rate") {
      return [...currentLocations].sort((a, b) => b.rate - a.rate);
    }

    if (sort === "newest") {
      return [...currentLocations].sort(
        (a, b) => getLocationTimestamp(b) - getLocationTimestamp(a),
      );
    }

    return currentLocations;
  }, [data?.locations, sort]);

  const totalPages = data?.pagination?.totalPages ?? 1;
  const currentPage = data?.pagination?.page ?? page;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Усі місця відпочинку</h2>

        <SearchBox
          regions={regions.map((regionOption) => ({
            value: regionOption.slug,
            label: regionOption.region,
          }))}
          locationTypes={locationTypes.map((locationTypeOption) => ({
            value: locationTypeOption.slug,
            label: locationTypeOption.type,
          }))}
        />

        {isLoading || isFetching ? (
          <p className={styles.loader}>Завантаження...</p>
        ) : locations.length === 0 ? (
          <p className={styles.empty}>Нічого не знайдено</p>
        ) : (
          <div className={styles.grid}>
            {locations.map((location) => (
              <LocationCard
                key={location._id}
                _id={location._id}
                image={location.image}
                name={location.name}
                locationType={
                  locationTypeLabels.get(location.locationType) ??
                  "Тип не вказано"
                }
                rate={location.rate}
              />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        ) : null}
      </div>
    </section>
  );
}
