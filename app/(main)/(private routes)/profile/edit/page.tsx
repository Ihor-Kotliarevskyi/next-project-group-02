import type { Metadata } from "next";
import { getMeServer } from "@/lib/api/serverApi";
import ProfileEditForm from "@/components/ProfileEditForm/ProfileEditForm";
import css from "./EditPage.module.css";

export const metadata: Metadata = {
  title: "Редагування профілю",
  description: "Редагуйте свій профіль на Relax Map",
  robots: { index: false },
};

export default async function Page() {
  const user = await getMeServer();

  if (!user) return null;

  return (
    <main className={css.wrapper}>
      <ProfileEditForm user={user} />
    </main>
  );
}
