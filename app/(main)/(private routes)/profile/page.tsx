import Image from 'next/image';
import Link from 'next/link';
import { getMeServer, getUserLocationsServer } from '@/lib/api/serverApi';
import ProfileLocationList from '@/components/ProfileLocationList/ProfileLocationList';
import css from './ProfilePage.module.css';

async function Profile() {
  const user = await getMeServer();

  const data = await getUserLocationsServer(user._id);
  const locations = data.data;
  const isLocations = locations.length !== 0 ? true : false;
  const isEditable = true;

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

        <div className={css.locations}>
          {isLocations ? (
            <ProfileLocationList locations={locations} isLoading={false} />
          ) : (
            <div className={css.wraper}>
              <div className={css.noLocationsMessage}>
                <p className={css.text}>
                  Ви ще нічого не публікували, поділіться своєю першою локацією!
                </p>
                <button type="button" className={css.buttonAdd}>
                  <Link href="/locations/add" className={css.locationAddLink}>
                    Поділитися локацією
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

export default Profile;
