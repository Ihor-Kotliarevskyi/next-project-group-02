import { redirect } from "next/navigation";
import { getMeServer } from "@/lib/api/serverApi";
import Modal from "@/components/Modal/Modal";
import AddReviewForm from "./AddReviewForm";

interface Props {
  searchParams: Promise<{ locationId?: string }>;
}

export default async function AddReviewPage({ searchParams }: Props) {
  try {
    await getMeServer();
  } catch {
    redirect("/auth-prompt");
  }

  const { locationId } = await searchParams;
  return (
    <Modal>
      <AddReviewForm locationId={locationId ?? ""} />
    </Modal>
  );
}
