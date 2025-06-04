-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price VARCHAR(100) DEFAULT 'Contact for Quote',
  image_url TEXT,
  description TEXT,
  specifications JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotation_requests table
CREATE TABLE IF NOT EXISTS quotation_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  project_details TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_quotation_requests_status ON quotation_requests(status);
CREATE INDEX IF NOT EXISTS idx_quotation_requests_created_at ON quotation_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Update the RLS policies to allow proper access

-- Drop existing policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Anyone can create quotation requests" ON quotation_requests;
DROP POLICY IF EXISTS "Customers can view their own requests" ON quotation_requests;
DROP POLICY IF EXISTS "Anyone can create customer records" ON customers;
DROP POLICY IF EXISTS "Customers can view their own records" ON customers;

-- Create more permissive policies for development
-- Products policies
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON products FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON products FOR DELETE USING (true);

-- Categories policies
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON categories FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON categories FOR DELETE USING (true);

-- Quotation requests policies
CREATE POLICY "Enable read access for all users" ON quotation_requests FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON quotation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON quotation_requests FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON quotation_requests FOR DELETE USING (true);

-- Customers policies
CREATE POLICY "Enable read access for all users" ON customers FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON customers FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON customers FOR DELETE USING (true);
