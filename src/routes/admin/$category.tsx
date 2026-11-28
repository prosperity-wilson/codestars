import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { getCategory, statusLabel, type Category } from "@/lib/admin/categories";
import { listRows, logActivity, updateRow, type Row } from "@/lib/admin/db";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { AidDocuments } from "@/components/admin/AidDocuments";
import { PromotionPublication } from "@/components/admin/PromotionPublication";
import { useServerFn } from "@tanstack/react-start";
import { saveAidReview } from "@/lib/admin/workflows.functions";
import { parseAwardAmount } from "@/lib/phase1-rules";
import { adminMetadata } from "@/lib/admin/metadata";

type Search = { status?: string; sub?: string; id?: string };

export const Route = createFileRoute("/admin/$category")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const out: Search = {};
    for (const k of ["status", "sub", "id"] as const) if (typeof s[k] === "string" && s[k]) out[k] = s[k] as string;
    return out;
  },
  beforeLoad: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ params }) => adminMetadata(getCategory(params.category)?.label ?? "Submissions", "Review and manage CodeStars submissions privately."),
  component: CategoryPage,
  notFoundComponent: () => <p className="text-muted-foreground">That section doesn't exist.</p>,
  errorComponent: ({ error }) => <p role="alert" className="text-primary">{error instanceof Error ? error.message : String(error)}</p>,
});

const fmt = (d: string) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

