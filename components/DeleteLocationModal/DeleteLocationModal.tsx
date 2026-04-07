"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteLocation } from "@/lib/api/clientApi";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";

type DeleteLocationModalProps = {
  locationId: string;
  locationName?: string;
  onClose: () => void;
};

export default function DeleteLocationModal({
  locationId,
  locationName,
  onClose,
}: DeleteLocationModalProps) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteLocation(locationId),
    onSuccess: () => {
      toast.success("Локацію видалено", {
        style: {
          background: "#cc6534",
          color: "#ffffff",
        },
        iconTheme: {
          primary: "#ffffff",
          secondary: "#cc6534",
        },
      });
      onClose();
      router.refresh();
    },
    onError: () => {
      toast.error("Не вдалося видалити локацію. Спробуйте ще раз.");
    },
  });

  return (
    <ConfirmationModal
      title="Видалити локацію?"
      text={
        locationName
          ? `Локація «${locationName}» та всі відгуки до неї будуть видалені назавжди.`
          : "Локація та всі відгуки до неї будуть видалені назавжди."
      }
      confirmLabel="Видалити"
      loadingLabel="Видалення..."
      isLoading={isPending}
      onConfirm={() => mutate()}
      onCancel={onClose}
    />
  );
}
