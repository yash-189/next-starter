"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { getQueryClient } from "@/lib/query";
import { Toaster } from "@/ui/primitives/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={getQueryClient()}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
