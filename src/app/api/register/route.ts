import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body with Zod
    const validatedData = registerSchema.parse(body);
    const { firstName, lastName, email, password } = validatedData;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Get or create the free tier
    let freeTier = await prisma.subscriptionTier.findFirst({
      where: { name: "Free" },
    });

    if (!freeTier) {
      // Create the subscription tiers if they don't exist
      freeTier = await prisma.subscriptionTier.create({
        data: {
          name: "Free",
          description: "Basic access to AI content generation",
          price: 0,
          features: [
            "50 AI content generations per month",
            "Basic product descriptions",
            "Basic social media content",
          ],
          creditsPerMonth: 50,
        },
      });

      // Also create the other tiers
      await prisma.subscriptionTier.create({
        data: {
          name: "Professional",
          description: "Enhanced AI content for growing businesses",
          price: 29.99,
          features: [
            "200 AI content generations per month",
            "Advanced product descriptions",
            "Social media content with hashtags",
            "SEO-optimized content",
          ],
          creditsPerMonth: 200,
        },
      });

      await prisma.subscriptionTier.create({
        data: {
          name: "Business",
          description: "Premium AI content for serious e-commerce brands",
          price: 79.99,
          features: [
            "1000 AI content generations per month",
            "Premium product descriptions",
            "Advanced social media content",
            "SEO-optimized content",
            "Priority support",
          ],
          creditsPerMonth: 1000,
        },
      });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        password: hashedPassword,
        // Create a free subscription for the new user
        subscription: {
          create: {
            tierId: freeTier.id,
            status: "ACTIVE",
            remainingCredits: freeTier.creditsPerMonth,
          },
        },
      },
    });

    // Return success response
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Return validation errors if it's a Zod error
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
