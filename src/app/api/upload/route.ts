import { NextRequest, NextResponse } from "next/server";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { auth } from "../../../../auth";

// Maximum file size (50MB to accommodate videos)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // Validate file existence
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 50MB)" },
        { status: 400 }
      );
    }

    // Determine file type category (image or video)
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    // Validate file type
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/webm"];

    if (
      !(isImage && allowedImageTypes.includes(file.type)) &&
      !(isVideo && allowedVideoTypes.includes(file.type))
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Allowed types: JPEG, PNG, WebP, MP4, MOV, WebM",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using our function
    const result = await uploadBufferToCloudinary(buffer, {
      folder: "snap-to-sell",
      resourceType: isVideo ? "video" : "image",
      format: file.type.split("/")[1],
    });

    // Return cloudinary upload result with file metadata
    return NextResponse.json({
      ...result,
      originalFilename: file.name,
      size: file.size,
      type: file.type,
      fileType: isVideo ? "video" : "image",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// Limit request size
export const config = {
  api: {
    bodyParser: false,
  },
};
