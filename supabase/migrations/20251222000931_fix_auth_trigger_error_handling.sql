/*
  # Fix Authentication Trigger Error Handling
  
  1. Changes
    - Update handle_new_user function with proper error handling
    - Add exception handling to prevent trigger from blocking auth
    - Ensure trigger doesn't interfere with login process
    
  Important Notes:
    - Trigger only fires on INSERT (new signups), not on login
    - Added exception handling to log errors without blocking auth
    - Function will return NEW even if profile insertion fails
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.user_profiles (id, full_name, email, location, bio, skills, interests, points)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Volunteer'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'location', 'Not specified'),
      COALESCE(NEW.raw_user_meta_data->>'bio', ''),
      COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'skills')), '{}'),
      COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'interests')), '{}'),
      0
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION 
    WHEN OTHERS THEN
      RAISE WARNING 'Could not create user profile: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;
