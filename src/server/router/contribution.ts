import { z } from "zod";
import { createRouter } from "./context";

export const contributionRouter = createRouter().mutation("contributeToIdea", {
  input: z.object({
    userId: z.string(),
    ideaId: z.string(),
    description: z.string(),
    file: z.string(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  }),
  async resolve({ ctx, input }) {
    return await ctx.prisma.contribution.create({
      data: {
        description: input.description,
        file: input.file,
        ideaId: input.ideaId,
        userId: input.userId,
        status: input.status,
      },
    });
  },
});
