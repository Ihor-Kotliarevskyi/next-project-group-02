export const uploadImage = async (file: File): Promise<string> => {
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

    return data.secure_url;
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    return "https://picsum.photos/300";
  }
};