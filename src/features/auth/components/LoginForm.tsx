"use client";

import { useActionState } from "react";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Label } from "@/ui/primitives/label";
import { type LoginState, login } from "../actions";

export function LoginForm() {
  const [state, action, isPending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.error && (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
