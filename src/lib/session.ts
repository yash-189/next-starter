import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SessionCookie } from "./cookies";
import { env } from "./env";
import { Endpoints } from "./http/endpoints";
import type { Envelope } from "./http/envelope";
import { Routes } from "./routes";

// Keep in sync with the backend's refresh token lifetime.
const REFRESH_MAX_AGE_S = 30 * 24 * 60 * 60;

const COOKIE = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax",
  path: Routes.home,
} as const;

export interface Session {
  accessToken: string;
  refreshToken: string;
}

export async function getAccessToken() {
  return (await cookies()).get(SessionCookie.access)?.value;
}

// Can't be called from server components; they can't write cookies.
export async function setSession(session: Session) {
  const store = await cookies();
  store.set(SessionCookie.access, session.accessToken, COOKIE);
  store.set(SessionCookie.refresh, session.refreshToken, {
    ...COOKIE,
    maxAge: REFRESH_MAX_AGE_S,
  });
}

export async function getRefreshToken() {
  return (await cookies()).get(SessionCookie.refresh)?.value;
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SessionCookie.access);
  store.delete(SessionCookie.refresh);
}

export async function refreshSession(): Promise<Session | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  const response = await fetch(`${env.API_URL}${Endpoints.auth.refresh}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as Envelope<Session>;
  if (!body.success) return null;
  const session = body.data;
  await setSession(session);
  return session;
}

// Checks the refresh cookie, not the access token: an expired access token
// gets refreshed on its first 401 instead of bouncing the user to login.
export async function requireSession() {
  if (!(await getRefreshToken())) redirect(Routes.login);
}
