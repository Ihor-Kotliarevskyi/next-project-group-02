import styles from "./AdvantagesBlock.module.css";
import Icon from "@/components/Icon/Icon";

const advantages = [
  {
    icon: "reviews-icon",
    title: "Реальні відгуки",
    text: "Користувачі діляться чесними враженнями, щоб ви робили правильний вибір.",
  },
  {
    icon: "filters-icon",
    title: "Зручні фільтри",
    text: "Шукайте за типом локації, регіоном, наявністю зручностей та іншими критеріями.",
  },
  {
    icon: "community-icon",
    title: "Спільнота мандрівників",
    text: "Додавайте власні улюблені місця та діліться своїми неймовірними знахідками.",
  },
];

export default function AdvantagesBlock() {
  return (
    <section className={styles.advantagesSection}>
      <div className={styles.advantagesContainer}>
      <h2 className={styles.advantagesTitle}>Ключові переваги</h2>

      <div className={styles.advantagesGrid}>
        {advantages.map((item, index) => (
          <div key={index} className={styles.advantagesCard}>
            <div className={styles.advantagesIcon}>
              <Icon
                name={item.icon}
                width={64}
                height={64}
                className={styles.advantagesIconImg}
                aria-hidden={true}
              />
            </div>

            <h3 className={styles.advantagesCardTitle}>
              {item.title}
            </h3>

            <p className={styles.advantagesCardText}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
