/*
# CodeStars MVP Schema Foundation

## What this migration does

Creates the complete database foundation for the CodeStars MVP, moving the
organization from a static website to a functional application with persistent,
secure storage for public submissions and administrative review.

## Tables created

### Public submission tables (anon can INSERT, nobody can SELECT)

1. `contact_messages` — general contact messages and partnership inquiries
   submitted through the website contact form.

2. `creative_inquiries` — project inquiries from the "Hire CodeStars Creative"
   form, including requested service and budget range.

3. `school_applications` — training program applications submitted through the
   School Apply form, including course selection and motivation.

4. `financial_aid_applications` — private financial-aid applications with
   applicant circumstances, consent for sponsor sharing, and review/sponsorship
   decision records. This is the most sensitive table: only admins ever read it.

5. `promotion_submissions` — community-submitted promotions (events, products,
   opportunities) awaiting moderation.

### Public-read tables

6. `courses` — CodeStars School course/program catalog. Publicly readable so the
   programs page can display them. Managed by admins only.

7. `announcements` — organization-wide announcements. Publicly readable when
   published. Managed by admins only.

8. `published_promotions` — a VIEW exposing only promotion submissions that have
   been approved/published, with only the public-safe columns. This is how the
   Promotions page lists approved promotions without exposing pending or rejected
   submissions or submitter contact details.

### Administrative tables

9. `admin_activity_log` — audit trail of privileged administrative actions
   (status changes, decisions, deletions). Admin-write only, admin-read only.

10. `admin_profiles` — links authenticated users to admin metadata. Used to
    verify admin authorization. An admin is an authenticated Supabase user whose
    `raw_app_meta_data ->> 'role'` equals 'admin'. This table is a mirror for
    fast policy checks and audit; the source of truth is app_metadata (user-
    immutable). Rows are managed via the Supabase dashboard or a SECURITY
    DEFINER setup function, never by public signup.

## Relationships

- `school_applications.course_id` → `courses.id` (nullable: applicants may
  register interest before a course cohort is open).
- `admin_activity_log.admin_id` → `auth.users.id`.
- `admin_profiles.user_id` → `auth.users.id`.

## Security model

### Public (anon) visitors
- CAN INSERT into: contact_messages, creative_inquiries,
  school_applications, financial_aid_applications, promotion_submissions.
- CANNOT SELECT, UPDATE, or DELETE any submission table. A visitor who submits
  a form cannot read it back, and cannot read anyone else's submission.
- CAN SELECT from: courses (published only), announcements (published only),
  published_promotions view.

### Authenticated administrators
- CAN SELECT, UPDATE on all submission tables.
- CAN INSERT, UPDATE, DELETE on courses, announcements.
- CAN INSERT into admin_activity_log.
- Authorization is enforced by the `is_admin()` helper which checks
  `auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'`. This is user-immutable
  metadata set by a Supabase operator, not user-editable profile data.

### Financial aid — extra privacy
- Financial-aid applications are NEVER readable by anon or by non-admin
  authenticated users. Only admins. Donors/sponsors have no database access in
  this MVP. Sharing with a sponsor requires recorded applicant consent
  (consent_share_sponsor boolean) and authorized admin handling.

### Admin account creation
- There is NO public admin registration. Admin accounts are created in the
  Supabase dashboard by a project operator, who then sets
  `raw_app_meta_data.role = 'admin'` on the user. A SECURITY DEFINER function
  `setup_admin_profile` allows an existing admin to provision the
  admin_profiles row for a new admin user (not the auth account itself).

## Notes
1. All timestamps use `timestamptz DEFAULT now()`.
2. All primary keys are `uuid DEFAULT gen_random_uuid()`.
3. Status fields use `text` with `CHECK` constraints rather than enums for
   migration simplicity.
4. Idempotent: uses IF NOT EXISTS / DROP POLICY IF EXISTS patterns.
*/

-- ============================================================================
-- Helper function: is_admin()
-- Returns true if the current request's JWT has app_metadata.role = 'admin'.
-- app_metadata is set by the Supabase operator and is NOT user-editable.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- Revoke public execute; only authenticated roles should call it.
-- (anon also calls it in policies, so we keep it callable by anon.)
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ============================================================================
-- Table: courses
-- School program catalog. Public-read (published only), admin-managed.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned','open','closed','archived')),
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.courses TO authenticated;

