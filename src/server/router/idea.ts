import { Genre } from "@prisma/client";
import { createRouter } from "./context";
import { z } from "zod";

export const ideaRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.idea.findMany();
    },
  })
  .query("getMostPopular", {
    async resolve({ ctx }) {
      return await ctx.prisma.idea.findMany({
        orderBy: [{ likes: { _count: "desc" } }],
        take: 9,
      });
    },
  })
  .query("getMostPopularThisWeek", {
    async resolve({ ctx }) {
      const now = new Date();
      let data = await ctx.prisma.idea.findMany({
        orderBy: [{ likes: { _count: "desc" } }],
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
          },
        },
        include: {
          likes: true,
        },
        take: 6,
      });

      if (data.length <= 6) {
        data = await ctx.prisma.idea.findMany({
          orderBy: [{ likes: { _count: "desc" } }],
          take: 6,
          include: {
            likes: true,
          },
        });
      }
      return data;
    },
  })
  .query("search", {
    input: z.object({
      this_query: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findMany({
        where: {
          OR: [
            {
              tag_one: {
                in: [input.this_query],
              },
            },
            {
              tag_two: {
                in: [input.this_query],
              },
            },
            {
              title: {
                search: input.this_query,
              },
            },
            {
              description: {
                search: input.this_query,
              },
            },
          ],
        },
        include: {
          likes: true,
        },
        take: 10,
      });
    },
  })
  .query("searchTag", {
    input: z.object({
      this_query: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findMany({
        where: {
          OR: [
            {
              tag_one: {
                in: [input.this_query],
              },
            },
            {
              tag_two: {
                in: [input.this_query],
              },
            },
          ],
        },
        include: {
          likes: true,
        },
        take: 10,
      });
    },
  })
  .query("searchGenre", {
    input: z.object({
      this_query: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findMany({
        where: {
          OR: [
            {
              genre: {
                in: [input.this_query.replaceAll(" ", "_") as Genre],
              },
            },
          ],
        },
        include: {
          likes: true,
        },
        take: 10,
      });
    },
  })
  .query("getIdeaById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findFirst({
        where: {
          id: input.id,
        },
        include: {
          likes: true,
          user: true,
          contributions: {
            include: {
              user: true,
            },
          },
        },
      });
    },
  })
  .query("getIdeasByUser", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          likes: true,
        },
      });
    },
  })
  .query("getMostPopularTags", {
    async resolve({ ctx }) {
      const mostUsedTags = await ctx.prisma.idea.groupBy({
        by: ["tag_one"],
        _count: {
          tag_one: true,
        },
        orderBy: {
          _count: {
            tag_one: "desc",
          },
        },
      });

      const tagCounts = mostUsedTags.reduce(
        (acc: { [key: string]: number }, { tag_one, _count }) => {
          const count = _count.tag_one || 0;
          const tagOneLower = tag_one.toLowerCase();
          acc[tagOneLower] = (acc[tagOneLower] || 0) + count;
          return acc;
        },
        {}
      );

      const mostUsedTags2 = await ctx.prisma.idea.groupBy({
        by: ["tag_two"],
        _count: {
          tag_two: true,
        },
        orderBy: {
          _count: {
            tag_two: "desc",
          },
        },
      });

      mostUsedTags2.reduce(
        (acc: { [key: string]: number }, { tag_two, _count }) => {
          const count = _count.tag_two || 0;
          const tagTwoLower = tag_two.toLowerCase();
          acc[tagTwoLower] = (acc[tagTwoLower] || 0) + count;
          return acc;
        },
        tagCounts
      );

      const mostUsedTagArray = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 30);

      return mostUsedTagArray;
    },
  })
  .query("getMostPopularGenres", {
    async resolve({ ctx }) {
      const mostUsedGenres = await ctx.prisma.idea.groupBy({
        by: ["genre"],
        _count: {
          genre: true,
        },
        orderBy: {
          _count: {
            genre: "desc",
          },
        },
      });

      const genreCounts = mostUsedGenres.reduce(
        (acc: { [key: string]: number }, { genre, _count }) => {
          const genreCount = _count.genre;

          if (genreCount) {
            acc[genre] = (acc[genre] || 0) + genreCount;
          }

          return acc;
        },
        {}
      );

      const mostUsedTagArray = Object.entries(genreCounts)
        .map(([genre, count]) => {
          genre = genre.replaceAll("_", " ");
          return { genre, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 30);

      return mostUsedTagArray;
    },
  })
  .mutation("likeIdea", {
    input: z.object({
      user: z.string(),
      idea: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.update({
        where: {
          id: input.idea,
        },
        data: {
          likes: {
            connect: {
              id: input.user,
            },
          },
        },
      });
    },
  })
  .mutation("unlikeIdea", {
    input: z.object({
      user: z.string(),
      idea: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.update({
        where: {
          id: input.idea,
        },
        data: {
          likes: {
            disconnect: {
              id: input.user,
            },
          },
        },
      });
    },
  })

  .mutation("addIdea", {
    input: z.object({
      user: z.string(),
      title: z.string(),
      description: z.string(),
      tag_one: z.string(),
      tag_two: z.string(),
      genre: z.string(),
      file: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.idea.create({
        data: {
          userId: input.user,
          title: input.title,
          description: input.description,
          tag_one: input.tag_one,
          tag_two: input.tag_two,
          genre: input.genre as Genre | undefined,
          file: input.file,
        },
      });
    },
  });
