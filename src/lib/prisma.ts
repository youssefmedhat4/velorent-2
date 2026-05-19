import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  // During `next build`, Prisma client is instantiated but never actually
  // connects to the DB (static pages don't run DB queries at build time).
  // We allow the client to be created without a URL — it will throw at
  // runtime if a query is attempted without DATABASE_URL set.
  const adapter = new PrismaPg({
    connectionString: connectionString ?? "postgresql://localhost:5432/placeholder",
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
