import type { Metadata } from "next";
import AuthNav from "@/components/AuthComponent/AuthNav/AuthNav";
import LoginForm from "@/components/AuthComponent/LoginForm/LoginForm";

export const metadata: Metadata = {
  title: "Вхід",
  description: "Увійдіть до свого акаунту Relax Map",
  openGraph: {
    title: "Вхід | Relax Map",
    description: "Увійдіть до свого акаунту Relax Map",
  },
};

export default function Page() {
  return (
    <>
      <AuthNav />
      <LoginForm />
    </>
  );
}
