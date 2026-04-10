import type { Metadata } from "next";
import Modal from "@/components/Modal/Modal";
import AddReviewForm from "@/app/@modal/(.)add-review/AddReviewForm";

export const metadata: Metadata = {
  title: "Додати відгук",
  description: "Залиште відгук про місце відпочинку на Relax Map",
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ locationId?: string }>;
}

export default async function AddReviewPage({ searchParams }: Props) {
  const { locationId } = await searchParams;

  return (
    <Modal>
      <AddReviewForm locationId={locationId ?? ""} />
    </Modal>
  );
}
