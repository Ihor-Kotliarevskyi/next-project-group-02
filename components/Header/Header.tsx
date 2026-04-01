import css from "./Header.module.css";
import Link from "next/link";

export default function Header() {
  const isAuth = false;
  return (
    <header>
      <div className={css.header}>
        <Link href="/" className={css.logo}>
          Relax Map
        </Link>
        <nav className={css.nav}>
          <ul className={css.navigation}>
            {!isAuth && (
              <li>
                <Link href="/">Головна</Link>
              </li>
            )}

            <li>
              <Link href="/locations">Місця відпочинку</Link>
            </li>
            {isAuth && (
              <li>
                <Link href="/pro">Мій Профіль</Link>
              </li>
            )}
          </ul>
          <div className={css.btn}>
            {!isAuth ? (
              <>
                <Link href="/login" className={css.loginBtn}>
                  Вхід
                </Link>
                <Link href="/register" className={css.signupBtn}>
                  Реєстрація
                </Link>
              </>
            ) : (
              <>
                <Link href="/locations/add" className={css.locationBtn}>
                  Поділитися локацією
                </Link>
                <div className={css.user}>
                  <img src="#" alt="User avatar" className={css.avatar} />
                  <span className={css.username}></span>
                  <button className={css.exitBtn}>Вийти</button>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
