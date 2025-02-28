/*
  # Fix products table schema

  1. Changes
     - Make temporada and marca columns nullable
     - This fixes the error when creating products with null values for these fields
*/

-- Make temporada and marca columns nullable
ALTER TABLE IF EXISTS products 
  ALTER COLUMN temporada DROP NOT NULL,
  ALTER COLUMN marca DROP NOT NULL;