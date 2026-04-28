import { beforeEach, describe, expect, it } from "vitest";
import { callerFor } from "./helpers/trpc";
import { truncateAll } from "./setup";

const prisma = () => globalThis.__prisma__;

beforeEach(async () => {
  await truncateAll();
});

async function seedUser(id: string, role: "USER" | "ADMIN" = "USER") {
  return prisma().user.create({
    data: { id, email: `${id}@test.example`, role },
  });
}

async function seedIdea(userId: string) {
  return prisma().idea.create({
    data: {
      userId,
      title: "t",
      description: "d",
      tag_one: "a",
      tag_two: "b",
      file: `file-${Math.random()}`,
    },
  });
}

describe("contribution.contributeToIdea", () => {
  it("requires auth", async () => {
    const caller = await callerFor();
    await expect(
      caller.mutation("contribution.contributeToIdea", {
        ideaId: "x",
        description: "d",
        file: "f",
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("forces status to PENDING (clients cannot self-approve)", async () => {
    const author = await seedUser("author");
    const contributor = await seedUser("contrib");
    const idea = await seedIdea(author.id);

    const caller = await callerFor({ userId: contributor.id });
    const c = await caller.mutation("contribution.contributeToIdea", {
      ideaId: idea.id,
      description: "my contribution",
      file: "contrib-file",
    });

    expect(c.status).toBe("PENDING");
    expect(c.userId).toBe(contributor.id);
  });
});

describe("contribution.approveContribution / rejectContribution", () => {
  it("rejects non-admin users with FORBIDDEN", async () => {
    const author = await seedUser("author");
    const contributor = await seedUser("contributor");
    const idea = await seedIdea(author.id);
    const c = await prisma().contribution.create({
      data: {
        userId: contributor.id,
        ideaId: idea.id,
        description: "x",
        file: "y",
        status: "PENDING",
      },
    });

    const caller = await callerFor({ userId: author.id }); // a regular user
    await expect(
      caller.mutation("contribution.approveContribution", { contributionId: c.id }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("lets an ADMIN approve and reject", async () => {
    const admin = await seedUser("admin", "ADMIN");
    const author = await seedUser("author");
    const contributor = await seedUser("contributor");
    const idea = await seedIdea(author.id);
    const c = await prisma().contribution.create({
      data: {
        userId: contributor.id,
        ideaId: idea.id,
        description: "x",
        file: "y",
        status: "PENDING",
      },
    });

    const caller = await callerFor({ userId: admin.id });
    const approved = await caller.mutation("contribution.approveContribution", {
      contributionId: c.id,
    });
    expect(approved.status).toBe("APPROVED");

    const rejected = await caller.mutation("contribution.rejectContribution", {
      contributionId: c.id,
    });
    expect(rejected.status).toBe("REJECTED");
  });
});
