/*
  # Create Demo User Using Proper Auth Functions
  
  1. Purpose
    - Create a demo user account using Supabase's proper auth system
    - This ensures all required auth records are created (users, identities, etc.)
    
  2. Demo Account
    - Email: anna.kowalska@example.com
    - Password: volunteer123
    
  3. Important Notes
    - Uses auth.users insert which triggers proper identity creation
    - Email is auto-confirmed for demo purposes
    - The handle_new_user trigger will create the user profile
*/

-- Re-enable the auth trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create demo user with all required fields
DO $$
DECLARE
  user_id uuid;
BEGIN
  -- Generate a new UUID for the user
  user_id := gen_random_uuid();
  
  -- Insert into auth.users with all required fields
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at,
    confirmation_token,
    is_super_admin
  ) VALUES (
    user_id,
    '00000000-0000-0000-0000-000000000000',
    'anna.kowalska@example.com',
    crypt('volunteer123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', 'Anna Kowalska',
      'location', 'Warsaw, Poland',
      'bio', 'Experienced math teacher passionate about helping children succeed',
      'skills', jsonb_build_array('Math', 'Tutoring', 'Curriculum Development'),
      'interests', jsonb_build_array('education_math', 'education_english')
    ),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    false
  ) ON CONFLICT (id) DO NOTHING;
  
  -- Insert into auth.identities (required for proper auth)
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    provider,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    user_id,
    user_id::text,
    'email',
    jsonb_build_object(
      'sub', user_id::text,
      'email', 'anna.kowalska@example.com',
      'email_verified', true
    ),
    NOW(),
    NOW(),
    NOW()
  ) ON CONFLICT (provider, provider_id) DO NOTHING;
  
  -- Update the user profile with additional data (the trigger creates basic profile)
  UPDATE public.user_profiles
  SET 
    points = 850,
    skills = ARRAY['Math', 'Tutoring', 'Curriculum Development'],
    interests = ARRAY['education_math', 'education_english']
  WHERE id = user_id;
  
  -- Insert sample activities
  INSERT INTO user_activities (user_id, activity_type, description, points_earned, created_at) VALUES
    (user_id, 'volunteered', 'Completed Math Tutoring Session at Local School', 50, NOW() - INTERVAL '2 days'),
    (user_id, 'attended_event', 'Attended Volunteer Training Workshop', 25, NOW() - INTERVAL '5 days'),
    (user_id, 'posted', 'Shared experience teaching advanced algebra', 10, NOW() - INTERVAL '7 days'),
    (user_id, 'volunteered', 'Led English Reading Session', 50, NOW() - INTERVAL '10 days')
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert sample assigned opportunities
  DECLARE
    opp1_id uuid;
    opp2_id uuid;
  BEGIN
    SELECT id INTO opp1_id FROM opportunities LIMIT 1;
    SELECT id INTO opp2_id FROM opportunities LIMIT 1 OFFSET 1;
    
    IF opp1_id IS NOT NULL THEN
      INSERT INTO assigned_opportunities (user_id, opportunity_id, opportunity_title, status, start_date) VALUES
        (user_id, opp1_id, 'Math Tutoring - Elementary School', 'in_progress', CURRENT_DATE)
      ON CONFLICT (id) DO NOTHING;
    END IF;
    
    IF opp2_id IS NOT NULL THEN
      INSERT INTO assigned_opportunities (user_id, opportunity_id, opportunity_title, status, start_date) VALUES
        (user_id, opp2_id, 'Weekend Learning Support', 'assigned', CURRENT_DATE + INTERVAL '3 days')
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END;
END $$;
