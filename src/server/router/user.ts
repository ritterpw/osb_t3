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
      const now = new Date();
      let data = await ctx.prisma.user.findMany({
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
                gte: now,
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
