import type { Metadata } from "next";
import AuthPromptModal from "@/components/AuthPromptModal/AuthPromptModal";

export const metadata: Metadata = {
  title: "Увійдіть до акаунту",
  description: "Увійдіть або зареєструйтесь, щоб продовжити",
  robots: { index: false },
};

export default function AuthPromptPage() {
  return <AuthPromptModal />;
}
