/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";
import { getSession } from "~/server/session";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
// Store session tokens with Promise-based resolution
// This allows the route handler to wait for the token to be set
const sessionTokenPromises = new Map<
  string,
  { resolve: (token: string) => void; reject: () => void }
>();
const sessionTokenStore = new Map<string, string>();
const logoutRequests = new Set<string>();

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const cookieHeader = opts.headers.get("cookie") ?? undefined;
  const session = await getSession(cookieHeader);

  // Generate a request ID to track session tokens
  // Use timestamp + random for better uniqueness
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  return {
    db,
    session,
    requestId,
    setSessionToken: (token: string) => {
      sessionTokenStore.set(requestId, token);
      // Resolve any waiting promises
      const promise = sessionTokenPromises.get(requestId);
      if (promise) {
        promise.resolve(token);
        sessionTokenPromises.delete(requestId);
      }
      // Clean up after 5 seconds
      setTimeout(() => {
        sessionTokenStore.delete(requestId);
        sessionTokenPromises.delete(requestId);
      }, 5000);
    },
    deleteSession: () => {
      logoutRequests.add(requestId);
      // Clean up after 5 seconds
      setTimeout(() => {
        logoutRequests.delete(requestId);
      }, 5000);
    },
    ...opts,
  };
};

export async function waitForSessionToken(
  requestId: string,
  timeout = 2000,
): Promise<string | undefined> {
  // Check if token already exists
  const existing = sessionTokenStore.get(requestId);
  if (existing) {
    return existing;
  }

  // Wait for token to be set
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      sessionTokenPromises.delete(requestId);
      resolve(undefined);
    }, timeout);

    sessionTokenPromises.set(requestId, {
      resolve: (token: string) => {
        clearTimeout(timeoutId);
        resolve(token);
      },
      reject: () => {
        clearTimeout(timeoutId);
        resolve(undefined);
      },
    });
  });
}

export function shouldDeleteSession(requestId: string): boolean {
  return logoutRequests.has(requestId);
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next }) => {
  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  return await next();
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.userId` is not null.
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource.",
      });
    }
    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  });
