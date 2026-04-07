import { getMeServer } from "@/lib/api/serverApi";
import Modal from "@/components/Modal/Modal";
import ProfileEditForm from "@/components/ProfileEditForm/ProfileEditForm";

export default async function ProfileEditModalPage() {
  const user = await getMeServer();

  if (!user) return null;

  return (
    <Modal>
      <ProfileEditForm user={user} />
    </Modal>
  );
}
