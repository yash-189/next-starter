"use client";

import { EmptyState } from "@/ui/components/EmptyState";
import { PageHeader } from "@/ui/components/PageHeader";
import { Button } from "@/ui/primitives/button";
import { useTasks } from "../hooks/useTasks";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";

export function TasksScreen() {
  const { data: tasks, isPending, isError, refetch } = useTasks();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tasks"
        description="A sample feature — copy it, rename it."
      />
      <TaskForm />
      {isPending ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : isError ? (
        <EmptyState
          title="Couldn't load tasks"
          action={<Button onClick={() => refetch()}>Try again</Button>}
        />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Add your first one above."
        />
      ) : (
        <TaskList tasks={tasks} />
      )}
    </div>
  );
}
