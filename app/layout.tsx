import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { Toaster } from "react-hot-toast";
import "modern-normalize";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Relax Map",
  description: "Знаходьте та діліться місцями для відпочинку в Україні",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="uk" className={montserrat.variable}>
      <body>
        <TanStackProvider>
          <AuthProvider>
            {children}
            {modal}
          </AuthProvider>
          <Toaster position="top-right" />
        </TanStackProvider>
      </body>
    </html>
  );
}