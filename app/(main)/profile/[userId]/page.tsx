import { redirect } from 'next/navigation';
import Image from 'next/image';
import { getMeServer, getUserByIdServer, getUserLocationsServer } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';
import Link from 'next/link';
import ProfileLocationList from '@/components/ProfileLocationList/ProfileLocationList';
import { Location } from '@/types/location';

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function Profile({ params }: Props) {
  const { userId } = await params;

  let user;
  let currentUser;
  let locations: Location[] = [];

  try {
    const [userData, currentUserData, locationsData] = await Promise.all([
      getUserByIdServer(userId),
      getMeServer(),
      getUserLocationsServer(userId),
    ]);
    user = userData;
    currentUser = currentUserData;
    locations = locationsData.data;
  } catch {
    redirect('/login');
  }

  if (currentUser && currentUser._id === userId) {
    redirect('/profile');
  }

  const isLocations = locations.length !== 0 ? true : false;

  return (
    <main className={css.mainContent}>
      <div className={css.profile}>
        <div className={css.header}>
          <Image
            src={user.avatarUrl ? user.avatarUrl : user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
          <div className={css.profileInfo}>
            <h2 className={css.userName}>{user.name}</h2>
            <p className={css.articles}>Статей: {user.articlesAmount}</p>
          </div>
        </div>
        <h2 className={css.title}>Локації</h2>
        <div className={css.locations}>
          {isLocations ? (
            <ProfileLocationList locations={locations} isLoading={false} />
          ) : (
            <div className={css.wraper}>
              <div className={css.noLocationsMessage}>
                <p className={css.text}>Цей користувач ще не ділився локаціями </p>
                <button type="button" className={css.buttonAdd}>
                  <Link href="/locations" className={css.locationAddLink}>
                    Назад до локацій
                  </Link>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
