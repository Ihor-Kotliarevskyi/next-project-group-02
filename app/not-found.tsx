import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", minHeight: "50vh" }}>
      <h1>404 — Сторінку не знайдено</h1>
      <p>На жаль, сторінка, яку ви шукаєте, не існує.</p>
      <Link href="/">Повернутися на головну</Link>
    </main>
  );
}
