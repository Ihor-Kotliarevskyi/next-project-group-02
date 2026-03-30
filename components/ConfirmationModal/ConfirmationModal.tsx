'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { logout as logoutApi } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import css from './ConfirmationModal.module.css';

export default function ConfirmationModal() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = () => {
    router.back();
  };

const handleConfirm = async () => {
  try {
    setError('');
    setIsLoading(true);

    await logoutApi();

    logout(); 

    router.back(); 
  } catch {
    setError('Не вдалося виконати вихід. Спробуйте ще раз.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Modal>
      <div className={css.content}>
        <h2 className={css.title}>Ви точно хочете вийти?</h2>
        <p className={css.text}>Ми будемо сумувати за вами!</p>

        {error ? <p className={css.error}>{error}</p> : null}

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelBtn}
            onClick={handleCancel}
            disabled={isLoading}
          >
            Скасувати
          </button>

          <button
            type="button"
            className={css.confirmBtn}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Завантаження...' : 'Вийти'}
          </button>
        </div>
      </div>
    </Modal>
  );
}