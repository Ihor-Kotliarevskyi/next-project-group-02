import { redirect } from 'next/navigation';
import Image from 'next/image';
import { getUserByIdServer, getUserLocationsServer } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function Profile({ params }: Props) {
  const { userId } = await params;

  let user;
  let locations: unknown[] = [];

  try {
    const [userData, locationsData] = await Promise.all([
      getUserByIdServer(userId),
      getUserLocationsServer(userId),
    ]);
    user = userData;
    locations = locationsData.data;
  } catch {
    redirect('/login');
  }

  const avatarSrc = user.avatarUrl || user.avatar || null;

  return (
    <main className={css.mainContent}>
      <div className={css.header}>
        {avatarSrc ? (
          <Image src={avatarSrc} alt={user.name} width={145} height={145} className={css.avatar} />
        ) : (
          <div className={css.avatarFallback}>{user.name.charAt(0).toUpperCase()}</div>
        )}
        <div className={css.profileInfo}>
          <h2 className={css.userName}>{user.name}</h2>
          <p className={css.articles}>Статей: {user.articlesAmount}</p>
        </div>
      </div>
      <p className={css.locationsCount}>Локацій: {locations.length}</p>
    </main>
  );
}
