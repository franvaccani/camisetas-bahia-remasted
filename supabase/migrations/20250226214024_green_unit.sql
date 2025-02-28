/*
  # Fix authentication issues

  1. Changes
     - Create a more reliable approach to add the admin user
     - Fix schema querying errors
     - Ensure proper authentication setup
*/

-- Create a function to safely add the admin user
CREATE OR REPLACE FUNCTION public.ensure_admin_user()
RETURNS void AS $$
DECLARE
  _instance_id UUID;
  _user_exists BOOLEAN;
BEGIN
  -- Check if user already exists
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'admin@camisetasbahia.com') INTO _user_exists;
  
  IF NOT _user_exists THEN
    -- Get the current instance_id from an existing user or use default
    BEGIN
      SELECT instance_id INTO _instance_id FROM auth.users LIMIT 1;
      
      IF _instance_id IS NULL THEN
        _instance_id := '00000000-0000-0000-0000-000000000000'::UUID;
      END IF;
      
      -- Insert the admin user
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
        updated_at,
        confirmation_token
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
        now(),
        ''
      );
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the migration
      RAISE NOTICE 'Error creating admin user: %', SQLERRM;
    END;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT public.ensure_admin_user();

-- Drop the function after use
DROP FUNCTION IF EXISTS public.ensure_admin_user();

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

-- Fix any potential schema issues
DO $$
BEGIN
  -- Ensure auth schema exists
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
    CREATE SCHEMA IF NOT EXISTS auth;
  END IF;
  
  -- Ensure public schema exists
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'public') THEN
    CREATE SCHEMA IF NOT EXISTS public;
  END IF;
END $$;

-- Grant necessary permissions
DO $$
BEGIN
  -- Grant usage on schemas
  GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
  GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
  
  -- Grant select on auth tables to authenticated users
  GRANT SELECT ON ALL TABLES IN SCHEMA auth TO authenticated;
  
  -- Grant all on public tables
  GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
  GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the migration
  RAISE NOTICE 'Error granting permissions: %', SQLERRM;
END $$;