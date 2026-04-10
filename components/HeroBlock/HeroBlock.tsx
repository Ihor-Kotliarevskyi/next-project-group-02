import Image from "next/image";
import Link from "next/link";
import styles from "./HeroBlock.module.css";

export default function HeroBlock() {
  return (
    <section className={styles.hero}>
      <Image
        src="/images/hero-bg.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        quality={85}
        className={styles.heroImage}
      />
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <h3 className={styles.heroSubtitle}>
          Кожен куточок твоєї країни - це історія, яку варто пережити.
          Знайди ідеальне місце для відпочинку серед тисяч перевірених локацій.
        </h3>
        <h1 className={styles.heroTitle}>Рідна. Незвідана. Твоя.</h1>
        <div className={styles.heroCta}>
          <Link href="/locations" className={styles.heroBtn}>
            Місця відпочинку
          </Link>
        </div>
      </div>
    </section>
  );
}
