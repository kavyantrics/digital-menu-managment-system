import { authRouter } from "~/server/api/routers/auth";
import { userRouter } from "~/server/api/routers/user";
import { restaurantRouter } from "~/server/api/routers/restaurant";
import { menuRouter } from "~/server/api/routers/menu";
import { publicMenuRouter } from "~/server/api/routers/public-menu";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  restaurant: restaurantRouter,
  menu: menuRouter,
  publicMenu: publicMenuRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.auth.getCurrentUser();
 */
export const createCaller = createCallerFactory(appRouter);
