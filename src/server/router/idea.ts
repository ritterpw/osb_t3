import { createRouter } from "./context";
import { z } from "zod";

export const ideaRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findMany();
    },
  })
  .mutation("addIdea", {
    input: z.object({
      title: z.string(),
      description: z.string(),
      tag_one: z.string(),
    }),
    async resolve({ ctx, input }) {
      console.log(input);

      return await ctx.prisma.idea.create({
        data: {
          userId: "cl7sirxdp00079ux7n7gnlbir",
          title: input.title,
          description: input.description,
          tag_one: input.tag_one,
          tag_two: "world",
        },
      });
    },
  });
