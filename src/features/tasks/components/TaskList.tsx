"use client";

import { Button } from "@/ui/primitives/button";
import { useDeleteTask } from "../hooks/useTasks";
import type { Task } from "../types";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const deleteTask = useDeleteTask();

  return (
    <ul className="divide-y rounded-lg border">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between p-3">
          <span>{task.title}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteTask.mutate(task.id)}
            disabled={deleteTask.isPending}
            aria-label={`Delete ${task.title}`}
          >
            Delete
          </Button>
        </li>
      ))}
    </ul>
  );
}
