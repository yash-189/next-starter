import { isServer, MutationCache, QueryClient } from "@tanstack/react-query";
import { cache } from "react";
import { toast } from "sonner";
import { ApiError } from "./http/errors";

const STALE_MS = 60_000;

function makeQueryClient() {
  return new QueryClient({
    // Avoids refetching server-prefetched data right after hydration.
    defaultOptions: { queries: { staleTime: STALE_MS } },
    // Failed reads are shown by the screen, field errors by the form.
    mutationCache: new MutationCache({
      onError: (error) => {
        if (error instanceof ApiError && error.fieldErrors.length > 0) return;
        toast.error(error.message);
      },
    }),
  });
}

// One client per server request, shared by every server component in it,
// so users never share a cache.
const getServerQueryClient = cache(makeQueryClient);

let browserClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) return getServerQueryClient();
  browserClient ??= makeQueryClient();
  return browserClient;
}
