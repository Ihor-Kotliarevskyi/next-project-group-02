import type { Metadata } from "next";
import LocationList from "@/components/LocationList/LocationList";

export const metadata: Metadata = {
  title: "Усі локації",
  description: "Перегляньте всі місця для відпочинку в Україні на Relax Map",
  openGraph: {
    title: "Усі локації | Relax Map",
    description: "Перегляньте всі місця для відпочинку в Україні на Relax Map",
  },
};

export default function LocationsPage() {
  return (
    <main>
      <LocationList />
    </main>
  );
}
