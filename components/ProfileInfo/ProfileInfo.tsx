import Image from 'next/image';
import css from './ProfileInfo.module.css';

interface ProfileInfoProps {
  user: {
    avatarUrl?: string;
    avatar?: string;
    name: string;
    articlesAmount: number;
  };
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className={css.header}>
      <Image
        src={user.avatarUrl || user.avatar || '/default-avatar.png'}
        alt="User Avatar"
        width={145}
        height={145}
        className={css.avatar}
      />
      <div className={css.profileInfo}>
        <h2 className={css.userName}>{user.name}</h2>
        <p className={css.articles}>Статей: {user.articlesAmount}</p>
      </div>
    </div>
  );
}
