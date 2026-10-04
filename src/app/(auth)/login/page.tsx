import type { Metadata } from "next";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6">
      <h1 className="font-semibold text-2xl tracking-tight">Sign in</h1>
      <LoginForm />
    </main>
  );
}
