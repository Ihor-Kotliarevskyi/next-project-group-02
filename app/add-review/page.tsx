import Modal from "@/components/Modal/Modal";
import AddReviewForm from "@/app/@modal/(.)add-review/AddReviewForm";

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
