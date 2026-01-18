import NextAuth from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import GoogleProvider from "next-auth/providers/google";
import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id";
import { RoleType } from "./constants/roles";

export const { signIn, signOut, auth, handlers } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER}/v2.0`,
      authorization: {
        params: { 
          prompt: "select_account",
          scope: "openid profile email User.Read"
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email || profile?.email;
      
      if (!email) {
        return false;
      }

      if (!email.endsWith("@uc.cl")) {
        return "/auth/error?error=UnauthorizedEmail";
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as RoleType;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
})