import styles from "./AdvantagesBlock.module.css";
import Image from "next/image";

const advantages = [
  {
    icon: "/iconsAdvantage/reviews.svg",
    title: "Реальні відгуки",
    text: "Користувачі діляться чесними враженнями, щоб ви робили правильний вибір.",
  },
  {
    icon: "/iconsAdvantage/filters.svg",
    title: "Зручні фільтри",
    text: "Шукайте за типом локації, регіоном, ціною та іншими параметрами.",
  },
  {
    icon: "/iconsAdvantage/community.svg",
    title: "Спільнота мандрівників",
    text: "Додавайте власні улюблені місця та діліться досвідом.",
  },
];

export default function AdvantagesBlock() {
  return (
    <section className={styles.advantagesSection}>
      <h2 className={styles.advantagesTitle}>Ключові переваги</h2>

      <div className={styles.advantagesGrid}>
        {advantages.map((item, index) => (
          <div key={index} className={styles.advantagesCard}>
            <div className={styles.advantagesIcon}>
              <Image
                src={item.icon}
                alt={item.title}
                fill
                className={styles.advantagesIconImg}
              />
            </div>

            <h3 className={styles.advantagesCardTitle}>{item.title}</h3>
            <p className={styles.advantagesCardText}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
