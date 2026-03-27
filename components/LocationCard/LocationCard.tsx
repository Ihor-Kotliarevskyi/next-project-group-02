import Image from "next/image";
import ReactStars from "react-rating-stars-component";
import styles from "./LocationCard.module.css";
import { Location } from "@/types/location";

type LocationCardProps = Pick<
  Location,
  "_id" | "image" | "name" | "locationType" | "rate"
>;

export default function LocationCard({
  _id,
  image,
  name,
  locationType,
  rate,
}: LocationCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image src={image} alt={name} fill className={styles.image} />
      </div>
      <div className={styles.content}>
        <p className={styles.type}>{locationType}</p>
        <div className={styles.rating}>
          <ReactStars
            count={5}
            value={rate}
            isHalf={true}
            edit={false}
            size={20}
            activeColor="#FFC107"
          />
        </div>
        <h3 className={styles.title}>{name}</h3>
        <button className={styles.button}>Переглянути локацію</button>
      </div>
    </div>
  );
}
