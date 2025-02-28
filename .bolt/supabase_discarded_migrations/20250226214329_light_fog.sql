/*
  # Create admin user

  1. Changes
     - Create admin user with minimal required fields
     - Avoid using columns that don't exist in the auth.users table
     - Ensure compatibility with Supabase Auth
*/

-- Create a function to safely add the admin user
CREATE OR REPLACE FUNCTION public.create_admin_user()
RETURNS void AS $$
DECLARE
  _instance_id UUID;
  _user_id UUID;
BEGIN
  -- Get the current instance_id from an existing user or use default
  SELECT instance_id INTO _instance_id FROM auth.users LIMIT 1;
  
  IF _instance_id IS NULL THEN
    _instance_id := '00000000-0000-0000-0000-000000000000'::UUID;
  END IF;
  
  -- Only insert if the user doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@camisetasbahia.com') THEN
    -- Generate a new UUID for the user
    _user_id := gen_random_uuid();
    
    -- Insert the admin user with only the columns we know exist
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
      _user_id,
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
    
    -- Add identity record for the user if identities table exists
    BEGIN
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        created_at,
        updated_at
      ) VALUES (
        _user_id,
        _user_id,
        jsonb_build_object('sub', _user_id, 'email', 'admin@camisetasbahia.com'),
        'email',
        now(),
        now()
      );
    EXCEPTION WHEN OTHERS THEN
      -- Ignore errors if identities table doesn't exist or has different structure
      RAISE NOTICE 'Could not create identity record: %', SQLERRM;
    END;
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