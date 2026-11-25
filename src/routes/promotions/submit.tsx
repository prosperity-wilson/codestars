import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/blocks";
import { SubmitForm } from "@/components/site/blocks";

export const Route = createFileRoute("/promotions/submit")({
  head: () => ({ meta: [{"title": "Submit a promotion \u2014 CodeStars Impact"}, {"name": "description", "content": "Submit a technology event, product or opportunity for CodeStars to review and promote."}, {"property": "og:title", "content": "Submit a promotion \u2014 CodeStars Impact"}, {"property": "og:description", "content": "Submit a technology event, product or opportunity for CodeStars to review and promote."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="Promotions / Submit" title="Submit a promotion" intro="Submissions are reviewed before anything is published." />
<Section>
  <SubmitForm table="promotion_submissions" submitLabel="Send submission" successMessage="Thank you — your submission will be reviewed before anything is published." toRow={(v)=>({name:v["name"]!,email:v["email"]!,promo_type:v["type"]!,title:v["title"]!,link:v["link"]!,details:v["details"]!})} fields={[{name:"name",label:"Your name",required:true},{name:"email",label:"Email",type:"email",required:true},{name:"type",label:"Type",type:"select",options:["Event","Product or service","Job or internship","Training or scholarship"],required:true},{name:"title",label:"Title",required:true},{name:"link",label:"Link (optional)"},{name:"details",label:"Details",type:"textarea",required:true}]} />
</Section>
</>
  );
}
