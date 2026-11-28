import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, statusLabel } from "@/lib/admin/categories";
import { adminMetadata } from "@/lib/admin/metadata";

export const Route = createFileRoute("/admin/activity")({ head: () => adminMetadata("Activity log", "Immutable CodeStars administrative activity history."), component: Activity });

function Activity() {
  const q = useQuery({
    queryKey: ["admin", "activity"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admin_activity").select("*").order("created_at", { ascending: false }).limit(200);
      if (error) throw new Error(error.message);
      return data;
    },
  });
  const label = (t: string | null) => CATEGORIES.find((c) => c.table === t)?.label ?? t ?? "";
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Records</p>
      <h1 className="mt-2 text-4xl font-medium">Activity log</h1>
      <p className="mt-2 text-muted-foreground">The latest 200 admin actions. Entries can't be edited or deleted.</p>
      <div className="mt-8 border border-border bg-card">
        {q.isLoading && <p className="p-6 text-sm text-muted-foreground">Loading…</p>}
        {q.isError && <p role="alert" className="p-6 text-sm text-primary">Couldn't load activity: {(q.error as Error).message}</p>}
        {q.data?.length === 0 && <p className="p-6 text-sm text-muted-foreground">No admin actions recorded yet.</p>}
        <ul className="divide-y divide-border">
          {q.data?.map((a) => {
            const d = (a.details ?? {}) as Record<string, unknown>;
            const transition = d["from"] !== undefined || d["to"] !== undefined;
            const formatValue = (value: unknown) => a.action === "award_updated" ? value == null ? "Not set" : `L$ ${Number(value).toLocaleString()}` : statusLabel(String(value ?? ""));
            return (
              <li key={a.id} className="flex flex-col gap-1 p-4 text-sm sm:flex-row sm:items-center sm:gap-6">
                <span className="w-44 shrink-0 font-mono text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
                <span className="font-medium">{statusLabel(a.action)}</span>
                <span className="text-muted-foreground">{label(a.table_name)}{transition ? ` · ${formatValue(d["from"])} → ${formatValue(d["to"])}` : ""}</span>
                <span className="font-mono text-xs text-muted-foreground sm:ml-auto">#{a.record_id?.slice(0, 8)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
