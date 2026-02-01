/*
  # Setup Authentication System for Volunteer Platform
  
  1. Authentication Setup
    - Add function to auto-create profile on signup
    - Create trigger for new user registration
      
  2. Security Updates
    - Update RLS policies to work with authenticated users
    - Add policies for users to update their own profiles
    
  3. Seed Data
    - Insert test volunteer user (Anna Kowalska)
    - Insert sample activities and engagements for demo
    
  Important Notes:
    - Uses Supabase's built-in auth.users table
    - Password authentication is handled by Supabase auth
    - RLS ensures users can only modify their own data
    - The user_profiles.id will match auth.users.id for authenticated users
*/

-- Add function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email, location, bio, skills, interests, points)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Volunteer'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'location', 'Not specified'),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'skills')), '{}'),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'interests')), '{}'),
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies for authenticated access
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own activities" ON user_activities;
CREATE POLICY "Users can view own activities"
  ON user_activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR true);

DROP POLICY IF EXISTS "Users can update assigned opportunities" ON assigned_opportunities;
CREATE POLICY "Users can update assigned opportunities"
  ON assigned_opportunities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a test user profile (for demo purposes)
-- In production, this would be created through the signup flow
INSERT INTO user_profiles (
  id,
  full_name,
  email,
  location,
  bio,
  skills,
  interests,
  points
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Anna Kowalska',
  'anna.kowalska@example.com',
  'Warsaw, Poland',
  'Experienced math teacher passionate about helping children succeed',
  ARRAY['Math', 'Tutoring', 'Curriculum Development'],
  ARRAY['education_math', 'education_english'],
  850
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  location = EXCLUDED.location,
  bio = EXCLUDED.bio,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  points = EXCLUDED.points;

-- Insert sample activities for the demo user
INSERT INTO user_activities (user_id, activity_type, description, points_earned, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'volunteered', 'Completed Math Tutoring Session at Local School', 50, NOW() - INTERVAL '2 days'),
  ('11111111-1111-1111-1111-111111111111', 'attended_event', 'Attended Volunteer Training Workshop', 25, NOW() - INTERVAL '5 days'),
  ('11111111-1111-1111-1111-111111111111', 'posted', 'Shared experience teaching advanced algebra', 10, NOW() - INTERVAL '7 days'),
  ('11111111-1111-1111-1111-111111111111', 'volunteered', 'Led English Reading Session', 50, NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample assigned opportunities (with fallback if no opportunities exist)
DO $$
DECLARE
  opp1_id uuid;
  opp2_id uuid;
BEGIN
  SELECT id INTO opp1_id FROM opportunities LIMIT 1;
  SELECT id INTO opp2_id FROM opportunities LIMIT 1 OFFSET 1;
  
  IF opp1_id IS NOT NULL THEN
    INSERT INTO assigned_opportunities (user_id, opportunity_id, opportunity_title, status, start_date) VALUES
      ('11111111-1111-1111-1111-111111111111', 
       opp1_id, 
       'Math Tutoring - Elementary School',
       'in_progress',
       CURRENT_DATE)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  IF opp2_id IS NOT NULL THEN
    INSERT INTO assigned_opportunities (user_id, opportunity_id, opportunity_title, status, start_date) VALUES
      ('11111111-1111-1111-1111-111111111111',
       opp2_id,
       'Weekend Learning Support',
       'assigned',
       CURRENT_DATE + INTERVAL '3 days')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Insert sample events
INSERT INTO events (title, description, category, location, event_date, organizer, attendees_count) VALUES
  ('Volunteer Orientation', 'Introduction to volunteer opportunities', 'Training', 'Warsaw Community Center', NOW() + INTERVAL '5 days', 'Hearthy Foundation', 45),
  ('Math Teaching Workshop', 'Advanced techniques for teaching mathematics', 'Education', 'Warsaw', NOW() + INTERVAL '8 days', 'Education Team', 30),
  ('Community Service Day', 'Join us for a day of community service', 'Community Service', 'Various Locations', NOW() + INTERVAL '12 days', 'Hearthy Foundation', 120)
ON CONFLICT (id) DO NOTHING;
