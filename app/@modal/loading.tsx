<<<<<<< HEAD
export default function Loading() {
  return null;
=======
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
>>>>>>> bed9d5414c85599f756c6a96211ee465a7399682
}
