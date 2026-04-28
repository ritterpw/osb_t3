import { Genre } from "@prisma/client";

/**
 * Canonical list of genres, derived from the Prisma `Genre` enum.
 * Single source of truth — UI dropdowns, validators, and search use this.
 */
export const GENRES: readonly Genre[] = Object.values(Genre);

export function formatGenre(g: Genre | string): string {
  return g.replace(/_/g, " ");
}
