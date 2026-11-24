import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Grid, CTA, Notice } from "@/components/site/blocks";

export const Route = createFileRoute("/creative/")({
  head: () => ({ meta: [{"title": "CodeStars Creative \u2014 Digital services"}, {"name": "description", "content": "CodeStars Creative delivers digital services and creative technology solutions for Liberian businesses and organizations."}, {"property": "og:title", "content": "CodeStars Creative \u2014 Digital services"}, {"property": "og:description", "content": "CodeStars Creative delivers digital services and creative technology solutions for Liberian businesses and organizations."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="CodeStars Creative" title="Digital work made with care, for organizations that mean business." intro="Websites, brand identities and digital tools for businesses, NGOs and entrepreneurs in Liberia and beyond.">
  <CTA to="/creative/services">See services</CTA><CTA to="/creative/hire" variant="outline">Start a project</CTA>
</PageHero>
<Section kicker="Approach" title="From first conversation to launch">
  <Grid items={[{title:"Listen",body:"We start with your goals, audience and budget in LRD or USD."},{title:"Design & build",body:"We design, build and review with you at each stage."},{title:"Launch & support",body:"We hand over clearly and stay available for updates."}]} />
</Section>
</>
  );
}
