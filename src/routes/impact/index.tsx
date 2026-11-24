import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Grid, CTA, Notice } from "@/components/site/blocks";

export const Route = createFileRoute("/impact/")({
  head: () => ({ meta: [{"title": "CodeStars Impact \u2014 Community and partnerships"}, {"name": "description", "content": "CodeStars Impact drives technology promotion, partnerships and community development in Liberia."}, {"property": "og:title", "content": "CodeStars Impact \u2014 Community and partnerships"}, {"property": "og:description", "content": "CodeStars Impact drives technology promotion, partnerships and community development in Liberia."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="CodeStars Impact" title="Technology that reaches the community." intro="Promotion, partnerships and community programs that widen access to technology.">
  <CTA to="/impact/partners">Partner with us</CTA><CTA to="/promotions" variant="outline">Promotions</CTA>
</PageHero>
<Section>
  <Grid items={[{title:"Promotion",body:"Spotlighting Liberian tech events, products and opportunities."},{title:"Partnerships",body:"Working with organizations that share our mission."},{title:"Community",body:"Bringing people together to learn and build."}]} />
</Section>
</>
  );
}
