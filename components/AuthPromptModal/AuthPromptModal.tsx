'use client';

import Link from 'next/link';
import Modal from '@/components/Modal/Modal';
import css from './AuthPromptModal.module.css';

export default function AuthPromptModal() {
  return (
    <Modal>
      <div className={css.content}>
        <h2 className={css.title}>Щоб продовжити, увійдіть або зареєструйтеся</h2>
        <p className={css.text}>
          Залишати відгуки можуть лише авторизовані користувачі.
        </p>

        <div className={css.actions}>
          <Link href="/login" className={css.loginBtn}>
            Увійти
          </Link>

          <Link href="/register" className={css.registerBtn}>
            Зареєструватися
          </Link>
        </div>
      </div>
    </Modal>
  );
}