import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "file:./db/custom.db";
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  // For Turso (libsql://) URLs, we need to pass the auth token.
  // For local SQLite (file:), no auth token is needed.
  const adapter = new PrismaLibSql({
    url: dbUrl,
    authToken: dbUrl.startsWith("libsql://") ? authToken : undefined,
  });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
