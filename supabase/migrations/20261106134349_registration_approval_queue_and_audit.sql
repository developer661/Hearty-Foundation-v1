/*
# Registration approval queue, document storage and audit trail

1. New Tables
- `admin_requests`: one row per registration that needs an administrator decision.
  - `request_type`: volunteer, business_partner, care_facility_ngo or foundation_ngo.
  - `subject_table` / `subject_id`: the registration record it refers to.
  - `applicant_name`, `applicant_email`, `submitted_at`.
  - `status`: pending, approved or rejected.
  - `verification_level`: partially_verified or verified (verified once approved with the required documents on file).
  - `decided_by`, `decided_at`, `decision_reason`.
- `admin_audit_log`: record of every administrator decision (who, what, which record, previous and new status, reason, time).

2. Automation
- Every new volunteer, business partner, care facility/NGO or foundation registration automatically creates a pending request, so the administrator notification counter updates in real time.
- Existing registrations were added to the queue; registrations already approved or rejected keep their decision.

3. Functions
- `admin_decide_request(request, decision, reason)`: approves or rejects a request. Rejection requires a reason. Updates the registration status, the matching account's verification status, the request, and writes an audit entry. Callable only by administrators.

4. Documents
- New private storage bucket `registration-documents` (PDF, JPEG or PNG, up to 5 MB each).
- Anyone completing a registration may upload documents; only administrators may read them, through short-lived links.

5. Security
- Administrators get read access to registration records, documents, requests and the audit log.
- Audit log and requests can only be written through the decision function.
- Ordinary users cannot read other people's registration documents.

6. Realtime
- `admin_requests` is published on the realtime channel so the notification counter updates without refreshing.
*/

CREATE TABLE IF NOT EXISTS admin_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type text NOT NULL CHECK (request_type IN ('volunteer', 'business_partner', 'care_facility_ngo', 'foundation_ngo')),
  subject_table text NOT NULL,
  subject_id uuid NOT NULL,
  applicant_name text NOT NULL,
  applicant_email text NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verification_level text NOT NULL DEFAULT 'partially_verified' CHECK (verification_level IN ('partially_verified', 'verified')),
  decided_by uuid,
  decided_at timestamptz,
  decision_reason text,
  UNIQUE (subject_table, subject_id)
);

CREATE INDEX IF NOT EXISTS admin_requests_status_idx ON admin_requests (status, submitted_at DESC);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  admin_name text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  entity_label text NOT NULL,
  previous_status text,
  new_status text,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_created_idx ON admin_audit_log (created_at DESC);

ALTER TABLE admin_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON admin_requests FROM anon;
REVOKE ALL ON admin_audit_log FROM anon;
REVOKE INSERT, UPDATE, DELETE ON admin_requests FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON admin_audit_log FROM authenticated;
GRANT SELECT ON admin_requests TO authenticated;
GRANT SELECT ON admin_audit_log TO authenticated;

DROP POLICY IF EXISTS "Admins can view requests" ON admin_requests;
CREATE POLICY "Admins can view requests" ON admin_requests FOR SELECT
  TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Admins can view audit log" ON admin_audit_log;
CREATE POLICY "Admins can view audit log" ON admin_audit_log FOR SELECT
  TO authenticated USING (public.is_platform_admin());

CREATE OR REPLACE FUNCTION public.create_admin_request_from_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row jsonb := to_jsonb(NEW);
  v_type text;
BEGIN
  v_type := CASE TG_TABLE_NAME
    WHEN 'volunteer_registrations' THEN 'volunteer'
    WHEN 'business_partner_registrations' THEN 'business_partner'
    WHEN 'care_facility_registrations' THEN 'care_facility_ngo'
    WHEN 'foundation_registrations' THEN 'foundation_ngo'
  END;

  INSERT INTO admin_requests (request_type, subject_table, subject_id, applicant_name, applicant_email, submitted_at)
  VALUES (
    v_type,
    TG_TABLE_NAME,
    NEW.id,
    COALESCE(v_row->>'full_name', v_row->>'company_name', v_row->>'name', 'Unnamed applicant'),
    COALESCE(v_row->>'email', ''),
    COALESCE(NEW.created_at, now())
  )
  ON CONFLICT (subject_table, subject_id) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_admin_request_from_registration() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS admin_request_volunteer_trigger ON volunteer_registrations;
