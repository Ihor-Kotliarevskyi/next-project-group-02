"use client";

import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLocationStore } from "@/lib/store/locationStore";
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

export default function LocationList() {
  const { filters } = useLocationStore();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["locations", filters],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getLocations({
          page: pageParam,
          limit: 9,
          region: filters.region,
          locationType: filters.locationType,
          search: filters.search,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.pagination.page < lastPage.pagination.totalPages
          ? lastPage.pagination.page + 1
          : undefined,
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
        locationTypes.map((locationType: { slug: string; type: string }) => [
          locationType.slug,
          locationType.type,
        ]),
      ),
    [locationTypes],
  );

  const locations = useMemo(() => {
    const allLocations =
    data?.pages.flatMap((page) => page.locations as Location[]) ?? [];

  const uniqueLocations = Array.from(
    new Map(allLocations.map((loc) => [loc._id, loc])).values()
  );

  const normalizedSearch = filters.search.trim().toLowerCase();

  const filteredLocations = normalizedSearch
    ? uniqueLocations.filter((location) => {
        const locationName = location.name.toLowerCase();
        const locationTypeLabel =
          locationTypeLabels.get(location.locationType)?.toLowerCase() ?? "";
        const locationTypeSlug = location.locationType.toLowerCase();

        return (
          locationName.includes(normalizedSearch) ||
          locationTypeLabel.includes(normalizedSearch) ||
          locationTypeSlug.includes(normalizedSearch)
        );
      })
    : uniqueLocations;

    if (filters.sort === "name") {
      return [...filteredLocations].sort((a, b) =>
        a.name.localeCompare(b.name, "uk"),
      );
    }

    if (filters.sort === "rate") {
      return [...filteredLocations].sort((a, b) => b.rate - a.rate);
    }

    return filteredLocations;
  }, [data?.pages, filters.sort, filters.search, locationTypeLabels]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Усі місця відпочинку</h2>
        <SearchBox
          regions={regions.map((region) => ({
            value: region.slug,
            label: region.region,
          }))}
          locationTypes={locationTypes.map(
            (locationType: { slug: string; type: string }) => ({
              value: locationType.slug,
              label: locationType.type,
            }),
          )}
        />

        {isLoading ? (
          <p className={styles.loader}>Завантаження...</p>
        ) : (
          <div className={styles.grid}>
            {locations.length === 0 ? (
              <p className={styles.empty}>Нічого не знайдено</p>
            ) : (
              locations.map((location: Location) => (
                <LocationCard
                  key={location._id}
                  _id={location._id}
                  image={location.image}
                  name={location.name}
                  locationType={
                    locationTypeLabels.get(location.locationType) ??
                    location.locationType
                  }
                  rate={location.rate}
                />
              ))
            )}
          </div>
        )}

        {hasNextPage ? (
          <Pagination
            onLoadMore={() => {
              void fetchNextPage();
            }}
            isLoading={isFetchingNextPage}
          />
        ) : null}
      </div>
    </section>
  );
}
