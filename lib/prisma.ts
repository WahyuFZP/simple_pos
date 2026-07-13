// lib/prisma.ts
// Singleton PrismaClient dengan PrismaPg adapter

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getPool = () => {
  return new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    family: 4,
    ssl: {
      rejectUnauthorized: false,
    },
  } as any);
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaPg(getPool()) });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
