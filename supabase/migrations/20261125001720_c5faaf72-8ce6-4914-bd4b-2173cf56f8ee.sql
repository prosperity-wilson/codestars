
create type public.app_role as enum ('admin');
create type public.training_status as enum ('draft','submitted','under_review','shortlisted','not_selected','waitlisted','accepted','confirmed','enrolled');
create type public.promotion_status as enum ('submitted','under_review','changes_requested','approved','rejected','published');
create type public.inquiry_status as enum ('new','in_progress','closed');
create type public.aid_status as enum ('submitted','under_review','approved','partially_approved','declined');

create or replace function public.update_updated_at_column() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null, created_at timestamptz not null default now(), unique(user_id, role));
grant select, update on public.profiles to authenticated; grant all on public.profiles to service_role;
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin') $$;

create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "own roles read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create trigger profiles_updated before update on public.profiles for each row execute function public.update_updated_at_column();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles(id, full_name) values (new.id, new.raw_user_meta_data->>'full_name') on conflict do nothing; return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Public content
create table public.courses (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null check (char_length(title) between 1 and 200),
  summary text, description text, duration text, fee_lrd numeric(12,2) check (fee_lrd >= 0), start_date date,
  is_published boolean not null default false, sort_order int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null check (char_length(title) between 1 and 200),
  client_name text, category text, summary text, body text, cover_image_path text, project_url text, completed_on date,
  is_published boolean not null default false, sort_order int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.announcements (
  id uuid primary key default gen_random_uuid(), title text not null check (char_length(title) between 1 and 200), body text not null,
  is_published boolean not null default false, published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

-- Submissions
create table public.promotion_submissions (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 200),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 320),
  promo_type text not null check (promo_type in ('Event','Product or service','Job or internship','Training or scholarship')),
  title text not null check (char_length(title) between 1 and 200), link text check (char_length(link) <= 500),
  details text not null check (char_length(details) between 1 and 5000),
  status public.promotion_status not null default 'submitted', admin_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.promotions (
  id uuid primary key default gen_random_uuid(), submission_id uuid references public.promotion_submissions(id) on delete set null,
  title text not null, promo_type text not null, body text not null, link text, image_path text,
  starts_on date, ends_on date, is_published boolean not null default false, published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.creative_inquiries (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 200),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 320),
  phone text check (char_length(phone) <= 40), organization text check (char_length(organization) <= 200),
  service text not null check (char_length(service) <= 100), budget text check (char_length(budget) <= 100),
  details text not null check (char_length(details) between 1 and 5000),
  status public.inquiry_status not null default 'new', admin_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.training_applications (
  id uuid primary key default gen_random_uuid(), course_id uuid references public.courses(id) on delete set null,
  program_name text not null check (char_length(program_name) <= 200),
  full_name text not null check (char_length(full_name) between 1 and 200),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 320),
  phone text not null check (char_length(phone) between 3 and 40), county text check (char_length(county) <= 200),
  requests_financial_aid boolean not null default false,
  motivation text not null check (char_length(motivation) between 1 and 5000),
  status public.training_status not null default 'submitted', admin_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.financial_aid_applications (
  id uuid primary key default gen_random_uuid(),
  training_application_id uuid references public.training_applications(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 200),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 320),
  household_situation text check (char_length(household_situation) <= 5000),
  essay text not null check (char_length(essay) between 1 and 8000),
  amount_requested_lrd numeric(12,2) check (amount_requested_lrd >= 0),
  document_paths text[] not null default '{}',
  status public.aid_status not null default 'submitted', amount_awarded_lrd numeric(12,2), admin_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.partnership_inquiries (
  id uuid primary key default gen_random_uuid(), inquiry_type text not null default 'partner' check (inquiry_type in ('partner','donor')),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 320),
  organization text check (char_length(organization) <= 200), message text not null check (char_length(message) between 1 and 5000),
  status public.inquiry_status not null default 'new', admin_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 200),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 320),
  topic text check (char_length(topic) <= 100), message text not null check (char_length(message) between 1 and 5000),
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.admin_activity (
  id uuid primary key default gen_random_uuid(), actor_id uuid not null default auth.uid(),
  action text not null, table_name text, record_id uuid, details jsonb, created_at timestamptz not null default now());

