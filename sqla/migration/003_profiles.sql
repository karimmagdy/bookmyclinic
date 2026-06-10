SET search_path TO "user_312a098d", public;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_profiles" ON profiles;
CREATE POLICY "auth_select_profiles" ON profiles
  FOR SELECT TO authenticated
  USING (true);
GRANT SELECT ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "auth_update_profiles" ON profiles;
CREATE POLICY "auth_update_profiles" ON profiles
  FOR UPDATE TO authenticated
  USING (true);
GRANT UPDATE ON public.profiles TO authenticated;
