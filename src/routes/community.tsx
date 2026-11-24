import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Grid, CTA } from "@/components/site/blocks";
import { ORG } from "@/components/site/nav";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{"title": "Community \u2014 CodeStars"}, {"name": "description", "content": "Join the CodeStars community of learners, builders and creatives in Liberia."}, {"property": "og:title", "content": "Community \u2014 CodeStars"}, {"property": "og:description", "content": "Join the CodeStars community of learners, builders and creatives in Liberia."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="Community" title="Learn and build together." intro="The CodeStars community connects learners, developers and creatives." />
<Section>
  <Grid items={[{title:"Newsletter",body:"Updates on programs and opportunities.",tag:"Planned"},{title:"Meetups",body:"In-person sessions for the community.",tag:"Planned"},{title:"Open source",body:"Follow our code on GitHub.",tag:"Available"}]} />
  <div className="mt-10 flex flex-wrap gap-3"><a href={ORG.github} target="_blank" rel="noreferrer" className="bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">GitHub</a><CTA to="/contact" variant="outline">Get updates by email</CTA></div>
</Section>
</>
  );
}
