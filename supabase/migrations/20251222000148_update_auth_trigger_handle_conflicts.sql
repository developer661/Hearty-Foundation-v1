/*
  # Update Auth Trigger to Handle Existing Profiles
  
  1. Changes
    - Modify handle_new_user function to handle conflicts
    - Use ON CONFLICT DO NOTHING to prevent errors when profile already exists
    
  Important Notes:
    - This allows the auth user creation to succeed even if profile exists
    - Useful for demo/testing scenarios
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
