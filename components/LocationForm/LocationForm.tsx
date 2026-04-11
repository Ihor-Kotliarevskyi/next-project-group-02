"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useState, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LocationFormValues, LocationPhoto } from "@/types/location";
import { createLocation, updateLocation, addLocationPhotos } from "@/lib/api/clientApi";
import css from "./LocationForm.module.css";
import { getLocationValidationSchema } from "@/lib/validation/locationSchema";
import { uploadImage } from "@/utils/uploadImage";
import MapPickerWrapper from "@/components/MapPicker/MapPickerWrapper";
import LocationPhotoSection from "@/components/LocationPhotoSection/LocationPhotoSection";

type Props = {
  id?: string;
  initialData?: {
    name: string;
    locationType: string;
    region: string;
    description: string;
    image?: string;
    imagePublicId?: string;
    imagePosition?: string;
    photos?: LocationPhoto[];
    coordinates?: { lat: number; lon: number };
  };
  regions: { slug: string; region: string }[];
  locationTypes: { slug: string; type: string }[];
};

export default function LocationForm({
  initialData,
  id,
  regions,
  locationTypes,
}: Props) {
  const isEdit = !!id;
  const queryClient = useQueryClient();
  const router = useRouter();
  const validationSchema = getLocationValidationSchema(isEdit);

  const initialImagePosition = initialData?.imagePosition ?? "50% 50%";

  const [imagePosition, setImagePosition] = useState(initialImagePosition);

  const [externalDirty, setExternalDirty] = useState(false);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);

  const [photoKey, setPhotoKey] = useState(0);

  const initialValues = useMemo(
    () => ({
      name: initialData?.name ?? "",
      locationType:
        locationTypes.find((t) => t.slug === initialData?.locationType)?.slug ?? "",
      region: regions.find((r) => r.slug === initialData?.region)?.slug ?? "",
      description: initialData?.description ?? "",
      imageFile: null,
      lat: initialData?.coordinates?.lat ?? 0,
      lon: initialData?.coordinates?.lon ?? 0,
    }),
    [initialData, locationTypes, regions]
  );

  const handleSubmit = async (
    values: LocationFormValues,
    { setSubmitting }: FormikHelpers<LocationFormValues>
  ) => {
    try {
      if (isEdit) {
        await updateLocation(id!, {
          name: values.name,
          locationType: values.locationType,
          region: values.region,
          description: values.description,
          coordinates: { lat: values.lat, lon: values.lon },
        });
        await queryClient.invalidateQueries();
        window.location.href = `/locations/${id}`;
      } else {
        let imageUrl = "https://picsum.photos/300";
        let imagePublicId: string | undefined;

        if (mainFile) {
          const uploaded = await uploadImage(mainFile);
          imageUrl = uploaded.url;
          imagePublicId = uploaded.publicId;
        }

        const data = await createLocation({
          name: values.name,
          locationType: values.locationType,
          region: values.region,
          description: values.description,
          coordinates: { lat: values.lat, lon: values.lon },
          image: imageUrl,
          imagePublicId,
        });

        if (extraFiles.length > 0) {
          try {
            await addLocationPhotos(data._id, extraFiles);
          } catch {
            toast.error("Локацію створено, але деякі фото не вдалося завантажити.");
          }
        }

        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        router.push(`/locations/${data._id}`);
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const axiosDetail = JSON.stringify((error as any)?.response?.data || {});
      toast.error(
        isEdit
          ? `Не вдалося зберегти зміни. Спробуйте ще раз. ${message} ${axiosDetail}`
          : `Не вдалося створити локацію. ${message} ${axiosDetail}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setIsTypeOpen(false);
      }
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setIsRegionOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className={css.mainLocationForm}>
      <div className={css.containerLocationForm}>
        <h1 className={css.locationFormTitle}>
          {isEdit ? "Редагування місця" : "Додавання нового місця"}
        </h1>

        <Formik<LocationFormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnMount
          validateOnChange
          validateOnBlur
        >
          {({
            resetForm,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
            errors,
            touched,
            isValid,
            dirty,
            values,
          }) => {
            const selectedLabel = locationTypes.find(
              (l) => l.slug === values.locationType
            )?.type;

            const canSubmit =
              isValid && !isSubmitting && (!isEdit || dirty || externalDirty);

            return (
              <Form>
                <div className={css.locationFormWrapper}>

                  {/* ── Photo section ── */}
                  <div className={css.formGroup}>
                    <p className={css.label}>Фотографії</p>

                    {isEdit ? (
                      <LocationPhotoSection
                        mode="edit"
                        locationId={id!}
                        mainImageUrl={initialData?.image ?? ""}
                        mainImagePosition={initialData?.imagePosition}
                        initialPhotos={initialData?.photos ?? []}
                        onFocalPointChange={(fp) => {
                          setImagePosition(fp);
                        }}
                        onExternalDirty={() => setExternalDirty(true)}
                      />
                    ) : (
                      <LocationPhotoSection
                        key={photoKey}
                        mode="create"
                        onMainChange={(file, focalPoint) => {
                          setMainFile(file);
                          setImagePosition(focalPoint);
                          setFieldValue("imageFile", file);
                          setFieldTouched("imageFile", true);
                        }}
                        onExtrasChange={(files) => setExtraFiles(files)}
                      />
                    )}

                    <ErrorMessage
                      className={css.errorMessage}
                      name="imageFile"
                      component="div"
                    />
                  </div>

                  {/* ── Name ── */}
                  <div className={css.formGroup}>
                    <label className={css.label} htmlFor="name">
                      Назва місця
                    </label>
                    <Field
                      id="name"
                      name="name"
                      placeholder="Введіть назву місця"
                      className={`${css.locationInput} ${
                        errors.name && touched.name ? css.inputError : ""
                      }`}
                    />
                    <ErrorMessage
                      className={css.errorMessage}
                      name="name"
                      component="div"
                    />
                  </div>

                  {/* ── Location type ── */}
                  <div className={css.formGroup}>
                    <label className={css.label}>Тип місця</label>
                    <div className={css.selectWrapper} ref={typeRef}>
                      <div
                        className={`${css.select} ${isTypeOpen ? css.selectOpen : ""} ${
                          !values.locationType ? css.placeholder : ""
                        }`}
                        onClick={() => {
                          setIsTypeOpen((prev) => !prev);
                          setIsRegionOpen(false);
                          setFieldTouched("locationType", true);
                        }}
                      >
                        {selectedLabel || "Оберіть тип місця"}
                      </div>
                      {isTypeOpen && (
                        <div className={css.dropdown}>
                          {locationTypes.map((location) => (
                            <div
                              key={location.slug}
                              className={`${css.option} ${
                                values.locationType === location.slug ? css.active : ""
                              }`}
                              onClick={() => {
                                setFieldValue("locationType", location.slug);
                                setIsTypeOpen(false);
                              }}
                            >
                              {location.type}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <ErrorMessage
                      className={css.errorMessage}
                      name="locationType"
                      component="div"
                    />
                  </div>

                  {/* ── Region ── */}
                  <div className={css.formGroup}>
                    <label className={css.label}>Регіон</label>
                    <div className={css.selectWrapper} ref={regionRef}>
                      <div
                        className={`${css.select} ${isRegionOpen ? css.selectOpen : ""} ${
                          !values.region ? css.placeholder : ""
                        }`}
                        onClick={() => {
                          setIsRegionOpen(true);
                          setIsTypeOpen(false);
                          setFieldTouched("region", true);
                        }}
                      >
                        {regions.find((r) => r.slug === values.region)?.region ||
                          "Оберіть регіон"}
                      </div>
                      {isRegionOpen && (
                        <div className={css.dropdown}>
                          {regions.map((region) => (
                            <div
                              key={region.slug}
                              className={`${css.option} ${
                                values.region === region.slug ? css.active : ""
                              }`}
                              onClick={() => {
                                setFieldValue("region", region.slug);
                                setIsRegionOpen(false);
                              }}
                            >
                              {region.region}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <ErrorMessage
                      className={css.errorMessage}
                      name="region"
                      component="div"
                    />
                  </div>

                  {/* ── Description ── */}
                  <div className={css.formGroup}>
                    <label className={css.label} htmlFor="description">
                      Детальний опис
                    </label>
                    <Field
                      className={`${css.locationInput} ${
                        errors.description && touched.description ? css.inputError : ""
                      } ${css.textarea}`}
                      as="textarea"
                      id="description"
                      name="description"
                      placeholder="Детальний опис локації"
                      maxLength={6000}
                      onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                        const target = e.currentTarget;
                        target.style.height = "auto";
                        target.style.height = target.scrollHeight + "px";
                      }}
                    />
                    <ErrorMessage
                      className={css.errorMessage}
                      name="description"
                      component="div"
                    />
                  </div>

                  {/* ── Map ── */}
                  <div className={css.formGroup}>
                    <label className={css.label}>Оберіть розташування</label>
                    <MapPickerWrapper
                      lat={values.lat}
                      lon={values.lon}
                      onChange={(lat, lon) => {
                        setFieldValue("lat", lat);
                        setFieldValue("lon", lon);
                      }}
                    />
                  </div>

                  {/* ── Buttons ── */}
                  <div className={css.buttonGroup}>
                    <button
                      className={`${css.locationSubmit} ${css.buttonGeneral}`}
                      type="submit"
                      disabled={!canSubmit}
                    >
                      {isSubmitting ? (
                        <span className={css.loader} />
                      ) : isEdit ? (
                        "Зберегти зміни"
                      ) : (
                        "Зберегти"
                      )}
                    </button>
                    <button
                      className={`${css.locationCancel} ${css.buttonGeneral}`}
                      type="button"
                      onClick={() => {
                        if (!dirty && !externalDirty && mainFile === null) {
                          router.push("/locations");
                          return;
                        }
                        resetForm();
                        setMainFile(null);
                        setExtraFiles([]);
                        setImagePosition(initialImagePosition);
                        setExternalDirty(false);
                        setPhotoKey((k) => k + 1);
                      }}
                    >
                      {isEdit ? "Відмінити зміни" : "Відмінити"}
                    </button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </main>
  );
}
