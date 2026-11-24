import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Grid, CTA, Notice } from "@/components/site/blocks";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{"title": "About CodeStars \u2014 Mission and vision"}, {"name": "description", "content": "Learn about CodeStars, a Liberian technology, creativity and innovation organization, and its mission and vision."}, {"property": "og:title", "content": "About CodeStars \u2014 Mission and vision"}, {"property": "og:description", "content": "Learn about CodeStars, a Liberian technology, creativity and innovation organization, and its mission and vision."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="About" title="Built in Paynesville, for a digitally empowered Liberia." intro="CodeStars brings together creative services, practical education and community work under one organization." />
<Section kicker="Mission" title="Empower individuals, businesses and communities through accessible technology education, creative digital solutions and innovation-driven opportunities."><span /></Section>
<Section dark kicker="Vision"><p className="max-w-4xl font-display text-3xl md:text-4xl">Contribute to a digitally empowered Liberia through technology, talent, innovation and collaboration.</p></Section>
<Section kicker="How we work" title="Three divisions">
  <Grid items={[{title:"CodeStars Creative",body:"Digital services and creative technology solutions."},{title:"CodeStars School",body:"Practical technology education."},{title:"CodeStars Impact",body:"Technology promotion, partnerships and community development."}]} />
</Section>
</>
  );
}