CREATE TRIGGER admin_request_volunteer_trigger AFTER INSERT ON volunteer_registrations
  FOR EACH ROW EXECUTE FUNCTION public.create_admin_request_from_registration();

DROP TRIGGER IF EXISTS admin_request_business_partner_trigger ON business_partner_registrations;
CREATE TRIGGER admin_request_business_partner_trigger AFTER INSERT ON business_partner_registrations
  FOR EACH ROW EXECUTE FUNCTION public.create_admin_request_from_registration();

DROP TRIGGER IF EXISTS admin_request_care_facility_trigger ON care_facility_registrations;
CREATE TRIGGER admin_request_care_facility_trigger AFTER INSERT ON care_facility_registrations
  FOR EACH ROW EXECUTE FUNCTION public.create_admin_request_from_registration();

DROP TRIGGER IF EXISTS admin_request_foundation_trigger ON foundation_registrations;
CREATE TRIGGER admin_request_foundation_trigger AFTER INSERT ON foundation_registrations
  FOR EACH ROW EXECUTE FUNCTION public.create_admin_request_from_registration();

INSERT INTO admin_requests (request_type, subject_table, subject_id, applicant_name, applicant_email, submitted_at, status)
SELECT 'volunteer', 'volunteer_registrations', id, full_name, email, created_at,
  CASE lower(coalesce(status, '')) WHEN 'approved' THEN 'approved' WHEN 'rejected' THEN 'rejected' ELSE 'pending' END
FROM volunteer_registrations
ON CONFLICT (subject_table, subject_id) DO NOTHING;

INSERT INTO admin_requests (request_type, subject_table, subject_id, applicant_name, applicant_email, submitted_at, status)
SELECT 'business_partner', 'business_partner_registrations', id, company_name, email, created_at,
  CASE lower(coalesce(status, '')) WHEN 'approved' THEN 'approved' WHEN 'rejected' THEN 'rejected' ELSE 'pending' END
FROM business_partner_registrations
ON CONFLICT (subject_table, subject_id) DO NOTHING;

INSERT INTO admin_requests (request_type, subject_table, subject_id, applicant_name, applicant_email, submitted_at, status)
SELECT 'care_facility_ngo', 'care_facility_registrations', id, name, email, created_at,
  CASE lower(coalesce(status, '')) WHEN 'approved' THEN 'approved' WHEN 'rejected' THEN 'rejected' ELSE 'pending' END
FROM care_facility_registrations
ON CONFLICT (subject_table, subject_id) DO NOTHING;

INSERT INTO admin_requests (request_type, subject_table, subject_id, applicant_name, applicant_email, submitted_at, status)
SELECT 'foundation_ngo', 'foundation_registrations', id, name, email, created_at,
  CASE lower(coalesce(status, '')) WHEN 'approved' THEN 'approved' WHEN 'rejected' THEN 'rejected' ELSE 'pending' END
