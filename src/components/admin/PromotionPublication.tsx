import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { EyeOff, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { setPromotionPublication } from "@/lib/admin/workflows.functions";

export function PromotionPublication({ submissionId, status, dirty, onStatus }: { submissionId: string; status: string; dirty: boolean; onStatus: (status: string) => void }) {
  const qc = useQueryClient();
  const publish = useServerFn(setPromotionPublication);
  const q = useQuery({ queryKey: ["admin", "publication", submissionId], queryFn: async () => {
    const { data, error } = await supabase.from("promotions").select("id,is_published").eq("submission_id", submissionId).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  } });
  const m = useMutation({ mutationFn: (value: boolean) => publish({ data: { submissionId, publish: value } }),
    onSuccess: async (_, value) => {
      onStatus(value ? "published" : "approved");
      await Promise.all([qc.invalidateQueries({ queryKey: ["admin"] }), qc.invalidateQueries({ queryKey: ["published_promotions"] })]);
      toast.success(value ? "Promotion published" : "Promotion unpublished");
    }, onError: (err: Error) => toast.error(err.message),
  });
  const published = q.data?.is_published === true;
  return <section className="mt-6 border-t border-border px-4 pt-5">
    <h3 className="text-sm font-medium">Public promotion</h3>
    <p className="mt-1 text-sm text-muted-foreground">{q.isPending ? "Checking publication…" : published ? "Published" : "Not published"}</p>
    {(q.isError || m.isError) && <p role="alert" className="mt-2 text-sm text-primary">{q.error?.message ?? m.error?.message}</p>}
    <Button type="button" variant={published ? "outline" : "default"} className="mt-3" disabled={dirty || q.isPending || q.isError || m.isPending || (!published && status !== "approved" && status !== "published")} onClick={() => m.mutate(!published)}>
      {published ? <EyeOff /> : <Send />}{m.isPending ? "Saving…" : published ? "Unpublish" : "Publish"}
    </Button>
  </section>;
}