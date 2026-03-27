import { Feedback } from "../../types/feedBackCard";

export const FeedBackCard = ({ userName, description, rate }: Feedback) => {
  return (
    <div className="card">
      <div>⭐ {rate}</div>
      <p>{description}</p>
      <span>{userName}</span>
    </div>
  );
};
