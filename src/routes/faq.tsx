import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/blocks";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{"title": "FAQ \u2014 CodeStars"}, {"name": "description", "content": "Answers to common questions about CodeStars, its programs and services."}, {"property": "og:title", "content": "FAQ \u2014 CodeStars"}, {"property": "og:description", "content": "Answers to common questions about CodeStars, its programs and services."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="FAQ" title="Frequently asked questions" />
<Section>
  <div className="max-w-3xl divide-y divide-border border-y border-border">
    {[["Where is CodeStars based?","Paynesville, Liberia."],["Where are classes held?","Venue details are shared privately with accepted learners."],["How much do programs cost?","Fees are confirmed when each cohort opens, in LRD. Financial aid is available."],["Can I apply online?","Yes. Use the Apply page to submit your application online. You can also request financial aid on the Financial aid page."],["How do I hire CodeStars Creative?","Use the Hire us page to send a project enquiry with your project details."],["How do I contact you?","Use the Contact page form, or email codestars.work@gmail.com."]].map(([q,a])=>(
      <details key={q} className="group py-5"><summary className="cursor-pointer list-none font-display text-xl">{q}</summary><p className="mt-3 text-muted-foreground">{a}</p></details>))}
  </div>
</Section>
</>
  );
}
