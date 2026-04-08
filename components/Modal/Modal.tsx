"use client";

import {
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import css from "./Modal.module.css";
import Icon from "@/components/Icon/Icon";

type ModalProps = {
  children: ReactNode;
  onClose?: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  }, [onClose, router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [closeModal]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      contentRef.current &&
      !contentRef.current.contains(event.target as Node)
    ) {
      closeModal();
    }
  };

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal} ref={contentRef}>
        <button
          type="button"
          className={css.closeBtn}
          onClick={closeModal}
          aria-label="Закрити модальне вікно"
        >
          <Icon name="close" width={14} height={14} aria-hidden={true} />
        </button>
        {children}
      </div>
    </div>
  );
}
