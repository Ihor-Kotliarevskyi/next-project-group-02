"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createFeedback, getMe } from "@/lib/api/clientApi";
import styles from "./AddReviewForm.module.css";

const schema = Yup.object({
  rating: Yup.number().min(1, "Оберіть рейтинг").required(),
  comment: Yup.string()
    .min(10, "Мінімум 10 символів")
    .max(500, "Максимум 500 символів")
    .required("Обовʼязково"),
});

export default function AddReviewForm({ locationId }: { locationId: string }) {
  const router = useRouter();

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });

  const mutation = useMutation({
    mutationFn: (values: { rating: number; comment: string }) =>
      createFeedback(locationId, {
        ...values,
        userName: me?.name ?? "Анонім",
      }),
    onSuccess: () => {
      window.dispatchEvent(new Event("review-added"));
      toast.success("Відгук додано!");
      setTimeout(() => router.back(), 100);
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
        <label className={styles.label}>Рейтинг</label>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              className={
                s <= formik.values.rating ? styles.starOn : styles.starOff
              }
              onClick={() => formik.setFieldValue("rating", s)}
              aria-label={`${s} зірок`}
            >
              ★
            </button>
          ))}
        </div>
        {formik.touched.rating && formik.errors.rating && (
          <span className={styles.error}>{formik.errors.rating}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="comment" className={styles.label}>
          Коментар
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          className={styles.textarea}
          placeholder="Поділіться враженнями…"
          value={formik.values.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.comment && formik.errors.comment && (
          <span className={styles.error}>{formik.errors.comment}</span>
        )}
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Надсилаємо…" : "Надіслати"}
      </button>
    </form>
  );
}
