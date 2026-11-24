import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/blocks";
import { SubmissionForm } from "@/components/site/SubmissionForm";

export const Route = createFileRoute("/promotions/submit")({
  head: () => ({ meta: [{"title": "Submit a promotion \u2014 CodeStars Impact"}, {"name": "description", "content": "Submit a technology event, product or opportunity for CodeStars to review and promote."}, {"property": "og:title", "content": "Submit a promotion \u2014 CodeStars Impact"}, {"property": "og:description", "content": "Submit a technology event, product or opportunity for CodeStars to review and promote."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="Promotions / Submit" title="Submit a promotion" intro="Submissions are reviewed before anything is published." />
<Section>
  <SubmissionForm
    table="promotion_submissions"
    submitLabel="Send submission"
    successMessage="Your promotion has been submitted. It will be reviewed before publishing."
    fieldMap={{ name: "submitter_name", email: "submitter_email", type: "category" }}
    fields={[
      { name: "name", label: "Your name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "type", label: "Type", type: "select", required: true,
        options: ["Event","Product or service","Job or internship","Training or scholarship"],
        optionValues: { "Event": "event", "Product or service": "product_service", "Job or internship": "job_internship", "Training or scholarship": "training_scholarship" } },
      { name: "title", label: "Title", required: true },
      { name: "link", label: "Link (optional)" },
      { name: "details", label: "Details", type: "textarea", required: true },
    ]}
  />
</Section>
</>
  );
}
