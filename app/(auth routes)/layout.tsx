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
          <span className={css.logo}>Relax Map</span>
        </Link>
      </header>

      <main className={css.content}>{children}</main>

      <footer className={css.footer}>
        <p>© 2026 Relax Map</p>
      </footer>
    </>
  );
}
