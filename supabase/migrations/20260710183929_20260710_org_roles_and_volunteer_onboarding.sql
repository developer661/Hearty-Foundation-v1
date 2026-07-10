/*
  # Organization Roles, Permissions, and Volunteer Onboarding

  ## Summary
  This migration introduces a role-based access control system for organization accounts
  and an automated onboarding package system for verified volunteers.

  ## 1. Changes to `user_profiles` table
  - `org_role` (text, nullable) — Role within an organization: 'org_admin' | 'opportunity_manager' | null
    - 'org_admin': Full access to organization settings, user management, and all opportunity operations
    - 'opportunity_manager': Can create, edit, publish opportunities and manage applications
    - null: Standard volunteer account (no org role)
  - `organization_id` (uuid, nullable) — References the parent organization's user_profiles.id.
    Set only for sub-users added to an organization by an org admin. The primary org account has this null.

  ## 2. New table: `onboarding_templates`
  Stores configurable onboarding content that org admins can customize.
  - `id` (uuid, primary key)
  - `organization_id` (uuid, nullable) — null = global default template; uuid = org-specific template
  - `title` (text) — Template name/title shown to volunteer
  - `welcome_message` (text) — Personalized welcome text
  - `instructions` (text) — General platform usage instructions
  - `prep_steps` (text[]) — Ordered list of preparation steps for the volunteer
  - `contact_info` (text) — Contact details for questions
  - `event_guidance` (text) — Guidance about upcoming events and orientations
  - `training_materials` (text) — Links or descriptions of training resources
  - `additional_info` (text) — Any extra information
  - `is_active` (boolean) — Whether this template is currently in use
  - `created_at`, `updated_at` (timestamps)

  ## 3. New table: `volunteer_onboarding_reads`
  Tracks which volunteers have seen and dismissed the onboarding package.
  - `id` (uuid, primary key)
  - `volunteer_id` (uuid) — References user_profiles.id
  - `template_id` (uuid, nullable) — References onboarding_templates.id
  - `viewed_at` (timestamp) — When the volunteer first saw the package
  - `dismissed_at` (timestamp, nullable) — When the volunteer dismissed/read the package

  ## 4. Security
  - RLS enabled on both new tables
  - anon + authenticated can read/write (consistent with app's mock auth using anon key)

  ## 5. Seed data
  - Updates existing demo org users (care facility + business partner) to have org_role = 'org_admin'
  - Inserts a default global onboarding template
*/

-- Add org_role and organization_id to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS org_role text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS organization_id uuid;

-- Set existing org demo users as org_admin
UPDATE user_profiles
SET org_role = 'org_admin'
WHERE user_type IN ('care_facility_ngo', 'business_partner')
  AND org_role IS NULL;

-- Create onboarding_templates table
CREATE TABLE IF NOT EXISTS onboarding_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Welcome to the Volunteer Network',
  welcome_message text NOT NULL DEFAULT 'Welcome to the Hearty Foundation Volunteer Network! We are thrilled to have you join our community of dedicated volunteers making a real difference in children''s lives.',
  instructions text NOT NULL DEFAULT 'Our platform connects volunteers with care facilities, NGOs, and business partners. Browse available opportunities, apply for roles that match your skills and interests, and track your impact through your personal dashboard.',
  prep_steps text[] NOT NULL DEFAULT ARRAY[
    'Complete your volunteer profile with your skills and interests',
    'Browse the opportunities page and identify roles that suit you',
    'Apply for one or more opportunities using the Apply button',
    'Wait for approval notification from the organization',
    'Attend the orientation session scheduled by your organization',
    'Begin your volunteer activities and log your hours'
  ],
  contact_info text NOT NULL DEFAULT 'For questions or support, contact us at: contact@hearthy.org | Phone: +48 123 456 789 | Office hours: Mon–Fri 9:00–17:00',
  event_guidance text NOT NULL DEFAULT 'Check the Upcoming Events section in your dashboard for scheduled orientation sessions, training workshops, and volunteer meetups. New volunteers are encouraged to attend the monthly orientation.',
  training_materials text NOT NULL DEFAULT 'Training resources are available in your profile Documents section. Required materials include: Volunteer Code of Conduct, Child Safeguarding Policy, and role-specific training guides.',
  additional_info text DEFAULT 'If you require documentation for Kamil''s Law compliance (working with children), please upload the required documents in your profile before applying to restricted opportunities.',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE onboarding_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_onboarding_templates" ON onboarding_templates;
