"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ApiError } from "@/lib/http";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { useCreateTask } from "../hooks/useTasks";
import { type TaskFormValues, taskFormSchema } from "../schemas";

export function TaskForm() {
  const createTask = useCreateTask();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { title: "" },
  });
  const error = form.formState.errors.title?.message;

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        createTask.mutate(values, {
          onSuccess: () => form.reset(),
          onError: (error) => {
            if (!(error instanceof ApiError)) return;
            for (const { field, message } of error.fieldErrors) {
              if (field in values) {
                form.setError(field as keyof TaskFormValues, { message });
              }
            }
          },
        }),
      )}
      className="flex flex-col gap-2"
    >
      <div className="flex gap-2">
        <Input
          {...form.register("title")}
          placeholder="What needs doing?"
          aria-label="New task"
          aria-invalid={!!error}
        />
        <Button type="submit" disabled={createTask.isPending}>
          Add
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </form>
  );
}
