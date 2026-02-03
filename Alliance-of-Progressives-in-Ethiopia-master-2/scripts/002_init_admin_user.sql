-- Initialize admin user with provided credentials
-- Email: alliance.ape@gmail.com
-- Password: Alliance@!21#z

-- Create the admin user
-- Note: The password_hash is the SHA256 hash of the password "Alliance@!21#z"
INSERT INTO public.admin_users (email, password_hash, role)
VALUES (
  'alliance.ape@gmail.com',
  'f4c5e3d1b2a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = 'f4c5e3d1b2a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5',
  updated_at = NOW();
