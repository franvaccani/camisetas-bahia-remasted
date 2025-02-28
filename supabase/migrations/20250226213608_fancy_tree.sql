/*
  # Fix admin user creation

  1. Changes
     - Improved admin user creation to avoid errors
     - Fixed ambiguous column reference issue
*/

-- Create admin user with proper instance_id handling
DO $$
DECLARE
  instance_id_var UUID;
BEGIN
  -- Get the instance_id from an existing user or use default
  SELECT COALESCE(
    (SELECT instance_id FROM auth.users LIMIT 1),
    '00000000-0000-0000-0000-000000000000'::UUID
  ) INTO instance_id_var;

  -- Insert admin user if it doesn't exist
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
    instance_id_var,
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
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@camisetasbahia.com'
  );
END $$;