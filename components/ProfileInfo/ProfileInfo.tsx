import Image from "next/image";
import Link from "next/link";
import css from "./ProfileInfo.module.css";

interface ProfileInfoProps {
  user: {
    avatarUrl?: string;
    avatar?: string;
    name: string;
    articlesAmount: number;
  };
  isEditable?: boolean;
}

export default function ProfileInfo({ user, isEditable }: ProfileInfoProps) {
  return (
    <div className={css.header}>
      <Image
        src={user.avatarUrl || user.avatar || "/default-avatar.png"}
        alt="User Avatar"
        width={145}
        height={145}
        className={css.avatar}
      />
      <div className={css.profileInfo}>
        <h2 className={css.userName}>{user.name}</h2>
        <p className={css.articles}>Статей: {user.articlesAmount}</p>
        {isEditable && (
          <div className={css.actions}>
            <Link href="/profile/edit" className={css.editBtn}>
              Редагувати профіль
            </Link>
            <Link href="/locations/add" className={css.addBtn}>
              + Поділитись локацією
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
