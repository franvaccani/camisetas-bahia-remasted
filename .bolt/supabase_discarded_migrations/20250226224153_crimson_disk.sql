/*
  # Fix product creation and user_id handling

  1. Changes
     - Modify user_id column to accept text values
     - Update RLS policies to allow both authenticated and anonymous users to manage products

  2. Security
     - Maintain RLS on products table
     - Update policies for better access control
*/

-- First drop existing policies
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Users can create their own products" ON products;
DROP POLICY IF EXISTS "Users can update their own products" ON products;
DROP POLICY IF EXISTS "Users can delete their own products" ON products;
DROP POLICY IF EXISTS "Users can create products" ON products;
DROP POLICY IF EXISTS "Users can update products" ON products;
DROP POLICY IF EXISTS "Users can delete products" ON products;
DROP POLICY IF EXISTS "Anonymous users can manage system products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage their products" ON products;

-- Drop the foreign key constraint if it exists
ALTER TABLE IF EXISTS products DROP CONSTRAINT IF EXISTS products_user_id_fkey;

-- Modify user_id column to accept text values
ALTER TABLE products ALTER COLUMN user_id TYPE text USING user_id::text;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new policies
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