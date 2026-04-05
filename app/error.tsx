"use client";

import styles from "./error.module.css";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className={styles.wrapper}>
      <h1>Щось пішло не так!</h1>
      <p>Виникла непередбачена помилка. Спробуйте ще раз.</p>
      <button onClick={reset} className={styles.button}>
        Спробувати ще раз
      </button>
    </main>
  );
}
