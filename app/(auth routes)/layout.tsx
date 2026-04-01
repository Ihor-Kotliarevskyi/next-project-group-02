import Link from "next/link";
import css from "@/components/AuthComponent/AuthNav/Auth.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className={css.header}>
        <Link href="/">
          <h1 className={css.logo}>Relax Map</h1>
        </Link>
      </header>

      <main className={css.content}>{children}</main>

      <footer className={css.footer}>
        <p>© 2026 Relax Map</p>
      </footer>
    </>
  );
}