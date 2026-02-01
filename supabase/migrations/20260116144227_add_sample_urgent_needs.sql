/*
  # Add Sample Urgent Needs Data

  1. Purpose
    - Populate the opportunities table with sample urgent needs
    - These will be displayed on the main page in the Urgent Needs section
    - Synchronized with the dashboard's urgent needs display

  2. Data Added
    - 10 sample urgent opportunities with urgency='urgent'
    - Various categories: Healthcare, Education, Community, Food & Nutrition
    - Different locations across Poland
    - Active status for immediate display

  3. Notes
    - Uses INSERT with ON CONFLICT DO NOTHING for idempotency
    - All opportunities marked as 'urgent' and 'active'
*/

INSERT INTO opportunities (id, title, description, category, institution_name, location, urgency, status, created_at)
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Medical Supplies Needed for Children''s Hospital',
    'Urgent need for medical supplies including bandages, first aid kits, and basic medications for pediatric ward.',
    'Healthcare',
    'Warsaw Children''s Hospital',
    'Warsaw, Mazovia',
    'urgent',
    'active',
    now() - interval '2 hours'
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Educational Materials for Orphanage',
    'Books, school supplies, and learning materials urgently needed for 50 children preparing for school year.',
    'Education',
    'Sunshine Orphanage',
    'Kraków, Lesser Poland',
    'urgent',
    'active',
    now() - interval '1 day'
  ),
  (
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'Winter Clothing for Homeless Shelter',
    'Cold weather approaching. Need warm clothes, blankets, and winter boots for 100+ residents.',
    'Community Support',
    'Hope Homeless Shelter',
    'Gdańsk, Pomerania',
    'urgent',
    'active',
    now() - interval '3 hours'
  ),
  (
    'd4e5f6a7-b8c9-0123-def1-234567890123',
    'Food Donations for Community Kitchen',
    'Weekly food supplies running low. Need non-perishable items to serve 200 families.',
    'Food & Nutrition',
    'St. Michael Community Kitchen',
    'Wrocław, Lower Silesia',
    'urgent',
    'active',
    now() - interval '5 hours'
  ),
  (
    'e5f6a7b8-c9d0-1234-ef12-345678901234',
    'Volunteers Needed for After-School Program',
    'Immediate need for tutors and mentors for disadvantaged youth after-school program.',
    'Education',
    'Youth Opportunity Center',
    'Poznań, Greater Poland',
    'urgent',
    'active',
    now() - interval '6 hours'
  ),
  (
    'f6a7b8c9-d0e1-2345-f123-456789012345',
    'Emergency Housing Support Required',
    'Families displaced by recent fire need temporary housing assistance and basic necessities.',
    'Community Support',
    'Red Cross Poland',
    'Łódź, Łódź Voivodeship',
    'urgent',
    'active',
    now() - interval '4 hours'
  ),
  (
    'a7b8c9d0-e1f2-3456-1234-567890123456',
    'Medical Equipment for Elderly Care',
    'Wheelchairs, walkers, and mobility aids urgently needed for elderly care facility.',
    'Healthcare',
    'Golden Years Nursing Home',
    'Szczecin, West Pomerania',
    'urgent',
    'active',
    now() - interval '8 hours'
  ),
  (
    'b8c9d0e1-f2a3-4567-2345-678901234567',
    'School Lunch Program Funding Crisis',
    'Program at risk of closing. Need support to continue providing meals to 300 children daily.',
    'Food & Nutrition',
    'Happy Meals Foundation',
    'Katowice, Silesia',
    'urgent',
    'active',
    now() - interval '12 hours'
  ),
  (
    'c9d0e1f2-a3b4-5678-3456-789012345678',
    'Mental Health Support for Youth',
    'Counselors and therapists needed for youth mental health crisis intervention program.',
    'Healthcare',
    'Mind Matters Youth Center',
    'Bydgoszcz, Kuyavia-Pomerania',
    'urgent',
    'active',
    now() - interval '10 hours'
  ),
  (
    'd0e1f2a3-b4c5-6789-4567-890123456789',
    'Emergency Repairs for Community Center',
    'Roof damage threatens to close community center serving 500+ families. Need immediate repairs.',
    'Community Support',
    'Neighborhood Community Hub',
    'Lublin, Lublin Voivodeship',
    'urgent',
    'active',
    now() - interval '7 hours'
  )
ON CONFLICT (id) DO NOTHING;
