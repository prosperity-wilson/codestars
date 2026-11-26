import { statusLabel } from "@/lib/admin/categories";

const NEW = ["new", "submitted"];
const DONE = ["closed", "accepted", "confirmed", "enrolled", "approved", "partially_approved", "published"];
const NEG = ["declined", "rejected", "not_selected"];

export function StatusBadge({ status }: { status: string }) {
  const cls = NEW.includes(status)
    ? "border-primary bg-primary text-primary-foreground"
    : DONE.includes(status)
      ? "border-foreground bg-foreground text-background"
      : NEG.includes(status)
        ? "border-muted-foreground text-muted-foreground line-through decoration-1"
        : "border-primary text-primary";
  return <span className={`inline-block whitespace-nowrap border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${cls}`}>{statusLabel(status)}</span>;
}
