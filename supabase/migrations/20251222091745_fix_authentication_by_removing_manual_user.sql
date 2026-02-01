/*
  # Fix Authentication by Removing Manually Created User
  
  1. Problem
    - The demo user was manually inserted into auth.users table
    - This causes "Database error querying schema" because the user is missing required auth.identities records
    - Supabase's auth system expects users to be created through proper auth API
    
  2. Solution
    - Delete the manually created user from auth.users
    - Clean up related records in user_profiles
    - Users will need to sign up through the proper signup flow
    
  3. Important Notes
    - Manual insertion into auth.users is NOT supported
    - Users must be created through Supabase's auth API (signUp method)
    - This will fix the login error immediately
*/

-- Delete the manually created user from auth tables
DELETE FROM auth.users WHERE email = 'anna.kowalska@example.com';

-- Keep the user profile for when they sign up properly
-- (The trigger will recreate it when they sign up)
DELETE FROM public.user_profiles WHERE email = 'anna.kowalska@example.com';
DELETE FROM public.user_activities WHERE user_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.assigned_opportunities WHERE user_id = '11111111-1111-1111-1111-111111111111';
