/*
  # Extend Opportunities Table and Add Category Interests Support

  ## Summary
  This migration extends the existing opportunities table with new fields required
  for the full Opportunity/Urgent Need creation workflow, adds Kamil's Law compliance
  tracking, and introduces standardized category interests to both user profiles and
  volunteer registrations for volunteer-to-opportunity matching.

  ## Changes to `opportunities` table
  1. `frequency` (text) - how often the opportunity recurs (e.g., Weekly, Monthly, One-time)
  2. `volunteers_required` (integer) - number of volunteers needed
  3. `activity_duration` (text) - duration per session (e.g., 2 hours, Half day)
  4. `organization_owner_id` (uuid) - references user_profiles(id), the creating organization
  5. `required_documentation` (text) - documents volunteers must provide
  6. `kamils_law_required` (boolean) - whether Polish Kamil's Law compliance docs are required (child safety)
  7. `shared_meals` (boolean) - whether meals/refreshments are provided to volunteers
  8. `friendly_environment` (boolean) - indicator of volunteer-friendly environment
  9. `certificate_available` (boolean) - whether a participation certificate is issued
  10. `volunteer_benefits` (text) - other benefits described for volunteers
  11. `additional_notes` (text) - extra instructions or information
  12. `tags` (text[]) - keyword tags for matching with volunteer interests

  ## Changes to `user_profiles` table
  - `category_interests` (text[]) - standardized interest categories selected by volunteer

  ## Changes to `volunteer_registrations` table
  - `category_interests` (text[]) - standardized interest categories captured at registration

  ## Security
  - Adds INSERT policy on opportunities for anon + authenticated roles (app uses mock auth with anon key)
  - Adds UPDATE policy on opportunities for anon + authenticated roles
*/

-- Extend opportunities table
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS frequency text;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS volunteers_required integer;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS activity_duration text;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS organization_owner_id uuid;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS required_documentation text;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS kamils_law_required boolean DEFAULT false;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS shared_meals boolean DEFAULT false;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS friendly_environment boolean DEFAULT false;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS certificate_available boolean DEFAULT false;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS volunteer_benefits text;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS additional_notes text;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add category interests to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS category_interests text[] DEFAULT '{}';

-- Add category interests to volunteer_registrations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'volunteer_registrations' AND column_name = 'category_interests'
  ) THEN
    ALTER TABLE volunteer_registrations ADD COLUMN category_interests text[] DEFAULT '{}';
  END IF;
END $$;

-- Add INSERT policy for opportunities (app uses anon key via mock auth)
DROP POLICY IF EXISTS "Allow insert opportunities" ON opportunities;
CREATE POLICY "Allow insert opportunities" ON opportunities FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Add UPDATE policy for opportunities
DROP POLICY IF EXISTS "Allow update opportunities" ON opportunities;
CREATE POLICY "Allow update opportunities" ON opportunities FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Add index for faster matching queries
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_kamils_law ON opportunities(kamils_law_required);
CREATE INDEX IF NOT EXISTS idx_opportunities_owner ON opportunities(organization_owner_id);
