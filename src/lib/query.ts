import { isServer, MutationCache, QueryClient } from "@tanstack/react-query";
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

let browserClient: QueryClient | undefined;

// New client per server request so users never share a cache.
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserClient ??= makeQueryClient();
  return browserClient;
}
