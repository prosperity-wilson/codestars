import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

// All rows and identities in this file exist only inside an isolated memory database.
const migration = (name: string) => readFileSync(new URL(`../../supabase/migrations/${name}`, import.meta.url), "utf8");
const db = new PGlite();
const adminId = randomUUID();
const userId = randomUUID();
let submissionId: string;
let aidId: string;

async function asRole(role: "anon" | "authenticated" | "postgres", id = "") {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub','${id}',false); set role ${role};`);
}
async function rows(sql: string) { return (await db.query<Record<string, unknown>>(sql)).rows; }

beforeAll(async () => {
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth; create schema storage;
    grant usage on schema public,auth,storage to anon,authenticated,service_role;
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}');
    create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text unique);
    grant select,insert,delete on storage.objects to anon,authenticated;
    alter table storage.objects enable row level security;
    create function storage.foldername(text) returns text[] language sql immutable as $$ select string_to_array($1,'/') $$;`);
  await db.exec(migration("20261125001720_c5faaf72-8ce6-4914-bd4b-2173cf56f8ee.sql"));
  await db.exec(migration("20261125003938_e323105a-d38d-401a-90a5-4df895b79d01.sql"));
  await db.exec(migration("20261128043151_038c2fa5-d623-40f7-8966-a0508dc276d9.sql"));
  await db.exec(`insert into auth.users(id) values('${adminId}'),('${userId}'); insert into public.user_roles(user_id,role) values('${adminId}','admin');`);
}, 30000);

beforeEach(async () => {
  submissionId = randomUUID(); aidId = randomUUID();
  await asRole("postgres");
  await db.exec(`insert into public.promotion_submissions(id,name,email,promo_type,title,details) values('${submissionId}','Isolated test','test@example.test','Event','Local test event','Local test details');
    insert into public.financial_aid_applications(id,full_name,email,essay,document_paths) values('${aidId}','Isolated test','test@example.test','Local test essay',array['incoming/${aidId}/proof.pdf']);`);
  await asRole("authenticated", adminId);
});
afterAll(async () => { await db.close(); });

describe("isolated database: promotion publication", () => {
  const publish = () => db.query("select public.set_promotion_publication($1,true)", [submissionId]);
  const unpublish = () => db.query("select public.set_promotion_publication($1,false)", [submissionId]);
  const approve = () => db.exec(`update public.promotion_submissions set status='approved' where id='${submissionId}'`);
  it("requires approval before publishing", async () => {
    await expect(publish()).rejects.toThrow("Approve");
  });
  it("publishes an approved submission with only published promotions visible publicly", async () => {
    await approve(); await publish(); await asRole("anon");
    expect(await rows(`select title,body from public.promotions where submission_id='${submissionId}'`)).toEqual([{ title: "Local test event", body: "Local test details" }]);
  });
  it("unpublishes without destroying the promotion or original submission", async () => {
    await approve(); await publish(); await unpublish(); await asRole("anon");
    expect(await rows(`select id from public.promotions where submission_id='${submissionId}'`)).toHaveLength(0);
    await asRole("authenticated", adminId);
    expect(await rows(`select is_published from public.promotions where submission_id='${submissionId}'`)).toEqual([{ is_published: false }]);
    expect(await rows(`select status from public.promotion_submissions where id='${submissionId}'`)).toEqual([{ status: "approved" }]);
  });
  it("repeated publishing and republishing preserve one corresponding publication", async () => {
    await approve(); await publish();
    const before = await rows(`select id,published_at from public.promotions where submission_id='${submissionId}'`);
    await publish(); await publish();
    expect(await rows(`select id,published_at from public.promotions where submission_id='${submissionId}'`)).toEqual(before);
    await unpublish(); await publish();
    expect(await rows(`select id from public.promotions where submission_id='${submissionId}'`)).toEqual([{ id: before[0]?.['id'] }]);
  });
  it("records approval, publishing and unpublishing in the existing audit log", async () => {
    await approve(); await publish(); await unpublish();
    const actions = await rows(`select action from public.admin_activity where record_id='${submissionId}' or details->>'submission_id'='${submissionId}'`);
    expect(actions.map((r) => r['action'])).toEqual(expect.arrayContaining(["status_changed", "promotion_published", "promotion_unpublished"]));
  });
  it("does not add duplicate publication audit entries for repeated publishing", async () => {
    await approve(); await publish(); await publish();
    expect(await rows(`select action from public.admin_activity where action='promotion_published' and details->>'submission_id'='${submissionId}'`)).toHaveLength(1);
  });
  it("rejects publishing by signed-in non-admin users", async () => {
    await asRole("authenticated", userId); await expect(publish()).rejects.toThrow("authorization");
    expect(await rows(`select id from public.promotion_submissions where id='${submissionId}'`)).toHaveLength(0);
  });
  it("rejects anonymous publication calls", async () => {
    await asRole("anon"); await expect(publish()).rejects.toThrow("permission denied");
  });
  it("rejects bypassing publication through a status-only change", async () => {
    await expect(db.exec(`update public.promotion_submissions set status='published' where id='${submissionId}'`)).rejects.toThrow("publication action");
  });
  it("automatically unpublishes if a published submission is rejected", async () => {
    await approve(); await publish(); await db.exec(`update public.promotion_submissions set status='rejected' where id='${submissionId}'`);
    await asRole("anon"); expect(await rows(`select id from public.promotions where submission_id='${submissionId}'`)).toHaveLength(0);
  });
});

describe("isolated database: aid awards, private documents and audit integrity", () => {
  it("saves award amounts and logs before/after values while preserving document paths", async () => {
    await db.exec(`update public.financial_aid_applications set amount_awarded_lrd=1250.50 where id='${aidId}'`);
    expect(await rows(`select amount_awarded_lrd,document_paths from public.financial_aid_applications where id='${aidId}'`)).toEqual([{ amount_awarded_lrd: "1250.50", document_paths: [`incoming/${aidId}/proof.pdf`] }]);
    expect(await rows(`select details from public.admin_activity where record_id='${aidId}' and action='award_updated'`)).toEqual([{ details: { from: null, to: 1250.5 } }]);
  });
  it("rejects negative awards", async () => {
    await expect(db.exec(`update public.financial_aid_applications set amount_awarded_lrd=-1 where id='${aidId}'`)).rejects.toThrow("non-negative");
  });
  it("permits public document uploads only into the existing incoming folder", async () => {
    await asRole("anon");
    await db.exec(`insert into storage.objects(bucket_id,name) values('private-documents','incoming/${aidId}/proof.pdf')`);
    await expect(db.exec(`insert into storage.objects(bucket_id,name) values('private-documents','elsewhere/${aidId}/proof.pdf')`)).rejects.toThrow("row-level security");
  });
  it("only administrators can read stored private documents", async () => {
    await asRole("anon"); await db.exec(`insert into storage.objects(bucket_id,name) values('private-documents','incoming/${aidId}/proof.pdf')`);
    expect(await rows(`select id from storage.objects where name='incoming/${aidId}/proof.pdf'`)).toHaveLength(0);
    await asRole("authenticated", userId); expect(await rows(`select id from storage.objects where name='incoming/${aidId}/proof.pdf'`)).toHaveLength(0);
    await asRole("authenticated", adminId); expect(await rows(`select id from storage.objects where name='incoming/${aidId}/proof.pdf'`)).toHaveLength(1);
  });
  it("hides financial aid records from non-admin users and rejects their award updates", async () => {
    await asRole("authenticated", userId);
    expect(await rows(`select id from public.financial_aid_applications where id='${aidId}'`)).toHaveLength(0);
    await db.exec(`update public.financial_aid_applications set amount_awarded_lrd=100 where id='${aidId}'`);
    await asRole("authenticated", adminId);
    expect(await rows(`select amount_awarded_lrd from public.financial_aid_applications where id='${aidId}'`)).toEqual([{ amount_awarded_lrd: null }]);
  });
  it("rejects public applicants trying to award themselves aid", async () => {
    await asRole("anon"); await expect(db.exec(`insert into public.financial_aid_applications(full_name,email,essay,amount_awarded_lrd) values('Local test','test@example.test','Local essay',100)`)).rejects.toThrow("row-level security");
  });
  it("rolls back award changes when audit logging fails", async () => {
    await asRole("postgres"); await db.exec("revoke insert on public.admin_activity from authenticated");
    try {
      await asRole("authenticated", adminId);
      await expect(db.exec(`update public.financial_aid_applications set amount_awarded_lrd=100 where id='${aidId}'`)).rejects.toThrow("permission denied");
      expect(await rows(`select amount_awarded_lrd from public.financial_aid_applications where id='${aidId}'`)).toEqual([{ amount_awarded_lrd: null }]);
    } finally { await asRole("postgres"); await db.exec("grant insert on public.admin_activity to authenticated"); }
  });
  it("prevents audit modification or deletion even outside the normal RLS path", async () => {
    await db.exec(`update public.financial_aid_applications set amount_awarded_lrd=100 where id='${aidId}'`);
    await asRole("postgres");
    await expect(db.exec(`update public.admin_activity set action='tampered' where record_id='${aidId}'`)).rejects.toThrow("immutable");
    await expect(db.exec(`delete from public.admin_activity where record_id='${aidId}'`)).rejects.toThrow("immutable");
  });
});