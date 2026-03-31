"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LocationFormValues } from "@/types/location";
import { createLocation, updateLocation } from "@/lib/api/clientApi";
import css from "./LocationForm.module.css";

type Props = {
  id?: string;
  initialData?: {
    name: string;
    locationType: string;
    region: string;
    description: string;
    image?: string;
  };
  regions: string[];
  locationTypes: string[];
};

export default function LocationForm({ initialData, id, regions, locationTypes }: Props) {
  
  const isEdit = !!initialData;
  const router = useRouter();
  const placeholder = "/images/location-form-placeholder-image.jpg";
  

 const [imagePreview, setImagePreview] = useState<string>(
  initialData?.image || placeholder
  );
  
  useEffect(() => { 
    setImagePreview(initialData?.image || placeholder);
  }, [initialData]);
 

  useEffect(() => {
    const currentPreview = imagePreview;

    return () => {
      if (currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [imagePreview]);

const initialValues: LocationFormValues = {
  name: initialData?.name ?? "",
  locationType: initialData?.locationType || "",
  region: initialData?.region || "",
  description: initialData?.description || "",
  imageFile: null,
};

  const validationSchema = Yup.object({
   imageFile: Yup.mixed<File>()
  .test("required", "Додайте фото", (value) => {
    if (isEdit) return true; 
    return !!value;
  })
  .test("fileType", "Тільки JPG або PNG", (value) => {
    if (!value) return true;
    return ["image/jpeg", "image/png"].includes(value.type);
  })
  .test("fileSize", "Максимум 1MB", (value) => {
    if (!value) return true;
    return value.size <= 1024 * 1024;
  }),

    name: Yup.string()
      .min(3, "Мінімум 3 символи")
      .max(96, "Максимум 96 символів")
      .required("Введіть назву"),

    locationType: Yup.string()
      .max(64, "Максимум 64 символи")
      .required("Оберіть тип"),

    region: Yup.string()
      .max(64, "Максимум 64 символи")
      .required("Оберіть регіон"),

    description: Yup.string()
      .min(20, "Мінімум 20 символів")
      .max(6000, "Максимум 6000символів")
      .required("Введіть опис"),
  });
  

  useEffect(() => {
    if (isEdit && !id) {
      router.push("/");
    }
  }, [isEdit, id, router]);

    const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bym9862n");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/drr2wc5rr/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log("Cloudinary response:", data);

    return data.secure_url;
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    return "https://picsum.photos/300";
  }
};
  

 const handleSubmit = async (
  values: LocationFormValues,
  { setSubmitting }: FormikHelpers<LocationFormValues>
) => {
   try {
    let imageUrl = initialData?.image || "https://picsum.photos/300";
    if (values.imageFile) {
      imageUrl = await uploadImage(values.imageFile);
    }

const payload = {
  name: values.name,
  locationType: values.locationType,
  region: values.region,
  description: values.description,
  image: imageUrl,
  coordinates: { lat: 0, lon: 0 },
};

    const data = isEdit
      ? await updateLocation(id!, payload)
      : await createLocation(payload);

    router.push(`/locations/${data._id}`);
  } catch {
    toast.error("Не вдалося зберегти");
  } finally {
    setSubmitting(false);
  }
  };
  

  
  return (
    <main>
    <div className={css.locationForm}>

      <h1 className={css.locationFormTitle}>
        {isEdit ? "Редагування місця" : "Додавання нового місця"}
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
          enableReinitialize

      >
        {({ resetForm, setFieldValue, isSubmitting }) => (
          <Form className={css.locationFormWrapper}>
            {/* Фото */}
            <div className="location-form__field">
              <p className="location-form__label">Обкладинка</p>

              <input
                id="fileInput"
                type="file"
                accept="image/jpeg, image/png"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFieldValue("imageFile", file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />

              <button
                type="button"
                className="location-form_upload-btn"
                onClick={() =>
                  document.getElementById("fileInput")?.click()
                }
              >           
               Завантажте фото
              </button>

              {imagePreview && (
                <img
                  src={imagePreview}
                  className="location-form_preview"
                  alt="preview"
                  width={120}
                  style={{ display: "block", marginTop: 10 }}
                />
              )}

              <ErrorMessage className="location-form__error" name="imageFile" component="div" />
            </div>

            {/* Назва */}
            <div>
              <label className="location-form__label" htmlFor="name">Назва місця</label>
              <Field
                id="name"
                name="name"
                placeholder="Введіть назву місця"
                className="location-form__input"
              />
              <ErrorMessage className="location-form__error" name="name" component="div" />
            </div>

            {/* Тип */}
            <div>
              <label className="location-form__label" htmlFor="locationType">Тип місця</label>
              <Field className="location-form__input" as="select" id="locationType" name="locationType">
                <option value="">Оберіть тип місця</option>
                {locationTypes.map((location, index) => (
                 <option key={index} value={location}>
                  {location}
                </option>
     ))}
              </Field>
              <ErrorMessage className="location-form__error" name="locationType" component="div" />
            </div>

            {/* Регіон */}
            <div>
              <label className="location-form__label" htmlFor="region">Регіон</label>
              <Field className="location-form__input" as="select" id="region" name="region">
                <option value="">Оберіть регіон</option>
                {regions.map((region, index) => (
                  <option key={index} value={region}>
                    {region} 
                  </option>
              ))}
              </Field>
              <ErrorMessage className="location-form__error" name="region" component="div" />
            </div>

            {/* Опис */}
            <div>
              <label className="location-form__label" htmlFor="description">Опис</label>
              <Field
                className="location-form__textarea"
                as="textarea"
                id="description"
                name="description"
                placeholder="Детальний опис локації"
                maxLength={600}
              />
              <ErrorMessage className="location-form__error" name="description" component="div" />
            </div>

            {/* Кнопки */}
            <div style={{ marginTop: 20 }}>
              <button className="location-form__actions" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Завантаження..."
                  : isEdit
                  ? "Зберегти"
                  : "Опублікувати"}
              </button>

              <button
                className="location-form__cancel"
                type="button"
                onClick={() => {
                  resetForm();
                  setImagePreview(initialData?.image || placeholder);

                  const input = document.getElementById("fileInput") as HTMLInputElement;
                  if (input) input.value = "";
                }}
              >
                {isEdit ? "Відмінити зміни" : "Відмінити"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      </div>
      </main>
  );
}
