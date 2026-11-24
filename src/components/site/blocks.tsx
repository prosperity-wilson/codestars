import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ORG } from "./nav";

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

/** Composes the user's details into an email to CodeStars. Nothing is stored on this site. */
export function EmailForm({ subject, fields, submitLabel }: { subject: string; fields: Field[]; submitLabel: string }) {
  const [error, setError] = useState("");
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    setError("");
    const body = fields.map((f) => `${f.label}: ${String(data.get(f.name) ?? "").slice(0, 2000)}`).join("\n\n");
    window.location.href = `mailto:${ORG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const cls = "mt-2 w-full border border-input bg-card px-3 py-2.5 text-sm focus:border-primary focus:outline-none";
  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-5">
      {fields.map((f) => (
        <label key={f.name} className="text-sm font-medium">
          {f.label}{f.required && <span className="text-primary"> *</span>}
          {f.type === "textarea" ? (
            <textarea name={f.name} required={f.required} maxLength={2000} rows={5} className={cls} />
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
      {error && <p className="text-sm text-primary" role="alert">{error}</p>}
      <div>
        <button type="submit" className="bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">{submitLabel}</button>
        <p className="mt-3 text-xs text-muted-foreground">This opens your email app with your details filled in, addressed to {ORG.email}. Online submissions are planned for a later release.</p>
      </div>
    </form>
  );
}
