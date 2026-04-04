import Link from 'next/link';
import css from './ProfilePlaceholder.module.css';

interface ProfilePlaceholderProps {
  isOwnProfile: boolean;
}

export default function ProfilePlaceholder({ isOwnProfile }: ProfilePlaceholderProps) {
  return (
    <div className={css.wraper}>
      <div className={css.noLocationsMessage}>
        <p className={css.text}>
          {isOwnProfile
            ? 'Ви ще нічого не публікували, поділіться своєю першою локацією!'
            : 'Цей користувач ще не ділився локаціями'}
        </p>
        <button type="button" className={css.buttonAdd}>
          <Link
            href={isOwnProfile ? '/locations/add' : '/locations'}
            className={css.locationAddLink}
          >
            {isOwnProfile ? 'Поділитися локацією' : 'Назад до локацій'}
          </Link>
        </button>
      </div>
    </div>
  );
}
