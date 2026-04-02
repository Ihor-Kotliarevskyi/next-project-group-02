import Link from "next/link";
import css from "./Logo.module.css";
import Image from "next/image";

type LogoProps = {
  onClick?: () => void;
};

export default function Logo({ onClick }: LogoProps) {
  return (
    <div className={css.logoContainer}>
      <Link href="/" onClick={onClick} className={css.logoLink}>
        <Image
          src="/images/map_search.png"
          alt="Relax Map logo"
          width={24}
          height={24}
          className={css.logoImg}
        />
        <span className={css.logoText}>Relax Map</span>
      </Link>
    </div>
  );
}
