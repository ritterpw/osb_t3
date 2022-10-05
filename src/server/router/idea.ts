import { createRouter } from "./context";
import { string, z } from "zod";

export const ideaRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findMany();
    },
  })
  .query("getMostPopular", {
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findMany({
        orderBy: [{ likes: "desc" }],
        take: 9,
      });
    },
  })
  .query("getMostPopularThisWeek", {
    async resolve({ ctx, input }) {
      const now = new Date();
      const data = await ctx.prisma.idea.findMany({
        orderBy: [{ likes: "desc" }],
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
          },
        },
        take: 9,
      });
      if (data.length < 9) {
        return await ctx.prisma.idea.findMany({
          orderBy: [{ likes: "desc" }],
          take: 9,
        });
      }
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
        take: 10,
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
      console.log(input);
      return await ctx.prisma.idea.create({
        data: {
          userId: "cl8sesmmi0024rxx756lhf4zy",
          title: input.title,
          description: input.description,
          tag_one: input.tag_one,
          tag_two: input.tag_two,
          file: input.file,
        },
      });
    },
  });
