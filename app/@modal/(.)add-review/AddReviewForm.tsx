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

const STAR_COLOR = "fill: #000;";

function StarIcon({ type }: { type: "full" | "half" | "empty" }) {
  if (type === "full") {
    return (
      <svg width="22.55" height="22.65" viewBox="0 0 32 32" fill={STAR_COLOR}>
        <path d="M15.932 25.588l-7.961 6.065c-0.32 0.242-0.644 0.348-0.971 0.316s-0.631-0.137-0.912-0.316c-0.281-0.179-0.482-0.423-0.603-0.731s-0.131-0.653-0.029-1.036l3.038-9.893-7.808-5.617c-0.32-0.218-0.527-0.493-0.62-0.825s-0.086-0.646 0.024-0.942c0.109-0.288 0.286-0.548 0.532-0.778s0.571-0.345 0.976-0.345h9.682l3.096-10.316c0.102-0.39 0.303-0.682 0.603-0.878s0.614-0.293 0.942-0.293c0.327 0 0.641 0.098 0.942 0.293s0.505 0.488 0.615 0.878l3.085 10.316h9.693c0.397 0 0.719 0.115 0.965 0.345s0.423 0.49 0.532 0.778c0.109 0.296 0.117 0.61 0.024 0.942s-0.3 0.607-0.62 0.825l-7.808 5.617 3.038 9.881c0.102 0.39 0.092 0.738-0.029 1.041s-0.322 0.546-0.603 0.726c-0.281 0.187-0.584 0.296-0.907 0.327s-0.645-0.078-0.965-0.327l-7.95-6.055z" />
      </svg>
    );
  }

  if (type === "half") {
    return (
      <svg width="22.55" height="22.65" viewBox="0 0 34 32" fill={STAR_COLOR}>
        <path d="M16.211 5.415v16.817l6.829 4.127-1.835-7.731 6.006-5.227-7.919-0.69-3.081-7.296zM16.211 25.758l-8.288 4.999c-0.279 0.169-0.57 0.245-0.872 0.227s-0.571-0.112-0.807-0.282c-0.236-0.169-0.411-0.388-0.525-0.657s-0.138-0.572-0.072-0.911l2.188-9.444-7.31-6.377c-0.265-0.228-0.428-0.486-0.486-0.774s-0.051-0.567 0.022-0.84c0.066-0.273 0.219-0.503 0.459-0.69s0.528-0.297 0.867-0.326l9.665-0.844 3.744-8.921c0.133-0.309 0.334-0.539 0.603-0.69s0.539-0.227 0.812-0.227 0.543 0.076 0.812 0.227c0.269 0.151 0.47 0.381 0.603 0.69l3.744 8.921 9.676 0.844c0.332 0.030 0.617 0.138 0.857 0.326s0.392 0.418 0.459 0.69c0.073 0.273 0.081 0.552 0.022 0.84s-0.221 0.545-0.486 0.774l-7.31 6.377 2.188 9.444c0.066 0.339 0.042 0.643-0.072 0.911s-0.289 0.488-0.525 0.657c-0.236 0.169-0.505 0.263-0.807 0.282s-0.593-0.057-0.873-0.227l-8.288-4.999z" />
      </svg>
    );
  }

  return (
    <svg width="22.55" height="22.65" viewBox="0 0 32 32" fill={STAR_COLOR}>
      <path d="M9.473 26.551l6.447-4.894 6.447 4.894-2.588-8.141 5.929-3.859h-7.106l-2.682-8.141-2.682 8.141h-7.106l5.929 3.859-2.588 8.141zM15.932 25.588l-7.961 6.065c-0.32 0.242-0.644 0.348-0.971 0.316s-0.631-0.137-0.912-0.316c-0.281-0.179-0.482-0.423-0.603-0.731s-0.131-0.653-0.029-1.036l3.038-9.893-7.808-5.617c-0.32-0.218-0.527-0.493-0.62-0.825s-0.086-0.646 0.024-0.942c0.109-0.288 0.286-0.548 0.532-0.778s0.571-0.345 0.976-0.345h9.682l3.096-10.316c0.102-0.39 0.303-0.682 0.603-0.878s0.614-0.293 0.942-0.293c0.327 0 0.641 0.098 0.942 0.293s0.505 0.488 0.615 0.878l3.085 10.316h9.693c0.397 0 0.719 0.115 0.965 0.345s0.423 0.49 0.532 0.778c0.109 0.296 0.117 0.61 0.024 0.942s-0.3 0.607-0.62 0.825l-7.808 5.617 3.038 9.881c0.102 0.39 0.092 0.738-0.029 1.041s-0.322 0.546-0.603 0.726c-0.281 0.187-0.584 0.296-0.907 0.327s-0.645-0.078-0.965-0.327l-7.95-6.055z" />
    </svg>
  );
}

export default function AddReviewForm({ locationId }: { locationId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: me } = useQuery({ queryKey: ["currentUser"], queryFn: getMe });

  const mutation = useMutation({
    mutationFn: (values: { rating: number; comment: string }) =>
      createFeedback(locationId, {
        ...values,
        userName: me?.name ?? "Анонім",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["locations", locationId] });
      queryClient.invalidateQueries({ queryKey: ["location", locationId] });
      
      window.dispatchEvent(new CustomEvent("review-added", { detail: { review: data } }));
      toast.success("Відгук додано!");
      router.refresh();
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

    const isFull = value >= s;
    const isHalf = value >= s - 0.5 && value < s;

    return (
      <button
        key={s}
        type="button"
        className={styles.starBtn}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const isHalfClick = clickX < rect.width / 2;

          const newRating = isHalfClick ? s - 0.5 : s;
          formik.setFieldValue("rating", newRating);
        }}
      >
        <StarIcon type={isFull ? "full" : isHalf ? "half" : "empty"} />
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
