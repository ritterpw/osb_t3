import { createRouter } from "./context";
import { z } from "zod";

export const userRouter = createRouter()
  .query("getUser", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `getUser ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findMany();
    },
  });
