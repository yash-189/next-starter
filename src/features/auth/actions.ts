"use server";

import { redirect } from "next/navigation";
import { ApiError } from "@/lib/http";
import { serverHttp } from "@/lib/http/server";
import { Routes } from "@/lib/routes";
import { clearSession, setSession } from "@/lib/session";
import { login as loginRequest, logout as logoutRequest } from "./api";
import { loginSchema } from "./schemas";

// Server actions only because writing the session cookie needs the server.

export interface LoginState {
  error?: string;
}

export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }
  try {
    await setSession(await loginRequest(serverHttp, parsed.data));
  } catch (error) {
    return {
      error: error instanceof ApiError ? error.message : "Couldn't sign in.",
    };
  }
  redirect(Routes.tasks);
}

export async function logout() {
  // Sign out locally even if the backend is down.
  await logoutRequest(serverHttp).catch(() => undefined);
  await clearSession();
  redirect(Routes.login);
}
