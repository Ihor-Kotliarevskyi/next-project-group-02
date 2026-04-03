import Image from 'next/image';
import { getUserByIdServer, getUserLocationsServer } from '@/lib/api/serverApi';
import ProfileLocationList from '@/components/ProfileLocationList/ProfileLocationList';

import css from './ProfilePage.module.css';

async function Profile() {
  // Тестовий ID користувача
  const userId = '6881563901add19ee16fcff5';

  // Отримуємо дані паралельно для кращої продуктивності
  const [user, data] = await Promise.all([
    getUserByIdServer(userId),
    getUserLocationsServer(userId),
  ]);

  const locations = data.data;

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

        <div>
          <ProfileLocationList locations={locations} isLoading={false} />
        </div>
      </div>
    </main>
  );
}

export default Profile;
