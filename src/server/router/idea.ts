import { createRouter } from "./context";
import { z } from "zod";

export const ideaRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.idea.findMany();
    },
  })
  .query("getMostPopular", {
    async resolve({ ctx }) {
      return await ctx.prisma.idea.findMany({
        orderBy: [{ likes: { _count: "desc" } }],
        take: 9,
      });
    },
  })
  .query("getMostPopularThisWeek", {
    async resolve({ ctx }) {
      const now = new Date();
      let data = await ctx.prisma.idea.findMany({
        orderBy: [{ likes: { _count: "desc" } }],
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
          },
        },
        include: {
          likes: true,
        },
        take: 6,
      });

      if (data.length <= 6) {
        data = await ctx.prisma.idea.findMany({
          orderBy: [{ likes: { _count: "desc" } }],
          take: 6,
          include: {
            likes: true,
          },
        });
      }
      return data;
    },
  })
  .query("search", {
    input: z.object({
      this_query: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findMany({
        where: {
          OR: [
            {
              tag_one: {
                search: input.this_query,
              },
            },
            {
              tag_two: {
                search: input.this_query,
              },
            },
            {
              title: {
                search: input.this_query,
              },
            },
            {
              description: {
                search: input.this_query,
              },
            },
          ],
        },
        include: {
          likes: true,
        },
        take: 10,
      });
    },
  })
  .query("searchTag", {
    input: z.object({
      this_tag: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findMany({
        where: {
          OR: [
            {
              tag_one: {
                search: input.this_tag,
              },
            },
            {
              tag_two: {
                search: input.this_tag,
              },
            },
          ],
        },
        include: {
          likes: true,
        },
        take: 10,
      });
    },
  })
  .query("getIdeaById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findFirst({
        where: {
          id: input.id,
        },
        include: {
          user: true,
        },
      });
    },
  })
  .mutation("likeIdea", {
    input: z.object({
      user: z.string(),
      idea: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.update({
        where: {
          id: input.idea,
        },
        data: {
          likes: {
            connect: {
              id: input.user,
            },
          },
        },
      });
    },
  })
  .mutation("unlikeIdea", {
    input: z.object({
      user: z.string(),
      idea: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.update({
        where: {
          id: input.idea,
        },
        data: {
          likes: {
            disconnect: {
              id: input.user,
            },
          },
        },
      });
    },
  })
  .mutation("contributeToIdea", {
    input: z.object({
      userId: z.string(),
      ideaId: z.string(),
      description: z.string(),
      file: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.pendingContributions.create({
        data: {
          userId: input.userId,
          ideaId: input.ideaId,
          description: input.description,
          file: input.file,
        },
      });
    },
  })
  .mutation("addIdea", {
    input: z.object({
      user: z.string(),
      title: z.string(),
      description: z.string(),
      tag_one: z.string(),
      tag_two: z.string(),
      file: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.create({
        data: {
          userId: input.user,
          title: input.title,
          description: input.description,
          tag_one: input.tag_one,
          tag_two: input.tag_two,
          file: input.file,
        },
      });
    },
  });
