import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { parseAwardAmount, PRIVATE_DOCUMENT_TTL_SECONDS, requireAdmin, requireApplicationDocument } from "@/lib/phase1-rules";
import { z } from "zod";

export const saveAidReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.uuid(), status: z.enum(["submitted", "under_review", "approved", "partially_approved", "declined"]), notes: z.string().max(5000), award: z.string().max(30) }))
  .handler(async ({ data, context }) => {
    const { data: admin, error: roleError } = await context.supabase.rpc("is_admin");
    requireAdmin(!roleError && admin === true);
    const { data: row, error } = await context.supabase.from("financial_aid_applications")
      .update({ status: data.status, admin_notes: data.notes.trim() || null, amount_awarded_lrd: parseAwardAmount(data.award) })
      .eq("id", data.id).select("*").single();
    if (error) throw new Error(error.message);
    return row;
  });

export const setPromotionPublication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ submissionId: z.uuid(), publish: z.boolean() }))
  .handler(async ({ data, context }) => {
    const { data: admin, error: roleError } = await context.supabase.rpc("is_admin");
    requireAdmin(!roleError && admin === true);
    const { data: id, error } = await context.supabase.rpc("set_promotion_publication", { p_submission_id: data.submissionId, p_publish: data.publish });
    if (error) throw new Error(error.message);
    return { id };
  });

export const getAidDocumentLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ applicationId: z.uuid(), path: z.string().min(1).max(1024), download: z.boolean() }))
  .handler(async ({ data, context }) => {
    const { data: admin, error: roleError } = await context.supabase.rpc("is_admin");
    requireAdmin(!roleError && admin === true);
    const { data: application, error } = await context.supabase.from("financial_aid_applications")
      .select("document_paths").eq("id", data.applicationId).single();
    if (error) throw new Error("Application not found.");
    requireApplicationDocument(application.document_paths, data.path);
    const { data: link, error: linkError } = await context.supabase.storage.from("private-documents")
      .createSignedUrl(data.path, PRIVATE_DOCUMENT_TTL_SECONDS, data.download ? { download: true } : {});
    if (linkError || !link) throw new Error("Couldn't access this document. Please try again.");
    const { error: auditError } = await context.supabase.from("admin_activity").insert({
      action: data.download ? "document_download_requested" : "document_view_requested",
      table_name: "financial_aid_applications", record_id: data.applicationId,
      details: { path: data.path, expires_in_seconds: PRIVATE_DOCUMENT_TTL_SECONDS },
    });
    if (auditError) throw new Error("Document access could not be recorded. Please try again.");
    return { url: link.signedUrl };
  });