"use client";

import Modal from "@/components/Modal/Modal";
import { ScaleLoader } from "react-spinners";

export default function ModalLoading() {
  return (
    <Modal>
      <div style={{ display: "flex", justifyContent: "center", padding: "32px" }}>
        <ScaleLoader color="#E76F51" aria-label="Завантаження" />
      </div>
    </Modal>
  );
}
