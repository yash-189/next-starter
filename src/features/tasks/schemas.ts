import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Give the task a title").max(120),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
