/*
  # Add user_type to profiles and update verification system

  1. Changes to user_profiles
    - Add user_type column to identify volunteer, care_facility_ngo, or business_partner
    - Update existing verification_status constraint
    - Add access_level field for access control
    
  2. New Tables
    - `idea_submissions` - Ideas submitted by users to Hearty Foundation
    - `business_partner_activities` - Track activities by business partners
    
  3. Security
    - Enable RLS on all new tables with appropriate policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'user_type'
  ) THEN
    ALTER TABLE user_profiles 
    ADD COLUMN user_type text DEFAULT 'volunteer' CHECK (user_type IN ('volunteer', 'care_facility_ngo', 'business_partner'));
  END IF;
END $$;

ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_verification_status_check;

UPDATE user_profiles 
SET verification_status = 'verified' 
WHERE verification_status IN ('verified_level_1', 'verified_level_2');

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_verification_status_check 
CHECK (verification_status IN ('not_verified', 'in_verification', 'verified', 'rejected'));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'access_level'
  ) THEN
    ALTER TABLE user_profiles 
    ADD COLUMN access_level text DEFAULT 'full_access' CHECK (access_level IN ('read_only', 'full_access'));
  END IF;
END $$;

UPDATE user_profiles 
SET access_level = 'full_access' 
WHERE user_type = 'volunteer';

CREATE TABLE IF NOT EXISTS idea_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE idea_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own idea submissions"
  ON idea_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own idea submissions"
  ON idea_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS business_partner_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('event_organized', 'activity_sponsored', 'donation', 'collaboration')),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  location text,
  participants_count integer DEFAULT 0,
  amount_contributed numeric(10, 2),
  status text DEFAULT 'completed' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE business_partner_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business partners can view own activities"
  ON business_partner_activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = business_partner_id);

CREATE POLICY "Business partners can insert own activities"
  ON business_partner_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = business_partner_id);

CREATE POLICY "Business partners can update own activities"
  ON business_partner_activities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = business_partner_id)
  WITH CHECK (auth.uid() = business_partner_id);

CREATE POLICY "All authenticated users can view completed activities"
  ON business_partner_activities
  FOR SELECT
  TO authenticated
  USING (status = 'completed');

CREATE INDEX IF NOT EXISTS idx_idea_submissions_user_id ON idea_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_idea_submissions_status ON idea_submissions(status);
CREATE INDEX IF NOT EXISTS idx_business_partner_activities_partner_id ON business_partner_activities(business_partner_id);
CREATE INDEX IF NOT EXISTS idx_business_partner_activities_date ON business_partner_activities(date DESC);