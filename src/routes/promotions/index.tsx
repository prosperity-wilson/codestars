import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Grid, CTA, Notice } from "@/components/site/blocks";

export const Route = createFileRoute("/promotions/")({
  head: () => ({ meta: [{"title": "Promotions \u2014 CodeStars Impact"}, {"name": "description", "content": "CodeStars Impact promotes Liberian technology events, products and opportunities."}, {"property": "og:title", "content": "Promotions \u2014 CodeStars Impact"}, {"property": "og:description", "content": "CodeStars Impact promotes Liberian technology events, products and opportunities."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="Impact / Promotions" title="Tech promotions" intro="A place to spotlight Liberian technology events, products and opportunities.">
  <CTA to="/promotions/submit">Submit a promotion</CTA>
</PageHero>
<Section><Notice>No promotions are published yet. Approved submissions will appear here.</Notice></Section>
</>
  );
}
