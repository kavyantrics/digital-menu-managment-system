import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "~/env";

const secretKey = env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresAt)
    .setIssuedAt()
    .sign(encodedKey);

  return session;
}

/**
 * Get session from cookies. Can work with both Server Components (using cookies())
 * and API Route Handlers (by passing cookie string from request headers).
 */
export async function getSession(
  cookieHeader?: string,
): Promise<{ userId: string } | null> {
  let sessionToken: string | undefined;

  if (cookieHeader) {
    // Extract session cookie from request headers (for API Route Handlers)
    // Cookie header format: "cookie1=value1; cookie2=value2"
    const cookiePairs = cookieHeader.split(";");
    for (const pair of cookiePairs) {
      const trimmed = pair.trim();
      const equalIndex = trimmed.indexOf("=");
      if (equalIndex === -1) continue;
      const key = trimmed.slice(0, equalIndex).trim();
      if (key === "session") {
        // Get everything after the first = (in case value contains =)
        const value = trimmed.slice(equalIndex + 1).trim();
        try {
          sessionToken = decodeURIComponent(value);
        } catch {
          // If decoding fails, use the value as-is (might not be encoded)
          sessionToken = value;
        }
        break;
      }
    }
  } else {
    // Use cookies() from next/headers (for Server Components)
    try {
      const cookieStore = await cookies();
      sessionToken = cookieStore.get("session")?.value;
    } catch {
      // cookies() might not be available in this context
      return null;
    }
  }

  if (!sessionToken) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionToken, encodedKey);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
