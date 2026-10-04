import { logout } from "@/features/auth";
import { requireSession } from "@/lib/session";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/ui/components/ThemeToggle";
import { Button } from "@/ui/primitives/button";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  await requireSession();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <span className="font-medium">{site.name}</span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
