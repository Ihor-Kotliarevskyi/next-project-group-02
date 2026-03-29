"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  id?: string;
  initialData?: {
    name: string;
    placeType: string;
    region: string;
    description: string;
    image?: string;
  };
};

type FormValues = {
  name: string;
  placeType: string;
  region: string;
  description: string;
  imageFile: File | null;
};

export default function LocationForm({ initialData, id }: Props) {
  
  const isEdit = !!initialData;
  const router = useRouter();
  const placeholder = "/placeholder.png";
  

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

  const [regions, setRegions] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const [regionsRes, typesRes] = await Promise.all([
        fetch("/api/categories/regions"),
        fetch("/api/categories/types"),
      ]);

      const regionsData = await regionsRes.json();
      const typesData = await typesRes.json();

      setRegions(regionsData);
      setTypes(typesData);
    } catch (error) {
      console.error("Помилка завантаження категорій");
      toast.error("Не вдалося завантажити категорії");
    }
  };

  fetchCategories();
}, []);

  const initialValues: FormValues = {
    name: initialData?.name || "",
    placeType: initialData?.placeType || "",
    region: initialData?.region || "",
    description: initialData?.description || "",
    imageFile: null as File | null,
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

    placeType: Yup.string()
      .max(64, "Максимум 64 символи")
      .required("Оберіть тип"),

    region: Yup.string()
      .max(64, "Максимум 64 символи")
      .required("Оберіть регіон"),

    description: Yup.string()
      .min(10, "Мінімум 10 символів")
      .max(600, "Максимум 600 символів")
      .required("Введіть опис"),
  });
  

  useEffect(() => {
    if (isEdit && !id) {
      router.push("/");
    }
  }, [isEdit, id, router]);

  const handleSubmit = async (
  values: FormValues,
  { setSubmitting }: FormikHelpers<FormValues>
) => {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("placeType", values.placeType);
  formData.append("region", values.region);
  formData.append("description", values.description);

  if (values.imageFile) {
    formData.append("image", values.imageFile);
  }

  try {
    const res = await fetch(
      isEdit ? `/api/locations/${id}` : "/api/locations",
      {
        method: isEdit ? "PATCH" : "POST",
        body: formData,
        credentials: "include", 
      }
    );

    if (!res.ok) throw new Error("Помилка");

    const data = await res.json();

    router.push(`/locations/${data.id}`);
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
              <label htmlFor="placeType">Тип місця</label>
              <Field as="select" id="placeType" name="placeType">
                 <option value="">Оберіть тип місця</option>
                  {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
              ))}
               </Field>
              <ErrorMessage name="placeType" component="div" />
            </div>

            {/* Регіон */}
            <div>
              <label htmlFor="region">Регіон</label>
              <Field as="select" id="region" name="region">
                <option value="">Оберіть регіон</option>
                {regions.map((region) => (
                 <option key={region} value={region}>
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