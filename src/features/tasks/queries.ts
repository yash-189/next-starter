import { queryOptions } from "@tanstack/react-query";
import type { Http } from "@/lib/http";
import { getTasks } from "./api";

// Keys: for invalidation and cache reads; no HTTP instance needed.
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
};

// Queries pair a key with its fetch, so the hook and the server prefetch
// share one definition. Pass serverHttp on the server, clientHttp in hooks.
export const taskQueries = {
  list: (http: Http) =>
    queryOptions({
      queryKey: taskKeys.lists(),
      queryFn: () => getTasks(http),
    }),
};
