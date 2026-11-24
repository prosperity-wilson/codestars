import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, Grid, CTA, Notice } from "@/components/site/blocks";

export const Route = createFileRoute("/creative/portfolio")({
  head: () => ({ meta: [{"title": "Portfolio \u2014 CodeStars Creative"}, {"name": "description", "content": "Selected work from CodeStars Creative."}, {"property": "og:title", "content": "Portfolio \u2014 CodeStars Creative"}, {"property": "og:description", "content": "Selected work from CodeStars Creative."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="Creative / Portfolio" title="Portfolio" />
<Section>
  <Notice>Our portfolio is being prepared. Case studies will be published here only with client permission. To see examples of past work, <Link to="/contact" className="text-primary underline">contact us</Link>.</Notice>
</Section>
</>
  );
}
