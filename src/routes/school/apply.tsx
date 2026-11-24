import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/blocks";
import { SubmissionForm } from "@/components/site/SubmissionForm";

export const Route = createFileRoute("/school/apply")({
  head: () => ({ meta: [{"title": "Apply \u2014 CodeStars School"}, {"name": "description", "content": "Apply or register interest for a CodeStars School program."}, {"property": "og:title", "content": "Apply \u2014 CodeStars School"}, {"property": "og:description", "content": "Apply or register interest for a CodeStars School program."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="School / Apply" title="Apply to CodeStars School" intro="Submit your application below. We will contact you when the next cohort opens." />
<Section>
  <SubmissionForm
    table="school_applications"
    submitLabel="Submit application"
    successMessage="Your application has been received. We will contact you when the next cohort opens."
    fieldMap={{ why: "motivation", aid: "requesting_aid" }}
    fields={[
      { name: "name", label: "Full name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "county", label: "County / community" },
      { name: "program", label: "Program", type: "select", required: true,
        options: ["Digital Literacy","Web Development Foundations","Graphic Design"] },
      { name: "aid", label: "Requesting financial aid?", type: "select",
        options: ["Yes","No"],
        optionValues: { "Yes": "true", "No": "false" },
        booleanField: true },
      { name: "why", label: "Why do you want to join?", type: "textarea", required: true },
    ]}
  />
</Section>
</>
  );
}
