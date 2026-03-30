"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LocationFormValues } from "@/types/location";

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

 const handleSubmit = async (
  values: LocationFormValues,
  { setSubmitting }: FormikHelpers<LocationFormValues>
) => {
  try {
    const res = await fetch(
      isEdit
        ? `/api/locations/${id}`
        : '/api/locations',
      {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          locationType: values.locationType,
          region: values.region,
          description: values.description,
          image: placeholder,
          coordinates: {
            lat: 0,
            lon: 0,
          },
        }),
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Помилка");

    const data = await res.json();

    router.push(`/locations/${data._id}`);
  } catch (error) {
    toast.error("Не вдалося зберегти");
  } finally {
    setSubmitting(false);
  }
};
  
  
  return (
    <main>
      <h1>
        {isEdit ? "Редагування місця" : "Додавання нового місця"}
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
          enableReinitialize

      >
        {({ resetForm, setFieldValue, isSubmitting }) => (
          <Form>
            {/* Фото */}
            <div>
              <p>Обкладинка</p>

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
                onClick={() =>
                  document.getElementById("fileInput")?.click()
                }
              >           
               Завантажте фото
              </button>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  width={120}
                  style={{ display: "block", marginTop: 10 }}
                />
              )}

              <ErrorMessage name="imageFile" component="div" />
            </div>

            {/* Назва */}
            <div>
              <label htmlFor="name">Назва місця</label>
              <Field
                id="name"
                name="name"
                placeholder="Введіть назву місця"
              />
              <ErrorMessage name="name" component="div" />
            </div>

            {/* Тип */}
            <div>
              <label htmlFor="locationType">Тип місця</label>
              <Field as="select" id="locationType" name="locationType">
                <option value="">Оберіть тип місця</option>
                {locationTypes.map((location, index) => (
                 <option key={index} value={location}>
                  {location}
                </option>
     ))}
              </Field>
              <ErrorMessage name="locationType" component="div" />
            </div>

            {/* Регіон */}
            <div>
              <label htmlFor="region">Регіон</label>
              <Field as="select" id="region" name="region">
                <option value="">Оберіть регіон</option>
                {regions.map((region, index) => (
                  <option key={index} value={region}>
                    {region} 
                  </option>
              ))}
              </Field>
              <ErrorMessage name="region" component="div" />
            </div>

            {/* Опис */}
            <div>
              <label htmlFor="description">Опис</label>
              <Field
                as="textarea"
                id="description"
                name="description"
                placeholder="Детальний опис локації"
                maxLength={600}
              />
              <ErrorMessage name="description" component="div" />
            </div>

            {/* Кнопки */}
            <div style={{ marginTop: 20 }}>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Завантаження..."
                  : isEdit
                  ? "Зберегти"
                  : "Опублікувати"}
              </button>

              <button
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
    </main>
  );
}
