import FeedbackSection from "@/components/ReviewsSection/ReviewsSection";
import LocationList from "@/components/LocationList/LocationList";

export default function Page() {
  return (
    <main>
      <h1>Главная страница</h1>

      {/* Код из main: список локаций */}
      <LocationList locations={[]} regions={[]} locationTypes={[]} />

      {/* Твой код: секция отзывов */}
      <FeedbackSection locationId="68d568270e6bcc357e9833ef" />
    </main>
  );
}
