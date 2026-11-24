import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Grid, CTA, Notice } from "@/components/site/blocks";

export const Route = createFileRoute("/school/programs")({
  head: () => ({ meta: [{"title": "Programs \u2014 CodeStars School"}, {"name": "description", "content": "Technology programs offered by CodeStars School, from digital literacy to web development."}, {"property": "og:title", "content": "Programs \u2014 CodeStars School"}, {"property": "og:description", "content": "Technology programs offered by CodeStars School, from digital literacy to web development."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="School / Programs" title="Programs" intro="Dates and fees are confirmed when each cohort opens. Status shows what is currently accepting applications." />
<Section>
  <Grid items={[{title:"Digital Literacy",body:"Computers, internet, email and everyday office tools.",tag:"Planned"},{title:"Web Development Foundations",body:"HTML, CSS, JavaScript and publishing your first site.",tag:"Planned"},{title:"Graphic Design",body:"Design principles and tools for print and social media.",tag:"Planned"}]} />
  <div className="mt-10 flex flex-wrap gap-3"><CTA to="/school/apply">Register interest</CTA><CTA to="/school/financial-aid" variant="outline">Financial aid</CTA></div>
</Section>
</>
  );
}
