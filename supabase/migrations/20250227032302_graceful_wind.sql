/*
  # Make product name and price optional

  1. Changes
    - Modify the `name` column to be nullable
    - Modify the `price` column to be nullable
  
  2. Reason
    - Allow products to be created without specifying a name (will be generated from category)
    - Allow products to be created without specifying a price (for items where price is not yet determined)
*/

-- Make name and price columns nullable
ALTER TABLE products 
  ALTER COLUMN name DROP NOT NULL,
  ALTER COLUMN price DROP NOT NULL;