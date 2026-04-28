import { TRPCError } from "@trpc/server";
import type { PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";

type AuthCtx = { session: Session | null; prisma: PrismaClient };

/**
 * Extract the authenticated user's id from the tRPC context, or throw UNAUTHORIZED.
 *
 * Always read userId from here — never trust a userId passed in via the procedure
 * input, since clients can pass anything.
 */
export function requireUserId(ctx: { session: Session | null }): string {
  const userId = (ctx.session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in.",
    });
  }
  return userId;
}

/**
 * Require the authenticated user to have ADMIN role. Returns their userId.
 *
 * Role is loaded from the DB — never trust a role claim from the JWT/session,
 * since session.user is shaped by NextAuth callbacks and could be stale.
 */
export async function requireAdminId(ctx: AuthCtx): Promise<string> {
  const userId = requireUserId(ctx);
  const user = await ctx.prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required.",
    });
  }
  return userId;
}
