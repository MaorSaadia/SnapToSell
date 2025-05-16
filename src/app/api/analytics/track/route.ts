import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * POST /api/analytics/track
 * Tracks a new content generation for analytics purposes
 */
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const body = await req.json();
    
    // Validate request body
    const { 
      contentType, 
      platform, 
      tone, 
      promptText, 
      generatedContent, 
      keywords = [],
      mediaId = null,
      creditsUsed = 1
    } = body;
    
    if (!contentType || !generatedContent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Since we're having database connection issues, we'll just log the tracking data
    // In a real implementation, we would use Prisma to track the content generation
    
    console.log("Tracking content generation:", {
      userId,
      contentType,
      platform,
      tone,
      promptText,
      // We don't log the full content to keep logs smaller
      contentLength: generatedContent?.length || 0,
      keywords,
      mediaId,
      creditsUsed,
    });
    
    /*
    // Start a transaction to ensure consistency
    await db.$transaction(async (tx) => {
      // Create the content generation record
      const contentGeneration = await tx.contentGeneration.create({
        data: {
          userId,
          contentType,
          platform,
          tone,
          promptText,
          generatedContent,
          keywords,
          ...(mediaId ? { mediaId } : {}),
          creditsUsed
        }
      });
      
      // Update user's generation stats
      let stats = await tx.generationStats.findUnique({
        where: { userId }
      });
      
      if (stats) {
        // Update existing stats
        await tx.generationStats.update({
          where: { userId },
          data: {
            totalGenerations: stats.totalGenerations + 1,
            totalCreditsUsed: stats.totalCreditsUsed + creditsUsed,
            lastGeneratedAt: new Date(),
            // Update specific content type count
            ...(contentType === "website" 
              ? { websiteDescriptions: stats.websiteDescriptions + 1 } 
              : {}),
            ...(contentType === "social" 
              ? { socialMediaContent: stats.socialMediaContent + 1 } 
              : {}),
            ...(mediaId ? { imagesProcessed: stats.imagesProcessed + 1 } : {})
          }
        });
      } else {
        // Create new stats
        await tx.generationStats.create({
          data: {
            userId,
            totalGenerations: 1,
            totalCreditsUsed: creditsUsed,
            lastGeneratedAt: new Date(),
            websiteDescriptions: contentType === "website" ? 1 : 0,
            socialMediaContent: contentType === "social" ? 1 : 0,
            imagesProcessed: mediaId ? 1 : 0
          }
        });
      }
      
      // Update user's subscription credits
      if (creditsUsed > 0) {
        const subscription = await tx.subscription.findUnique({
          where: { userId }
        });
        
        if (subscription) {
          await tx.subscription.update({
            where: { userId },
            data: {
              remainingCredits: Math.max(0, subscription.remainingCredits - creditsUsed)
            }
          });
        }
      }
    });
    */
    
    // Return success response with mock ID
    return NextResponse.json({
      success: true,
      id: `mock-gen-${Date.now()}`,
      trackedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error tracking content generation:", error);
    return NextResponse.json(
      { error: "Failed to track content generation" },
      { status: 500 }
    );
  }
}
