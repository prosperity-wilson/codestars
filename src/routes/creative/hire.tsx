import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/blocks";
import { SubmissionForm } from "@/components/site/SubmissionForm";

export const Route = createFileRoute("/creative/hire")({
  head: () => ({ meta: [{"title": "Hire CodeStars Creative \u2014 Start a project"}, {"name": "description", "content": "Tell CodeStars Creative about your project and request a quote."}, {"property": "og:title", "content": "Hire CodeStars Creative \u2014 Start a project"}, {"property": "og:description", "content": "Tell CodeStars Creative about your project and request a quote."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="Creative / Hire us" title="Start a project" intro="Tell us what you need. We will reply by email." />
<Section>
  <SubmissionForm
    table="creative_inquiries"
    submitLabel="Send enquiry"
    successMessage="Your project enquiry has been received. We will reply by email."
    fieldMap={{ org: "organization", details: "details" }}
    fields={[
      { name: "name", label: "Full name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone (optional)", type: "tel" },
      { name: "org", label: "Business or organization" },
      { name: "service", label: "Service", type: "select", required: true,
        options: ["Website","Brand identity","Graphic design","Web application","Digital setup","Other"],
        optionValues: { "Website": "website", "Brand identity": "brand_identity", "Graphic design": "graphic_design", "Web application": "web_application", "Digital setup": "digital_setup", "Other": "other" } },
      { name: "budget", label: "Estimated budget", type: "select",
        options: ["Under LRD 50,000","LRD 50,000 – 150,000","LRD 150,000 – 400,000","Above LRD 400,000","Not sure yet"],
        optionValues: { "Under LRD 50,000": "under_50000", "LRD 50,000 – 150,000": "50000_150000", "LRD 150,000 – 400,000": "150000_400000", "Above LRD 400,000": "above_400000", "Not sure yet": "not_sure" } },
      { name: "details", label: "Project details", type: "textarea", required: true },
    ]}
  />
</Section>
</>
  );
}
