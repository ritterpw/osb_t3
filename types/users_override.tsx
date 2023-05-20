import { User } from "@prisma/client";

export type topUser = {
  ideas: {
    id: string;
    likes: User[];
    title: string;
  }[];
  id: string;
  image: string | null;
  name: string | null;
  producer_name: string | null;
};
