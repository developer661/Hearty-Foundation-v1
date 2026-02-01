/*
  # Add Verification Status System

  1. Changes
    - Add `verification_status` column to `user_profiles` table
    - Add `user_id` column to link with auth.users
    - Set default status to 'not_verified' for new users
    - Update demo user to 'verified_level_1' status
    
  2. Verification Levels
    - not_verified: Read-only access, can view but not interact
    - verified_level_1: Basic verified access, can interact but cannot work with children
    - verified_level_2: Full access with child-work documents verified
    
  3. Notes
    - Existing users will be set to 'not_verified' by default
    - Demo user will be upgraded to 'verified_level_1'
*/

-- Add user_id column to link with auth.users if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE user_profiles 
    ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Add verification_status column to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'verification_status'
  ) THEN
    ALTER TABLE user_profiles 
    ADD COLUMN verification_status text DEFAULT 'not_verified' CHECK (verification_status IN ('not_verified', 'verified_level_1', 'verified_level_2'));
  END IF;
END $$;

-- Make phone and bio fields optional
DO $$
BEGIN
  ALTER TABLE user_profiles ALTER COLUMN bio DROP NOT NULL;
EXCEPTION
  WHEN undefined_column THEN NULL;
  WHEN others THEN NULL;
END $$;

-- Update demo user to verified_level_1
UPDATE user_profiles
SET verification_status = 'verified_level_1'
WHERE email = 'demo@hearthy.org';

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.verification_status IS 'User verification level: not_verified (read-only), verified_level_1 (basic verified), verified_level_2 (fully verified with child-work documents)';
