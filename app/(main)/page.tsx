import HeroBlock from "@/components/HeroBlock/HeroBlock";
import AdvantagesBlock from "@/components/AdvantagesBlock/AdvantagesBlock";
import PopularLocationsBlock from "@/components/PopularLocationsBlock/PopularLocationsBlock";
import ReviewsBlock from "@/components/ReviewsBlock/ReviewsBlock";

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
