import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin/db";
import { CATEGORIES, resolveAdminAccess } from "@/lib/admin/categories";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin dashboard — CodeStars" },
      { name: "description", content: "Review CodeStars submissions." },
      { property: "og:title", content: "Admin dashboard — CodeStars" },
      { property: "og:description", content: "Review CodeStars submissions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    const access = resolveAdminAccess(!!data.user, data.user ? await checkIsAdmin() : false);
    if (access === "login") throw redirect({ to: "/admin/login" });
    if (access === "denied") {
      await supabase.auth.signOut();
      throw redirect({ to: "/admin/login", search: { denied: true } });
    }
    return { adminEmail: data.user?.email ?? "" };
  },
  component: AdminLayout,
});

const linkCls = "block px-3 py-2 text-sm text-secondary-foreground/75 hover:bg-secondary-foreground/10 hover:text-secondary-foreground";
const activeCls = { className: "bg-secondary-foreground/10 !text-secondary-foreground border-l-2 border-primary" };

function AdminLayout() {
  const { adminEmail } = Route.useRouteContext();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate({ to: "/admin/login", replace: true });
      if (event === "SIGNED_IN" || event === "USER_UPDATED") router.invalidate();
    });
    return () => data.subscription.unsubscribe();
  }, [navigate, router]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="px-3 py-5 font-display text-xl text-secondary-foreground">CodeStars <span className="font-mono text-xs uppercase tracking-widest text-primary">Admin</span></div>
      <Link to="/admin" activeOptions={{ exact: true }} activeProps={activeCls} className={linkCls} onClick={() => setOpen(false)}>Overview</Link>
      <p className="mt-5 px-3 pb-1 font-mono text-[10px] uppercase tracking-widest text-secondary-foreground/50">Submissions</p>
      {CATEGORIES.map((c) => (
        <Link key={c.key} to="/admin/$category" params={{ category: c.key }} activeProps={activeCls} className={linkCls} onClick={() => setOpen(false)}>{c.label}</Link>
      ))}
      <p className="mt-5 px-3 pb-1 font-mono text-[10px] uppercase tracking-widest text-secondary-foreground/50">Records</p>
      <Link to="/admin/activity" activeProps={activeCls} className={linkCls} onClick={() => setOpen(false)}>Activity log</Link>
      <div className="mt-auto border-t border-secondary-foreground/15 px-3 py-4 text-xs text-secondary-foreground/60">
        <p className="truncate">{adminEmail}</p>
        <button onClick={signOut} className="mt-2 border border-secondary-foreground/40 px-3 py-1.5 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Sign out</button>
        <Link to="/" className="ml-3 underline">View site</Link>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 bg-secondary md:sticky md:top-0 md:block md:h-screen">{nav}</aside>
      <header className="flex items-center justify-between bg-secondary px-4 py-3 text-secondary-foreground md:hidden">
        <span className="font-display text-lg">CodeStars Admin</span>
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="border border-secondary-foreground/40 px-3 py-1 text-sm">{open ? "Close" : "Menu"}</button>
      </header>
      {open && <div className="bg-secondary md:hidden">{nav}</div>}
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10"><Outlet /></main>
      <Toaster />
    </div>
  );
}