function CategoryPage() {
  const { category: c } = Route.useRouteContext();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const q = useQuery({ queryKey: ["admin", c.key, search.status ?? "", search.sub ?? ""], queryFn: () => listRows(c, search.status, search.sub) });
  // Options for the secondary filter come from all rows in this category.
  const all = useQuery({ queryKey: ["admin", c.key, "", ""], queryFn: () => listRows(c), enabled: !!c.filterKey });
  const filterKey = c.filterKey;
  const subOptions = filterKey ? [...new Set((all.data ?? []).map((r) => r[filterKey] as string | null).filter(Boolean) as string[])].sort() : [];
  const selected = q.data?.find((r) => r.id === search.id) ?? all.data?.find((r) => r.id === search.id);
  const set = (patch: { [K in keyof Search]?: string | undefined }) => navigate({ search: (prev) => { const n: Record<string, string | undefined> = { ...prev, ...patch }; Object.keys(n).forEach((k) => { if (!n[k]) delete n[k]; }); return n as Search; } });

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Submissions</p>
      <h1 className="mt-2 text-4xl font-medium">{c.label}</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <select aria-label="Filter by status" value={search.status ?? ""} onChange={(e) => set({ status: e.target.value })} className="border border-input bg-card px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {c.statuses.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
        {c.filterKey && (
          <select aria-label={`Filter by ${c.filterLabel}`} value={search.sub ?? ""} onChange={(e) => set({ sub: e.target.value })} className="border border-input bg-card px-3 py-2 text-sm">
            <option value="">All {c.filterLabel?.toLowerCase()}s</option>
            {subOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        {q.data && <span className="self-center font-mono text-xs text-muted-foreground">{q.data.length} record{q.data.length === 1 ? "" : "s"}</span>}
      </div>

      <div className="mt-6 border border-border bg-card">
        {q.isLoading && <div className="space-y-px">{[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse bg-muted" />)}</div>}
        {q.isError && <p role="alert" className="p-6 text-sm text-primary">Couldn't load records: {(q.error as Error).message}</p>}
        {q.data?.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No records{search.status || search.sub ? " match these filters" : " yet"}.</p>}
        <ul className="divide-y divide-border">
          {q.data?.map((r) => (
            <li key={r.id}>
              <Button variant="ghost" onClick={() => set({ id: r.id })} className="flex h-auto w-full flex-col items-start gap-1 whitespace-normal rounded-none p-4 text-left sm:flex-row sm:items-center sm:gap-6">
                <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">{fmt(r.created_at)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{String(r[c.nameKey] ?? "—")}</span>
                  <span className="block truncate text-sm text-muted-foreground">{String(r[c.subtitleKey] ?? "")}</span>
                </span>
                <StatusBadge status={r.status} />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <Sheet open={!!search.id} onOpenChange={(o) => !o && set({ id: undefined })}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {search.id && !selected && (q.isLoading ? <p className="mt-10 text-sm text-muted-foreground">Loading…</p> : <p className="mt-10 text-sm text-muted-foreground">Record not found.</p>)}
          {selected && <Detail key={selected.id} c={c} row={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Detail({ c, row }: { c: Category; row: Row }) {
  const qc = useQueryClient();
  const [status, setStatus] = useState(row.status);
  const [notes, setNotes] = useState((row["admin_notes"] as string | null) ?? "");
  const [award, setAward] = useState(row["amount_awarded_lrd"] == null ? "" : String(row["amount_awarded_lrd"]));
  const saveAid = useServerFn(saveAidReview);
  const logged = useRef(false);
  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    void logActivity("viewed", c.table, row.id);
  }, [c.table, row.id]);

  const m = useMutation({
    mutationFn: () => {
      if (c.key === "financial-aid") {
        parseAwardAmount(award);
        return saveAid({ data: { id: row.id, status: status as "submitted" | "under_review" | "approved" | "partially_approved" | "declined", notes, award } });
      }
      const patch: { status?: string; admin_notes?: string | null } = {};
      if (status !== row.status) patch.status = status;
      if (c.hasNotes && (notes || null) !== ((row["admin_notes"] as string | null) ?? null)) patch.admin_notes = notes || null;
      return updateRow(c, row, patch);
    },
    onSuccess: () => { toast.success("Saved"); void qc.invalidateQueries({ queryKey: ["admin"] }); },
    onError: (e: Error) => toast.error(`Couldn't save: ${e.message}`),
  });
  const dirty = status !== row.status || (c.hasNotes && notes !== ((row["admin_notes"] as string | null) ?? "")) || (c.key === "financial-aid" && award !== (row["amount_awarded_lrd"] == null ? "" : String(row["amount_awarded_lrd"])));

  return (
    <div>
      <SheetHeader>
        <SheetDescription className="font-mono text-xs uppercase tracking-widest text-primary">{c.label}</SheetDescription>
        <SheetTitle className="font-display text-2xl">{String(row[c.nameKey] ?? "—")}</SheetTitle>
      </SheetHeader>
      <div className="mt-2 flex items-center gap-3 px-4 text-xs text-muted-foreground">
        <StatusBadge status={row.status} />
        <span>Received {new Date(row.created_at).toLocaleString()}</span>
      </div>
      <dl className="mt-6 space-y-4 px-4">
        {c.fields.map((f) => {
          const v = row[f.key];
          let text: string;
          if (f.kind === "bool") text = v ? "Yes" : "No";
          else if (f.kind === "money") text = v == null ? "—" : `L$ ${Number(v).toLocaleString()}`;
          else if (f.kind === "list") text = Array.isArray(v) && v.length ? `${v.length} file(s) on record` : "None";
          else text = v == null || v === "" ? "—" : String(v);
          return (
            <div key={f.key}>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{f.label}</dt>
              <dd className={`mt-1 text-sm ${f.long ? "whitespace-pre-wrap leading-relaxed" : ""}`}>{text}</dd>
            </div>
          );
        })}
      </dl>
      {c.key === "financial-aid" && <AidDocuments applicationId={row.id} paths={row["document_paths"]} />}
      {c.key === "promotions" && <PromotionPublication submissionId={row.id} status={row.status} dirty={dirty || m.isPending} onStatus={setStatus} />}
      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="mt-8 space-y-4 border-t border-border px-4 pt-6 pb-8">
        <label className="block text-sm">Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full border border-input bg-card px-3 py-2">
            {c.statuses.map((s) => <option key={s} value={s} disabled={c.key === "promotions" && s === "published" && row.status !== "published"}>{statusLabel(s)}</option>)}
          </select>
        </label>
        {c.key === "financial-aid" && <label className="block text-sm">Amount awarded (LRD)
          <input type="number" min="0" step="0.01" value={award} onChange={(e) => setAward(e.target.value)} className="mt-1 w-full border border-input bg-card px-3 py-2" />
        </label>}
        {c.hasNotes && (
          <label className="block text-sm">Internal notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-1 w-full border border-input bg-card px-3 py-2" placeholder="Only admins can see these notes." />
          </label>
        )}
        {m.isError && <p role="alert" className="text-sm text-primary">{m.error.message}</p>}
        <Button type="submit" disabled={!dirty || m.isPending}>{m.isPending ? "Saving…" : "Save changes"}</Button>
      </form>
    </div>
  );
}
