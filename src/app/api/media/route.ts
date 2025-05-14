import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";

// GET handler to retrieve all media items for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || "20");
    const offset = Number(searchParams.get("offset") || "0");
    const search = searchParams.get("search") || "";

    // Fetch media items
    const mediaItems = await prisma.media.findMany({
      where: {
        userId,
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    // Count total items for pagination
    const total = await prisma.media.count({
      where: {
        userId,
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    return NextResponse.json({
      items: mediaItems,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media items" },
      { status: 500 }
    );
  }
}

// POST handler to create a new media entry
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Parse request body
    const body = await request.json();
    const { url, name, size, type, productId, isPublic = false } = body;

    // Validate required fields
    if (!url || !name || !type) {
      return NextResponse.json(
        { error: "Missing required fields: url, name, type" },
        { status: 400 }
      );
    }

    // Create new media item
    const media = await prisma.media.create({
      data: {
        url,
        name,
        size: size || 0,
        type,
        isPublic,
        user: {
          connect: {
            id: userId,
          },
        },
        ...(productId && {
          product: {
            connect: {
              id: productId,
            },
          },
        }),
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: "Failed to create media item" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a media item
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Get media ID from query params
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("id");

    if (!mediaId) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 }
      );
    }

    // Find media item and verify ownership
    const media = await prisma.media.findUnique({
      where: {
        id: mediaId,
      },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Verify user owns this media
    if (media.userId !== userId) {
      return NextResponse.json(
        { error: "You don't have permission to delete this media" },
        { status: 403 }
      );
    }

    // Delete media item
    await prisma.media.delete({
      where: {
        id: mediaId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Failed to delete media item" },
      { status: 500 }
    );
  }
}
