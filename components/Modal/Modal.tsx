"use client";

import { useRouter } from "next/navigation";
import styles from "./Modal.module.css";

interface ModalProps {
    children: React.ReactNode;
}

export default function Modal({ children }: ModalProps) {
    const router = useRouter();

    return (
    <div className={styles.overlay} onClick={() => router.back()}>
        <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        >
        <button
            className={styles.closeBtn}
            onClick={() => router.back()}
            aria-label="Закрити"
        >
            ✕
        </button>
        {children}
        </div>
    </div>
    );
}
