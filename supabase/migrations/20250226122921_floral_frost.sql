/*
  # Create admin user using auth.users table

  1. Create admin user with proper fields
  2. Set up authentication data
*/

-- Create admin user
INSERT INTO auth.users (
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