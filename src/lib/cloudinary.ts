import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Define the Cloudinary response type
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: string;
  created_at: string;
  [key: string]: unknown;
}

// Export the configured cloudinary instance
export { cloudinary };

/**
 * Server-side function to upload a buffer to Cloudinary
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    resourceType?: "auto" | "image" | "video" | "raw";
    format?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "snap-to-sell",
        resource_type: options.resourceType || "image",
        format: options.format,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result as CloudinaryUploadResult);
      }
    );

    // Write buffer to stream
    uploadStream.write(buffer);
    uploadStream.end();
  });
}
