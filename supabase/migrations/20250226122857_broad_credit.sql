/*
  # Create admin user with proper fields

  1. Add unique constraint to email column
  2. Create admin user with required fields only
*/

-- First ensure email is unique
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON auth.users (email);

-- Create admin user
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
VALUES (
  '00000000-0000-0000-0000-000000000000',
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
)
ON CONFLICT DO NOTHING;