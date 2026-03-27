"use client";
import { useEffect, useState } from "react";
import { getFeedbacks } from "@/lib/api/feedbacks";
import { FeedBackCard } from "../FeedBackCard/FeedBackCard";
import { Feedback } from "../../types/feedBackCard";
export const ReviewsSection = ({ locationId }: { locationId: string }) => {
  const [reviews, setReviews] = useState<Feedback[]>([]);

  useEffect(() => {
    getFeedbacks(locationId).then((res) => {
      setReviews(res.data);
    });
  }, [locationId]);

  return (
    <div>
      <h2>Відгуки</h2>

      <div className="grid">
        {reviews.map((review) => (
          <FeedBackCard
            key={review._id}
            _id={review._id}
            userName={review.userName}
            description={review.description}
            rate={review.rate}
          />
        ))}
      </div>
    </div>
  );
};
export default ReviewsSection;
