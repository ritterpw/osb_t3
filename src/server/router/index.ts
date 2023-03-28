// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { userRouter } from "./user";
import { ideaRouter } from "./idea";
import { contributionRouter } from "./contribution";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("idea.", ideaRouter)
  .merge("contribution.", contributionRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
