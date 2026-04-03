'use client';

import { useMemo, useState } from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import LocationCard from '@/components/LocationCard/LocationCard';
import css from './ProfileLocationList.module.css';
import { Location } from '@/types/location';
import { getLocationTypes } from '@/lib/api/clientApi';
import { useQuery } from '@tanstack/react-query';

interface ProfileLocationListProps {
  locations: Location[];
  isLoading?: boolean;
}

export default function ProfileLocationList({
  locations = [],
  isLoading = false,
}: ProfileLocationListProps) {
  const { filters } = useLocationStore();

  const [visibleCount, setVisibleCount] = useState(6);

  const sortedLocations = useMemo(() => {
    const list = [...locations];
    if (filters.sort === 'name') {
      return list.sort((a, b) => a.name.localeCompare(b.name, 'uk'));
    }
    if (filters.sort === 'rate') {
      return list.sort((a, b) => b.rate - a.rate);
    }
    return list;
  }, [locations, filters.sort]);

  const displayedLocations = useMemo(() => {
    return sortedLocations.slice(0, visibleCount);
  }, [sortedLocations, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const hasMore = visibleCount < sortedLocations.length;

  if (isLoading) {
    return <p className={css.loader}>Завантаження...</p>;
  }

  const { data: locationTypes = [] } = useQuery<
    {
      slug: string;
      type: string;
    }[]
  >({
    queryKey: ['locationTypes'],
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
              />
            ))
          )}
        </div>

        {hasMore && (
          <div className={css.wrapper}>
            <button
              className={css.button}
              onClick={handleLoadMore}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? 'Завантаження...' : 'Показати ще'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
