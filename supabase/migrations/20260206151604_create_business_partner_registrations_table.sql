/*
  # Create Business Partner Registrations Table

  1. New Tables
    - `business_partner_registrations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `company_name` (text) - Name of the business
      - `date_of_establishment` (date) - When the company was established
      - `business_profile` (text) - Description of the business
      - `address` (text) - Company address
      - `nip` (text) - Tax ID number
      - `contact_person` (text) - Name of contact person
      - `phone` (text) - Contact phone number
      - `email` (text) - Contact email
      - `status` (text) - Registration status (pending, approved, rejected)
      - `created_at` (timestamptz) - When the registration was created
      - `updated_at` (timestamptz) - When the registration was last updated

  2. Security
    - Enable RLS on `business_partner_registrations` table
    - Add policy for business partners to view their own registration
    - Add policy for authenticated users to insert their own registration
*/

CREATE TABLE IF NOT EXISTS business_partner_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  date_of_establishment date NOT NULL,
  business_profile text NOT NULL,
  address text NOT NULL,
  nip text NOT NULL,
  contact_person text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE business_partner_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own business partner registration"
  ON business_partner_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business partner registration"
  ON business_partner_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_business_partner_registrations_user_id 
  ON business_partner_registrations(user_id);

CREATE INDEX IF NOT EXISTS idx_business_partner_registrations_status 
  ON business_partner_registrations(status);