import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Notice, EmailForm } from "@/components/site/blocks";

export const Route = createFileRoute("/impact/partners")({
  head: () => ({ meta: [{"title": "Partners \u2014 CodeStars Impact"}, {"name": "description", "content": "Partner with CodeStars to expand access to technology in Liberia."}, {"property": "og:title", "content": "Partners \u2014 CodeStars Impact"}, {"property": "og:description", "content": "Partner with CodeStars to expand access to technology in Liberia."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="Impact / Partners" title="Partner with CodeStars" intro="We welcome schools, businesses, NGOs and institutions who share our mission." />
<Section>
  <Notice>We do not list partners until a partnership is formally agreed. Current partners will be announced here.</Notice>
  <div className="mt-10"><EmailForm subject="Partnership enquiry — CodeStars" submitLabel="Send enquiry" fields={[{name:"name",label:"Your name",required:true},{name:"email",label:"Email",type:"email",required:true},{name:"org",label:"Organization",required:true},{name:"idea",label:"How would you like to work together?",type:"textarea",required:true}]} /></div>
</Section>
</>
  );
}
