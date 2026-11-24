import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, Notice } from "@/components/site/blocks";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{"title": "Sign in \u2014 CodeStars"}, {"name": "description", "content": "Sign in to your CodeStars account."}, {"property": "og:title", "content": "Sign in \u2014 CodeStars"}, {"property": "og:description", "content": "Sign in to your CodeStars account."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Page,
});

function Page() {
  return (
<>
<PageHero eyebrow="Account" title="Sign in" />
<Section>
  <Notice>Accounts for learners and clients are planned for a later release and are not available yet. For now, please <Link to="/contact" className="text-primary underline">contact us</Link> by email.</Notice>
</Section>
</>
  );
}
