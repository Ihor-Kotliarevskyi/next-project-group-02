"use client";

import Modal from "@/components/Modal/Modal";
import { ScaleLoader } from "react-spinners";
import styles from "./loading.module.css";

export default function ModalLoading() {
  return (
    <Modal>
      <div className={styles.wrapper}>
        <ScaleLoader color="#E76F51" aria-label="Завантаження" />
      </div>
    </Modal>
  );
}
