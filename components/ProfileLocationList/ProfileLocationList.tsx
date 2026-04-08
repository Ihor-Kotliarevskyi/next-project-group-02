"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useLocationStore } from "@/lib/store/locationStore";
import LocationCard from "@/components/LocationCard/LocationCard";
import Pagination from "@/components/Pagination/Pagination";
import DeleteLocationModal from "@/components/DeleteLocationModal/DeleteLocationModal";
import css from "./ProfileLocationList.module.css";
import { Location } from "@/types/location";
import { getLocationTypes } from "@/lib/api/clientApi";
import { useQuery } from "@tanstack/react-query";

interface ProfileLocationListProps {
  locations: Location[];
  isLoading?: boolean;
  isEditable?: boolean;
}

export default function ProfileLocationList({
  locations = [],
  isLoading = false,
  isEditable = false,
}: ProfileLocationListProps) {
  const { filters } = useLocationStore();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const [limit, setLimit] = useState(4);
  const [deletingLocation, setDeletingLocation] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleRequestDelete = useCallback((id: string, name: string) => {
    setDeletingLocation({ id, name });
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeletingLocation(null);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1440px)");
    setLimit(mql.matches ? 6 : 4);
    const handler = (e: MediaQueryListEvent) => setLimit(e.matches ? 6 : 4);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const { data: locationTypes = [] } = useQuery<
    { slug: string; type: string }[]
  >({
    queryKey: ["locationTypes"],
    queryFn: getLocationTypes,
  });

  const sortedLocations = useMemo(() => {
    const list = [...locations];
    if (filters.sort === "name") {
      return list.sort((a, b) => a.name.localeCompare(b.name, "uk"));
    }
    if (filters.sort === "rate") {
      return list.sort((a, b) => b.rate - a.rate);
    }
    return list;
  }, [locations, filters.sort]);

  const totalPages = Math.ceil(sortedLocations.length / limit);
  const currentPage = Math.min(page, totalPages || 1);

  const displayedLocations = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return sortedLocations.slice(start, start + limit);
  }, [sortedLocations, currentPage, limit]);

  const locationTypeLabels = useMemo(
    () => new Map(locationTypes.map((item) => [item.slug, item.type])),
    [locationTypes]
  );

  if (isLoading) {
    return <p className={css.loader}>Завантаження...</p>;
  }

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.grid}>
          {displayedLocations.length === 0 ? (
            <p className={css.empty}>Нічого не знайдено</p>
          ) : (
            displayedLocations.map((location: Location) => (
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
                isEditable={isEditable}
                onDelete={isEditable ? handleRequestDelete : undefined}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        )}
      </div>

      {deletingLocation && (
        <DeleteLocationModal
          locationId={deletingLocation.id}
          locationName={deletingLocation.name}
          onClose={handleCloseDeleteModal}
        />
      )}
    </section>
  );
}
