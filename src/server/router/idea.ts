import { createRouter } from "./context";
import { z } from "zod";

export const ideaRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findMany();
    },
  })
  .query("getMostPopular", {
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findMany({ take: 9 });
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
