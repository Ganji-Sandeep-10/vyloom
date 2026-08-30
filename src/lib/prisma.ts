import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

/**
 * TEMPORARY: no hosted database yet.
 *
 * The seeded SQLite file (prisma/dev.db) is committed to the repo so the
 * storefront can display real catalog data on Vercel. Vercel's deployment
 * filesystem is read-only, so on boot we copy the seed DB into /tmp (the only
 * writable location) and point Prisma at that copy. Reads work everywhere;
 * writes (register / cart / checkout / admin edits) persist only for the life
 * of a single serverless instance and are effectively throwaway.
 *
 * Replace this with a real `DATABASE_URL` (Postgres) and delete this shim.
 */
function resolveDatabaseUrl(): string {
  const fromEnv = process.env.DATABASE_URL;

  // A non-file URL (e.g. postgres://) means a real DB is configured — use it as-is.
  if (fromEnv && !fromEnv.startsWith("file:")) return fromEnv;

  const seedDb = path.join(process.cwd(), "prisma", "dev.db");

  // On a writable dev filesystem, just use the file in place.
  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  if (!isServerless) {
    return fromEnv ?? `file:${seedDb}`;
  }

  // Serverless: stage a writable copy in /tmp so write queries don't hard-crash.
  const tmpDb = "/tmp/vyloom.db";
  try {
    if (!fs.existsSync(tmpDb) && fs.existsSync(seedDb)) {
      fs.copyFileSync(seedDb, tmpDb);
    }
  } catch {
    // If the copy fails, fall back to the read-only seed file (reads still work).
    return `file:${seedDb}`;
  }
  return `file:${tmpDb}`;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: { db: { url: resolveDatabaseUrl() } },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
