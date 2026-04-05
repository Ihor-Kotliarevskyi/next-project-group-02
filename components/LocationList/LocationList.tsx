"use client";

import { useEffect, useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const { filters, setSearch, setRegion, setLocationType, setSort } =
    useLocationStore();

  const effectiveFilters = useMemo(
    () => ({
      search: searchParams.get("search") ?? filters.search,
      region: searchParams.get("region") ?? filters.region,
      locationType:
        searchParams.get("locationType") ?? filters.locationType,
      sort: searchParams.get("sort") ?? filters.sort,
    }),
    [filters, searchParams],
  );

  useEffect(() => {
    if (filters.search !== effectiveFilters.search) {
      setSearch(effectiveFilters.search);
    }

    if (filters.region !== effectiveFilters.region) {
      setRegion(effectiveFilters.region);
    }

    if (filters.locationType !== effectiveFilters.locationType) {
      setLocationType(effectiveFilters.locationType);
    }

    if (filters.sort !== effectiveFilters.sort) {
      setSort(effectiveFilters.sort);
    }
  }, [
    effectiveFilters.locationType,
    effectiveFilters.region,
    effectiveFilters.search,
    effectiveFilters.sort,
    filters.locationType,
    filters.region,
    filters.search,
    filters.sort,
    setLocationType,
    setRegion,
    setSearch,
    setSort,
  ]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["locations", effectiveFilters],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getLocations({
          page: pageParam,
          limit: 9,
          region: effectiveFilters.region,
          locationType: effectiveFilters.locationType,
          search: effectiveFilters.search,
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
        ])
      ),
    [locationTypes]
  );

  const locations = useMemo(() => {
    const allLocations =
      data?.pages.flatMap((page) => page.locations as Location[]) ?? [];

    const uniqueLocations = Array.from(
      new Map(allLocations.map((loc) => [loc._id, loc])).values(),
    );

    if (effectiveFilters.sort === "name") {
      return [...uniqueLocations].sort((a, b) =>
        a.name.localeCompare(b.name, "uk"),
      );
    }

    if (effectiveFilters.sort === "rate") {
      return [...uniqueLocations].sort((a, b) => b.rate - a.rate);
    }

    return uniqueLocations;
  }, [data?.pages, effectiveFilters.sort]);

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
            })
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
