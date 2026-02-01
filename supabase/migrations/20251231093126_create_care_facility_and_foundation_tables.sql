/*
  # Create Care Facility and Foundation Registration Tables

  1. New Tables
    - `care_facility_registrations`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the care facility
      - `date_of_establishment` (date) - When the facility was established
      - `business_profile` (text) - Description of business activities
      - `address` (text) - Full address
      - `krs` (text) - KRS number (Polish court register number)
      - `email` (text, unique) - Login email
      - `password_hash` (text) - Hashed password
      - `status` (text) - pending, approved, rejected
      - `created_at` (timestamptz)
      
    - `care_facility_documents`
      - `id` (uuid, primary key)
      - `registration_id` (uuid, foreign key to care_facility_registrations)
      - `document_type` (text) - KRS, decision, certificate, etc.
      - `file_name` (text)
      - `file_url` (text)
      - `file_size` (bigint)
      - `created_at` (timestamptz)
      
    - `foundation_registrations`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the foundation/NGO
      - `date_of_establishment` (date) - When the organization was established
      - `business_profile` (text) - Description of activities
      - `address` (text) - Full address
      - `krs` (text) - KRS number
      - `email` (text, unique) - Login email
      - `password_hash` (text) - Hashed password
      - `status` (text) - pending, approved, rejected
      - `created_at` (timestamptz)
      
    - `foundation_documents`
      - `id` (uuid, primary key)
      - `registration_id` (uuid, foreign key to foundation_registrations)
      - `document_type` (text) - KRS, decision, statute, etc.
      - `file_name` (text)
      - `file_url` (text)
      - `file_size` (bigint)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public insert (for registration)
    - Add policies for authenticated users to view their own data
*/

CREATE TABLE IF NOT EXISTS care_facility_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date_of_establishment date NOT NULL,
  business_profile text NOT NULL,
  address text NOT NULL,
  krs text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS care_facility_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES care_facility_registrations(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_url text DEFAULT '',
  file_size bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS foundation_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date_of_establishment date NOT NULL,
  business_profile text NOT NULL,
  address text NOT NULL,
  krs text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS foundation_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES foundation_registrations(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_url text DEFAULT '',
  file_size bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE care_facility_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_facility_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create care facility registration"
  ON care_facility_registrations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own care facility registration"
  ON care_facility_registrations FOR SELECT
  TO authenticated
  USING (email = current_user);

CREATE POLICY "Anyone can upload care facility documents"
  ON care_facility_documents FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their care facility documents"
  ON care_facility_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM care_facility_registrations
      WHERE care_facility_registrations.id = care_facility_documents.registration_id
      AND care_facility_registrations.email = current_user
    )
  );

CREATE POLICY "Anyone can create foundation registration"
  ON foundation_registrations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own foundation registration"
  ON foundation_registrations FOR SELECT
  TO authenticated
  USING (email = current_user);

CREATE POLICY "Anyone can upload foundation documents"
  ON foundation_documents FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their foundation documents"
  ON foundation_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM foundation_registrations
      WHERE foundation_registrations.id = foundation_documents.registration_id
      AND foundation_registrations.email = current_user
    )
  );

CREATE INDEX IF NOT EXISTS idx_care_facility_email ON care_facility_registrations(email);
CREATE INDEX IF NOT EXISTS idx_care_facility_status ON care_facility_registrations(status);
CREATE INDEX IF NOT EXISTS idx_foundation_email ON foundation_registrations(email);
CREATE INDEX IF NOT EXISTS idx_foundation_status ON foundation_registrations(status);
