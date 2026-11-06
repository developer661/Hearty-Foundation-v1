/*
# Demo administrator account (RafalS)

1. Purpose
- Creates a demo administrator account for testing and visual review of the administration area.

2. Account
- Username: RafalS (used to sign in together with the login email)
- Login email: rafals@example.com
- The password is stored only as a bcrypt hash, using the same mechanism as the other accounts.
- The account is marked with the administrator role and a verified profile.

3. Important Notes
- This is a demo/development credential. Before any production use, create a new administrator account with a strong password and remove this demo account.
- The credentials are not displayed anywhere in the application.
- Re-running this migration is safe: the account is only created once and the profile is updated to the administrator values.
*/

DO $$
DECLARE
  v_id uuid := 'a1d00000-0000-4000-8000-00000000ad01';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_id) THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at,
      confirmation_token, is_super_admin
    ) VALUES (
      v_id,
      '00000000-0000-0000-0000-000000000000',
      'rafals@example.com',
      crypt('12345678', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"RafalS"}'::jsonb,
      'authenticated',
      'authenticated',
      now(),
      now(),
      '',
      false
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      v_id,
      'rafals@example.com',
      'email',
      jsonb_build_object('sub', v_id::text, 'email', 'rafals@example.com', 'email_verified', true, 'phone_verified', false),
      now(),
      now(),
      now()
    );
  END IF;

  INSERT INTO user_profiles (id, full_name, email, location, username, platform_role, verification_status, access_level, user_type)
  VALUES (v_id, 'RafalS', 'rafals@example.com', 'Warsaw, Poland', 'RafalS', 'administrator', 'verified', 'full_access', 'volunteer')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    platform_role = EXCLUDED.platform_role,
    verification_status = EXCLUDED.verification_status,
    access_level = EXCLUDED.access_level;
END;
$$;
