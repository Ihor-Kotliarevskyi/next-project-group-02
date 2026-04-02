'use client';

import { useMemo, useState } from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import LocationCard from '@/components/LocationCard/LocationCard';
import Pagination from '@/components/Pagination/Pagination';
import styles from './ProfileLocationList.module.css';
import { Location } from '@/types/location';

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
    return <p className={styles.loader}>Завантаження...</p>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {displayedLocations.length === 0 ? (
            <p className={styles.empty}>Нічого не знайдено</p>
          ) : (
            displayedLocations.map((location: Location) => (
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

        {hasMore && <Pagination onLoadMore={handleLoadMore} isLoading={false} />}
      </div>
    </section>
  );
}
