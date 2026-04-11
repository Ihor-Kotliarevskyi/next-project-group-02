"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import FocalPointPicker from "@/components/FocalPointPicker/FocalPointPicker";
import {
  addLocationPhotos,
  deleteLocationPhoto,
  updateLocation,
} from "@/lib/api/clientApi";
import { LocationPhoto } from "@/types/location";
import css from "./LocationPhotoSection.module.css";

const MAX_TOTAL = 10;
const MAX_FILE_SIZE_MB = 4;

type PhotoEntry = {
  key: string;
  url: string;
  isMain: boolean;
  focalPoint: string;
  savedId?: string;
  savedPublicId?: string;
  file?: File;
};

type EditProps = {
  mode: "edit";
  locationId: string;
  mainImageUrl: string;
  mainImagePosition?: string;
  initialPhotos: LocationPhoto[];
  onFocalPointChange: (fp: string) => void;
  onExternalDirty: () => void;
};

type CreateProps = {
  mode: "create";
  onMainChange: (file: File | null, focalPoint: string) => void;
  onExtrasChange: (files: File[]) => void;
};

type Props = EditProps | CreateProps;

let _keyN = 0;
const nextKey = () => `ph_${++_keyN}`;

export default function LocationPhotoSection(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [entries, setEntries] = useState<PhotoEntry[]>(() => {
    if (props.mode !== "edit") return [];
    const list: PhotoEntry[] = [];
    if (props.mainImageUrl) {
      list.push({
        key: "main",
        url: props.mainImageUrl,
        isMain: true,
        focalPoint: props.mainImagePosition ?? "50% 50%",
      });
    }
    props.initialPhotos.forEach((p) => {
      list.push({
        key: p._id,
        url: p.url,
        isMain: false,
        focalPoint: "50% 50%",
        savedId: p._id,
        savedPublicId: p.publicId,
      });
    });
    return list;
  });

  const [selectedKey, setSelectedKey] = useState<string | null>(() =>
    props.mode === "edit" && props.mainImageUrl ? "main" : null
  );
  const [uploading, setUploading] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      entries.forEach((e) => {
        if (e.url.startsWith("blob:")) URL.revokeObjectURL(e.url);
      });
    };
  }, []);

  const selectedEntry =
    entries.find((e) => e.key === selectedKey) ?? entries[0] ?? null;

  const notifyCreate = (updated: PhotoEntry[]) => {
    if (props.mode !== "create") return;
    const main = updated.find((e) => e.isMain);
    const extras = updated.filter((e) => !e.isMain);
    props.onMainChange(main?.file ?? null, main?.focalPoint ?? "50% 50%");
    props.onExtrasChange(extras.flatMap((e) => (e.file ? [e.file] : [])));
  };

  const handleFocalPoint = (key: string, fp: string) => {
    const entry = entries.find((e) => e.key === key);
    const next = entries.map((e) => (e.key === key ? { ...e, focalPoint: fp } : e));
    setEntries(next);
    if (entry?.isMain) {
      if (props.mode === "edit") {
        props.onFocalPointChange(fp);
        props.onExternalDirty();
      } else {
        notifyCreate(next);
      }
    }
  };

  const handleSetMain = async (targetKey: string) => {
    const target = entries.find((e) => e.key === targetKey);
    if (!target || target.isMain) return;

    if (props.mode === "edit") {
      if (!target.savedId || !target.savedPublicId) return;
      setBusyKey(targetKey);
      try {
        await updateLocation(props.locationId, {
          image: target.url,
          imagePublicId: target.savedPublicId,
        });
        await deleteLocationPhoto(props.locationId, target.savedId);

        setEntries((prev) =>
          prev
            .filter((e) => e.key !== targetKey)
            .map((e) =>
              e.isMain ? { ...e, url: target.url, focalPoint: target.focalPoint } : e
            )
        );
        setSelectedKey("main");
        props.onFocalPointChange(target.focalPoint);
        props.onExternalDirty();
        toast.success("Головне фото змінено автоматично");
      } catch {
        toast.error("Не вдалося змінити головне фото.");
      } finally {
        setBusyKey(null);
      }
    } else {
      const updated = entries.map((e) => ({ ...e, isMain: e.key === targetKey }));
      setEntries(updated);
      setSelectedKey(targetKey);
      notifyCreate(updated);
    }
  };

  const handleDelete = async (targetKey: string) => {
    const target = entries.find((e) => e.key === targetKey);
    if (!target) return;

    if (props.mode === "edit") {
      if (target.isMain || !target.savedId) return;
      setBusyKey(targetKey);
      try {
        await deleteLocationPhoto(props.locationId, target.savedId);
        const remaining = entries.filter((e) => e.key !== targetKey);
        setEntries(remaining);
        if (selectedKey === targetKey) setSelectedKey("main");
        toast.success("Фото видалено");
      } catch {
        toast.error("Не вдалося видалити фото.");
      } finally {
        setBusyKey(null);
      }
    } else {
      if (target.url.startsWith("blob:")) URL.revokeObjectURL(target.url);
      let updated = entries.filter((e) => e.key !== targetKey);
      if (target.isMain && updated.length > 0) {
        updated = updated.map((e, i) => (i === 0 ? { ...e, isMain: true } : e));
      }
      setEntries(updated);
      if (selectedKey === targetKey) setSelectedKey(updated[0]?.key ?? null);
      notifyCreate(updated);
    }
  };

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (inputRef.current) inputRef.current.value = "";
    if (!files.length) return;

    const remaining = MAX_TOTAL - entries.length;
    const toProcess = files.slice(0, remaining);
    if (files.length > remaining && remaining > 0) {
      toast.error(`Додано перші ${remaining} фото. Ліміт: ${MAX_TOTAL}.`);
    }
    if (!toProcess.length) {
      toast.error(`Досягнуто ліміту ${MAX_TOTAL} фото.`);
      return;
    }

    const oversized = toProcess.filter((f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversized.length) {
      toast.error(
        `Деякі файли перевищують ${MAX_FILE_SIZE_MB} МБ: ${oversized.map((f) => f.name).join(", ")}`
      );
      return;
    }

    if (props.mode === "edit") {
      setUploading(true);
      try {
        const result = await addLocationPhotos(props.locationId, toProcess);
        const allSaved: LocationPhoto[] = result.photos ?? [];
        const existingIds = new Set(entries.map((e) => e.savedId).filter(Boolean));
        const newEntries: PhotoEntry[] = allSaved
          .filter((p) => !existingIds.has(p._id))
          .map((p) => ({
            key: p._id,
            url: p.url,
            isMain: false,
            focalPoint: "50% 50%",
            savedId: p._id,
            savedPublicId: p.publicId,
          }));
        setEntries((prev) => [...prev, ...newEntries]);
        toast.success("Фото збережено автоматично");
      } catch {
        toast.error("Не вдалося завантажити фото.");
      } finally {
        setUploading(false);
      }
    } else {
      const newEntries: PhotoEntry[] = toProcess.map((file) => ({
        key: nextKey(),
        url: URL.createObjectURL(file),
        isMain: false,
        focalPoint: "50% 50%",
        file,
      }));
      const hasMain = entries.some((e) => e.isMain);
      const combined = [...entries, ...newEntries];
      if (!hasMain && combined.length > 0) {
        combined[0] = { ...combined[0], isMain: true };
      }
      setEntries(combined);
      if (!selectedKey) setSelectedKey(combined[0]?.key ?? null);
      notifyCreate(combined);
    }
  };

  const canAddMore = entries.length < MAX_TOTAL;

  return (
    <div className={css.wrapper}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        hidden
        onChange={handleFilesChange}
      />

      {selectedEntry ? (
        <FocalPointPicker
          src={selectedEntry.url}
          value={selectedEntry.focalPoint}
          onChange={(fp) => handleFocalPoint(selectedEntry.key, fp)}
        />
      ) : (
        <button
          type="button"
          className={css.emptyBtn}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <span className={css.emptyPlus}>+</span>
          <span>Завантажте фото</span>
        </button>
      )}

      {entries.length > 0 && (
        <div className={css.strip}>
          {entries.map((entry) => {
            const isSelected = selectedEntry?.key === entry.key;
            const isBusy = busyKey === entry.key;
            return (
              <div
                key={entry.key}
                className={[
                  css.thumb,
                  isSelected ? css.thumbSelected : "",
                  isBusy ? css.thumbBusy : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setSelectedKey(entry.key)}
                role="button"
                tabIndex={0}
                onKeyDown={(ev) => ev.key === "Enter" && setSelectedKey(entry.key)}
                aria-label={entry.isMain ? "Головне фото" : "Вибрати фото"}
              >
                <Image
                  src={entry.url}
                  alt=""
                  fill
                  className={css.thumbImg}
                  unoptimized
                  sizes="80px"
                  style={
                    entry.focalPoint !== "50% 50%"
                      ? { objectPosition: entry.focalPoint }
                      : undefined
                  }
                />

                {entry.isMain && (
                  <span className={css.mainBadge} title="Головне фото">
                    ★
                  </span>
                )}

                {!entry.isMain && (
                  <button
                    type="button"
                    className={css.starBtn}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      handleSetMain(entry.key);
                    }}
                    disabled={isBusy}
                    title="Зробити головним"
                  >
                    ★
                  </button>
                )}

                {(props.mode === "create" || !entry.isMain) && (
                  <button
                    type="button"
                    className={css.removeBtn}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      handleDelete(entry.key);
                    }}
                    disabled={isBusy}
                    aria-label="Видалити"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}

          {canAddMore && (
            <button
              type="button"
              className={css.addThumb}
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              aria-label="Додати фото"
            >
              {uploading ? <span className={css.spinner} /> : "+"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
