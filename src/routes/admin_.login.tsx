import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin/db";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/admin_/login")({
  validateSearch: (s: Record<string, unknown>): { denied?: boolean } => (s["denied"] ? { denied: true } : {}),
  head: () => ({
    meta: [
      { title: "Admin sign in — CodeStars" },
      { name: "description", content: "Sign in to the CodeStars admin review dashboard." },
      { property: "og:title", content: "Admin sign in — CodeStars" },
      { property: "og:description", content: "Sign in to the CodeStars admin review dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  ssr: false,
  component: AdminLogin,
});

function AdminLogin() {
  const { denied } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(denied ? "This account is not authorized to use the admin dashboard." : null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message === "Invalid login credentials" ? "Email or password is incorrect." : err.message);
      setBusy(false);
      return;
    }
    if (!(await checkIsAdmin())) {
      await supabase.auth.signOut();
      setError("This account is not authorized to use the admin dashboard.");
      setBusy(false);
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-background p-8">
        <Logo />
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-primary">Admin</p>
        <h1 className="mt-2 text-3xl font-medium">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">For authorized CodeStars staff only.</p>
        <label className="mt-6 block text-sm">Email
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-input bg-card px-3 py-2" />
        </label>
        <label className="mt-4 block text-sm">Password
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border border-input bg-card px-3 py-2" />
        </label>
        {error && <p role="alert" className="mt-4 border border-primary px-3 py-2 text-sm text-primary">{error}</p>}
        <button disabled={busy} className="mt-6 w-full bg-primary px-4 py-2.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
