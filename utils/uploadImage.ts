export type UploadedImage = {
  url: string;
  publicId: string;
};

export const uploadImage = async (file: File): Promise<UploadedImage> => {
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

  if (!res.ok) {
    throw new Error("Не вдалося завантажити зображення");
  }

  const data = await res.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};
