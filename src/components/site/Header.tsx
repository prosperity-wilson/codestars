import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { NAV } from "./nav";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <div key={item.to} className="group relative">
              <Link to={item.to} className="px-3 py-2 text-sm text-foreground/80 hover:text-primary" activeProps={{ className: "text-primary" }} activeOptions={{ exact: !("children" in item) }}>
                {item.label}
              </Link>
              {"children" in item && (
                <div className="invisible absolute left-0 top-full min-w-48 border border-border bg-card py-2 opacity-0 shadow-sm transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link key={c.to} to={c.to} className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary">{c.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link to="/login" className="ml-3 border border-foreground px-4 py-1.5 text-sm hover:bg-foreground hover:text-background">Sign in</Link>
        </nav>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 pb-6 lg:hidden" aria-label="Mobile">
          {NAV.map((item) => (
            <div key={item.to} className="border-b border-border py-3">
              <Link to={item.to} onClick={() => setOpen(false)} className="font-display text-lg">{item.label}</Link>
              {"children" in item && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {item.children.slice(1).map((c) => (
                    <Link key={c.to} to={c.to} onClick={() => setOpen(false)} className="text-sm text-muted-foreground">{c.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="mt-4 block text-sm text-primary">Sign in →</Link>
        </nav>
      )}
    </header>
  );
}
