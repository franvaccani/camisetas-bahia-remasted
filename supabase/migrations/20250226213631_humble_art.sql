/*
  # Fix authentication setup

  1. Changes
     - Create a simpler approach to add the admin user
     - Ensure proper authentication setup
     - Avoid schema querying errors
*/

-- Create a function to add the admin user safely
CREATE OR REPLACE FUNCTION add_admin_user()
RETURNS void AS $$
BEGIN
  -- Only insert if the user doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@camisetasbahia.com') THEN
    -- Get the current instance_id or use default
    WITH instance_data AS (
      SELECT instance_id FROM auth.users LIMIT 1
    )
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
    )
    SELECT
      COALESCE((SELECT instance_id FROM instance_data), '00000000-0000-0000-0000-000000000000'::UUID),
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
      now();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT add_admin_user();

-- Drop the function after use
DROP FUNCTION IF EXISTS add_admin_user();

-- Ensure email is unique in auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'users' 
    AND indexname = 'users_email_key'
    AND schemaname = 'auth'
  ) THEN
    CREATE UNIQUE INDEX users_email_key ON auth.users (email);
  END IF;
END $$;