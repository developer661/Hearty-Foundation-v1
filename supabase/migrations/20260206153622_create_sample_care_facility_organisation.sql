/*
  # Create Sample Care Facility Organisation

  1. Creates a verified Care Facility demo account
    - Organisation: "Sunshine Children's Home"
    - Type: care_facility
    - Status: verified with full_access
    - Complete profile with photos and detailed description
    
  2. Adds sample data
    - Applications from people wanting to collaborate
    - Volunteers onboarded
    - Activity logs
*/

DO $$
DECLARE
  user_uuid uuid := '66666666-6666-6666-6666-666666666666';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_uuid) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin
    ) VALUES (
      user_uuid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'sunshine@example.com',
      crypt('sunshine123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{}',
      '{"full_name": "Sunshine Children''s Home"}',
      false
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = user_uuid) THEN
    INSERT INTO public.user_profiles (
      id,
      user_id,
      email,
      full_name,
      user_type,
      location,
      bio,
      verification_status,
      access_level,
      points,
      skills,
      interests
    ) VALUES (
      user_uuid,
      user_uuid,
      'sunshine@example.com',
      'Sunshine Children''s Home',
      'care_facility_ngo',
      'Krakow, Poland',
      'A warm and caring home providing shelter, education, and emotional support for children in need.',
      'verified',
      'full_access',
      2500,
      ARRAY['Child Care', 'Education', 'Social Work'],
      ARRAY['Children Welfare', 'Education', 'Community Support']
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.care_facility_registrations WHERE email = 'sunshine@example.com') THEN
    INSERT INTO public.care_facility_registrations (
      organisation_type,
      name,
      date_of_establishment,
      business_profile,
      detailed_description,
      address,
      secondary_address,
      krs,
      email,
      password_hash,
      status
    ) VALUES (
      'care_facility',
      'Sunshine Children''s Home',
      '2010-05-20',
      'A warm and caring home providing shelter, education, and emotional support for children in need.',
      'Sunshine Children''s Home is a registered care facility dedicated to providing a safe, nurturing environment for children aged 3-18 who cannot live with their biological families. Our mission is to help each child develop their full potential through quality education, emotional support, and life skills training.

Our Operating Model:
- 24/7 residential care with trained caregivers
- Individual education plans tailored to each child
- Psychological and therapeutic support
- After-school activities and skill development programs
- Family integration support when possible
- Preparation for independent living for older children

We currently care for 35 children and employ 12 full-time staff members plus regular volunteers. Our facility includes dormitories, a dining hall, study rooms, a playground, and therapy rooms.',
      'ul. Słoneczna 15, 31-000 Krakow, Poland',
      'ul. Kwiatowa 8, 31-001 Krakow, Poland (Administrative Office)',
      '0001234567',
      'sunshine@example.com',
      'hashed_password_placeholder',
      'approved'
    );
  END IF;

  DELETE FROM public.organisation_applications WHERE organisation_id = user_uuid;
  
  INSERT INTO public.organisation_applications (
    organisation_id,
    applicant_name,
    applicant_email,
    applicant_phone,
    application_type,
    message,
    status
  ) VALUES 
  (
    user_uuid,
    'Maria Kowalska',
    'maria.k@example.com',
    '+48 500 100 200',
    'volunteer',
    'I would like to help with tutoring mathematics and English.',
    'in_progress'
  ),
  (
    user_uuid,
    'Jan Nowak',
    'jan.n@example.com',
    '+48 600 200 300',
    'volunteer',
    'Interested in organizing sports activities for children.',
    'in_application'
  ),
  (
    user_uuid,
    'Tech Company Ltd',
    'contact@techco.example.com',
    '+48 22 333 4444',
    'partnership',
    'We would like to sponsor computer equipment and coding classes.',
    'in_progress'
  ),
  (
    user_uuid,
    'Anna Wiśniewska',
    'anna.w@example.com',
    '+48 700 400 500',
    'volunteer',
    'Art therapy and creative workshops for children.',
    'completed'
  ),
  (
    user_uuid,
    'Local Library',
    'library@example.com',
    '+48 12 555 6666',
    'collaboration',
    'Partnership for reading programs and library access.',
    'completed'
  );

  DELETE FROM public.organisation_volunteers WHERE organisation_id = user_uuid;

  INSERT INTO public.organisation_volunteers (
    organisation_id,
    volunteer_name,
    volunteer_email,
    volunteer_skills,
    onboarding_date,
    status,
    hours_contributed
  ) VALUES
  (
    user_uuid,
    'Piotr Zieliński',
    'piotr.z@example.com',
    ARRAY['Teaching', 'Math', 'Physics'],
    '2024-09-01',
    'active',
    120
  ),
  (
    user_uuid,
    'Katarzyna Lewandowska',
    'katarzyna.l@example.com',
    ARRAY['Art', 'Crafts', 'Music'],
    '2024-10-15',
    'active',
    80
  ),
  (
    user_uuid,
    'Tomasz Nowicki',
    'tomasz.n@example.com',
    ARRAY['Sports', 'Football', 'Coaching'],
    '2024-08-01',
    'active',
    150
  ),
  (
    user_uuid,
    'Agnieszka Kowalczyk',
    'agnieszka.k@example.com',
    ARRAY['Psychology', 'Counseling'],
    '2024-07-01',
    'active',
    200
  ),
  (
    user_uuid,
    'Michał Dąbrowski',
    'michal.d@example.com',
    ARRAY['IT', 'Computer Skills'],
    '2024-06-01',
    'completed',
    95
  );

  DELETE FROM public.organisation_activities_log WHERE organisation_id = user_uuid;

  INSERT INTO public.organisation_activities_log (
    organisation_id,
    activity_type,
    description,
    metadata
  ) VALUES
  (
    user_uuid,
    'volunteer_onboarded',
    'Piotr Zieliński joined as a volunteer tutor',
    '{"volunteer_name": "Piotr Zieliński", "role": "Tutor"}'
  ),
  (
    user_uuid,
    'application_received',
    'New partnership application from Tech Company Ltd',
    '{"applicant": "Tech Company Ltd", "type": "partnership"}'
  ),
  (
    user_uuid,
    'volunteer_onboarded',
    'Katarzyna Lewandowska joined as an art instructor',
    '{"volunteer_name": "Katarzyna Lewandowska", "role": "Art Instructor"}'
  ),
  (
    user_uuid,
    'event_created',
    'Organized Christmas celebration event',
    '{"event": "Christmas Celebration", "participants": 45}'
  ),
  (
    user_uuid,
    'application_received',
    'New volunteer application from Maria Kowalska',
    '{"applicant": "Maria Kowalska", "type": "volunteer"}'
  );

END $$;