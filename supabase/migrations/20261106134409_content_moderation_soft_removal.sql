/*
# Content moderation with soft removal

1. Modified Tables
- `posts`, `post_comments`, `events` (events are the platform's published announcements; the platform has no separate announcements table)
  - `moderation_status`: active or removed. Defaults to active, so existing content stays visible.
  - `moderated_by`, `moderated_at`, `moderation_reason`: who removed or restored an item, when, and why.

2. Behaviour
- Removed items disappear from all normal user views.
- Administrators still see removed items so they can review or restore them.
- Nothing is physically deleted by moderation.

3. New Function
- `admin_moderate_content(kind, id, action, reason)`: removes or restores a post, comment or event. Removal requires a reason. Every action is written to the audit log. Callable only by administrators.

4. Security
- Public read policies now only return active content, except for administrators.
- Moderation can only happen through the function above.
*/

ALTER TABLE posts ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'active' CHECK (moderation_status IN ('active', 'removed'));
ALTER TABLE posts ADD COLUMN IF NOT EXISTS moderated_by uuid;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS moderated_at timestamptz;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS moderation_reason text;

ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'active' CHECK (moderation_status IN ('active', 'removed'));
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS moderated_by uuid;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS moderated_at timestamptz;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS moderation_reason text;

ALTER TABLE events ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'active' CHECK (moderation_status IN ('active', 'removed'));
ALTER TABLE events ADD COLUMN IF NOT EXISTS moderated_by uuid;
ALTER TABLE events ADD COLUMN IF NOT EXISTS moderated_at timestamptz;
ALTER TABLE events ADD COLUMN IF NOT EXISTS moderation_reason text;

DROP POLICY IF EXISTS "Anyone can view posts" ON posts;
CREATE POLICY "Anyone can view active posts" ON posts FOR SELECT
  TO public USING (moderation_status = 'active' OR public.is_platform_admin());

DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;
CREATE POLICY "Anyone can view active comments" ON post_comments FOR SELECT
  TO public USING (moderation_status = 'active' OR public.is_platform_admin());

DROP POLICY IF EXISTS "Anyone can view events" ON events;
CREATE POLICY "Anyone can view active events" ON events FOR SELECT
  TO public USING (moderation_status = 'active' OR public.is_platform_admin());

CREATE OR REPLACE FUNCTION public.admin_moderate_content(p_kind text, p_id uuid, p_action text, p_reason text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reason text := NULLIF(btrim(COALESCE(p_reason, '')), '');
  v_current text;
  v_label text;
  v_admin_name text;
  v_new text;
BEGIN
  IF NOT public.is_platform_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_action NOT IN ('remove', 'restore') THEN
    RAISE EXCEPTION 'Invalid action';
  END IF;

  IF p_action = 'remove' AND v_reason IS NULL THEN
    RAISE EXCEPTION 'A reason is required to remove content';
  END IF;

  IF v_reason IS NOT NULL AND length(v_reason) > 1000 THEN
    RAISE EXCEPTION 'Reason is too long';
  END IF;

  v_new := CASE WHEN p_action = 'remove' THEN 'removed' ELSE 'active' END;

  IF p_kind = 'post' THEN
    SELECT moderation_status, left(content, 80) INTO v_current, v_label FROM posts WHERE id = p_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Content not found'; END IF;
    IF v_current = v_new THEN RAISE EXCEPTION 'Content is already %', v_new; END IF;
    UPDATE posts SET moderation_status = v_new, moderated_by = auth.uid(), moderated_at = now(),
      moderation_reason = CASE WHEN v_new = 'removed' THEN v_reason ELSE NULL END
      WHERE id = p_id;
  ELSIF p_kind = 'comment' THEN
    SELECT moderation_status, left(content, 80) INTO v_current, v_label FROM post_comments WHERE id = p_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Content not found'; END IF;
    IF v_current = v_new THEN RAISE EXCEPTION 'Content is already %', v_new; END IF;
    UPDATE post_comments SET moderation_status = v_new, moderated_by = auth.uid(), moderated_at = now(),
      moderation_reason = CASE WHEN v_new = 'removed' THEN v_reason ELSE NULL END
      WHERE id = p_id;
  ELSIF p_kind = 'event' THEN
    SELECT moderation_status, left(title, 80) INTO v_current, v_label FROM events WHERE id = p_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Content not found'; END IF;
    IF v_current = v_new THEN RAISE EXCEPTION 'Content is already %', v_new; END IF;
    UPDATE events SET moderation_status = v_new, moderated_by = auth.uid(), moderated_at = now(),
      moderation_reason = CASE WHEN v_new = 'removed' THEN v_reason ELSE NULL END
      WHERE id = p_id;
  ELSE
    RAISE EXCEPTION 'Unknown content type';
  END IF;

  SELECT COALESCE(full_name, email) INTO v_admin_name FROM user_profiles WHERE id = auth.uid();

  INSERT INTO admin_audit_log (admin_id, admin_name, action, entity_type, entity_id, entity_label, previous_status, new_status, reason)
  VALUES (auth.uid(), COALESCE(v_admin_name, 'Administrator'),
    CASE WHEN p_action = 'remove' THEN 'remove_content' ELSE 'restore_content' END,
    p_kind, p_id, COALESCE(v_label, ''), v_current, v_new, v_reason);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_moderate_content(text, uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_moderate_content(text, uuid, text, text) TO authenticated;
