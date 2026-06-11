SET search_path TO "user_312a098d", public;

CREATE TABLE IF NOT EXISTS "user_312a098d".bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES "user_312a098d".time_slots(id),
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE "user_312a098d".bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select" ON "user_312a098d".bookings;
CREATE POLICY "anon_select" ON "user_312a098d".bookings
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_insert" ON "user_312a098d".bookings;
CREATE POLICY "anon_insert" ON "user_312a098d".bookings
  FOR INSERT TO anon WITH CHECK (true);

GRANT SELECT, INSERT ON "user_312a098d".bookings TO anon;
