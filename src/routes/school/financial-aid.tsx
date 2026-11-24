import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Grid, CTA, Notice } from "@/components/site/blocks";

export const Route = createFileRoute("/school/financial-aid")({
  head: () => ({ meta: [{"title": "Financial aid \u2014 CodeStars School"}, {"name": "description", "content": "How financial aid works at CodeStars School."}, {"property": "og:title", "content": "Financial aid \u2014 CodeStars School"}, {"property": "og:description", "content": "How financial aid works at CodeStars School."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="School / Financial aid" title="Cost should not decide who learns." intro="Learners who cannot afford full fees can request support when applying." />
<Section>
  <Grid items={[{title:"Request it",body:"Select “Yes” for financial aid on your application."},{title:"Tell us your situation",body:"We may ask a few questions to understand your need."},{title:"Get a decision",body:"Aid amounts depend on available funding for each cohort."}]} />
  <div className="mt-10"><CTA to="/school/apply">Apply with aid</CTA></div>
</Section>
</>
  );
}
