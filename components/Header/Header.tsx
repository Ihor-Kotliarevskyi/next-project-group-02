"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./Header.module.css";
import Logo from "../Logo/Logo";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Головна" },
    { href: "/locations", label: "Місця відпочинку" },
  ];

  return (
    <header className={css.header}>
      <div className={css.inner}>
        {/* Logo */}
        {/* <Link href="/" className={css.logo} onClick={closeMenu}>
          Relax Map
        </Link> */}

        {/* onClick={closeMenu} */}
        <Logo />

        {/* Desktop nav */}
        <nav className={css.nav}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${css.navLink} ${pathname === href ? css.active : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className={css.auth}>
          {user ? (
            <>
              <Link href={`/profile/${user._id}`} className={css.profileLink}>
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    className={css.avatar}
                    width={32}
                    height={32}
                  />
                ) : (
                  <span className={css.avatarFallback}>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className={css.userName}>{user.name}</span>
              </Link>
              <Link href="/logout-confirm" className={css.logoutBtn}>
                Вийти
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={css.loginBtn}>
                Увійти
              </Link>
              <Link href="/register" className={css.registerBtn}>
                Реєстрація
              </Link>
            </>
          )}
        </div>
        {/* </div> */}
        {/* Burger button */}
        <button
          type="button"
          className={css.burger}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Відкрити меню"
          aria-expanded={menuOpen}
        >
          <span
            className={`${css.burgerLine} ${menuOpen ? css.burgerOpen : ""}`}
          />
          <span
            className={`${css.burgerLine} ${menuOpen ? css.burgerOpen : ""}`}
          />
          <span
            className={`${css.burgerLine} ${menuOpen ? css.burgerOpen : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={css.mobileMenu}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${css.mobileLink} ${pathname === href ? css.active : ""}`}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}

          <div className={css.mobileDivider} />

          {user ? (
            <>
              <Link
                href={`/profile/${user._id}`}
                className={css.mobileLink}
                onClick={closeMenu}
              >
                Профіль
              </Link>
              <Link
                href="/logout-confirm"
                className={css.mobileLink}
                onClick={closeMenu}
              >
                Вийти
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={css.mobileLink}
                onClick={closeMenu}
              >
                Увійти
              </Link>
              <Link
                href="/register"
                className={css.mobileLink}
                onClick={closeMenu}
              >
                Реєстрація
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
