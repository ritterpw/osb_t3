import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { callerFor } from "./helpers/trpc";
import { truncateAll } from "./setup";

const prisma = () => globalThis.__prisma__;

async function seedUser(id: string) {
  return prisma().user.create({
    data: {
      id,
      email: `${id}@test.example`,
      name: id,
    },
  });
}

async function seedIdea(userId: string, overrides: Partial<{ id: string; createdAt: Date; file: string }> = {}) {
  return prisma().idea.create({
    data: {
      userId,
      title: "t",
      description: "d",
      tag_one: "a",
      tag_two: "b",
      file: overrides.file ?? `file-${Math.random()}`,
      createdAt: overrides.createdAt,
      ...(overrides.id ? { id: overrides.id } : {}),
    },
  });
}

beforeEach(async () => {
  await truncateAll();
});

describe("idea.addIdea — auth", () => {
  it("rejects unauthenticated callers with UNAUTHORIZED", async () => {
    const caller = await callerFor();
    await expect(
      caller.mutation("idea.addIdea", {
        title: "t",
        description: "d",
        tag_one: "a",
        tag_two: "b",
        genre: "Hip_hop",
        file: "f1",
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("creates an idea for the session user (never trusts an input userId)", async () => {
    const user = await seedUser("u1");
    const caller = await callerFor({ userId: user.id });

    const idea = await caller.mutation("idea.addIdea", {
      title: "title",
      description: "desc",
      tag_one: "a",
      tag_two: "b",
      genre: "Hip_hop",
      file: "f-create",
    });

    expect(idea.userId).toBe(user.id);
  });
});

describe("idea.addIdea — daily rate limit (3/day)", () => {
  it("allows 3 ideas in the same calendar day, blocks the 4th", async () => {
    const user = await seedUser("u-rate");
    const caller = await callerFor({ userId: user.id });

    for (let i = 0; i < 3; i++) {
      await caller.mutation("idea.addIdea", {
        title: `t${i}`,
        description: "d",
        tag_one: "a",
        tag_two: "b",
        genre: "Hip_hop",
        file: `f${i}`,
      });
    }

    await expect(
      caller.mutation("idea.addIdea", {
        title: "t4",
        description: "d",
        tag_one: "a",
        tag_two: "b",
        genre: "Hip_hop",
        file: "f4",
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("does not count ideas posted on previous days", async () => {
    const user = await seedUser("u-yesterday");

    // Seed 3 ideas dated yesterday — should not count toward today's limit.
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);

    for (let i = 0; i < 3; i++) {
      await seedIdea(user.id, { createdAt: yesterday, file: `old${i}` });
    }

    const caller = await callerFor({ userId: user.id });
    // Today's first idea must still succeed.
    const idea = await caller.mutation("idea.addIdea", {
      title: "today",
      description: "d",
      tag_one: "a",
      tag_two: "b",
      genre: "Hip_hop",
      file: "today",
    });
    expect(idea.id).toBeDefined();
  });

  it("counts each user's ideas independently", async () => {
    const a = await seedUser("u-a");
    const b = await seedUser("u-b");

    const callerA = await callerFor({ userId: a.id });
    const callerB = await callerFor({ userId: b.id });

    for (let i = 0; i < 3; i++) {
      await callerA.mutation("idea.addIdea", {
        title: `a${i}`, description: "d", tag_one: "a", tag_two: "b",
        genre: "Hip_hop", file: `a${i}`,
      });
    }
    // A is now at the limit; B should be unaffected.
    const ideaB = await callerB.mutation("idea.addIdea", {
      title: "b1", description: "d", tag_one: "a", tag_two: "b",
      genre: "Hip_hop", file: "b1",
    });
    expect(ideaB.userId).toBe(b.id);
  });
});

describe("idea.likeIdea / idea.unlikeIdea", () => {
  it("requires auth", async () => {
    const caller = await callerFor();
    await expect(
      caller.mutation("idea.likeIdea", { idea: "anything" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("connects and disconnects the session user from the likes relation", async () => {
    const author = await seedUser("author");
    const liker = await seedUser("liker");
    const idea = await seedIdea(author.id, { id: "idea-1" });

    const caller = await callerFor({ userId: liker.id });
    await caller.mutation("idea.likeIdea", { idea: idea.id });

    const afterLike = await prisma().idea.findUnique({
      where: { id: idea.id },
      include: { likes: true },
    });
    expect(afterLike?.likes.map((u) => u.id)).toContain(liker.id);

    await caller.mutation("idea.unlikeIdea", { idea: idea.id });
    const afterUnlike = await prisma().idea.findUnique({
      where: { id: idea.id },
      include: { likes: true },
    });
    expect(afterUnlike?.likes.map((u) => u.id)).not.toContain(liker.id);
  });
});
