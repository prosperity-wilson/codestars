import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, CTA, Notice } from "@/components/site/blocks";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/promotions/")({
  head: () => ({ meta: [{"title": "Promotions \u2014 CodeStars Impact"}, {"name": "description", "content": "CodeStars Impact promotes Liberian technology events, products and opportunities."}, {"property": "og:title", "content": "Promotions \u2014 CodeStars Impact"}, {"property": "og:description", "content": "CodeStars Impact promotes Liberian technology events, products and opportunities."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  const { data: promotions, isLoading } = useQuery({
    queryKey: ["published_promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("id, promo_type, title, link, body, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
<>
<PageHero eyebrow="Impact / Promotions" title="Tech promotions" intro="A place to spotlight Liberian technology events, products and opportunities.">
  <CTA to="/promotions/submit">Submit a promotion</CTA>
</PageHero>
<Section>
  {isLoading ? (
    <p className="text-sm text-muted-foreground">Loading promotions…</p>
  ) : promotions && promotions.length > 0 ? (
    <div className="grid gap-px border border-border bg-border md:grid-cols-2">
      {promotions.map((p) => (
        <div key={p.id} className="bg-background p-7">
          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>{p.promo_type}</span>
            {p.published_at && (
              <span>{new Date(p.published_at).toLocaleDateString()}</span>
            )}
          </div>
          <h3 className="mt-4 text-xl font-medium">{p.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              View link →
            </a>
          )}
        </div>
      ))}
    </div>
  ) : (
    <Notice>No promotions are published yet. Approved submissions will appear here.</Notice>
  )}
</Section>
</>
  );
}
