import React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import "modern-normalize";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-manrope",
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
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={montserrat.variable}>
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
          <Toaster position="top-right" />
        </TanStackProvider>
      </body>
    </html>
  );
}
