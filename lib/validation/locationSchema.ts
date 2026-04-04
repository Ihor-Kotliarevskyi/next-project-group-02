import * as Yup from "yup";

export const getLocationValidationSchema = (isEdit: boolean) =>
  Yup.object({
   imageFile: isEdit
  ? Yup.mixed<File>()
  : Yup.mixed<File>()
      .required("Додайте фото")
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
      .max(6000, "Максимум 6000 символів")
      .required("Введіть опис"),
  });