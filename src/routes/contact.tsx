import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, EmailForm } from "@/components/site/blocks";
import { ORG } from "@/components/site/nav";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{"title": "Contact \u2014 CodeStars"}, {"name": "description", "content": "Get in touch with CodeStars in Paynesville, Liberia."}, {"property": "og:title", "content": "Contact \u2014 CodeStars"}, {"property": "og:description", "content": "Get in touch with CodeStars in Paynesville, Liberia."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="Contact" title="Get in touch" intro={`Email us at ${ORG.email}, or use the form below.`} />
<Section>
  <EmailForm subject="Message — CodeStars website" submitLabel="Send message" fields={[{name:"name",label:"Name",required:true},{name:"email",label:"Email",type:"email",required:true},{name:"topic",label:"Topic",type:"select",options:["General","Creative","School","Impact","Partnerships"]},{name:"message",label:"Message",type:"textarea",required:true}]} />
</Section>
</>
  );
}
