import Link from "next/link";
import { Routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { buttonVariants } from "@/ui/primitives/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      <h1 className="font-semibold text-4xl tracking-tight">{site.name}</h1>
      <p className="text-lg text-muted-foreground">
        Feature-based Next.js for a separate backend API: typed calls from
        OpenAPI, a token that never reaches the browser, and TanStack Query.
      </p>
      <div>
        <Link href={Routes.tasks} className={buttonVariants()}>
          Open the sample app
        </Link>
      </div>
    </main>
  );
}
