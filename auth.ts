import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";

// Define the User type with subscription information
type UserWithSubscription = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  subscription: {
    status: string;
    tier: string;
    remainingCredits: number;
  } | null;
};

export const { auth, handlers } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Query user from database using Prisma
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              subscription: {
                include: {
                  tier: true,
                },
              },
            },
          });

          if (!user) {
            return null;
          }

          const passwordMatch = await compare(
            String(credentials.password),
            user.password
          );

          if (!passwordMatch) {
            return null;
          }

          const userWithSubscription: UserWithSubscription = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            subscription: user.subscription
              ? {
                  status: user.subscription.status,
                  tier: user.subscription.tier.name,
                  remainingCredits: user.subscription.remainingCredits,
                }
              : null,
          };

          return userWithSubscription;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.subscription = (user as UserWithSubscription).subscription;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.subscription = token.subscription;
      }
      return session;
    },
  },
  // Add a secret key for JWT encryption and CSRF protection
  secret: "4e611d43d6d57ef36c0691fc574b33554d168196059669422669021c02ef67fd",
});
