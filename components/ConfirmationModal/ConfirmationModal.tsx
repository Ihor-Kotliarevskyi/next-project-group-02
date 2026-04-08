"use client";

import Modal from "@/components/Modal/Modal";
import css from "./ConfirmationModal.module.css";

type ConfirmationModalProps = {
  title: string;
  text?: string;
  confirmLabel: string;
  cancelLabel?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({
  title,
  text,
  confirmLabel,
  cancelLabel = "Скасувати",
  loadingLabel = "Завантаження...",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal onClose={onCancel}>
      <div className={css.content}>
        <h2 className={css.title}>{title}</h2>
        {text && <p className={css.text}>{text}</p>}

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelBtn}
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className={css.confirmBtn}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
