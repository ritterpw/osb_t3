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
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findMany();
    },
  });
