import { createRouter } from "./context";
import { z } from "zod";

export const userRouter = createRouter()
  .query("getUserByEmail", {
    input: z
      .object({
        email: z.string(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      return {
        user: await ctx.prisma.user.findFirst({
          where: { email: input?.email },
        }),
      };
    },
  })
  .query("getUserById", {
    input: z
      .object({
        userId: z.string(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      return {
        user: await ctx.prisma.user.findFirst({
          where: { id: input?.userId },
        }),
      };
    },
  })
  .query("getUserAndIdeasById", {
    input: z
      .object({
        userId: z.string(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      return {
        user: await ctx.prisma.user.findFirst({
          where: { id: input?.userId },
          include: {
            ideas: {
              include: {
                likes: true,
              },
            },
          },
        }),
      };
    },
  })
  .query("getMostPopularThisWeek", {
    async resolve({ ctx }) {
      // "This week" = ideas created in the last 7 days.
      // Previously this filtered by `gte: now` which always returned zero ideas.
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const data = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          producer_name: true,
          image: true,
          ideas: {
            select: {
              id: true,
              title: true,
              likes: true,
            },
            where: {
              createdAt: {
                gte: sevenDaysAgo,
              },
            },
            orderBy: {
              likes: { _count: "desc" },
            },
            take: 6,
          },
        },

        take: 6,
      });
      return data;
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findMany();
    },
  });
