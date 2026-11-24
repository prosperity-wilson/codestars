import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Grid, CTA, Notice } from "@/components/site/blocks";

export const Route = createFileRoute("/creative/services")({
  head: () => ({ meta: [{"title": "Services \u2014 CodeStars Creative"}, {"name": "description", "content": "Websites, branding, graphic design and digital tools from CodeStars Creative."}, {"property": "og:title", "content": "Services \u2014 CodeStars Creative"}, {"property": "og:description", "content": "Websites, branding, graphic design and digital tools from CodeStars Creative."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="Creative / Services" title="Services" intro="Pricing depends on scope. Ask for a quote and we will reply with an estimate in LRD or USD." />
<Section>
  <Grid items={[{title:"Websites",body:"Business sites, landing pages and organization websites that work well on mobile."},{title:"Brand identity",body:"Logos, color systems and brand guidelines."},{title:"Graphic design",body:"Flyers, social media graphics and event materials."},{title:"Web applications",body:"Custom tools such as booking, records and dashboards."},{title:"Digital setup",body:"Business email, social profiles and online presence setup."},{title:"Content & media",body:"Photography direction, copy and campaign content."}]} />
  <div className="mt-10"><CTA to="/creative/hire">Request a quote</CTA></div>
</Section>
</>
  );
}
