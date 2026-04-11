"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { addLocationPhotos, deleteLocationPhoto } from "@/lib/api/clientApi";
import { LocationPhoto } from "@/types/location";
import css from "./LocationPhotos.module.css";

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE_MB = 4;

type Props = {
  locationId: string;
  initialPhotos: LocationPhoto[];
  mainImageUrl?: string;
  onSetMain?: (photo: LocationPhoto) => Promise<void>;
};

export default function LocationPhotos({
  locationId,
  initialPhotos,
  mainImageUrl,
  onSetMain,
}: Props) {
  const [photos, setPhotos] = useState<LocationPhoto[]>(initialPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingMainId, setSettingMainId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = MAX_PHOTOS - photos.length;
    if (files.length > remaining) {
      toast.error(
        `Можна додати ще ${remaining} фото. Ліміт: ${MAX_PHOTOS}.`
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const oversized = files.filter(
      (f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024
    );
    if (oversized.length) {
      toast.error(
        `Деякі файли перевищують ${MAX_FILE_SIZE_MB} МБ: ${oversized.map((f) => f.name).join(", ")}`
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const updated = await addLocationPhotos(locationId, files);
      setPhotos(updated.photos ?? []);
      toast.success("Фото збережено автоматично");
    } catch {
      toast.error("Не вдалося завантажити фото. Спробуйте ще раз.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (photoId: string) => {
    setDeletingId(photoId);
    try {
      const updated = await deleteLocationPhoto(locationId, photoId);
      setPhotos(updated.photos ?? []);
      toast.success("Фото видалено");
    } catch {
      toast.error("Не вдалося видалити фото.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetMain = async (photo: LocationPhoto) => {
    if (!onSetMain) return;
    setSettingMainId(photo._id);
    try {
      await onSetMain(photo);
      setPhotos((prev) => prev.filter((p) => p._id !== photo._id));
      toast.success("Головне фото змінено автоматично");
    } catch {
      toast.error("Не вдалося змінити головне фото.");
    } finally {
      setSettingMainId(null);
    }
  };

  return (
    <div className={css.wrapper}>
      {mainImageUrl && (
        <div className={css.mainSection}>
          <p className={css.label}>Головне фото</p>
          <div className={css.mainImgWrap}>
            <Image
              src={mainImageUrl}
              alt="Головне фото"
              fill
              className={css.mainImg}
              unoptimized
            />
          </div>
        </div>
      )}

      <p className={css.label}>
        Додаткові фото{" "}
        <span className={css.counter}>
          {photos.length}/{MAX_PHOTOS}
        </span>
      </p>

      {photos.length > 0 && (
        <ul className={css.grid}>
          {photos.map((photo) => (
            <li key={photo._id} className={css.item}>
              <div className={css.imgWrapper}>
                <Image
                  src={photo.url}
                  alt=""
                  fill
                  className={css.img}
                  sizes="120px"
                  unoptimized
                />
              </div>
              {onSetMain && (
                <button
                  type="button"
                  className={css.setMainBtn}
                  onClick={() => handleSetMain(photo)}
                  disabled={settingMainId === photo._id}
                  title="Зробити головним"
                >
                  {settingMainId === photo._id ? "…" : "★"}
                </button>
              )}
              <button
                type="button"
                className={css.deleteBtn}
                onClick={() => handleDelete(photo._id)}
                disabled={deletingId === photo._id || settingMainId === photo._id}
                aria-label="Видалити фото"
              >
                {deletingId === photo._id ? "…" : "✕"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {onSetMain && photos.length > 0 && (
        <p className={css.hint}>Натисніть ★ на фото, щоб зробити його головним</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        hidden
        onChange={handleFilesChange}
      />

      <button
        type="button"
        className={css.uploadBtn}
        disabled={isUploading || photos.length >= MAX_PHOTOS}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? "Завантаження…" : "Додати фото"}
      </button>

      {photos.length >= MAX_PHOTOS && (
        <p className={css.limitNote}>Досягнуто ліміту фото</p>
      )}
    </div>
  );
}
