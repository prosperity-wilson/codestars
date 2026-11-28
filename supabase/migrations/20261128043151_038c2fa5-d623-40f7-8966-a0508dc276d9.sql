create unique index promotions_one_per_submission on public.promotions(submission_id) where submission_id is not null;

create function public.validate_aid_award() returns trigger language plpgsql set search_path=public as $$
begin
 if new.amount_awarded_lrd is not null and (new.amount_awarded_lrd < 0 or new.amount_awarded_lrd::text in ('NaN','Infinity','-Infinity')) then raise exception 'Award must be a finite non-negative LRD amount'; end if;
 return new;
end $$;
create trigger validate_aid_award before insert or update of amount_awarded_lrd on public.financial_aid_applications for each row execute function public.validate_aid_award();

create function public.audit_phase1_review() returns trigger language plpgsql security invoker set search_path=public as $$
begin
 if not public.is_admin() then raise exception 'Administrator authorization required'; end if;
 if old.status is distinct from new.status then
  insert into public.admin_activity(action,table_name,record_id,details) values ('status_changed',tg_table_name,new.id,jsonb_build_object('from',old.status,'to',new.status));
 end if;
 if old.admin_notes is distinct from new.admin_notes then
  insert into public.admin_activity(action,table_name,record_id) values ('notes_updated',tg_table_name,new.id);
 end if;
 if tg_table_name='financial_aid_applications' then
  if (to_jsonb(old)->'amount_awarded_lrd') is distinct from (to_jsonb(new)->'amount_awarded_lrd') then
   insert into public.admin_activity(action,table_name,record_id,details) values ('award_updated',tg_table_name,new.id,jsonb_build_object('from',to_jsonb(old)->'amount_awarded_lrd','to',to_jsonb(new)->'amount_awarded_lrd'));
  end if;
 elsif new.status <> 'published' then
  update public.promotions set is_published=false where submission_id=new.id and is_published;
 end if;
 return new;
end $$;
create trigger audit_aid_review after update on public.financial_aid_applications for each row execute function public.audit_phase1_review();
create trigger audit_promotion_review after update on public.promotion_submissions for each row execute function public.audit_phase1_review();

create function public.audit_promotion_publication() returns trigger language plpgsql security invoker set search_path=public as $$
begin
 if not public.is_admin() then raise exception 'Administrator authorization required'; end if;
 if tg_op='INSERT' then
  insert into public.admin_activity(action,table_name,record_id,details) values (case when new.is_published then 'promotion_published' else 'promotion_created' end,'promotions',new.id,jsonb_build_object('submission_id',new.submission_id));
 elsif old.is_published is distinct from new.is_published then
  insert into public.admin_activity(action,table_name,record_id,details) values (case when new.is_published then 'promotion_published' else 'promotion_unpublished' end,'promotions',new.id,jsonb_build_object('submission_id',new.submission_id));
 elsif to_jsonb(old)-'updated_at' is distinct from to_jsonb(new)-'updated_at' then
  insert into public.admin_activity(action,table_name,record_id,details) values ('promotion_updated','promotions',new.id,jsonb_build_object('submission_id',new.submission_id));
 end if;
 return new;
end $$;
create trigger audit_promotion_publication after insert or update on public.promotions for each row execute function public.audit_promotion_publication();

create function public.set_promotion_publication(p_submission_id uuid,p_publish boolean) returns uuid language plpgsql security invoker set search_path=public as $$
declare s public.promotion_submissions; publication_id uuid;
begin
 if not public.is_admin() then raise exception 'Administrator authorization required' using errcode='42501'; end if;
 select * into s from public.promotion_submissions where id=p_submission_id for update;
 if not found then raise exception 'Submission not found'; end if;
 if p_publish then
  if s.status not in ('approved','published') then raise exception 'Approve the submission before publishing'; end if;
  if s.link is not null and s.link !~* '^https?://' then raise exception 'Promotion link must use HTTP or HTTPS'; end if;
  insert into public.promotions(submission_id,title,promo_type,body,link,is_published,published_at)
   values(s.id,s.title,s.promo_type,s.details,s.link,true,now())
   on conflict (submission_id) where submission_id is not null do update set
    title=excluded.title,promo_type=excluded.promo_type,body=excluded.body,link=excluded.link,is_published=true,
    published_at=case when promotions.is_published then promotions.published_at else now() end
   returning id into publication_id;
  update public.promotion_submissions set status='published' where id=s.id and status is distinct from 'published';
 else
  update public.promotions set is_published=false where submission_id=s.id and is_published returning id into publication_id;
  if publication_id is null then select id into publication_id from public.promotions where submission_id=s.id; end if;
  update public.promotion_submissions set status='approved' where id=s.id and status='published';
 end if;
 return publication_id;
end $$;
revoke all on function public.set_promotion_publication(uuid,boolean) from public,anon;
grant execute on function public.set_promotion_publication(uuid,boolean) to authenticated;

create function public.guard_published_submission() returns trigger language plpgsql set search_path=public as $$
begin
 if new.status='published' and not exists(select 1 from public.promotions where submission_id=new.id and is_published) then raise exception 'Use the publication action to publish an approved submission'; end if;
 return new;
end $$;
create trigger guard_published_submission before update of status on public.promotion_submissions for each row execute function public.guard_published_submission();

create function public.protect_admin_activity() returns trigger language plpgsql set search_path=public as $$
begin raise exception 'Administrative activity is immutable'; end $$;
create trigger protect_admin_activity before update or delete on public.admin_activity for each row execute function public.protect_admin_activity();
