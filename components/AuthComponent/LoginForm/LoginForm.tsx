"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signInSchema } from "@/utils/validationSchemas";
import { useAuth } from "@/hooks/useAuth";
import css from "../../AuthComponent/AuthNav/Auth.module.css";

function LoginFormInner() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { submitAuth } = useAuth(redirectTo);

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={signInSchema}
            onSubmit={(values, helpers) => submitAuth(true, values, helpers)}
        >
            {({ isSubmitting, errors, touched }) => (
                <Form className={css.form}>
                    <h2 className={css.title}>Вхід</h2>

                    <div className={css.formGroup}>
                        <label htmlFor="email">Пошта*</label>
                        <Field
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="hello@relaxmap.ua"
                            className={`${css.input} ${
                                errors.email && touched.email ? css.inputError : ""
                            }`}
                        />
                        <ErrorMessage
                            name="email"
                            component="p"
                            className={css.error}
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="password">Пароль*</label>
                        <Field
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="********"
                            className={`${css.input} ${
                                errors.password && touched.password ? css.inputError : ""
                            }`}
                        />
                        <ErrorMessage
                            name="password"
                            component="p"
                            className={css.error}
                        />
                    </div>

                    <button
                        className={css.submitBtn}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "..." : "Увійти"}
                    </button>
                </Form>
            )}
        </Formik>
    );
}

export default function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}
