/**
 * Video utility functions for client-side use
 */

/**
 * Extract frames from a video at specified intervals
 * @param videoFile The video file to extract frames from
 * @param numFrames Number of frames to extract (default: 3)
 * @returns Promise<string[]> Array of frame images as base64 data URLs
 */
export async function extractVideoFrames(
  videoFile: File,
  numFrames: number = 3
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.playsInline = true;
      video.muted = true;

      // Create object URL for the video file
      const videoUrl = URL.createObjectURL(videoFile);
      video.src = videoUrl;

      // Wait for video metadata to load
      video.onloadedmetadata = async () => {
        const duration = video.duration;
        const frameGap = duration / (numFrames + 1);
        const frames: string[] = [];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Set canvas dimensions based on video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Extract frames at different timestamps
        for (let i = 1; i <= numFrames; i++) {
          const timestamp = frameGap * i;

          // Create a promise to handle each frame extraction
          const framePromise = new Promise<string>((resolveFrame) => {
            const handleTimeUpdate = () => {
              // Only capture when we're very close to the desired timestamp
              if (Math.abs(video.currentTime - timestamp) < 0.1) {
                video.removeEventListener("timeupdate", handleTimeUpdate);

                // Draw the video frame on the canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Get the image data as a base64 string
                const frameDataUrl = canvas.toDataURL("image/jpeg", 0.8);
                resolveFrame(frameDataUrl);
              }
            };

            // Listen for timeupdate events
            video.addEventListener("timeupdate", handleTimeUpdate);

            // Seek to the timestamp
            video.currentTime = timestamp;
          });

          frames.push(await framePromise);
        }

        // Clean up
        URL.revokeObjectURL(videoUrl);

        // Return the frames
        resolve(frames);
      };

      // Handle errors
      video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error("Error loading video"));
      };

      // Start loading the video
      video.load();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get a thumbnail image from a video file
 * @param videoFile The video file to extract a thumbnail from
 * @returns Promise<string> Thumbnail image as base64 data URL
 */
export async function getVideoThumbnail(videoFile: File): Promise<string> {
  try {
    const frames = await extractVideoFrames(videoFile, 1);
    return frames[0];
  } catch (error) {
    console.error("Error getting video thumbnail:", error);
    throw error;
  }
}
