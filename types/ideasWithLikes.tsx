import { Prisma } from "@prisma/client";

const ideasWithLikes = Prisma.validator<Prisma.IdeaArgs>()({
  include: { likes: true },
});

export type ideasWithLikes = Prisma.IdeaGetPayload<typeof ideasWithLikes>;
