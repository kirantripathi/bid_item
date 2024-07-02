

export const getCloudinaryImageUrl = async (file: File) => {
    const data = new FormData();
    data.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_UPLOAD_PRESET_NAME ?? ""
    );
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME ?? "");
    data.append("file", file);
    data.append("folder", "bidBuddy-image");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const res = await response.json(); // Parse JSON response
      const secureUrl = res["secure_url"];

      return secureUrl;
    } catch (error) {
      console.log(error, "image upload err");
      return "error"
    }
  };