DROP POLICY IF EXISTS "public_read_published_courses" ON public.courses;
CREATE POLICY "public_read_published_courses"
  ON public.courses FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "admin_insert_courses" ON public.courses;
CREATE POLICY "admin_insert_courses"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_update_courses" ON public.courses;
CREATE POLICY "admin_update_courses"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_courses" ON public.courses;
CREATE POLICY "admin_delete_courses"
  ON public.courses FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- Table: contact_messages
-- General contact + partnership inquiries. Public INSERT only.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  topic text NOT NULL DEFAULT 'general'
    CHECK (topic IN ('general','creative','school','impact','partnerships')),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','read','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE ON public.contact_messages TO authenticated;

DROP POLICY IF EXISTS "public_insert_contact_messages" ON public.contact_messages;
CREATE POLICY "public_insert_contact_messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_contact_messages" ON public.contact_messages;
CREATE POLICY "admin_select_contact_messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_update_contact_messages" ON public.contact_messages;
CREATE POLICY "admin_update_contact_messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- Table: creative_inquiries
-- Hire CodeStars Creative form. Public INSERT only.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.creative_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  organization text,
  service text NOT NULL
    CHECK (service IN ('website','brand_identity','graphic_design','web_application','digital_setup','other')),
  budget text
    CHECK (budget IS NULL OR budget IN ('under_50000','50000_150000','150000_400000','above_400000','not_sure')),
  details text NOT NULL,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','contacted','quoted','won','lost','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.creative_inquiries ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.creative_inquiries TO anon, authenticated;
GRANT SELECT, UPDATE ON public.creative_inquiries TO authenticated;

DROP POLICY IF EXISTS "public_insert_creative_inquiries" ON public.creative_inquiries;
CREATE POLICY "public_insert_creative_inquiries"
  ON public.creative_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_creative_inquiries" ON public.creative_inquiries;
CREATE POLICY "admin_select_creative_inquiries"
  ON public.creative_inquiries FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_update_creative_inquiries" ON public.creative_inquiries;
CREATE POLICY "admin_update_creative_inquiries"
  ON public.creative_inquiries FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- Table: school_applications
-- Training applications. Public INSERT only.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.school_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  county text,
  program text NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  requesting_aid boolean NOT NULL DEFAULT false,
  motivation text NOT NULL,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','reviewing','accepted','waitlisted','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.school_applications ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.school_applications TO anon, authenticated;
GRANT SELECT, UPDATE ON public.school_applications TO authenticated;

DROP POLICY IF EXISTS "public_insert_school_applications" ON public.school_applications;
CREATE POLICY "public_insert_school_applications"
  ON public.school_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_school_applications" ON public.school_applications;
CREATE POLICY "admin_select_school_applications"
  ON public.school_applications FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_update_school_applications" ON public.school_applications;
CREATE POLICY "admin_update_school_applications"
  ON public.school_applications FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- Table: financial_aid_applications
