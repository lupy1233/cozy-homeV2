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