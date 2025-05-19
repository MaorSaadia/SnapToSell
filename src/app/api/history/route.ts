/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../auth";

// GET: Fetch user's content history
export async function GET() {
  try {
    // Get the user session using the auth helper from the root config
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to view history" },
        { status: 401 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch generated content entries for this user using our new model
    try {
      // Query generated content for this user
      const generatedContent = await prisma.generated.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
      
      // Format the generated content to match our expected structure in the frontend
      const formattedHistory = generatedContent.map(item => ({
        id: item.id,
        userId: item.userId,
        productName: item.productName,
        contentType: item.type,  // Renamed from contentType to type in our model
        platform: item.platform,
        tone: item.tone,
        content: item.content,
        imageBase64: item.image, // Renamed from imageBase64 to image in our model
        textPrompt: item.prompt,
        keywords: item.keywords,
        generatedAt: item.createdAt,
      }));
      
      return NextResponse.json({ contentHistory: formattedHistory });
    } catch (error) {
      console.error("Error fetching generated content:", error);
      return NextResponse.json({ contentHistory: [] });
    }
  } catch (error) {
    console.error("Error fetching content history:", error);
    return NextResponse.json(
      { error: "Failed to fetch content history" },
      { status: 500 }
    );
  }
}

// POST: Save new content to history
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to save content" },
        { status: 401 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { 
      content, 
      options, 
      imageBase64, 
      textPrompt,
      productName 
    } = body;

    // Log the content options for debugging
    console.log('Content options:', options);
    
    // Map the content type directly - no need for enum conversion anymore
    // since we're using simple string types

    // Extract keywords if present
    const keywords = options.includeKeywords || [];

    try {
      // Create the content history record using the Prisma model
      // Let's log what we're about to save to help debug any issues
      console.log('Saving content history with data:', {
        userId: user.id,
        productName,
        contentType: options.contentType,
        options
      });
      
      // Create the generated content record using our new model
      const newGenerated = await prisma.generated.create({
        data: {
          userId: user.id,
          productName: productName || "Unnamed Product",
          type: options.contentType, // Using the simpler string content type
          platform: options.platform,
          tone: options.tone,
          content: content,
          image: imageBase64, // Using 'image' instead of 'imageBase64'
          prompt: textPrompt,
          keywords: keywords,
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        contentHistoryId: newGenerated.id 
      });
    } catch (error) {
      console.error("Error saving content history:", error);
      return NextResponse.json(
        { error: "Failed to save content history - database error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error saving content history:", error);
    return NextResponse.json(
      { error: "Failed to save content history" },
      { status: 500 }
    );
  }
}
