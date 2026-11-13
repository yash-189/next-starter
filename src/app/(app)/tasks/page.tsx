import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { TasksScreen, taskQueries } from "@/features/tasks";
import { serverHttp } from "@/lib/http/server";
import { getQueryClient } from "@/lib/query";

export const metadata: Metadata = { title: "Tasks" };

export default async function TasksPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(taskQueries.list(serverHttp));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksScreen />
    </HydrationBoundary>
  );
}
