import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { User } from "next-auth";
import { prisma } from "./src/lib/db";

// Define the User type with subscription information
type UserWithSubscription = User & {
  subscription?: {
    status: string;
    tier: string;
    remainingCredits: number;
  };
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
          // First, try to get user from database
          const user = await prisma.user.findUnique({
            where: { email: String(credentials.email) },
            include: {
              subscription: {
                include: {
                  tier: true,
                },
              },
            },
          });

          // If no user is found, fall back to the mock user
          if (!user) {
            // Only for development: use mock user if database is empty
            const mockUser = {
              id: "1",
              name: "Demo User",
              email: "user@example.com",
              // This is a hashed version of "password123"
              password:
                "$2b$10$uFwud11Wspi6hMjpC5rsAOLCVbvgSEXsWLlDEyvmfuyE.Nsru92vS",
              image: null,
            };

            if (credentials.email !== mockUser.email) {
              return null;
            }

            const passwordMatch = await compare(
              String(credentials.password),
              mockUser.password
            );

            if (!passwordMatch) {
              return null;
            }

            // Return mock user with subscription data
            return {
              id: mockUser.id,
              name: mockUser.name,
              email: mockUser.email,
              image: mockUser.image,
              subscription: {
                status: "ACTIVE",
                tier: "Professional",
                remainingCredits: 200,
              },
            } as UserWithSubscription;
          }

          // For real users, verify the password
          const passwordMatch = await compare(
            String(credentials.password),
            user.password
          );

          if (!passwordMatch) {
            return null;
          }

          // Return user with subscription data
          return {
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
              : undefined,
          } as UserWithSubscription;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60, // 90 days (3 months) in seconds
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || "";
        token.subscription = (user as UserWithSubscription).subscription;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || "";
        session.user.subscription = token.subscription;
      }
      return session;
    },
  },
  // Add a secret key for JWT encryption and CSRF protection
  secret: "4e611d43d6d57ef36c0691fc574b33554d168196059669422669021c02ef67fd",
});
