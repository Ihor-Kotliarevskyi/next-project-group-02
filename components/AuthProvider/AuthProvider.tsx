"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import { getMe } from "@/lib/api/clientApi";
import type { User } from "@/types/user";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const { data, error } = useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) setUser(data);
    else if (data === null) logout();
  }, [data, setUser, logout]);

  useEffect(() => {
    if (error) logout();
  }, [error, logout]);

  return <>{children}</>;
}
