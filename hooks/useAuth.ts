"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import type { FormikHelpers } from "formik";
import { useAuthStore } from "@/lib/store/authStore";
import { login, register } from "@/lib/api/clientApi";

type LoginValues = {
  email: string;
  password: string;
};

type RegisterValues = {
  name: string;
  email: string;
  password: string;
};

const ERROR_MAP: Record<string, string> = {
  "Invalid credentials": "Невірний email або пароль",
  "User already exists": "Користувач вже існує",
  "User not found": "Користувача не знайдено",
};

function mapErrorMessage(message: string): string {
  return ERROR_MAP[message] || "Щось пішло не так";
}

export function useAuth(redirectTo: string = "/") {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  async function submitAuth<T extends LoginValues | RegisterValues>(
    isLogin: boolean,
    values: T,
    helpers: FormikHelpers<T>
  ) {
    const { setSubmitting, setFieldError, resetForm } = helpers;
    const loading = toast.loading(isLogin ? "Вхід..." : "Реєстрація...");

    try {
      const data = isLogin
        ? await login(values as LoginValues)
        : await register(values as RegisterValues);

      if (!data) throw new Error("Користувача не отримано");

      setUser(data);
      resetForm();

      toast.success(isLogin ? "Успішний вхід" : "Реєстрація успішна");

      router.push(redirectTo);
      router.refresh();
    } catch (e: unknown) {

      const rawMessage = isAxiosError(e)
        ? e.response?.data?.response?.message ||
          e.response?.data?.response?.error ||
          e.response?.data?.error ||
          e.message
        : e instanceof Error
        ? e.message
        : "Unknown error";

      const message = mapErrorMessage(rawMessage);

      if (rawMessage.toLowerCase().includes("email")) {
        setFieldError("email", message);
      } else if (rawMessage.toLowerCase().includes("password")) {
        setFieldError("password", message);
      }

      toast.error("Щось пішло не так");
    } finally {
      toast.dismiss(loading);
      setSubmitting(false);
    }
  }

  return { submitAuth };
}