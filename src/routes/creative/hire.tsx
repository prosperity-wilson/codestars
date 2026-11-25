import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/blocks";
import { SubmitForm } from "@/components/site/blocks";

export const Route = createFileRoute("/creative/hire")({
  head: () => ({ meta: [{"title": "Hire CodeStars Creative \u2014 Start a project"}, {"name": "description", "content": "Tell CodeStars Creative about your project and request a quote."}, {"property": "og:title", "content": "Hire CodeStars Creative \u2014 Start a project"}, {"property": "og:description", "content": "Tell CodeStars Creative about your project and request a quote."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="Creative / Hire us" title="Start a project" intro="Tell us what you need. We will reply by email." />
<Section>
  <SubmitForm table="creative_inquiries" submitLabel="Send enquiry" toRow={(v)=>({name:v["name"]!,email:v["email"]!,phone:v["phone"]!,organization:v["org"]!,service:v["service"]!,budget:v["budget"]!,details:v["details"]!})} fields={[{name:"name",label:"Full name",required:true},{name:"email",label:"Email",type:"email",required:true},{name:"phone",label:"Phone (optional)",type:"tel"},{name:"org",label:"Business or organization"},{name:"service",label:"Service",type:"select",options:["Website","Brand identity","Graphic design","Web application","Digital setup","Other"],required:true},{name:"budget",label:"Estimated budget",type:"select",options:["Under LRD 50,000","LRD 50,000 – 150,000","LRD 150,000 – 400,000","Above LRD 400,000","Not sure yet"]},{name:"details",label:"Project details",type:"textarea",required:true}]} />
</Section>
</>
  );
}
