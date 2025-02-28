/*
  # Product Management Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `category` (text, main category)
      - `subcategory` (text, subcategory)
      - `subsubcategory` (text, optional)
      - `subsubsubcategory` (text, optional)
      - `price` (numeric, product price)
      - `images` (text[], array of image URLs)
      - `temporada` (text, season/year)
      - `marca` (text, brand)
      - `description` (text, product description)
      - `sizes` (text[], available sizes)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, reference to auth.users)

  2. Security
    - Enable RLS on products table
    - Add policies for:
      - Authenticated users can read all products
      - Users can only create/update/delete their own products
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  subcategory text NOT NULL,
  subsubcategory text,
  subsubsubcategory text,
  price numeric NOT NULL CHECK (price >= 0),
  images text[] NOT NULL DEFAULT '{}',
  temporada text NOT NULL,
  marca text NOT NULL,
  description text,
  sizes text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();