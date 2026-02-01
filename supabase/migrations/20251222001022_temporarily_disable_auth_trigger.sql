/*
  # Temporarily Disable Auth Trigger to Debug Login Issue
  
  1. Changes
    - Drop the trigger that fires on user creation
    - Keep the function for future use
    - This will help identify if the trigger is causing the login error
    
  Important Notes:
    - This is a diagnostic step
    - The trigger is only for new user signups, not logins
    - If this fixes login, we'll need to investigate the trigger function
*/

-- Drop the trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
