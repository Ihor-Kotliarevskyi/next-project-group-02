"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import css from "./AuthPromptModal.module.css";

function AuthPromptModalInner() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const redirectParam = `?redirect=${encodeURIComponent(redirect)}`;

  return (
    <Modal>
      <div className={css.content}>
        <h2 className={css.title}>
          Щоб продовжити, увійдіть або зареєструйтеся
        </h2>
        <p className={css.text}>
          Залишати відгуки можуть лише авторизовані користувачі.
        </p>

        <div className={css.actions}>
          <Link href={`/login${redirectParam}`} className={css.loginBtn}>
            Увійти
          </Link>

          <Link href={`/register${redirectParam}`} className={css.registerBtn}>
            Зареєструватися
          </Link>
        </div>
      </div>
    </Modal>
  );
}

export default function AuthPromptModal() {
  return (
    <Suspense fallback={null}>
      <AuthPromptModalInner />
    </Suspense>
  );
}
