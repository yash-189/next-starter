import { env } from "@/lib/env";
import { getAccessToken } from "@/lib/session";

// Browser requests to the backend go through here so the token can stay in
// an httpOnly cookie. Refreshing happens in clientHttp, not here.

type Context = { params: Promise<{ path: string[] }> };

async function handle(request: Request, { params }: Context) {
  const { path } = await params;
  const url = new URL(request.url);
  const headers = new Headers(request.headers);
  headers.delete("cookie");
  headers.delete("host");
  const token = await getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(
    `${env.API_URL}/${path.join("/")}${url.search}`,
    {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
    },
  );

  // fetch already decompressed the body; these headers would make the
  // browser try again.
  const out = new Headers(response.headers);
  out.delete("content-encoding");
  out.delete("content-length");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: out,
  });
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
};
