/*
  # Fix product creation and management

  1. Changes
     - Drop foreign key constraint on user_id to allow text values
     - Drop existing policies and recreate them to allow both authenticated and anonymous users
     - Add system user support for products

  2. Security
     - Enable RLS on products table
     - Add policies for authenticated and anonymous users
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

-- Drop the foreign key constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'products_user_id_fkey'
    AND table_name = 'products'
  ) THEN
    ALTER TABLE products DROP CONSTRAINT products_user_id_fkey;
  END IF;
END $$;

-- Recreate the products table with text user_id if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products'
    AND column_name = 'user_id'
    AND data_type = 'uuid'
  ) THEN
    -- Create a temporary table to hold the data
    CREATE TEMP TABLE temp_products AS SELECT * FROM products;
    
    -- Drop the original table
    DROP TABLE products;
    
    -- Recreate the table with text user_id
    CREATE TABLE products (
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
      user_id text NOT NULL
    );
    
    -- Copy the data back, converting uuid to text
    INSERT INTO products
    SELECT 
      id, name, category, subcategory, subsubcategory, subsubsubcategory,
      price, images, temporada, marca, description, sizes,
      created_at, updated_at, user_id::text
    FROM temp_products;
    
    -- Drop the temporary table
    DROP TABLE temp_products;
    
    -- Recreate the updated_at trigger
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
  END IF;
END $$;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage their products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id OR user_id = 'system')
  WITH CHECK (auth.uid()::text = user_id OR user_id = 'system');

CREATE POLICY "Anonymous users can manage system products"
  ON products
  FOR ALL
  TO anon
  USING (user_id = 'system')
  WITH CHECK (user_id = 'system');