import { execSync } from "node:child_process";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll } from "vitest";

/**
 * Test harness:
 *   - Start a throwaway Postgres container before the test suite.
 *   - Run `prisma db push` against it to create the schema.
 *   - Expose a PrismaClient via globalThis.__prisma__ for tests to use.
 *   - Tear the container down after.
 *
 * Each test file is responsible for cleaning its own data via truncate helper.
 */

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient;
  // eslint-disable-next-line no-var
  var __pgContainer__: StartedPostgreSqlContainer;
}

beforeAll(async () => {
  const container = await new PostgreSqlContainer("postgres:16-alpine")
    .withDatabase("test")
    .withUsername("test")
    .withPassword("test")
    .start();

  const url = container.getConnectionUri();
  process.env.DATABASE_URL = url;
  process.env.DIRECT_URL = url;

  // Push the Prisma schema into the freshly started container.
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    env: { ...process.env, DATABASE_URL: url, DIRECT_URL: url },
    stdio: "ignore",
  });

  globalThis.__prisma__ = new PrismaClient({ datasources: { db: { url } } });
  globalThis.__pgContainer__ = container;
});

afterAll(async () => {
  await globalThis.__prisma__?.$disconnect();
  await globalThis.__pgContainer__?.stop();
});

/**
 * Truncate every app table — call from test setup to start each test from clean state.
 */
export async function truncateAll(prisma: PrismaClient = globalThis.__prisma__) {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Contribution",
      "Idea",
      "_IdeaUserLikes",
      "Account",
      "Session",
      "VerificationToken",
      "User"
    RESTART IDENTITY CASCADE
  `);
}
