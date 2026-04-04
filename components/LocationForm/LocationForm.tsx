"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LocationFormValues } from "@/types/location";
import { createLocation, updateLocation } from "@/lib/api/clientApi";
import css from "./LocationForm.module.css";
import { getLocationValidationSchema } from "@/lib/validation/locationSchema";
import { uploadImage } from "@/utils/uploadImage";
import { useMemo } from "react";

type Props = {
  id?: string;
  initialData?: {
    name: string;
    locationType: string;
    region: string;
    description: string;
    image?: string;
  };
  regions: { slug: string; region: string }[];
  locationTypes: { slug: string; type: string }[];
};

export default function LocationForm({ initialData, id, regions, locationTypes }: Props) {
  
  const isEdit = !!id;
  const router = useRouter();
  const placeholder = "/images/location-form-placeholder-image.jpg";
  const validationSchema = getLocationValidationSchema(isEdit);
  
  

  const [imagePreview, setImagePreview] = useState<string>(placeholder);
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

 const initialValues = useMemo(() => ({
  name: initialData?.name ?? "",
  locationType:
    locationTypes.find(t => t.slug === initialData?.locationType)?.slug || "",
  region:
    regions.find(r => r.slug === initialData?.region)?.slug || "",
  description: initialData?.description || "",
  imageFile: null,
}), [initialData, locationTypes, regions]);


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
    <main className={css.main}>
      <div className={css.container}>

      <h1 className={css.locationFormTitle}>
        {isEdit ? "Редагування місця" : "Додавання нового місця"}
      </h1>

      <Formik<LocationFormValues>
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
  enableReinitialize
  validateOnMount
>
        

     {({ resetForm, setFieldValue, isSubmitting, errors, touched, isValid, dirty }) => (
            <Form>
              <div className={css.locationFormWrapper}>
          {/* Фото */}
          <div className={css.formGroup}>
            <p className={css.label}>Обкладинка</p>

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
                
            {imagePreview && (
              <img
                src={imagePreview}
                className={css.photoPreview}
                alt="preview"
                width={120}
                style={{ display: "block", marginTop: 10 }}
              />
            )}

                  <button
                    type="button"
                    className={`${css.uploadBtn} ${css.buttonGeneral}`}
              onClick={() =>
                document.getElementById("fileInput")?.click()
              }
              >
                Завантажте фото
            </button>

           
            <ErrorMessage className={css.errorMessage} name="imageFile" component="div" />
          </div>

          {/* Назва */}
          <div className={css.formGroup}>
            <label className={css.label} htmlFor="name">Назва місця</label>
            <Field
              id="name"
              name="name"
              placeholder="Введіть назву місця"
              className={`
                ${css.locationInput}
                ${errors.name && touched.name ? css.inputError : ""}
              `}
            />
            <ErrorMessage className={css.errorMessage} name="name" component="div" />
          </div>

          {/* Тип */}
          <div className={css.formGroup}>
            <label className={css.label} htmlFor="locationType">Тип місця</label>
                <Field
                  className={`
                    ${css.locationInput}
                    ${errors.locationType && touched.locationType ? css.inputError : ""}
                `}
                  as="select" id="locationType" name="locationType">
              <option value="">Оберіть тип місця</option>
                {locationTypes.map((location, index) => (
                 <option className={css.optional} key={index} value={location.slug}>
                  {location.type}
                </option>
     ))}
              </Field>
              <ErrorMessage className={css.errorMessage} name="locationType" component="div" />
            </div>

            {/* Регіон */}
            <div className={css.formGroup}>
              <label className={css.label} htmlFor="region">Регіон</label>
              <Field className={`
                ${css.locationInput}
                ${errors.region && touched.region ? css.inputError : ""}
              `} as="select" id="region" name="region">
                <option value="">Оберіть регіон</option>
                {regions.map((region, index) => (
                  <option key={index} value={region.slug}>
                    {region.region}
                  </option>
              ))}
              </Field>
              <ErrorMessage className={css.errorMessage} name="region" component="div" />
            </div>

            {/* Опис */}
            <div className={css.formGroup}>
              <label className={css.label} htmlFor="description">Детальний опис</label>
              <Field
                className={`${css.locationInput}  ${errors.description && touched.description  ? css.inputError : ""} ${css.textarea}`}
                as="textarea"
                id="description"
                name="description"
                placeholder="Детальний опис локації"
                maxLength={600}
              />
              <ErrorMessage className={css.errorMessage} name="description" component="div" />
            </div>

            {/* Кнопки */}
            <div className={css.buttonGroup}>

              <button
  className={`${css.locationCancel} ${css.buttonGeneral}`}
  type="button"
  onClick={() => {
    if (!dirty) {
      router.push("/locations"); 
      return;
    }

    resetForm();
    setImagePreview(initialData?.image || placeholder);

    const input = document.getElementById("fileInput") as HTMLInputElement;
    if (input) input.value = "";
  }}
>
  {isEdit ? "Відмінити зміни" : "Відмінити"}
</button>
                
              <button
                className={`${css.locationSubmit} ${css.buttonGeneral}`}
                type="submit"
                disabled={!isValid || isSubmitting  || !dirty}
              >
              {isSubmitting ? (
                 <span className={css.loader}></span>
                ) : isEdit ? (
                  "Зберегти зміни"
                 ) : (
                  "Зберегти"
             )}
            </button>
          </div>
        </div>
      </Form>
        )}
      </Formik>
    </div>
    </main>
  );
}
