import type { Session } from "next-auth";
import { appRouter } from "@/server/router";
import { createContextInner } from "@/server/router/context";

/**
 * Build a tRPC caller bound to either a fake session or no session.
 * Tests use this to invoke procedures directly, no HTTP layer involved.
 */
export async function callerFor(opts: { userId?: string } = {}) {
  const session: Session | null = opts.userId
    ? {
        user: { id: opts.userId } as Session["user"] & { id: string },
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }
    : null;

  // createContextInner ignores its req/res and just takes session — we override
  // the prisma client so tests use the testcontainer-backed instance.
  const ctx = await createContextInner({ session });
  ctx.prisma = globalThis.__prisma__;

  return appRouter.createCaller(ctx);
}
