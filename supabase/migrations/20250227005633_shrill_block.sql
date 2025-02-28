/*
  # Fix product creation functionality
  
  1. Changes
     - Modify user_id column to be text type and nullable
     - Update RLS policies to be more permissive
     - Add default value for user_id
  
  2. Security
     - Enable open access for demonstration purposes
     - In a production environment, stricter policies would be recommended
*/

-- Modify user_id column to be text type and nullable
ALTER TABLE products 
  ALTER COLUMN user_id TYPE text USING user_id::text,
  ALTER COLUMN user_id DROP NOT NULL,
  ALTER COLUMN user_id SET DEFAULT 'system';

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Anyone can create products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;

-- Create new policies with more permissive settings
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create products"
  ON products
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products
  FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete products"
  ON products
  FOR DELETE
  TO authenticated, anon
  USING (true);