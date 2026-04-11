import type { Metadata } from "next";
import { Suspense } from "react";
import UserList from "@/components/UserList/UserList";

export const metadata: Metadata = {
  title: "Автори | Relax Map",
  description: "Усі автори локацій на Relax Map",
  openGraph: {
    title: "Автори | Relax Map",
    description: "Усі автори локацій на Relax Map",
  },
};

export default function UsersPage() {
  return (
    <main>
      <Suspense>
        <UserList />
      </Suspense>
    </main>
  );
}
