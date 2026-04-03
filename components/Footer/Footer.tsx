import Image from "next/image";
import Logo from "../Logo/Logo";
import css from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.footerContainer}>
        <div className={css.inner}>
          <Logo />
          <ul className={css.socials}>
            <li className={css.facebook}>
              <Link href="https://www.facebook.com">
                <Image
                  src="/images/facebook.png"
                  alt="Facebook logo"
                  width={24}
                  height={24}
                  className={css.logoImg}
                />
              </Link>
            </li>
            <li className={css.instagram}>
              <Link href="https://www.instagram.com">
                <Image
                  src="/images/instagram.png"
                  alt="Instagram logo"
                  width={24}
                  height={24}
                  className={css.logoImg}
                />
              </Link>
            </li>
            <li className={css.x}>
              <Link href="https://x.com">
                <Image
                  src="/images/x.png"
                  alt="X logo"
                  width={24}
                  height={24}
                  className={css.logoImg}
                />
              </Link>
            </li>
            <li className={css.youtube}>
              <Link href="https://www.youtube.com">
                <Image
                  src="/images/youtube.png"
                  alt="YouTube logo"
                  width={24}
                  height={24}
                  className={css.logoImg}
                />
              </Link>
            </li>
          </ul>

          <ul className={css.footerNav}>
            <li className={css.items}>
              <Link href="/" className={css.itemsLink}>
                Головна
              </Link>
            </li>
            <li className={css.items}>
              <Link href="/locations" className={css.itemsLink}>
                Місця відпочинку
              </Link>
            </li>
          </ul>
        </div>
        <hr className={css.line} />
        <div className={css.copy}>
          <p>
            &copy; {new Date().getFullYear()} Природні Мандри. Усі права
            захищені.
          </p>
        </div>
      </div>
    </footer>
  );
}
