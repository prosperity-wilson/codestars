import { Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import { ORG } from "./nav";
import { Button } from "@/components/ui/button";
import { AID_DOCUMENT_ACCEPT, AID_DOCUMENT_MAX_COUNT, validateAidDocumentContents } from "@/lib/phase1-rules";

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-medium leading-[1.05] md:text-6xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{intro}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function Section({ title, kicker, children, dark = false }: { title?: string; kicker?: string; children: ReactNode; dark?: boolean }) {
  return (
    <section className={dark ? "bg-secondary text-secondary-foreground" : ""}>
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        {kicker && <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{kicker}</p>}
        {title && <h2 className="mt-2 mb-10 max-w-3xl text-3xl font-medium md:text-4xl">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

export function Grid({ items }: { items: { title: string; body: string; tag?: string }[] }) {
  return (
    <div className="grid gap-px border border-border bg-border md:grid-cols-3">
      {items.map((it, i) => (
        <div key={it.title} className="bg-background p-7">
          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>{String(i + 1).padStart(2, "0")}</span>
            {it.tag && <StatusTag status={it.tag} />}
          </div>
          <h3 className="mt-6 text-xl font-medium">{it.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
        </div>
      ))}
    </div>
  );
}

export function StatusTag({ status }: { status: string }) {
  const live = status.toLowerCase() === "open" || status.toLowerCase() === "available";
  return (
    <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${live ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export function CTA({ to, children, variant = "primary" }: { to: string; children: ReactNode; variant?: "primary" | "outline" }) {
  return (
    <Link to={to} className={variant === "primary" ? "bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90" : "border border-foreground px-6 py-3 text-sm font-medium hover:bg-foreground hover:text-background"}>
      {children}
    </Link>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return <div className="border-l-2 border-primary bg-muted px-5 py-4 text-sm">{children}</div>;
}

type Field = { name: string; label: string; type?: "text" | "email" | "tel" | "textarea" | "select"; options?: string[]; required?: boolean };

type Row = Record<string, string | boolean | null | string[]>;
type SubmitTable = "contact_messages" | "creative_inquiries" | "training_applications" | "promotion_submissions" | "partnership_inquiries" | "financial_aid_applications";

/** Saves the visitor's submission to the CodeStars database. Visitors can write but never read submissions. */
export function SubmitForm({ table, toRow, fields, submitLabel, documents = false, successMessage = "Thank you — we received your submission and will reply by email." }: { table: SubmitTable; toRow: (v: Record<string, string>) => Row; fields: Field[]; submitLabel: string; documents?: boolean; successMessage?: string }) {
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const uploaded = useRef(new Map<File, string>());
  const selectedFiles = useRef<File[]>([]);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const v: Record<string, string> = {};
    fields.forEach((f) => { v[f.name] = String(data.get(f.name) ?? "").trim(); });
    if (v["email"] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v["email"])) return setError("Please enter a valid email address.");
    setError(""); setSending(true);
    try {
      const row = Object.fromEntries(Object.entries(toRow(v)).map(([k, x]) => [k, x === "" ? null : x]));
      const { supabase } = await import("@/integrations/supabase/client");
      if (documents && table === "financial_aid_applications") {
        const files = selectedFiles.current;
        if (files.length > AID_DOCUMENT_MAX_COUNT) throw new Error("Choose no more than five documents.");
        await Promise.all(files.map(validateAidDocumentContents));
        const paths: string[] = [];
        for (const file of files) {
          let path = uploaded.current.get(file);
          if (!path) {
            const name = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
            path = `incoming/${crypto.randomUUID()}/${name}`;
            const { error: uploadError } = await supabase.storage.from("private-documents").upload(path, file, { contentType: file.type, upsert: false });
            if (uploadError) throw new Error("A document couldn't be uploaded. Please try again; your completed uploads will be reused.");
            uploaded.current.set(file, path);
          }
          paths.push(path);
        }
        row["document_paths"] = [...new Set([...(Array.isArray(row["document_paths"]) ? row["document_paths"] : []), ...paths])];
      }
      const { error: err } = await supabase.from(table).insert(row as never);
      if (err) throw new Error(`We couldn't send this right now. Please try again, or email ${ORG.email}.`);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send this right now. Please try again.");
    } finally { setSending(false); }
  };
  if (done) return <Notice>{successMessage}</Notice>;
  const cls = "mt-2 w-full border border-input bg-card px-3 py-2.5 text-sm focus:border-primary focus:outline-none";
  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-5">
      {fields.map((f) => (
        <label key={f.name} className="text-sm font-medium">
          {f.label}{f.required && <span className="text-primary"> *</span>}
          {f.type === "textarea" ? (
            <textarea name={f.name} required={f.required} maxLength={5000} rows={5} className={cls} />
          ) : f.type === "select" ? (
            <select name={f.name} required={f.required} className={cls} defaultValue="">
              <option value="" disabled>Select…</option>
              {f.options?.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input name={f.name} type={f.type ?? "text"} required={f.required} maxLength={200} className={cls} />
          )}
        </label>
      ))}
      {documents && table === "financial_aid_applications" && <label className="text-sm font-medium">Supporting documents (optional)
        <input type="file" name="documents" multiple accept={AID_DOCUMENT_ACCEPT} disabled={sending} className={cls} onChange={(e) => { selectedFiles.current = Array.from(e.target.files ?? []); setError(""); }} />
        <span className="mt-2 block text-xs text-muted-foreground">PDF, JPG or PNG. Up to five files, 10 MB each. Only authorized administrators can access them.</span>
      </label>}
      {error && <p className="text-sm text-primary" role="alert">{error}</p>}
      <div>
        <Button type="submit" size="lg" disabled={sending}>{sending ? "Sending…" : submitLabel}</Button>
      </div>
    </form>
  );
}
