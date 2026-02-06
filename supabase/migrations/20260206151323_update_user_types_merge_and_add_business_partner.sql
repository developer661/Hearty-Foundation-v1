/*
  # Update User Types - Merge Roles and Add Business Partner

  1. Changes
    - Merge 'care_facility' and 'foundation' user types into 'care_facility_ngo'
    - Add new 'business_partner' user type
    - Update existing records to use the new merged type
    - Update user_type check constraint to allow the new types

  2. User Types After Migration
    - 'volunteer' - Individual volunteers
    - 'care_facility_ngo' - Care Facilities and NGO Organisations (merged)
    - 'business_partner' - Business Partners (new)

  3. Security
    - Maintains existing RLS policies
    - No changes to access control
*/

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'user_type'
  ) THEN
    UPDATE user_profiles 
    SET user_type = 'care_facility_ngo' 
    WHERE user_type IN ('care_facility', 'foundation');

    ALTER TABLE user_profiles 
    DROP CONSTRAINT IF EXISTS user_profiles_user_type_check;

    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_type_check 
    CHECK (user_type IN ('volunteer', 'care_facility_ngo', 'business_partner'));
  END IF;
END $$;