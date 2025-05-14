/**
 * Media utility functions for client-side use
 */

// Upload a file to the server, which will then upload to Cloudinary
export async function uploadFile(file: File): Promise<string> {
  try {
    // Create form data
    const formData = new FormData();
    formData.append("file", file);

    // Upload to our API endpoint
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload file");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Create a media item in the database
export async function createMediaItem(data: {
  url: string;
  name: string;
  size: number;
  type: string;
  productId?: string;
}) {
  try {
    const response = await fetch("/api/media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create media item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating media item:", error);
    throw error;
  }
}

// Fetch media items from the API
export async function fetchMediaItems(
  options: {
    limit?: number;
    offset?: number;
    search?: string;
  } = {}
) {
  try {
    const { limit = 20, offset = 0, search = "" } = options;

    // Build query params
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());
    if (search) params.append("search", search);

    const response = await fetch(`/api/media?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch media items");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching media items:", error);
    throw error;
  }
}

// Delete a media item
export async function deleteMediaItem(id: string) {
  try {
    const response = await fetch(`/api/media?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete media item");
    }

    return true;
  } catch (error) {
    console.error("Error deleting media item:", error);
    throw error;
  }
}
