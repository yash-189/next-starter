import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientHttp } from "@/lib/http";
import { createTask, deleteTask, getTasks } from "../api";
import { taskKeys } from "../queryKeys";
import type { TaskFormValues } from "../schemas";

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.list(),
    queryFn: () => getTasks(clientHttp),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: TaskFormValues) => createTask(clientHttp, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(clientHttp, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
