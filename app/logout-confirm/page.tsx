import type { Metadata } from "next";
import LogoutConfirmModal from "@/components/LogoutConfirmModal/LogoutConfirmModal";

export const metadata: Metadata = {
  title: "Підтвердження виходу",
  description: "Підтвердіть вихід із акаунту Relax Map",
  robots: { index: false },
};

export default function LogoutConfirmPage() {
  return <LogoutConfirmModal />;
}