-- PRIVATE financial-aid applications. Most sensitive table.
-- Public INSERT only. Admin-only SELECT/UPDATE. No donor access in MVP.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.financial_aid_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_application_id uuid REFERENCES public.school_applications(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  program text NOT NULL,
  circumstances text NOT NULL,
  motivation text NOT NULL,
  evidence_refs text,
  consent_share_sponsor boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','reviewing','approved','denied','sponsored')),
  sponsor_decision text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.financial_aid_applications ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.financial_aid_applications TO anon, authenticated;
GRANT SELECT, UPDATE ON public.financial_aid_applications TO authenticated;

DROP POLICY IF EXISTS "public_insert_financial_aid" ON public.financial_aid_applications;
CREATE POLICY "public_insert_financial_aid"
  ON public.financial_aid_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_financial_aid" ON public.financial_aid_applications;
CREATE POLICY "admin_select_financial_aid"
  ON public.financial_aid_applications FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_update_financial_aid" ON public.financial_aid_applications;
CREATE POLICY "admin_update_financial_aid"
  ON public.financial_aid_applications FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- Table: promotion_submissions
-- Community promotion submissions awaiting moderation.
-- Public INSERT only. Admin manages. Published ones exposed via view.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.promotion_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_name text NOT NULL,
  submitter_email text NOT NULL,
  category text NOT NULL
    CHECK (category IN ('event','product_service','job_internship','training_scholarship')),
  title text NOT NULL,
  link text,
  details text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.promotion_submissions ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.promotion_submissions TO anon, authenticated;
GRANT SELECT, UPDATE ON public.promotion_submissions TO authenticated;

DROP POLICY IF EXISTS "public_insert_promotion_submissions" ON public.promotion_submissions;
CREATE POLICY "public_insert_promotion_submissions"
  ON public.promotion_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_promotion_submissions" ON public.promotion_submissions;
CREATE POLICY "admin_select_promotion_submissions"
  ON public.promotion_submissions FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_update_promotion_submissions" ON public.promotion_submissions;
CREATE POLICY "admin_update_promotion_submissions"
  ON public.promotion_submissions FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- View: published_promotions
-- Exposes ONLY approved promotions, with ONLY public-safe columns.
-- No submitter contact info is exposed.
-- ============================================================================

CREATE OR REPLACE VIEW public.published_promotions AS
SELECT
  id,
  category,
  title,
  link,
  details,
  published_at,
  created_at
FROM public.promotion_submissions
WHERE status = 'approved' AND published_at IS NOT NULL;

ALTER VIEW public.published_promotions SET (security_invoker = true);

GRANT SELECT ON public.published_promotions TO anon, authenticated;

-- ============================================================================
-- Table: announcements
-- Organization announcements. Public-read when published, admin-managed.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.announcements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.announcements TO authenticated;

DROP POLICY IF EXISTS "public_read_published_announcements" ON public.announcements;
CREATE POLICY "public_read_published_announcements"
  ON public.announcements FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "admin_insert_announcements" ON public.announcements;
CREATE POLICY "admin_insert_announcements"
  ON public.announcements FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_update_announcements" ON public.announcements;
CREATE POLICY "admin_update_announcements"
  ON public.announcements FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_announcements" ON public.announcements;
CREATE POLICY "admin_delete_announcements"
  ON public.announcements FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- Table: admin_profiles
-- Mirror of admin metadata for fast checks and audit. Not the source of truth
-- (app_metadata is). No public signup.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.admin_profiles TO authenticated;
GRANT INSERT ON public.admin_profiles TO authenticated;

DROP POLICY IF EXISTS "admin_read_all_admin_profiles" ON public.admin_profiles;
CREATE POLICY "admin_read_all_admin_profiles"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_insert_admin_profile" ON public.admin_profiles;
CREATE POLICY "admin_insert_admin_profile"
  ON public.admin_profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ============================================================================
-- Table: admin_activity_log
-- Audit trail for privileged actions. Admin-write, admin-read.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_table text NOT NULL,
  target_id uuid,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.admin_activity_log TO authenticated;

DROP POLICY IF EXISTS "admin_select_activity_log" ON public.admin_activity_log;
CREATE POLICY "admin_select_activity_log"
  ON public.admin_activity_log FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_insert_activity_log" ON public.admin_activity_log;
CREATE POLICY "admin_insert_activity_log"
  ON public.admin_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ============================================================================
-- SECURITY DEFINER function: setup_admin_profile
-- Allows an existing admin to create the admin_profiles row for a new admin
-- user. Does NOT create the auth account — that is done by the Supabase
-- operator in the dashboard.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.setup_admin_profile(target_user_id uuid, display_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;
  INSERT INTO public.admin_profiles (user_id, display_name)
  VALUES (target_user_id, display_name)
  ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.setup_admin_profile(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.setup_admin_profile(uuid, text) TO authenticated;

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_creative_inquiries_status ON public.creative_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_school_applications_status ON public.school_applications(status);
CREATE INDEX IF NOT EXISTS idx_financial_aid_status ON public.financial_aid_applications(status);
CREATE INDEX IF NOT EXISTS idx_promotion_submissions_status ON public.promotion_submissions(status);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published);
