/*
  # Create Verified Business Partner Example

  1. Creates a demo business partner account
    - Company: "Sponsoring Company"
    - Status: verified with full_access
    - Complete profile with contact information
    
  2. Adds activity history
    - Multiple events organized
    - Sponsorships and collaborations
    - Donations and community activities
*/

DO $$
DECLARE
  user_uuid uuid := '55555555-5555-5555-5555-555555555555';
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
      'sponsor@example.com',
      crypt('sponsor123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{}',
      '{"full_name": "Sponsoring Company"}',
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
      'sponsor@example.com',
      'Sponsoring Company',
      'business_partner',
      'Warsaw, Poland',
      'Leading corporate sponsor dedicated to supporting children in care facilities through educational programs, sports activities, and cultural events. We believe in creating opportunities for every child to reach their full potential.',
      'verified',
      'full_access',
      1500,
      ARRAY['Corporate Sponsorship', 'Event Organization', 'Community Engagement'],
      ARRAY['Children Education', 'Sports Programs', 'Cultural Activities']
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.business_partner_registrations WHERE user_id = user_uuid) THEN
    INSERT INTO public.business_partner_registrations (
      user_id,
      company_name,
      date_of_establishment,
      business_profile,
      address,
      nip,
      contact_person,
      phone,
      email,
      status
    ) VALUES (
      user_uuid,
      'Sponsoring Company',
      '2015-03-15',
      'Leading corporate sponsor dedicated to supporting children in care facilities through educational programs, sports activities, and cultural events.',
      'ul. Marszałkowska 142, 00-061 Warsaw, Poland',
      '1234567890',
      'Jan Kowalski',
      '+48 22 123 4567',
      'sponsor@example.com',
      'approved'
    );
  END IF;

  DELETE FROM public.business_partner_activities WHERE business_partner_id = user_uuid;

  INSERT INTO public.business_partner_activities (
    business_partner_id,
    activity_type,
    title,
    description,
    date,
    location,
    participants_count,
    amount_contributed,
    status
  ) VALUES 
  (
    user_uuid,
    'event_organized',
    'Summer Sports Camp 2024',
    'Organized a week-long sports camp for 50 children from local care facilities, including swimming, football, and basketball activities.',
    '2024-07-15',
    'Warsaw Sports Complex',
    50,
    15000.00,
    'completed'
  ),
  (
    user_uuid,
    'activity_sponsored',
    'Art Therapy Workshops',
    'Sponsored monthly art therapy sessions for children, providing art supplies and professional instructors.',
    '2024-09-01',
    'Community Art Center',
    30,
    8000.00,
    'completed'
  ),
  (
    user_uuid,
    'donation',
    'School Supplies Drive',
    'Donated comprehensive school supplies packages to 100 children at the start of the school year.',
    '2024-09-01',
    'Multiple Care Facilities',
    100,
    12000.00,
    'completed'
  ),
  (
    user_uuid,
    'collaboration',
    'Career Mentorship Program',
    'Launched a career mentorship program connecting older children with professionals from various industries.',
    '2024-10-01',
    'Company Headquarters',
    25,
    5000.00,
    'completed'
  ),
  (
    user_uuid,
    'event_organized',
    'Winter Holiday Festival',
    'Organized a festive celebration with gifts, entertainment, and special meals for children during the holiday season.',
    '2024-12-20',
    'Warsaw Community Center',
    80,
    20000.00,
    'completed'
  ),
  (
    user_uuid,
    'activity_sponsored',
    'Music Education Program',
    'Ongoing sponsorship of music lessons and instrument rentals for musically talented children.',
    '2025-01-15',
    'Music School',
    15,
    10000.00,
    'ongoing'
  ),
  (
    user_uuid,
    'event_organized',
    'Spring Sports Tournament',
    'Planning a city-wide sports tournament for children from all participating care facilities.',
    '2025-04-20',
    'National Stadium',
    150,
    25000.00,
    'planned'
  );
  
END $$;