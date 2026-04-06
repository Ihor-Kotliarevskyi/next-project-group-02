import type { Metadata } from "next";
import HeroBlock from "@/components/HeroBlock/HeroBlock";
import AdvantagesBlock from "@/components/AdvantagesBlock/AdvantagesBlock";
import PopularLocationsBlock from "@/components/PopularLocationsBlock/PopularLocationsBlock";
import ReviewsBlock from "@/components/ReviewsBlock/ReviewsBlock";

export const metadata: Metadata = {
  title: "Головна",
  description: "Знаходьте та діліться найкращими місцями для відпочинку в Україні",
  openGraph: {
    title: "Relax Map — місця для відпочинку в Україні",
    description: "Знаходьте та діліться найкращими місцями для відпочинку в Україні",
  },
};

export default function HomePage() {
  return (
    <main>
      <HeroBlock />
      <AdvantagesBlock />
      <PopularLocationsBlock />
      <ReviewsBlock />
    </main>
  );
}
