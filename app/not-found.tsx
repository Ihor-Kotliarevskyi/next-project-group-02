import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Сторінку не знайдено",
  description: "На жаль, сторінка, яку ви шукаєте, не існує",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className={styles.wrapper}>
      <h1>404 — Сторінку не знайдено</h1>
      <p>На жаль, сторінка, яку ви шукаєте, не існує.</p>
      <Link href="/">Повернутися на головну</Link>
    </main>
  );
}
