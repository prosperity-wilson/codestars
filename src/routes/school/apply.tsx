import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/blocks";
import { SubmitForm } from "@/components/site/blocks";

export const Route = createFileRoute("/school/apply")({
  head: () => ({ meta: [{"title": "Apply \u2014 CodeStars School"}, {"name": "description", "content": "Apply or register interest for a CodeStars School program."}, {"property": "og:title", "content": "Apply \u2014 CodeStars School"}, {"property": "og:description", "content": "Apply or register interest for a CodeStars School program."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="School / Apply" title="Apply to CodeStars School" intro="Submit your application below. We will contact you when the next cohort opens." />
<Section>
  <SubmitForm table="training_applications" submitLabel="Send application" successMessage="Your application has been received. We will contact you by email." toRow={(v)=>({full_name:v["name"]!,email:v["email"]!,phone:v["phone"]!,county:v["county"]!,program_name:v["program"]!,requests_financial_aid:v["aid"]==="Yes",motivation:v["why"]!})} fields={[{name:"name",label:"Full name",required:true},{name:"email",label:"Email",type:"email",required:true},{name:"phone",label:"Phone",type:"tel",required:true},{name:"county",label:"County / community"},{name:"program",label:"Program",type:"select",options:["Digital Literacy","Web Development Foundations","Graphic Design"],required:true},{name:"aid",label:"Requesting financial aid?",type:"select",options:["Yes","No"]},{name:"why",label:"Why do you want to join?",type:"textarea",required:true}]} />
</Section>
</>
  );
}
