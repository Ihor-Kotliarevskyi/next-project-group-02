"use client";

import { useMemo, useState, useEffect } from "react";
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

export default function LocationList() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const region = searchParams.get("region") ?? "";
  const locationType = searchParams.getAll("locationType");
  const sortBy = searchParams.get("sortBy") || "name";
  const order = searchParams.get("order") || "asc";
  const page = Number(searchParams.get("page") ?? "1");

  const [limit, setLimit] = useState(6);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1440px)");
    setLimit(mql.matches ? 9 : 6);
    const handler = (e: MediaQueryListEvent) => setLimit(e.matches ? 9 : 6);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["locations", search, region, locationType, sortBy, order, page, limit],
    queryFn: () =>
      getLocations({
        page,
        limit,
        region,
        locationType,
        search,
        sortBy,
        order,
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
    let list = (data?.locations as Location[]) ?? [];

    if (sortBy === "name") {
      return [...list].sort((a, b) => {
        const res = a.name.localeCompare(b.name, "uk");
        return order === "asc" ? res : -res;
      });
    }

    if (sortBy === "rate") {
      return [...list].sort((a, b) => {
        const res = b.rate - a.rate;
        return order === "asc" ? -res : res;
      });
    }

    if (sortBy === "createdAt") {
      return [...list].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        const res = timeB - timeA;
        return order === "asc" ? -res : res;
      });
    }

    return list;
  }, [data?.locations, sortBy, order]);

  const totalPages = data?.pagination?.totalPages ?? 1;
  const currentPage = data?.pagination?.page ?? 1;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Усі місця відпочинку</h2>

        <SearchBox
          regions={regions
            .slice()
            .sort((a, b) => a.region.localeCompare(b.region, "uk"))
            .map((regionOption) => ({
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
