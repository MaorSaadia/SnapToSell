import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create subscription tiers
  const freeTier = await prisma.subscriptionTier.create({
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

  const professionalTier = await prisma.subscriptionTier.create({
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

  const businessTier = await prisma.subscriptionTier.create({
    data: {
      name: "Business",
      description: "Premium AI content for serious e-commerce brands",
      price: 79.99,
      features: [
        "Unlimited AI content generations",
        "Premium product descriptions",
        "Advanced social media content",
        "SEO-optimized content",
        "Priority support",
      ],
      creditsPerMonth: 1000,
    },
  });

  // Create demo user with Professional subscription
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "user@example.com",
      // Hash of "password123"
      password: await hash("password123", 10),
      subscription: {
        create: {
          tierId: professionalTier.id,
          remainingCredits: professionalTier.creditsPerMonth,
        },
      },
    },
  });

  console.log({ freeTier, professionalTier, businessTier, demoUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
