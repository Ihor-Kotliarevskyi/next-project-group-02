import Link from "next/link";
import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.inner}>
        <Link href="/" className={css.logo}>
          Relax Map
        </Link>

        <nav className={css.nav}>
          <Link href="/" className={css.link}>
            Головна
          </Link>
          <Link href="/locations" className={css.link}>
            Локації
          </Link>
        </nav>

        <p className={css.copy}>
          &copy; {new Date().getFullYear()} Relax Map Map
        </p>
      </div>
    </footer>
  );
}
