import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES } from "@/lib/admin/categories";
import { countRows } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/")({ component: Overview });

function Overview() {
  const q = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: () => Promise.all(CATEGORIES.map(async (c) => ({ c, total: await countRows(c), fresh: await countRows(c, c.statuses[0] === "draft" ? "submitted" : c.statuses[0]) }))),
  });
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Dashboard</p>
      <h1 className="mt-2 text-4xl font-medium">Overview</h1>
      <p className="mt-2 text-muted-foreground">Live totals from the database. "Awaiting review" counts records still in their first status.</p>
      {q.isError && <p role="alert" className="mt-6 border border-primary p-4 text-sm text-primary">Couldn't load counts: {(q.error as Error).message}</p>}
      <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
        {(q.data ?? CATEGORIES.map((c) => ({ c, total: null as number | null, fresh: null as number | null }))).map(({ c, total, fresh }) => (
          <Link key={c.key} to="/admin/$category" params={{ category: c.key }} className="group bg-background p-6 hover:bg-card">
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className="mt-3 font-display text-5xl">{q.isLoading ? <span className="inline-block h-12 w-16 animate-pulse bg-muted" /> : total ?? "—"}</p>
            <p className="mt-3 font-mono text-xs text-primary">{fresh ?? "–"} awaiting review <span className="opacity-0 transition group-hover:opacity-100">→</span></p>
          </Link>
        ))}
      </div>
    </div>
  );
}
