/*
  # Create Volunteer-Business Partner Relationships

  ## Purpose
  This migration establishes the relationship between volunteers and business partners,
  allowing business partners to manage teams of volunteers.

  ## New Tables
  
  1. `volunteer_business_partner_relations`
    - Manages the relationship between volunteers and business partners
    - Tracks status (invited, pending, active, released)
    - Records join date and relationship metadata
    - Supports both business partner invitations and volunteer self-assignment

  ## Columns
    - `id` (uuid, primary key) - Unique identifier
    - `volunteer_id` (uuid, foreign key to user_profiles) - The volunteer user
    - `business_partner_id` (uuid, foreign key to user_profiles) - The business partner
    - `status` (text) - Relationship status: invited, pending, active, released
    - `invitation_type` (text) - How the relationship started: partner_invite, volunteer_request
    - `joined_at` (timestamptz) - When the relationship became active
    - `released_at` (timestamptz, nullable) - When the volunteer was released
    - `notes` (text, nullable) - Business partner notes about the volunteer
    - `created_at` (timestamptz) - Record creation time
    - `updated_at` (timestamptz) - Last update time

  ## Security
    - Enable RLS on the table
    - Business partners can view and manage their volunteer relationships
    - Volunteers can view their own relationships
    - Volunteers can create pending relationships (self-assignment requests)
*/

-- Create the volunteer-business partner relations table
CREATE TABLE IF NOT EXISTS volunteer_business_partner_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  business_partner_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('invited', 'pending', 'active', 'released')),
  invitation_type text NOT NULL CHECK (invitation_type IN ('partner_invite', 'volunteer_request')),
  joined_at timestamptz,
  released_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(volunteer_id, business_partner_id, status)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vbp_relations_volunteer ON volunteer_business_partner_relations(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_vbp_relations_partner ON volunteer_business_partner_relations(business_partner_id);
CREATE INDEX IF NOT EXISTS idx_vbp_relations_status ON volunteer_business_partner_relations(status);

-- Enable RLS
ALTER TABLE volunteer_business_partner_relations ENABLE ROW LEVEL SECURITY;

-- Policy: Business partners can view all their volunteer relationships
CREATE POLICY "Business partners can view their volunteer relationships"
  ON volunteer_business_partner_relations
  FOR SELECT
  TO authenticated
  USING (
    business_partner_id IN (
      SELECT id FROM user_profiles WHERE user_id = auth.uid() AND user_type = 'business_partner'
    )
  );

-- Policy: Volunteers can view their own relationships
CREATE POLICY "Volunteers can view their own relationships"
  ON volunteer_business_partner_relations
  FOR SELECT
  TO authenticated
  USING (
    volunteer_id IN (
      SELECT id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

-- Policy: Volunteers can create pending relationships (self-assignment requests)
CREATE POLICY "Volunteers can request to join business partners"
  ON volunteer_business_partner_relations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    volunteer_id IN (
      SELECT id FROM user_profiles WHERE user_id = auth.uid()
    )
    AND status = 'pending'
    AND invitation_type = 'volunteer_request'
  );

-- Policy: Business partners can insert volunteer relationships (invitations)
CREATE POLICY "Business partners can invite volunteers"
  ON volunteer_business_partner_relations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    business_partner_id IN (
      SELECT id FROM user_profiles WHERE user_id = auth.uid() AND user_type = 'business_partner'
    )
  );

-- Policy: Business partners can update their volunteer relationships
CREATE POLICY "Business partners can update volunteer relationships"
  ON volunteer_business_partner_relations
  FOR UPDATE
  TO authenticated
  USING (
    business_partner_id IN (
      SELECT id FROM user_profiles WHERE user_id = auth.uid() AND user_type = 'business_partner'
    )
  )
  WITH CHECK (
    business_partner_id IN (
      SELECT id FROM user_profiles WHERE user_id = auth.uid() AND user_type = 'business_partner'
    )
  );

-- Policy: Volunteers can update their own pending requests (to cancel them)
CREATE POLICY "Volunteers can update their pending requests"
  ON volunteer_business_partner_relations
  FOR UPDATE
  TO authenticated
  USING (
    volunteer_id IN (
      SELECT id FROM user_profiles WHERE user_id = auth.uid()
    )
    AND status = 'pending'
    AND invitation_type = 'volunteer_request'
  )
  WITH CHECK (
    volunteer_id IN (
      SELECT id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_volunteer_bp_relations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_volunteer_bp_relations_updated_at_trigger ON volunteer_business_partner_relations;
CREATE TRIGGER update_volunteer_bp_relations_updated_at_trigger
  BEFORE UPDATE ON volunteer_business_partner_relations
  FOR EACH ROW
  EXECUTE FUNCTION update_volunteer_bp_relations_updated_at();
