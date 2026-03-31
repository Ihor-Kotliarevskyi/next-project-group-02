'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { logout as logoutApi } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import css from './ConfirmationModal.module.css';

export default function ConfirmationModal() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    window.history.back();
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } finally {
      logout();
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      setIsLoading(false);
      window.location.href = '/';
    }
  };

  return (
    <Modal>
      <div className={css.content}>
        <h2 className={css.title}>Ви точно хочете вийти?</h2>
        <p className={css.text}>Ми будемо сумувати за вами!</p>

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