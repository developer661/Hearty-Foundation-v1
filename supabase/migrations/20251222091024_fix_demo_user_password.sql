/*
  # Fix Demo User Password
  
  1. Changes
    - Update the demo user password in auth.users
    - Set password to "volunteer123"
    
  Important Notes:
    - This sets a known password for the demo account
    - Password: volunteer123
    - Email: anna.kowalska@example.com
*/

-- Update the demo user with a properly hashed password
UPDATE auth.users
SET 
  encrypted_password = crypt('volunteer123', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email = 'anna.kowalska@example.com';
