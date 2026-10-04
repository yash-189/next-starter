import { Endpoints, type Http } from "@/lib/http";
import type { Session } from "@/lib/session";
import type { LoginInput } from "./schemas";

export const login = (http: Http, input: LoginInput) =>
  http.post<Session>(Endpoints.auth.login, input);

export const logout = (http: Http) => http.post<void>(Endpoints.auth.logout);
