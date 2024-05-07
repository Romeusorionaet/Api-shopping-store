import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import "dotenv/config";
import Redis from "ioredis";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { env } from "src/infra/env";
import { Environment } from "vitest";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const prisma = new PrismaClient();

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
});

function generateDatabaseURL(schema: string) {
  if (!env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable");
  }

  const databaseURL = new URL(env.DATABASE_URL);

  databaseURL.searchParams.set("schema", schema);

  return databaseURL.toString();
}

export default <Environment>{
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    const schema = randomUUID();
    const databaseURL = generateDatabaseURL(schema);

    process.env.DATABASE_URL = databaseURL;

    await redis.flushdb();

    execSync("npx prisma migrate deploy");

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );
        await prisma.$disconnect();
      },
    };
  },
};
