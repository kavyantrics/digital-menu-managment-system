import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import {
  createTRPCContext,
  waitForSessionToken,
  shouldDeleteSession,
} from "~/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = async (req: NextRequest): Promise<NextResponse> => {
  // Create context once and reuse it to ensure same requestId
  const context = await createContext(req);
  const requestId = context.requestId;

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => Promise.resolve(context),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });

  // Create NextResponse to handle cookies properly
  const nextResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  let sessionToken: string | undefined;
  if (requestId) {
    try {
      sessionToken = await waitForSessionToken(requestId, 2000);
    } catch {
      // Timeout or error - continue without setting cookie
    }
  }

  const shouldDelete = requestId ? shouldDeleteSession(requestId) : false;

  if (shouldDelete) {
    nextResponse.cookies.set("session", "", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });
  } else if (sessionToken) {
    const expiresDate = new Date();
    expiresDate.setTime(expiresDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    nextResponse.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresDate,
      path: "/",
    });
  }

  return nextResponse;
};

export { handler as GET, handler as POST };