CREATE POLICY "select_onboarding_templates" ON onboarding_templates FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_onboarding_templates" ON onboarding_templates;
CREATE POLICY "insert_onboarding_templates" ON onboarding_templates FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_onboarding_templates" ON onboarding_templates;
CREATE POLICY "update_onboarding_templates" ON onboarding_templates FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Create volunteer_onboarding_reads table
CREATE TABLE IF NOT EXISTS volunteer_onboarding_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  template_id uuid REFERENCES onboarding_templates(id) ON DELETE SET NULL,
  viewed_at timestamptz DEFAULT now(),
  dismissed_at timestamptz,
  UNIQUE(volunteer_id)
);

ALTER TABLE volunteer_onboarding_reads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_onboarding_reads" ON volunteer_onboarding_reads;
CREATE POLICY "select_onboarding_reads" ON volunteer_onboarding_reads FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_onboarding_reads" ON volunteer_onboarding_reads;
CREATE POLICY "insert_onboarding_reads" ON volunteer_onboarding_reads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_onboarding_reads" ON volunteer_onboarding_reads;
CREATE POLICY "update_onboarding_reads" ON volunteer_onboarding_reads FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Insert global default onboarding template (organization_id = null means global default)
INSERT INTO onboarding_templates (
  organization_id, title, welcome_message, instructions, prep_steps,
  contact_info, event_guidance, training_materials, additional_info, is_active
)
SELECT
  NULL,
  'Welcome to the Hearty Foundation',
  'Welcome to the Hearty Foundation Volunteer Network! We are thrilled to have you join our community of dedicated volunteers making a real difference in children''s lives. Your verification has been completed and you now have full access to all volunteer opportunities.',
  'Our platform connects verified volunteers with care facilities, NGOs, and business partners across Poland. You can browse available opportunities, apply for roles that match your skills and interests, track your volunteer hours, and build a meaningful portfolio of community service.',
  ARRAY[
    'Review and update your volunteer profile — add your skills, interests, and a personal bio',
    'Browse the Opportunities page and filter by your selected category interests',
    'Apply for one or more opportunities using the Apply Now button',
    'Wait for approval notification from the host organization (usually within 3–5 business days)',
    'Attend the orientation session scheduled by your assigned organization',
    'Begin your volunteer activities and log your participation hours',
    'Collect your participation certificate after completing 20+ hours'
  ],
  'For questions or support contact us at: contact@hearthy.org | Phone: +48 123 456 789 | Office hours: Monday–Friday 9:00–17:00 CET. For urgent matters related to child safeguarding, contact our child protection officer directly.',
  'Check the Upcoming Events section in your dashboard for orientation sessions, training workshops, and volunteer meetups. All new volunteers are strongly encouraged to attend the monthly Welcome Orientation held on the first Saturday of each month at 10:00 AM.',
  'Required reading before your first assignment: (1) Volunteer Code of Conduct — available in your Documents section. (2) Child Safeguarding Policy. (3) Role-specific training guides provided by your host organization. All materials are downloadable from your profile.',
  'If you will be working with children, you must upload Kamil''s Law compliance documentation (criminal background check + child protection training certificate) before applying to restricted opportunities. Contact us if you need guidance on obtaining these documents.',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM onboarding_templates WHERE organization_id IS NULL AND is_active = true
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_org_role ON user_profiles(org_role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization_id ON user_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_reads_volunteer ON volunteer_onboarding_reads(volunteer_id);
