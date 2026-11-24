import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, CTA } from "@/components/site/blocks";
import { FullLogo } from "@/components/site/Logo";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{"title": "CodeStars \u2014 Technology, creativity and innovation in Liberia"}, {"name": "description", "content": "CodeStars empowers people, businesses and communities in Liberia through technology education, creative digital services and innovation."}, {"property": "og:title", "content": "CodeStars \u2014 Technology, creativity and innovation in Liberia"}, {"property": "og:description", "content": "CodeStars empowers people, businesses and communities in Liberia through technology education, creative digital services and innovation."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<section className="border-b border-border">
  <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
    <div className="md:col-span-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Paynesville, Liberia</p>
      <h1 className="mt-5 text-5xl font-medium leading-[1.02] md:text-7xl">Technology should not be a privilege reserved for those who can afford it.</h1>
      <p className="mt-8 max-w-xl text-lg text-muted-foreground">CodeStars is a technology, creativity and innovation organization working toward a digitally empowered Liberia.</p>
      <div className="mt-10 flex flex-wrap gap-3"><CTA to="/school/programs">Explore programs</CTA><CTA to="/creative/hire" variant="outline">Work with Creative</CTA></div>
    </div>
    <div className="flex items-center justify-center bg-secondary p-6 md:col-span-4"><FullLogo className="w-full max-w-sm" /></div>
  </div>
</section>
<Section kicker="Three divisions" title="One organization, three ways to move Liberia forward.">
  <div className="grid gap-px border border-border bg-border md:grid-cols-3">
    {[["Creative","Digital services and creative technology solutions for businesses and organizations.","/creative"],["School","Practical technology education built for learners at every starting point.","/school"],["Impact","Technology promotion, partnerships and community development.","/impact"]].map(([t,b,to]) => [t!, b!, to!] as const).map(([t,b,to])=>(
      <Link key={to} to={to} className="group bg-background p-8 hover:bg-card">
        <p className="font-mono text-xs text-muted-foreground">CodeStars</p>
        <h3 className="mt-2 text-3xl font-medium group-hover:text-primary">{t}</h3>
        <p className="mt-4 text-sm text-muted-foreground">{b}</p>
        <p className="mt-8 text-sm text-primary">Learn more →</p>
      </Link>))}
  </div>
</Section>
<Section dark kicker="Mission">
  <p className="max-w-4xl font-display text-3xl leading-snug md:text-4xl">Empower individuals, businesses and communities through accessible technology education, creative digital solutions and innovation-driven opportunities.</p>
</Section>
</>
  );
}
