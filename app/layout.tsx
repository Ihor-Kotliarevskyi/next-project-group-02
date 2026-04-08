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
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"),
  title: {
    default: "Relax Map",
    template: "%s | Relax Map",
  },
  description: "Знаходьте та діліться місцями для відпочинку в Україні",
  openGraph: {
    type: "website",
    siteName: "Relax Map",
    title: "Relax Map",
    description: "Знаходьте та діліться місцями для відпочинку в Україні",
    locale: "uk_UA",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="uk" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
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
