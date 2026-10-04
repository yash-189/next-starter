import { Endpoints, type Http } from "@/lib/http";
import type { TaskFormValues } from "./schemas";
import type { Task } from "./types";

// Pass serverHttp from server components and clientHttp from hooks.

export const getTasks = (http: Http) => http.get<Task[]>(Endpoints.tasks.list);

export const createTask = (http: Http, values: TaskFormValues) =>
  http.post<Task>(Endpoints.tasks.list, values);

export const deleteTask = (http: Http, id: string) =>
  http.delete(Endpoints.tasks.one(id));
