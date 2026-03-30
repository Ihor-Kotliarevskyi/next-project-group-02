import Image from 'next/image';
import { getUserByIdServer, getUserLocationsServer } from '@/lib/api/serverApi';
import LocationList from '@/components/LocationList/LocationList';

import css from './ProfilePage.module.css';

async function Profile() {
  // Поки тільки тестово
  const user = await getUserByIdServer('6881563901add19ee16fcff5');
  const data = await getUserLocationsServer('6881563901add19ee16fcff5');
  const locations = data.data;

  // Пізніше видалити
  const regions = ['Київська', 'Львівська', 'Одеська'];
  const locationTypes = ['Готель', 'База відпочинку'];

  return (
    <main className={css.mainContent}>
      <div>
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
        <div>
          {/* <LocationList locations={locations} regions={regions} locationTypes={locationTypes} /> */}
        </div>
      </div>
    </main>
  );
}

export default Profile;
