import { createHash } from "crypto";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1";

function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "printngift/products";
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are missing.");
  }
  return { cloudName, apiKey, apiSecret, folder };
}

function sign(params: Record<string, string | number | boolean>, apiSecret: string) {
  const signatureBase = Object.entries(params)
    .filter(([, value]) => value !== "" && value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${signatureBase}${apiSecret}`).digest("hex");
}

export async function uploadImageToCloudinary(file: File) {
  const { cloudName, apiKey, apiSecret, folder } = cloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder, timestamp };
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("signature", sign(params, apiSecret));

  const response = await fetch(`${CLOUDINARY_UPLOAD_URL}/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "Cloudinary upload failed.");
  return {
    url: result.secure_url as string,
    publicId: result.public_id as string,
  };
}

export async function deleteImageFromCloudinary(publicId: string) {
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const params = { invalidate: true, public_id: publicId, timestamp };
  const formData = new FormData();
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("public_id", publicId);
  formData.append("invalidate", "true");
  formData.append("signature", sign(params, apiSecret));

  const response = await fetch(`${CLOUDINARY_UPLOAD_URL}/${cloudName}/image/destroy`, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  if (!response.ok || result.result === "error") throw new Error(result.error?.message || "Cloudinary delete failed.");
  return result;
}
