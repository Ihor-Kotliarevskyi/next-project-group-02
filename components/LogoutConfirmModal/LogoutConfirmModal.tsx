"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import { logout as logoutApi } from "@/lib/api/clientApi";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";

export default function LogoutConfirmModal() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } finally {
      logout();
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      setIsLoading(false);
      window.location.href = "/";
    }
  };

  return (
    <ConfirmationModal
      title="Ви точно хочете вийти?"
      text="Ми будемо сумувати за вами!"
      confirmLabel="Вийти"
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}
