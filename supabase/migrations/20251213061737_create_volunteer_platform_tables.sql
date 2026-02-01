/*
  # Create Volunteer Platform Tables

  1. New Tables
    - `volunteers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `location` (text)
      - `interest` (text)
      - `message` (text, nullable)
      - `created_at` (timestamptz)
      
    - `volunteer_registrations`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `date_of_birth` (date)
      - `profession` (text)
      - `experience` (text, nullable)
      - `motivation` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      
    - `volunteer_availability`
      - `id` (uuid, primary key)
      - `registration_id` (uuid, foreign key)
      - `day_of_week` (text)
      - `start_time` (time)
      - `end_time` (time)
      - `duration_weeks` (integer)
      - `hours_per_week` (integer)
      - `created_at` (timestamptz)
      
    - `registration_documents`
      - `id` (uuid, primary key)
      - `registration_id` (uuid, foreign key)
      - `document_type` (text)
      - `file_name` (text)
      - `file_url` (text)
      - `file_size` (bigint)
      - `validation_status` (text)
      - `created_at` (timestamptz)
      
    - `contact_requests`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text, nullable)
      - `message` (text, nullable)
      - `status` (text)
      - `created_at` (timestamptz)
      
    - `opportunities`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `institution_name` (text)
      - `location` (text)
      - `urgency` (text)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (volunteers and opportunities)
    - Add policies for authenticated insert access
*/

CREATE TABLE IF NOT EXISTS volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  interest text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS volunteer_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  date_of_birth date NOT NULL,
  profession text NOT NULL,
  experience text,
  motivation text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS volunteer_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES volunteer_registrations(id) ON DELETE CASCADE,
  day_of_week text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration_weeks integer DEFAULT 12,
  hours_per_week integer DEFAULT 2,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS registration_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES volunteer_registrations(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_url text DEFAULT '',
  file_size bigint DEFAULT 0,
  validation_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  institution_name text NOT NULL,
  location text NOT NULL,
  urgency text DEFAULT 'ongoing',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view volunteers"
  ON volunteers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can register as volunteer"
  ON volunteers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can create volunteer registration"
  ON volunteer_registrations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can add availability"
  ON volunteer_availability FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can upload documents"
  ON registration_documents FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can submit contact requests"
  ON contact_requests FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view opportunities"
  ON opportunities FOR SELECT
  TO public
  USING (true);
