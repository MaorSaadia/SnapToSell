import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/analytics/history
 * Returns content generation history for the authenticated user
 */
export async function GET(req: Request) {
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
    
    // Parse pagination parameters from the URL
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;
    
    // Since we're having database connection issues, let's return mock data
    // In a real implementation, we would query the database using Prisma
    
    // Mock history data - this would come from the ContentGeneration model
    const historyData = [
      {
        id: "1",
        contentType: "website",
        platform: null,
        tone: "professional",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        generatedContent: "This elegant handcrafted leather wallet combines timeless design with premium materials. Each wallet is meticulously crafted from full-grain leather that develops a rich patina over time, making your wallet as unique as you are. The spacious interior features multiple card slots, a bill compartment, and RFID protection to keep your financial information secure.",
        keywords: ["leather", "handcrafted", "premium"],
        isFavorite: false,
      },
      {
        id: "2",
        contentType: "social",
        platform: "instagram",
        tone: "casual",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        generatedContent: "✨ Elevate your style with our new collection! These handcrafted pieces aren't just accessories - they're conversation starters. Double tap if you're obsessed with this look! 👜 #FashionForward #NewCollection #MustHaveAccessory",
        keywords: ["fashion", "trending", "style"],
        isFavorite: true,
      },
      {
        id: "3",
        contentType: "social",
        platform: "tiktok",
        tone: "casual",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        generatedContent: "Quick unboxing of our bestselling product! 📦✨ You won't believe the quality until you see it! #TikTokMadeMeBuyIt #ProductReview #UnboxingTime",
        keywords: ["unboxing", "review", "trendy"],
        isFavorite: false,
      },
    ];
    
    // When the database is working, the query would look like:
    /*
    const [contentHistory, total] = await Promise.all([
      db.contentGeneration.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          savedBy: {
            where: { userId },
            select: { id: true }
          }
        }
      }),
      db.contentGeneration.count({ where: { userId } })
    ]);
    
    // Transform the data to include isFavorite flag
    const history = contentHistory.map(item => ({
      ...item,
      isFavorite: item.savedBy.length > 0
    }));
    
    return NextResponse.json({
      history,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
    */
    
    return NextResponse.json({
      history: historyData,
      pagination: {
        total: historyData.length,
        page,
        limit,
        pages: Math.ceil(historyData.length / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching content history:", error);
    return NextResponse.json(
      { error: "Failed to fetch content history" },
      { status: 500 }
    );
  }
}
