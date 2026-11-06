/*
# Administrator email notification outbox

## Plain-English summary
Whenever a new registration request needs administrator review, every administrator
account that has an email address is queued for one notification email. A separate
edge function sends the queued emails and records whether each one succeeded. The
queue lives in the database, so a failed or delayed email never stops the request
itself from being created, and nothing is sent twice for the same request.

## 1. New table
- `admin_email_outbox`: one row per (request, administrator) pair.
  - `request_id` – the pending admin request the email is about.
  - `recipient_user_id` / `recipient_email` – the administrator account and the email address on that account.
  - `status` – `pending`, `sent` or `failed`.
  - `attempts`, `last_error`, `claimed_at`, `sent_at` – delivery bookkeeping and failure log.
  - Unique on (`request_id`, `recipient_user_id`) so the same event never produces duplicate emails.

## 2. Trigger
- `admin_request_email_queue` runs after every insert on `admin_requests` and queues one row per administrator with an email address.
- Existing requests are not backfilled, so administrators do not receive emails for old requests.

## 3. Functions
- `claim_admin_email_batch(p_limit)`: atomically claims due emails for the sender so two runs never send the same row. Only pending requests are claimed. A row whose claim is older than 5 minutes can be reclaimed. Each row can be attempted up to 5 times.

## 4. Security
- Row level security is enabled on `admin_email_outbox` with no policies, so browsers (anon and authenticated roles) cannot read or change it.
- Only the server-side role (`service_role`) can read, update and claim rows.
- The trigger and claim function are not callable by browser roles.
- Notifications do not change `admin_requests`, so a request stays pending until an administrator decides it.
*/

CREATE TABLE IF NOT EXISTS public.admin_email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.admin_requests(id) ON DELETE CASCADE,
  recipient_user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  claimed_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_email_outbox_request_recipient_key UNIQUE (request_id, recipient_user_id)
);

CREATE INDEX IF NOT EXISTS admin_email_outbox_due_idx
  ON public.admin_email_outbox (created_at)
  WHERE status IN ('pending', 'failed');

ALTER TABLE public.admin_email_outbox ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.admin_email_outbox TO service_role;

CREATE OR REPLACE FUNCTION public.queue_admin_email_for_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.admin_email_outbox (request_id, recipient_user_id, recipient_email)
  SELECT NEW.id, p.id, btrim(p.email)
  FROM public.user_profiles p
  WHERE p.platform_role = 'administrator'
    AND NULLIF(btrim(p.email), '') IS NOT NULL
  ON CONFLICT (request_id, recipient_user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.queue_admin_email_for_request() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS admin_request_email_queue ON public.admin_requests;
CREATE TRIGGER admin_request_email_queue
  AFTER INSERT ON public.admin_requests
  FOR EACH ROW EXECUTE FUNCTION public.queue_admin_email_for_request();

CREATE OR REPLACE FUNCTION public.claim_admin_email_batch(p_limit integer)
RETURNS TABLE (
  outbox_id uuid,
  request_id uuid,
  recipient_email text,
  request_type text,
  applicant_name text,
  submitted_at timestamptz,
  attempt_number integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  WITH due AS (
    SELECT o.id
    FROM public.admin_email_outbox o
    JOIN public.admin_requests r ON r.id = o.request_id
    WHERE o.status IN ('pending', 'failed')
      AND o.attempts < 5
      AND r.status = 'pending'
      AND (o.claimed_at IS NULL OR o.claimed_at < now() - interval '5 minutes')
    ORDER BY o.created_at
    LIMIT greatest(p_limit, 1)
    FOR UPDATE OF o SKIP LOCKED
  ), claimed AS (
    UPDATE public.admin_email_outbox o
    SET attempts = o.attempts + 1,
        claimed_at = now()
    FROM due
    WHERE o.id = due.id
    RETURNING o.id AS claimed_id, o.request_id AS claimed_request_id,
              o.recipient_email AS claimed_email, o.attempts AS claimed_attempts
  )
  SELECT c.claimed_id, c.claimed_request_id, c.claimed_email,
         r.request_type::text, r.applicant_name, r.submitted_at, c.claimed_attempts
  FROM claimed c
  JOIN public.admin_requests r ON r.id = c.claimed_request_id;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.claim_admin_email_batch(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_admin_email_batch(integer) TO service_role;
