import { supabase } from "@/integrations/supabase/client";
import type { Category } from "./categories";

export type Row = Record<string, unknown> & { id: string; status: string; created_at: string };

// Dynamic table access: every call still goes through RLS, which only lets admins read/update.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}

export async function countRows(c: Category, status?: string) {
  let q = db.from(c.table).select("id", { count: "exact", head: true });
  if (status) q = q.eq("status", status);
  const { count, error } = await q;
  if (error) throw new Error(error.message);
  return (count ?? 0) as number;
}

export async function listRows(c: Category, status?: string, sub?: string): Promise<Row[]> {
  let q = db.from(c.table).select("*").order("created_at", { ascending: false }).limit(500);
  if (status) q = q.eq("status", status);
  if (sub && c.filterKey) q = q.eq(c.filterKey, sub);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data as Row[];
}

export async function logActivity(action: string, table: string, recordId: string, details: Record<string, unknown> = {}) {
  const { error } = await supabase.from("admin_activity").insert({ action, table_name: table, record_id: recordId, details: details as never });
  if (error) console.error("Activity log failed", error.message);
}

export async function updateRow(c: Category, row: Row, patch: { status?: string; admin_notes?: string | null }) {
  const { data, error } = await db.from(c.table).update(patch).eq("id", row.id).select("*").single();
  if (error) throw new Error(error.message);
  // Aid/promotion changes are audited atomically by database triggers.
  const databaseAudited = c.key === "financial-aid" || c.key === "promotions";
  if (!databaseAudited && patch.status && patch.status !== row.status) {
    await logActivity("status_changed", c.table, row.id, { from: row.status, to: patch.status });
  }
  if (!databaseAudited && "admin_notes" in patch && patch.admin_notes !== (row["admin_notes"] ?? null)) {
    await logActivity("notes_updated", c.table, row.id);
  }
  return data as Row;
}
