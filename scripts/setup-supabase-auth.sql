-- Enable authentication
-- This is usually enabled by default in Supabase, but let's ensure it's configured

-- Create a custom user for the client portal
-- You can run this in the Supabase SQL editor or use the Auth UI

-- First, let's create a function to handle user registration
CREATE OR REPLACE FUNCTION create_client_user(
  user_email TEXT,
  user_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- This would typically be done through the Supabase Auth API
  -- For now, we'll create a simple auth record
  
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;
  
  result := json_build_object(
    'user_id', new_user_id,
    'email', user_email,
    'created', true
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;

-- Create the default admin user for Bharat Hydraulics
-- Note: In production, you should use the Supabase Auth API instead
SELECT create_client_user('admin@bharathydraulics.com', 'bharathydraulics2024');