FROM foundation_registrations
ON CONFLICT (subject_table, subject_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.admin_decide_request(p_request_id uuid, p_decision text, p_reason text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_req admin_requests%ROWTYPE;
  v_reason text := NULLIF(btrim(COALESCE(p_reason, '')), '');
  v_docs integer := 0;
  v_level text := 'partially_verified';
  v_admin_name text;
BEGIN
  IF NOT public.is_platform_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_decision NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid decision';
  END IF;

  IF p_decision = 'rejected' AND v_reason IS NULL THEN
    RAISE EXCEPTION 'A reason is required to reject a request';
  END IF;

  IF v_reason IS NOT NULL AND length(v_reason) > 1000 THEN
    RAISE EXCEPTION 'Reason is too long';
  END IF;

  SELECT * INTO v_req FROM admin_requests WHERE id = p_request_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found';
  END IF;

  IF v_req.status <> 'pending' THEN
    RAISE EXCEPTION 'This request has already been decided';
  END IF;

  IF v_req.subject_table = 'volunteer_registrations' THEN
    SELECT count(*) INTO v_docs FROM registration_documents
      WHERE registration_id = v_req.subject_id AND document_type = 'id';
    IF v_docs > 0 THEN v_level := 'verified'; END IF;
    UPDATE volunteer_registrations SET status = p_decision WHERE id = v_req.subject_id;
  ELSIF v_req.subject_table = 'care_facility_registrations' THEN
    SELECT count(*) INTO v_docs FROM care_facility_documents WHERE registration_id = v_req.subject_id;
    IF v_docs > 0 THEN v_level := 'verified'; END IF;
    UPDATE care_facility_registrations SET status = p_decision WHERE id = v_req.subject_id;
  ELSIF v_req.subject_table = 'foundation_registrations' THEN
    SELECT count(*) INTO v_docs FROM foundation_documents WHERE registration_id = v_req.subject_id;
    IF v_docs > 0 THEN v_level := 'verified'; END IF;
    UPDATE foundation_registrations SET status = p_decision WHERE id = v_req.subject_id;
  ELSIF v_req.subject_table = 'business_partner_registrations' THEN
    UPDATE business_partner_registrations SET status = p_decision WHERE id = v_req.subject_id;
  ELSE
    RAISE EXCEPTION 'Unknown request type';
  END IF;

  IF p_decision = 'rejected' THEN
    v_level := 'partially_verified';
    UPDATE user_profiles SET verification_status = 'rejected'
      WHERE lower(email) = lower(v_req.applicant_email);
  ELSE
    UPDATE user_profiles SET verification_status = v_level
      WHERE lower(email) = lower(v_req.applicant_email);
  END IF;

  UPDATE admin_requests
    SET status = p_decision,
        verification_level = v_level,
        decided_by = auth.uid(),
        decided_at = now(),
        decision_reason = v_reason
    WHERE id = v_req.id;

  SELECT COALESCE(full_name, email) INTO v_admin_name FROM user_profiles WHERE id = auth.uid();

  INSERT INTO admin_audit_log (admin_id, admin_name, action, entity_type, entity_id, entity_label, previous_status, new_status, reason)
  VALUES (auth.uid(), COALESCE(v_admin_name, 'Administrator'),
    CASE WHEN p_decision = 'approved' THEN 'approve_registration' ELSE 'reject_registration' END,
    'registration_request', v_req.id, v_req.applicant_name, 'pending', p_decision, v_reason);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_decide_request(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_decide_request(uuid, text, text) TO authenticated;

DROP POLICY IF EXISTS "Admins can view volunteer registrations" ON volunteer_registrations;
CREATE POLICY "Admins can view volunteer registrations" ON volunteer_registrations FOR SELECT
  TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Admins can view business partner registrations" ON business_partner_registrations;
CREATE POLICY "Admins can view business partner registrations" ON business_partner_registrations FOR SELECT
  TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Admins can view care facility registrations" ON care_facility_registrations;
CREATE POLICY "Admins can view care facility registrations" ON care_facility_registrations FOR SELECT
  TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Admins can view foundation registrations" ON foundation_registrations;
CREATE POLICY "Admins can view foundation registrations" ON foundation_registrations FOR SELECT
  TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Admins can view volunteer documents" ON registration_documents;
CREATE POLICY "Admins can view volunteer documents" ON registration_documents FOR SELECT
  TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Admins can view care facility documents" ON care_facility_documents;
CREATE POLICY "Admins can view care facility documents" ON care_facility_documents FOR SELECT
  TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Admins can view foundation documents" ON foundation_documents;
CREATE POLICY "Admins can view foundation documents" ON foundation_documents FOR SELECT
  TO authenticated USING (public.is_platform_admin());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('registration-documents', 'registration-documents', false, 5242880, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Registrants can upload registration documents" ON storage.objects;
CREATE POLICY "Registrants can upload registration documents" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'registration-documents');

DROP POLICY IF EXISTS "Admins can read registration documents" ON storage.objects;
CREATE POLICY "Admins can read registration documents" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'registration-documents' AND public.is_platform_admin());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'admin_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE admin_requests;
  END IF;
END;
$$;
