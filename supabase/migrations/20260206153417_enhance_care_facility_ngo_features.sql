/*
  # Enhance Care Facility/NGO Features

  1. Changes to care_facility_registrations
    - Add organisation_type field (NGO, Care Facility, Teacher, School, Other)
    - Add secondary_address field for optional secondary location
    - Add profile_photos field to store URLs of organisation photos
    - Add detailed_description for rich text content
    
  2. New Tables
    - `organisation_applications` - Track applications from people wanting to collaborate
    - `organisation_volunteers` - Track volunteers onboarded by organisations
    - `organisation_activities_log` - Track organisation activities for dashboard
    
  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for organisations to manage their data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'care_facility_registrations' 
    AND column_name = 'organisation_type'
  ) THEN
    ALTER TABLE care_facility_registrations 
    ADD COLUMN organisation_type text CHECK (organisation_type IN ('ngo_organisation', 'care_facility', 'teacher', 'school', 'other'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'care_facility_registrations' 
    AND column_name = 'secondary_address'
  ) THEN
    ALTER TABLE care_facility_registrations 
    ADD COLUMN secondary_address text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'care_facility_registrations' 
    AND column_name = 'profile_photos'
  ) THEN
    ALTER TABLE care_facility_registrations 
    ADD COLUMN profile_photos text[] DEFAULT '{}';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'care_facility_registrations' 
    AND column_name = 'detailed_description'
  ) THEN
    ALTER TABLE care_facility_registrations 
    ADD COLUMN detailed_description text;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS organisation_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  applicant_name text NOT NULL,
  applicant_email text NOT NULL,
  applicant_phone text,
  application_type text NOT NULL CHECK (application_type IN ('volunteer', 'partnership', 'collaboration', 'other')),
  message text,
  status text DEFAULT 'in_application' CHECK (status IN ('in_application', 'in_progress', 'completed', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organisation_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organisations can view own applications"
  ON organisation_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = organisation_id);

CREATE POLICY "Organisations can insert own applications"
  ON organisation_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organisation_id);

CREATE POLICY "Organisations can update own applications"
  ON organisation_applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = organisation_id)
  WITH CHECK (auth.uid() = organisation_id);

CREATE TABLE IF NOT EXISTS organisation_volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  volunteer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  volunteer_name text NOT NULL,
  volunteer_email text NOT NULL,
  volunteer_skills text[],
  onboarding_date date NOT NULL DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  hours_contributed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organisation_volunteers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organisations can view own volunteers"
  ON organisation_volunteers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = organisation_id);

CREATE POLICY "Organisations can insert own volunteers"
  ON organisation_volunteers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organisation_id);

CREATE POLICY "Organisations can update own volunteers"
  ON organisation_volunteers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = organisation_id)
  WITH CHECK (auth.uid() = organisation_id);

CREATE TABLE IF NOT EXISTS organisation_activities_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('application_received', 'volunteer_onboarded', 'event_created', 'update_posted', 'document_uploaded')),
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE organisation_activities_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organisations can view own activity logs"
  ON organisation_activities_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = organisation_id);

CREATE POLICY "Organisations can insert own activity logs"
  ON organisation_activities_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organisation_id);

CREATE INDEX IF NOT EXISTS idx_organisation_applications_org_id ON organisation_applications(organisation_id);
CREATE INDEX IF NOT EXISTS idx_organisation_applications_status ON organisation_applications(status);
CREATE INDEX IF NOT EXISTS idx_organisation_volunteers_org_id ON organisation_volunteers(organisation_id);
CREATE INDEX IF NOT EXISTS idx_organisation_volunteers_status ON organisation_volunteers(status);
CREATE INDEX IF NOT EXISTS idx_organisation_activities_org_id ON organisation_activities_log(organisation_id);
CREATE INDEX IF NOT EXISTS idx_organisation_activities_created_at ON organisation_activities_log(created_at DESC);