import css from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className={css.footer}>
        <Link href="/" className={css.logo}>
          Relax Map
        </Link>
        <ul className={css.socials}>
          <li className={css.facebook}>
            <Link href="https://www.facebook.com">FB</Link>
          </li>
          <li className={css.instagram}>
            <Link href="https://www.instagram.com">In</Link>
          </li>
          <li className={css.x}>
            <Link href="https://x.com">X</Link>
          </li>
          <li className={css.youtube}>
            <Link href="https://www.youtube.com">YouTube</Link>
          </li>
        </ul>
        <ul className={css.footerNav}>
          <li>
            <Link href="/">Головна</Link>
          </li>
          <li>
            <Link href="/locations">Місця відпочинку</Link>
          </li>
        </ul>
        <div className={css.copy}>
          <p>
            © <time dateTime="2025">2025</time> Природні Мандри. Усі права
            захищені.
          </p>
        </div>
      </div>
    </footer>
  );
}
