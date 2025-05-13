import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

// This is a mock user database - in a real app, you'd use a database
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    // This is a hashed version of "password123"
    password: "$2b$10$uFwud11Wspi6hMjpC5rsAOLCVbvgSEXsWLlDEyvmfuyE.Nsru92vS",
    image: null,
  },
];

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

        // In a real app, you'd query your database here
        const user = users.find((user) => user.email === credentials.email);

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

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // Add a secret key for JWT encryption and CSRF protection
  secret: "4e611d43d6d57ef36c0691fc574b33554d168196059669422669021c02ef67fd",
});