-- Grants
grant select on public.courses, public.portfolio_projects, public.announcements, public.promotions to anon;
grant select, insert, update, delete on public.courses, public.portfolio_projects, public.announcements, public.promotions to authenticated;
grant insert on public.creative_inquiries, public.training_applications, public.financial_aid_applications, public.promotion_submissions, public.partnership_inquiries, public.contact_messages to anon;
grant select, insert, update, delete on public.creative_inquiries, public.training_applications, public.financial_aid_applications, public.promotion_submissions, public.partnership_inquiries, public.contact_messages to authenticated;
grant select, insert on public.admin_activity to authenticated;
grant all on public.courses, public.portfolio_projects, public.announcements, public.promotions, public.creative_inquiries, public.training_applications, public.financial_aid_applications, public.promotion_submissions, public.partnership_inquiries, public.contact_messages, public.admin_activity to service_role;

-- RLS
alter table public.courses enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.announcements enable row level security;
alter table public.promotions enable row level security;
alter table public.creative_inquiries enable row level security;
alter table public.training_applications enable row level security;
alter table public.financial_aid_applications enable row level security;
alter table public.promotion_submissions enable row level security;
alter table public.partnership_inquiries enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_activity enable row level security;

create policy "public read published" on public.courses for select to anon, authenticated using (is_published or public.is_admin());
create policy "admin manage" on public.courses for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public read published" on public.portfolio_projects for select to anon, authenticated using (is_published or public.is_admin());
create policy "admin manage" on public.portfolio_projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public read published" on public.announcements for select to anon, authenticated using (is_published or public.is_admin());
create policy "admin manage" on public.announcements for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public read published" on public.promotions for select to anon, authenticated using (is_published or public.is_admin());
create policy "admin manage" on public.promotions for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "anyone submits" on public.creative_inquiries for insert to anon, authenticated with check (status = 'new' and admin_notes is null);
create policy "admin manage" on public.creative_inquiries for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone submits" on public.training_applications for insert to anon, authenticated with check (status = 'submitted' and admin_notes is null);
create policy "admin manage" on public.training_applications for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone submits" on public.financial_aid_applications for insert to anon, authenticated with check (status = 'submitted' and admin_notes is null and amount_awarded_lrd is null and training_application_id is null);
create policy "admin manage" on public.financial_aid_applications for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone submits" on public.promotion_submissions for insert to anon, authenticated with check (status = 'submitted' and admin_notes is null);
create policy "admin manage" on public.promotion_submissions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone submits" on public.partnership_inquiries for insert to anon, authenticated with check (status = 'new' and admin_notes is null);
create policy "admin manage" on public.partnership_inquiries for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone submits" on public.contact_messages for insert to anon, authenticated with check (status = 'new');
create policy "admin manage" on public.contact_messages for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin read" on public.admin_activity for select to authenticated using (public.is_admin());
create policy "admin log" on public.admin_activity for insert to authenticated with check (public.is_admin() and actor_id = auth.uid());

-- updated_at triggers
do $$ declare t text; begin
  foreach t in array array['courses','portfolio_projects','announcements','promotions','creative_inquiries','training_applications','financial_aid_applications','promotion_submissions','partnership_inquiries','contact_messages'] loop
    execute format('create trigger %I_updated before update on public.%I for each row execute function public.update_updated_at_column()', t, t);
  end loop; end $$;

-- Indexes
create index on public.training_applications (status, created_at desc);
create index on public.training_applications (course_id);
create index on public.financial_aid_applications (status, created_at desc);
create index on public.financial_aid_applications (training_application_id);
create index on public.promotion_submissions (status, created_at desc);
create index on public.promotions (is_published, published_at desc);
create index on public.promotions (submission_id);
create index on public.creative_inquiries (status, created_at desc);
create index on public.partnership_inquiries (status, created_at desc);
create index on public.contact_messages (status, created_at desc);
create index on public.announcements (is_published, published_at desc);
create index on public.admin_activity (created_at desc);
create index on public.admin_activity (actor_id);
create index on public.user_roles (user_id);
