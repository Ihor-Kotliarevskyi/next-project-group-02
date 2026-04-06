"use client";

import Image from "next/image";
import Logo from "../Logo/Logo";
import css from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.inner}>
          <button
            onClick={handleScrollToTop}
            className={css.logoWrapper}
            aria-label="Scroll to top"
          >
            <Logo />
          </button>
          <ul className={css.socials}>
            <li className={css.facebook}>
              <Link href="https://www.facebook.com" target="_blank">
                <Image
                  src="/facebook.svg"
                  alt="Facebook logo"
                  width={24}
                  height={24}
                  className={css.logoImg}
                />
              </Link>
            </li>
            <li className={css.instagram}>
              <Link href="https://www.instagram.com" target="_blank">
                <Image
                  src="/instagram.svg"
                  alt="Instagram logo"
                  width={24}
                  height={24}
                  className={css.logoImg}
                />
              </Link>
            </li>
            <li className={css.x}>
              <Link href="https://x.com" target="_blank">
                <Image
                  src="/x.svg"
                  alt="X logo"
                  width={24}
                  height={24}
                  className={css.logoImg}
                />
              </Link>
            </li>
            <li className={css.youtube}>
              <Link href="https://www.youtube.com" target="_blank">
                <Image
                  src="/youtube.svg"
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
