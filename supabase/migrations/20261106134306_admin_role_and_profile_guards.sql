/*
# Administrator role and profile guards

1. Modified Tables
- `user_profiles`
  - `username` (text, optional, unique ignoring case): short login name, e.g. the administrator's username.
  - `platform_role` (text, optional): set to `administrator` for platform administrators. Empty for everyone else.

2. New Functions
- `is_platform_admin()`: true when the signed-in user has the administrator role. Used by security rules across the platform.
- `resolve_login_email(identifier)`: maps a username to its login email so people can sign in with either. Only usernames are resolved.
- `guard_user_profile_privileges()` trigger: blocks signed-in non-administrators from granting themselves the administrator role or the verified statuses.

3. Security
- Administrator role can only be granted directly in the database, never through the app.
- Verified statuses can only be set by an administrator; users can still move between not-verified and in-verification states during registration.
- Administrator read access to user profiles is already covered by the existing public profile read rule.

4. Notes
- Changes to existing rows: none. Existing profiles keep their values.
*/

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS platform_role text;

CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_username_lower_key
  ON user_profiles (lower(username)) WHERE username IS NOT NULL;

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND platform_role = 'administrator'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_platform_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.resolve_login_email(p_identifier text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.user_profiles
  WHERE username IS NOT NULL AND lower(username) = lower(trim(p_identifier))
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.resolve_login_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_login_email(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.guard_user_profile_privileges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_platform_admin() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.platform_role IS NOT NULL THEN
      RAISE EXCEPTION 'Not authorized';
    END IF;
    IF NEW.verification_status IN ('verified', 'partially_verified') THEN
      RAISE EXCEPTION 'Not authorized';
    END IF;
  ELSE
    IF NEW.platform_role IS DISTINCT FROM OLD.platform_role THEN
      RAISE EXCEPTION 'Not authorized';
    END IF;
    IF NEW.verification_status IS DISTINCT FROM OLD.verification_status
       AND NEW.verification_status IN ('verified', 'partially_verified') THEN
      RAISE EXCEPTION 'Not authorized';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_user_profile_privileges_trigger ON user_profiles;
CREATE TRIGGER guard_user_profile_privileges_trigger
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_user_profile_privileges();
