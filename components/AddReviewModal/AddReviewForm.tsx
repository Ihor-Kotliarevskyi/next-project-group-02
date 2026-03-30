"use client";

import { useState } from "react";

import { api } from ""; 
import { ReactComponent as Star } from "";
import { ReactComponent as StarHalf } from "";
import { ReactComponent as StarFilled } from "";


import styles from "./AddReviewForm.module.css";

export const AddReviewForm = ({
  locationId,
  onSuccess,
  isLoggedIn = false,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (rating < 1) newErrors.rating = "Оберіть рейтинг";

    if (!comment.trim()) {
      newErrors.comment = "Обов'язкове поле";
    } else if (comment.trim().length < 10) {
      newErrors.comment = "Мінімум 10 символів";
    } else if (comment.length > 100) {
      newErrors.comment = "Максимум 100 символів";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!validate()) return;

    try {
      setLoading(true);

      await api.addReview(locationId, {
        rating,
        text: comment,
      });

      onSuccess();
    } catch (error) {
      console.error("Помилка при відправці:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (index) => {
    const starNumber = index + 1;
    const halfValue = starNumber - 0.5;

    if (rating < halfValue) setRating(halfValue);
    else if (rating === halfValue) setRating(starNumber);
    else setRating(0);

    setErrors((prev) => ({ ...prev, rating: null }));
  };

  const renderStars = () =>
    [...Array(5)].map((_, index) => {
      const starNumber = index + 1;
      const halfValue = starNumber - 0.5;

      let icon;
      if (rating >= starNumber) icon = <StarFilled width={32} height={32} />;
      else if (rating >= halfValue) icon = <StarHalf width={32} height={32} />;
      else icon = <Star width={32} height={32} />;

      return (
        <button
          key={index}
          type="button"
          className={styles.starButton}
          onClick={() => handleStarClick(index)}
        >
          {icon}
        </button>
      );
    });

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <h3 className={styles.subtitle}>Ваш відгук</h3>

          <textarea
            placeholder="Напишіть ваш відгук"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setErrors((prev) => ({ ...prev, comment: null }));
            }}
            className={`${styles.textarea} ${
              errors.comment ? styles.textareaError : ""
            }`}
          />

          <div className={styles.warning}>
            {errors.comment && <p className={styles.error}>{errors.comment}</p>}
            <p className={styles.counter}>{comment.length}/100</p>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.stars}>{renderStars()}</div>
          {errors.rating && <p className={styles.error}>{errors.rating}</p>}
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onSuccess} className={styles.cancel}>
            Відмінити
          </button>

          <button type="submit" disabled={loading} className={styles.submit}>
            {loading ? "Відправка..." : "Надіслати"}
          </button>
        </div>
      </form>

    </>
  );
};