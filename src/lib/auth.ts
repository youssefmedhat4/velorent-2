import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types";
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "next-auth/adapters";

// Custom Prisma adapter compatible with Prisma 7 + adapter-pg
function CustomPrismaAdapter(): Adapter {
  return {
    async createUser(data) {
      const user = await prisma.user.create({
        data: {
          name: data.name ?? "",
          email: data.email,
          avatar: data.image ?? null,
        },
      });
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: null,
        image: user.avatar,
        role: user.role,
      } as AdapterUser & { role: UserRole };
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: null,
        image: user.avatar,
        role: user.role,
      } as AdapterUser & { role: UserRole };
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: null,
        image: user.avatar,
        role: user.role,
      } as AdapterUser & { role: UserRole };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      // We store OAuth accounts in the user table via a simple lookup
      // Since we don't have an Account model, find user by email from Google
      // This is called after OAuth — we handle it via signIn callback instead
      const account = await (prisma as any).account?.findUnique?.({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
      }).catch(() => null);

      if (!account?.user) return null;

      return {
        id: account.user.id,
        name: account.user.name,
        email: account.user.email,
        emailVerified: null,
        image: account.user.avatar,
        role: account.user.role,
      } as AdapterUser & { role: UserRole };
    },

    async updateUser(data) {
      const user = await prisma.user.update({
        where: { id: data.id },
        data: {
          name: data.name ?? undefined,
          avatar: data.image ?? undefined,
        },
      });
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: null,
        image: user.avatar,
        role: user.role,
      } as AdapterUser & { role: UserRole };
    },

    async linkAccount(account) {
      // Store account link — we'll use a simple JSON approach since we don't have Account model
      // For now just return the account data (OAuth users are created via createUser)
      return account as AdapterAccount;
    },

    async createSession(session) {
      return session as AdapterSession;
    },

    async getSessionAndUser(sessionToken) {
      return null;
    },

    async updateSession(session) {
      return session as AdapterSession;
    },

    async deleteSession(sessionToken) {
      return;
    },

    async createVerificationToken(token) {
      return token as VerificationToken;
    },

    async useVerificationToken({ identifier, token }) {
      return null;
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: CustomPrismaAdapter(),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth — create or link user by email
      if (account?.provider === "google" && profile?.email) {
        try {
          const existing = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!existing) {
            await prisma.user.create({
              data: {
                name: profile.name ?? profile.email,
                email: profile.email,
                avatar: (profile as { picture?: string }).picture ?? null,
              },
            });
          } else if (!existing.avatar && (profile as { picture?: string }).picture) {
            await prisma.user.update({
              where: { email: profile.email },
              data: { avatar: (profile as { picture?: string }).picture },
            });
          }
        } catch (err) {
          console.error("[GOOGLE_SIGNIN]", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role ?? "USER";
      }

      // On Google sign-in, fetch the user from DB to get their id and role
      if (account?.provider === "google" && profile?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: profile.email as string },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.email = dbUser.email;
            token.name = dbUser.name;
            token.picture = dbUser.avatar;
          }
        } catch (err) {
          console.error("[JWT_GOOGLE]", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});

export const authOptions = { auth };
