import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Grid, CTA, Notice } from "@/components/site/blocks";

export const Route = createFileRoute("/school/")({
  head: () => ({ meta: [{"title": "CodeStars School \u2014 Practical technology education"}, {"name": "description", "content": "CodeStars School offers practical technology education for learners in Liberia."}, {"property": "og:title", "content": "CodeStars School \u2014 Practical technology education"}, {"property": "og:description", "content": "CodeStars School offers practical technology education for learners in Liberia."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="CodeStars School" title="Practical skills. Real projects. A path into technology." intro="Hands-on training for students, job seekers and working professionals.">
  <CTA to="/school/programs">View programs</CTA><CTA to="/school/apply" variant="outline">Apply</CTA>
</PageHero>
<Section kicker="Learning" title="How the School works">
  <Grid items={[{title:"Hands-on first",body:"Every program is built around building real things."},{title:"Small cohorts",body:"Learners get direct attention from instructors."},{title:"Access matters",body:"Financial aid is available so cost is not the barrier."}]} />
</Section>
<Section><Notice>Training venue details are shared privately with accepted learners only.</Notice></Section>
</>
  );
}
