"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createFeedback, getMe } from "@/lib/api/clientApi";
import styles from "./AddReviewForm.module.css";

const schema = Yup.object({
  rating: Yup.number().min(1, "Оберіть рейтинг").required(),
  comment: Yup.string()
    .min(2, "Мінімум 2 символи")
    .max(200, "Максимум 200 символів")
    .required("Обовʼязково"),
});

export default function AddReviewForm({ locationId }: { locationId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });

  const mutation = useMutation({
    mutationFn: (values: { rating: number; comment: string }) =>
      createFeedback(locationId, {
        ...values,
        userName: me?.name ?? "Анонім",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["latestReviews"] });
      window.dispatchEvent(new Event("review-added"));
      toast.success("Відгук додано!");
      setTimeout(() => {
        router.back();
        router.refresh();
      }, 100);
    },
    onError: () => toast.error("Помилка. Спробуйте ще раз."),
  });

  const formik = useFormik({
    initialValues: { rating: 0, comment: "" },
    validationSchema: schema,
    onSubmit: (values) => mutation.mutate(values),
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form} noValidate>
      <h2 className={styles.title}>Залишити відгук</h2>

      

      <div className={styles.field}>
        <label htmlFor="comment" className={styles.label}>
          Ваш відгук
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          className={styles.textarea}
          placeholder="Напишіть ваш відгук"
          value={formik.values.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.comment && formik.errors.comment && (
          <span className={styles.error}>{formik.errors.comment}</span>
        )}
      </div>

      <div className={styles.stars}>
  {[1, 2, 3, 4, 5].map((s) => {
    const value = formik.values.rating;
    const isFull = s <= Math.floor(value);
    const isHalf = s === Math.ceil(value) && value % 1 === 0.5;

    return (
      <button
        key={s}
        type="button"
        className={
          isFull
            ? styles.starOn
            : isHalf
            ? styles.starHalf
            : styles.starOff
        }
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const half = clickX < rect.width / 2;
          const newRating = half ? s - 0.5 : s;
          formik.setFieldValue("rating", newRating);
        }}
        aria-label={`${s} зірок`}
      >
        <span className={styles.star}>★</span>
      </button>
    );
  })}
</div>

<div className={styles.actions}>
  <button
    type="button"
    className={styles.cancel}
    onClick={() => {
      console.log("Скасовано");
    }}
  >
    Відмінити
  </button>

  <button
    type="submit"
    className={styles.submit}
    disabled={mutation.isPending}
  >
    {mutation.isPending ? "Надсилаємо…" : "Надіслати"}
  </button>
</div>
    </form>
  );
}