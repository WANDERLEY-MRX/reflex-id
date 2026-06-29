import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { loginSchema } from "@/schemas";
import { config } from "@/config";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: config.auth.sessionMaxAge,
  },
  pages: {
    signIn: config.pages.login,
    error: "/auth/error",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        code: { label: "Código 2FA", type: "text" },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) {
          return null;
        }

        const { email, password, code } = validated.data;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.emailVerified) {
          return null;
        }

        if (user.deletedAt) {
          return null;
        }

        const account = await db.account.findFirst({
          where: {
            userId: user.id,
            provider: "credentials",
          },
        });

        if (!account) {
          return null;
        }

        const passwordHash = account.access_token;
        if (!passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, passwordHash);
        if (!isValid) {
          return null;
        }

        if (user.twoFactorEnabled) {
          if (!code) {
            throw new Error("2FA_REQUIRED");
          }

          const { default: speakeasy } = await import("speakeasy");
          const isValidToken = speakeasy.totp.verify({
            secret: user.twoFactorSecret!,
            encoding: "base32",
            token: code,
            window: 1,
          });

          if (!isValidToken) {
            return null;
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }

      if (account) {
        token.accessToken = account.access_token;
      }

      const dbUser = await db.user.findUnique({
        where: { id: token.id as string },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          twoFactorEnabled: true,
          emailVerified: true,
          deletedAt: true,
        },
      });

      if (!dbUser || dbUser.deletedAt) {
        return { ...token, error: "UserNotFound" };
      }

      return {
        ...token,
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        picture: dbUser.avatar,
        role: dbUser.role,
        twoFactorEnabled: dbUser.twoFactorEnabled,
        emailVerified: dbUser.emailVerified?.toISOString(),
      };
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser && user.id) {
        const slug = user.name
          ? user.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") +
            "-" +
            user.id.slice(0, 8)
          : `user-${user.id.slice(0, 8)}`;

        await db.profile.create({
          data: {
            userId: user.id,
            slug,
          },
        });
      }

      if (user.id) {
        await db.auditLog.create({
          data: {
            userId: user.id,
            action: "USER_SIGN_IN",
            resource: "session",
            resourceId: account?.providerAccountId,
            metadata: { provider: account?.provider, isNewUser } as any,
          },
        });
      }
    },
    async signOut(message) {
      const token = "token" in message ? message.token : null
      const session = "session" in message ? message.session : null
      if (token?.sub) {
        await db.auditLog.create({
          data: {
            userId: token.sub,
            action: "USER_SIGN_OUT",
            resource: "session",
            metadata: { sessionId: session && "id" in session ? (session as { id?: string }).id : undefined } as any,
          },
        });
      }
    },
    async linkAccount({ user, account }) {
      if (user.id && account?.provider) {
        await db.auditLog.create({
          data: {
            userId: user.id,
            action: "ACCOUNT_LINKED",
            resource: "account",
            resourceId: account.providerAccountId,
            metadata: { provider: account.provider } as any,
          },
        });
      }
    },
    async createUser({ user }) {
      if (user.id) {
        await db.auditLog.create({
          data: {
            userId: user.id,
            action: "USER_CREATED",
            resource: "user",
            resourceId: user.id,
          },
        });
      }
    },
  },
};
