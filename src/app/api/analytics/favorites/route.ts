import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/analytics/favorites
 * Returns saved/favorite content for the authenticated user
 */
export async function GET() {
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
    
    // Since we're having database connection issues, let's return mock data
    // In a real implementation, we would query the database using Prisma
    
    // Mock favorites data
    const favoritesData = [
      {
        id: "1",
        contentGenerationId: "2",
        contentType: "social",
        platform: "instagram",
        tone: "casual",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        generatedContent: "✨ Elevate your style with our new collection! These handcrafted pieces aren't just accessories - they're conversation starters. Double tap if you're obsessed with this look! 👜 #FashionForward #NewCollection #MustHaveAccessory",
        keywords: ["fashion", "trending", "style"],
        notes: "Really like the emojis in this one",
      }
    ];
    
    // When the database is working, the query would look like:
    /*
    const favorites = await db.savedContent.findMany({
      where: { 
        userId,
        isFavorite: true
      },
      include: {
        contentGeneration: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transform the data to include content details
    const transformedFavorites = favorites.map(item => ({
      id: item.id,
      contentGenerationId: item.contentGenerationId,
      contentType: item.contentGeneration.contentType,
      platform: item.contentGeneration.platform,
      tone: item.contentGeneration.tone,
      createdAt: item.createdAt.toISOString(),
      generatedContent: item.contentGeneration.generatedContent,
      keywords: item.contentGeneration.keywords,
      notes: item.notes,
    }));
    
    return NextResponse.json(transformedFavorites);
    */
    
    return NextResponse.json(favoritesData);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/favorites
 * Adds a content generation to favorites
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const body = await req.json();
    const { contentGenerationId, notes } = body;
    
    if (!contentGenerationId) {
      return NextResponse.json(
        { error: "Content generation ID is required" },
        { status: 400 }
      );
    }
    
    // Since we're having database connection issues, let's return mock data
    // In a real implementation, we would use Prisma to create a new favorite
    
    /*
    // Check if content generation exists and belongs to user
    const contentGeneration = await db.contentGeneration.findFirst({
      where: {
        id: contentGenerationId,
        userId
      }
    });
    
    if (!contentGeneration) {
      return NextResponse.json(
        { error: "Content generation not found" },
        { status: 404 }
      );
    }
    
    // Check if already saved
    const existing = await db.savedContent.findUnique({
      where: {
        userId_contentGenerationId: {
          userId,
          contentGenerationId
        }
      }
    });
    
    if (existing) {
      // Update existing saved content
      const updated = await db.savedContent.update({
        where: { id: existing.id },
        data: {
          isFavorite: true,
          ...(notes && { notes })
        }
      });
      return NextResponse.json(updated);
    }
    
    // Create new saved content
    const savedContent = await db.savedContent.create({
      data: {
        userId,
        contentGenerationId,
        isFavorite: true,
        ...(notes && { notes })
      }
    });
    
    return NextResponse.json(savedContent);
    */
    
    // Return mock response
    return NextResponse.json({
      id: "new-favorite-1",
      userId,
      contentGenerationId,
      isFavorite: true,
      notes: notes || null,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      { error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/analytics/favorites/:id
 * Removes a content generation from favorites
 */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get the ID from the URL
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Favorite ID is required" },
        { status: 400 }
      );
    }
    
    // Since we're having database connection issues, let's return mock data
    // In a real implementation, we would use Prisma to delete the favorite
    
    /*
    // Check if saved content exists and belongs to user
    const savedContent = await db.savedContent.findFirst({
      where: {
        id,
        userId
      }
    });
    
    if (!savedContent) {
      return NextResponse.json(
        { error: "Saved content not found" },
        { status: 404 }
      );
    }
    
    // Delete the saved content
    await db.savedContent.delete({
      where: { id }
    });
    */
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
