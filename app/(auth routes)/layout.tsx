import Link from "next/link";
import css from "@/components/AuthComponent/AuthNav/Auth.module.css";
import Logo from "@/components/Logo/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={css.wrapper}>
      <header className={css.header}>
        <Logo />
      </header>

      <main className={css.content}>{children}</main>

      <footer className={css.footer}>
        <p>© 2026 Relax Map</p>
      </footer>
    </div>
  );
}
