import { z } from "zod";
import { createRouter } from "./context";
import { requireAdminId, requireUserId } from "./auth-helpers";

export const contributionRouter = createRouter()
  .mutation("contributeToIdea", {
    input: z.object({
      ideaId: z.string(),
      description: z.string(),
      file: z.string(),
    }),
    async resolve({ ctx, input }) {
      const userId = requireUserId(ctx);
      return await ctx.prisma.contribution.create({
        data: {
          description: input.description,
          file: input.file,
          ideaId: input.ideaId,
          userId,
          // Always start PENDING — moderation/approval is a separate flow,
          // never accept status from the client.
          status: "PENDING",
        },
      });
    },
  })
  .mutation("approveContribution", {
    input: z.object({ contributionId: z.string() }),
    async resolve({ ctx, input }) {
      await requireAdminId(ctx);
      return await ctx.prisma.contribution.update({
        where: { id: input.contributionId },
        data: { status: "APPROVED" },
      });
    },
  })
  .mutation("rejectContribution", {
    input: z.object({ contributionId: z.string() }),
    async resolve({ ctx, input }) {
      await requireAdminId(ctx);
      return await ctx.prisma.contribution.update({
        where: { id: input.contributionId },
        data: { status: "REJECTED" },
      });
    },
  });
