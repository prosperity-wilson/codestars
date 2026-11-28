import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, ExternalLink, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAidDocumentLink } from "@/lib/admin/workflows.functions";

export function AidDocuments({ applicationId, paths }: { applicationId: string; paths: unknown }) {
  const getLink = useServerFn(getAidDocumentLink);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const documents = Array.isArray(paths) ? paths.filter((path): path is string => typeof path === "string") : [];

  async function access(path: string, download: boolean) {
    // Open synchronously so viewing isn't blocked after the signed-link request.
    const tab = download ? null : window.open("", "_blank");
    if (tab) tab.opener = null;
    setBusy(path); setError("");
    try {
      const { url } = await getLink({ data: { applicationId, path, download } });
      if (download) window.location.assign(url);
      else if (tab) tab.location.href = url;
      else throw new Error("Allow pop-ups to view this document, or choose Download.");
    } catch (err) {
      tab?.close();
      setError(err instanceof Error ? err.message : "Couldn't access this document.");
    } finally { setBusy(null); }
  }

  return <section className="mt-6 px-4" aria-label="Applicant documents">
    <h3 className="font-mono text-xs uppercase text-muted-foreground">Applicant documents</h3>
    {documents.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No documents attached.</p> :
      <ul className="mt-3 divide-y divide-border">
        {documents.map((path, index) => <li key={path} className="flex items-center gap-2 py-3">
          <span className="min-w-0 flex-1 break-all text-sm">{path.split("/").pop() || `Document ${index + 1}`}</span>
          {busy === path && <LoaderCircle className="size-4 shrink-0 animate-spin" aria-label="Preparing document" />}
          <Button type="button" variant="outline" size="icon" title="View document" aria-label={`View document ${index + 1}`} disabled={busy !== null} onClick={() => void access(path, false)}><ExternalLink /></Button>
          <Button type="button" variant="outline" size="icon" title="Download document" aria-label={`Download document ${index + 1}`} disabled={busy !== null} onClick={() => void access(path, true)}><Download /></Button>
        </li>)}
      </ul>}
    {error && <p role="alert" className="mt-2 text-sm text-primary">{error}</p>}
  </section>;
}