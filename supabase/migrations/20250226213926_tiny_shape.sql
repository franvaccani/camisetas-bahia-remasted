/*
  # Fix authentication issues

  1. Changes
     - Create a more reliable approach to add the admin user
     - Ensure proper authentication setup
     - Fix schema querying errors
*/

-- Create a function to add the admin user safely
CREATE OR REPLACE FUNCTION public.create_admin_user()
RETURNS void AS $$
DECLARE
  _instance_id UUID;
BEGIN
  -- Get the current instance_id from an existing user or use default
  SELECT instance_id INTO _instance_id FROM auth.users LIMIT 1;
  
  IF _instance_id IS NULL THEN
    _instance_id := '00000000-0000-0000-0000-000000000000'::UUID;
  END IF;
  
  -- Only insert if the user doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@camisetasbahia.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at
    ) VALUES (
      _instance_id,
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@camisetasbahia.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      false,
      now(),
      now()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT public.create_admin_user();

-- Drop the function after use
DROP FUNCTION IF EXISTS public.create_admin_user();

-- Ensure email is unique in auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'users' 
    AND indexname = 'users_email_key'
    AND schemaname = 'auth'
  ) THEN
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON auth.users (email);
  END IF;
END $$;