"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateMe } from "@/lib/api/clientApi";
import { uploadImage } from "@/utils/uploadImage";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./ProfileEditForm.module.css";

interface ProfileEditFormProps {
  user: {
    name: string;
    avatarUrl?: string;
    avatar?: string;
    articlesAmount: number;
  };
}

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const currentAvatar = user.avatarUrl || user.avatar || "/default-avatar.png";

  const [name, setName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>(currentAvatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName && !avatarFile) {
      router.push("/profile");
      return;
    }

    setIsLoading(true);
    try {
      const payload: { name?: string; avatarUrl?: string } = {};

      if (trimmedName) {
        payload.name = trimmedName;
      }

      if (avatarFile) {
        const uploaded = await uploadImage(avatarFile);
        payload.avatarUrl = uploaded.url;
      }

      const response = await updateMe(payload);
      const updatedUser = response.data ?? response;
      setUser(updatedUser);

      router.push("/profile");
    } catch {
      setError("Не вдалося зберегти зміни. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className={css.title}>Редагувати профіль</h1>

      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.avatarSection}>
          <p className={css.label}>Аватар</p>
          <div className={css.avatarRow}>
            <Image
              src={avatarPreview}
              alt="Avatar preview"
              width={100}
              height={100}
              className={css.avatarPreview}
            />
            <button
              type="button"
              className={css.uploadBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              Завантажити фото
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className={css.field}>
          <label htmlFor="name" className={css.label}>
            Ім&apos;я
          </label>
          <input
            id="name"
            type="text"
            className={css.input}
            placeholder="Введіть нове ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {error && <p className={css.error}>{error}</p>}

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelBtn}
            onClick={() => router.push("/profile")}
            disabled={isLoading}
          >
            Відмінити
          </button>
          <button type="submit" className={css.saveBtn} disabled={isLoading}>
            {isLoading ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      </form>
    </>
  );
}
