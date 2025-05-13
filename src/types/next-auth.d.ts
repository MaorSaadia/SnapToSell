import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
      subscription?: {
        status: string;
        tier: string;
        remainingCredits: number;
      };
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    subscription?: {
      status: string;
      tier: string;
      remainingCredits: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    subscription?: {
      status: string;
      tier: string;
      remainingCredits: number;
    };
  }
}
