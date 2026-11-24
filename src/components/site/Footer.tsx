import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { ORG } from "./nav";

const cols = [
  { title: "Creative", links: [["Services", "/creative/services"], ["Portfolio", "/creative/portfolio"], ["Hire us", "/creative/hire"]] },
  { title: "School", links: [["Programs", "/school/programs"], ["Apply", "/school/apply"], ["Financial aid", "/school/financial-aid"]] },
  { title: "Impact", links: [["Partners", "/impact/partners"], ["Promotions", "/promotions"], ["Community", "/community"]] },
  { title: "Organization", links: [["About", "/about"], ["FAQ", "/faq"], ["Contact", "/contact"]] },
] as const;

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-6">
        <div className="md:col-span-2">
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm opacity-70">Technology should not be a privilege reserved for those who can afford it.</p>
          <p className="mt-6 text-sm opacity-70">{ORG.location}</p>
          <a href={`mailto:${ORG.email}`} className="text-sm underline-offset-4 hover:underline">{ORG.email}</a>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="font-mono text-xs uppercase tracking-widest opacity-60">{c.title}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {c.links.map(([l, to]) => <li key={to}><Link to={to} className="hover:text-primary">{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-secondary-foreground/15">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-5 text-xs opacity-60">
          <span>© {new Date().getFullYear()} CodeStars. Paynesville, Liberia.</span>
          <a href={ORG.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
