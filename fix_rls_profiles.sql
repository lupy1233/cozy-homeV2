-- First, let's drop and recreate the profiles RLS policies to ensure they work correctly

-- Drop existing policies
DROP POLICY IF EXISTS profiles_select ON profiles;
DROP POLICY IF EXISTS profiles_update ON profiles;
DROP POLICY IF EXISTS profiles_insert ON profiles;

-- Recreate the policies with proper permissions
CREATE POLICY profiles_select
  ON profiles FOR SELECT
  USING (profiles.user_id = auth.uid() OR (current_setting('request.jwt.claim.role', true) = 'ADMIN'));

CREATE POLICY profiles_update
  ON profiles FOR UPDATE
  USING (profiles.user_id = auth.uid())
  WITH CHECK (profiles.user_id = auth.uid());

CREATE POLICY profiles_insert
  ON profiles FOR INSERT
  WITH CHECK (profiles.user_id = auth.uid());

-- Fix missing profile for existing user
INSERT INTO profiles (user_id, role, first_name, last_name, phone)
VALUES (
  '85dda59c-e246-4187-8952-d34e15725dcd',
  'ARCHITECT',
  'Nicolae-Ciprian',
  'Ciobanu', 
  '+40756115210'
)
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone;

-- For any other existing users without profiles
INSERT INTO profiles (user_id, role, first_name, last_name, phone)
SELECT 
  id,
  COALESCE((raw_user_meta_data->>'role')::role_enum, 'HOMEOWNER'),
  raw_user_meta_data->>'first_name',
  raw_user_meta_data->>'last_name',
  raw_user_meta_data->>'phone'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM profiles)
ON CONFLICT (user_id) DO NOTHING; 