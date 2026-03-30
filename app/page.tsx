import HeroBlock from "@/components/HeroBlock/HeroBlock";
import LocationList from "@/components/LocationList/LocationList";
import ReviewsBlock from "@/components/ReviewsBlock/ReviewsBlock";
import AdvantagesBlock from "@/components/AdvantagesBlock/AdvantagesBlock";

export default function HomePage() {
  return (
    <main>
      <HeroBlock />
      <LocationList />
      <ReviewsBlock />
      <AdvantagesBlock />
    </main>
  );
}
