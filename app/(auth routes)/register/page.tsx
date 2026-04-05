import type { Metadata } from "next";
import AuthNav from "@/components/AuthComponent/AuthNav/AuthNav";
import RegistrationForm from "@/components/AuthComponent/RegistrationForm/RegistrationForm";

export const metadata: Metadata = {
  title: "Реєстрація",
  description: "Створіть акаунт Relax Map для пошуку місць відпочинку",
  openGraph: {
    title: "Реєстрація | Relax Map",
    description: "Створіть акаунт Relax Map для пошуку місць відпочинку",
  },
};

export default function Page() {
  return (
    <>
      <AuthNav />
      <RegistrationForm />
    </>
  );
}
