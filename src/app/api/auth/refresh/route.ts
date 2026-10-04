import { refreshSession } from "@/lib/session";

// The browser can't read the refresh cookie, so it asks here.

export async function POST() {
  const session = await refreshSession();
  return new Response(null, { status: session ? 204 : 401 });
}
