"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./Header.module.css";
import Logo from "../Logo/Logo";
import Image from "next/image";
import Logout from "../Logout/Logout";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    router.push(`/locations?search=${encodeURIComponent(trimmedQuery)}`);
    setQuery("");
    setMenuOpen(false);
  }, [query, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch],
  );

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Головна" },
  ];

    const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <header className={css.header}>
      <div className={css.inner}>
<button
            onClick={handleScrollToTop}
            className={css.logoWrapper}
            aria-label="Scroll to top"
          >
            <Logo />
          </button>
        <div className={css.headerSearch}>
          <input
            type="text"
            className={css.headerSearchInput}
            placeholder="Пошук локацій..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={css.headerSearchBtn} onClick={handleSearch}>
            Знайти
          </button>
        </div>

        <div className={css.rightSide}>
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

          <div className={css.auth}>
            {user ? (
              <>
                <Link href="/locations/add" className={css.locationAdd}>
                  Поділитись локацією
                </Link>
                <Link href={`/profile`} className={css.profileLink}>
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
                <div className={css.exitHeader}>
                  <Logout />
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className={css.loginBtn}>
                  Вхід
                </Link>
                <Link href="/register" className={css.registerBtn}>
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>

        <ThemeToggle />

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

      {menuOpen && (
        <div className={css.mobileMenu}>
          <div className={css.mobileSearch}>
            <input
              type="text"
              className={css.mobileSearchInput}
              placeholder="Пошук локацій..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={css.mobileSearchBtn} onClick={handleSearch}>
              Знайти
            </button>
          </div>

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

          {user ? (
            <>
              <div className={css.mobileAuthContainer}>
                <Link href="/locations/add" className={css.mobileLocationAdd}>
                  Поділитись локацією
                </Link>
                <div className={css.mobileAuth}>
                  <Link href={`/profile`} className={css.mobileProfileLink}>
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        className={css.mobileAvatar}
                        width={32}
                        height={32}
                      />
                    ) : (
                      <span className={css.mobileAvatarFallback}>
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className={css.mobileUserName}>{user.name}</span>
                  </Link>
                  <Link
                    href="/logout-confirm"
                    className={css.mobileLink}
                    onClick={closeMenu}
                  >
                    <Image
                      src="/logout.svg"
                      alt="Exit"
                      width={24}
                      height={24}
                      className={css.logoutIcon}
                    />
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className={css.mobileGuestContainer}>
              <div className={css.mobileNotAuth}>
                <Link
                  href="/login"
                  className={css.mobileLinkLog}
                  onClick={closeMenu}
                >
                  Вхід
                </Link>
                <Link
                  href="/logout-confirm"
                  className={css.mobileLink}
                  scroll={false}
                  onClick={closeMenu}
                >
                  Реєстрація
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
