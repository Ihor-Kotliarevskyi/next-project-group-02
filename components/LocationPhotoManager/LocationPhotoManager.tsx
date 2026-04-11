"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import css from "./LocationPhotoManager.module.css";

const MAX_EXTRAS = 9;

type Props = {
  mainFile: File | null;
  mainPreview: string | null;
  extraFiles: File[];
  extraPreviews: string[];
  onMainChange: (file: File | null, preview: string | null) => void;
  onExtrasChange: (files: File[], previews: string[]) => void;
};

export default function LocationPhotoManager({
  mainFile,
  mainPreview,
  extraFiles,
  extraPreviews,
  onMainChange,
  onExtrasChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (mainPreview?.startsWith("blob:")) URL.revokeObjectURL(mainPreview);
      extraPreviews.forEach((p) => {
        if (p.startsWith("blob:")) URL.revokeObjectURL(p);
      });
    };
  }, []);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    if (!newFiles.length) return;

    if (!mainFile) {
      const [first, ...rest] = newFiles;
      const mainPrev = URL.createObjectURL(first);
      onMainChange(first, mainPrev);

      const remaining = MAX_EXTRAS - extraFiles.length;
      const toAdd = rest.slice(0, remaining);
      const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
      onExtrasChange([...extraFiles, ...toAdd], [...extraPreviews, ...newPreviews]);
    } else {
      const remaining = MAX_EXTRAS - extraFiles.length;
      const toAdd = newFiles.slice(0, remaining);
      const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
      onExtrasChange([...extraFiles, ...toAdd], [...extraPreviews, ...newPreviews]);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const promoteExtra = (index: number) => {
    const newMain = extraFiles[index];
    const newMainPreview = extraPreviews[index];

    const newExtras = [...extraFiles];
    const newExtraPreviews = [...extraPreviews];
    newExtras.splice(index, 1);
    newExtraPreviews.splice(index, 1);

    if (mainFile && mainPreview) {
      newExtras.unshift(mainFile);
      newExtraPreviews.unshift(mainPreview);
    }

    onMainChange(newMain, newMainPreview);
    onExtrasChange(newExtras, newExtraPreviews);
  };

  const removeExtra = (index: number) => {
    const preview = extraPreviews[index];
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    const newFiles = extraFiles.filter((_, i) => i !== index);
    const newPreviews = extraPreviews.filter((_, i) => i !== index);
    onExtrasChange(newFiles, newPreviews);
  };

  const removeMain = () => {
    if (mainPreview?.startsWith("blob:")) URL.revokeObjectURL(mainPreview);
    if (extraFiles.length > 0) {
      onMainChange(extraFiles[0], extraPreviews[0]);
      onExtrasChange(extraFiles.slice(1), extraPreviews.slice(1));
    } else {
      onMainChange(null, null);
    }
  };

  const totalPhotos = (mainFile ? 1 : 0) + extraFiles.length;
  const canAddMore = totalPhotos < 10;

  return (
    <div className={css.wrapper}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        hidden
        onChange={handleFilesSelected}
      />

      {mainPreview ? (
        <div className={css.mainWrap}>
          <div className={css.mainBadge}>Головне фото</div>
          <div className={css.mainImgWrap}>
            <Image
              src={mainPreview}
              alt="Головне фото"
              fill
              className={css.mainImg}
              unoptimized
            />
          </div>
          <button
            type="button"
            className={css.removeMain}
            onClick={removeMain}
            aria-label="Видалити головне фото"
          >
            ✕
          </button>
          {canAddMore && (
            <button
              type="button"
              className={css.changeMain}
              onClick={() => inputRef.current?.click()}
            >
              + Додати ще фото
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          className={css.uploadBtn}
          onClick={() => inputRef.current?.click()}
        >
          Завантажте фото
        </button>
      )}

      {extraPreviews.length > 0 && (
        <ul className={css.grid}>
          {extraPreviews.map((preview, i) => (
            <li key={i} className={css.thumb}>
              <div className={css.thumbImgWrap}>
                <Image
                  src={preview}
                  alt=""
                  fill
                  className={css.thumbImg}
                  unoptimized
                />
              </div>
              <button
                type="button"
                className={css.promoteBtn}
                onClick={() => promoteExtra(i)}
                title="Зробити головним"
              >
                ★
              </button>
              <button
                type="button"
                className={css.removeBtn}
                onClick={() => removeExtra(i)}
                aria-label="Видалити"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {mainPreview && (
        <p className={css.hint}>
          Натисніть ★ на фото, щоб зробити його головним
        </p>
      )}
    </div>
  );
}
