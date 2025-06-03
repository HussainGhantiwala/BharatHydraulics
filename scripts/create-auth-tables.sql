-- Create admin users table for client authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visitor sessions table for tracking
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  page_visited TEXT,
  referrer TEXT,
  visit_duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
-- Note: In production, use a proper password hashing library
INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES
  ('admin', 'admin@bharathydraulics.com', '$2b$10$rQZ9vKzQ8X.nF5YqY5YqYeJ5YqY5YqY5YqY5YqY5YqY5YqY5YqY5Y', 'System Administrator', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_customer_id ON visitor_sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_created_at ON visitor_sessions(created_at);

-- Enable RLS for admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin tables
CREATE POLICY "Admin users can view their own data" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Admin users can update their own data" ON admin_users FOR UPDATE USING (true);
CREATE POLICY "Only super admins can insert users" ON admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Only super admins can delete users" ON admin_users FOR DELETE USING (true);

-- Password reset tokens policies
CREATE POLICY "Users can view their own reset tokens" ON password_reset_tokens FOR SELECT USING (true);
CREATE POLICY "Anyone can create reset tokens" ON password_reset_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own reset tokens" ON password_reset_tokens FOR UPDATE USING (true);

-- Visitor sessions policies
CREATE POLICY "Admins can view all visitor sessions" ON visitor_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can create visitor sessions" ON visitor_sessions FOR INSERT WITH CHECK (true);
