-- Fix RLS policies to allow proper access
-- This script updates the Row Level Security policies

-- Disable RLS temporarily for easier development
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled, use these more permissive policies:
-- DROP ALL existing policies first
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on products
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'products') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON products';
    END LOOP;
    
    -- Drop all policies on categories
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'categories') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON categories';
    END LOOP;
    
    -- Drop all policies on quotation_requests
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'quotation_requests') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON quotation_requests';
    END LOOP;
    
    -- Drop all policies on customers
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'customers') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON customers';
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create new permissive policies
-- Products
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Categories  
CREATE POLICY "Allow all operations on categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- Quotation requests
CREATE POLICY "Allow all operations on quotation_requests" ON quotation_requests FOR ALL USING (true) WITH CHECK (true);

-- Customers
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true) WITH CHECK (true);
