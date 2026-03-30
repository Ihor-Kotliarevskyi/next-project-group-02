"use client";

import Link from "next/link";
import styles from "./AuthPromptContent.module.css";

export default function AuthPromptContent() {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Увійдіть, щоб залишити відгук</h2>
      <p className={styles.subtitle}>
        Тільки авторизовані користувачі можуть залишати відгуки.
      </p>
      <div className={styles.actions}>
        <Link href="/login" className={styles.primary}>
          Увійти
        </Link>
        <Link href="/register" className={styles.secondary}>
          Зареєструватися
        </Link>
      </div>
    </div>
  );
}
