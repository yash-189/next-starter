import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getTasks, TasksScreen, taskKeys } from "@/features/tasks";
import { serverHttp } from "@/lib/http/server";
import { getQueryClient } from "@/lib/query";

export const metadata: Metadata = { title: "Tasks" };

export default async function TasksPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: taskKeys.list(),
    queryFn: () => getTasks(serverHttp),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksScreen />
    </HydrationBoundary>
  );
}
