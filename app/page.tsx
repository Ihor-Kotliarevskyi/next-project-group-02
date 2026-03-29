import LocationList from "@/components/LocationList/LocationList";
import ReviewsBlock from "@/components/ReviewsBlock/ReviewsBlock";

export default function Page() {
  return (
    <main>
      {/* HeroBlock — handled by another developer */}
      {/* AdvantagesBlock — handled by another developer */}

      {/* Список локацій */}
      <LocationList locations={[]} regions={[]} locationTypes={[]} />

      {/* Останні відгуки — slider with reviews from all locations */}
      <ReviewsBlock />
    </main>
  );
}
