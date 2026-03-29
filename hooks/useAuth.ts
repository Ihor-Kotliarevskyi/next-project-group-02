'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { FormikHelpers } from 'formik';
import { useAuthStore } from '@/lib/store/authStore';

type LoginValues = {
  email: string;
  password: string;
};

type RegisterValues = {
  name: string;
  email: string;
  password: string;
};

export function useAuth(redirectTo: string = '/') {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  async function submitAuth<T extends LoginValues | RegisterValues>(
    isLogin: boolean,
    values: T,
    helpers: FormikHelpers<T>
  ) {
    const { setSubmitting, setFieldError, resetForm } = helpers;
    const loading = toast.loading(isLogin ? 'Вхід...' : 'Реєстрація...');

    try {
      const res = await fetch(isLogin ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        const message =
          data?.response?.message ||
          data?.response?.error ||
          data?.error ||
          'Помилка';
        throw new Error(message);
      }

      if (!data) throw new Error('Користувача не отримано');

      setUser(data);
      resetForm();
      toast.success(isLogin ? 'Успішний вхід' : 'Реєстрація успішна');
      router.push(redirectTo);
      router.refresh()

    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Щось пішло не так';

      if (message.toLowerCase().includes('email')) {
        setFieldError('email', message);
      } else if (message.toLowerCase().includes('password')) {
        setFieldError('password', message);
      }

      toast.error(message);
    } finally {
      toast.dismiss(loading);
      setSubmitting(false);
    }
  }

  return { submitAuth };
}