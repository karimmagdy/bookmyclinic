SET search_path TO "user_312a098d", public;

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES time_slots(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings
  FOR INSERT TO anon
  WITH CHECK (true);
GRANT INSERT ON public.bookings TO anon;

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings
  FOR SELECT TO anon
  USING (true);
GRANT SELECT ON public.bookings TO anon;
