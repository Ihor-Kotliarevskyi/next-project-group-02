'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import type { User } from '@/types/user';

async function fetchCurrentUser(): Promise<User> {
  const res = await fetch('/api/users/me');
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const { data, error } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  useEffect(() => {
    if (error) logout();
  }, [error, logout]);

  return <>{children}</>;
}
