import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Grid, CTA } from "@/components/site/blocks";
import { SubmitForm } from "@/components/site/blocks";

export const Route = createFileRoute("/school/financial-aid")({
  head: () => ({ meta: [{"title": "Financial aid \u2014 CodeStars School"}, {"name": "description", "content": "How financial aid works at CodeStars School."}, {"property": "og:title", "content": "Financial aid \u2014 CodeStars School"}, {"property": "og:description", "content": "How financial aid works at CodeStars School."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="School / Financial aid" title="Cost should not decide who learns." intro="Learners who cannot afford full fees can request support when applying." />
<Section>
  <Grid items={[{title:"Request it",body:"Complete the financial-aid form below or select “Yes” for financial aid on your school application."},{title:"Tell us your situation",body:"Share your circumstances so we can understand your need."},{title:"Get a decision",body:"Aid amounts depend on available funding for each cohort."}]} />
  <div className="mt-10"><CTA to="/school/apply">Apply with aid</CTA></div>
</Section>
<Section kicker="Financial aid form" title="Request financial aid">
  <p className="mb-6 max-w-2xl text-sm text-muted-foreground">Your financial-aid application is private. Only authorized CodeStars administrators can review it.</p>
  <SubmitForm table="financial_aid_applications" submitLabel="Submit aid request" successMessage="Your financial-aid request has been received privately. Only authorized CodeStars administrators can review it." toRow={(v)=>({full_name:v["name"]!,email:v["email"]!,household_situation:`Program: ${v["program"]}

${v["circumstances"]}`,essay:v["motivation"]!})} fields={[{name:"name",label:"Full name",required:true},{name:"email",label:"Email",type:"email",required:true},{name:"program",label:"Program",type:"select",options:["Digital Literacy","Web Development Foundations","Graphic Design"],required:true},{name:"circumstances",label:"Your circumstances",type:"textarea",required:true},{name:"motivation",label:"Why do you want to join this program?",type:"textarea",required:true}]} />
</Section>
</>
  );
}
