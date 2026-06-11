SET search_path TO "user_312a098d", public;

CREATE TABLE IF NOT EXISTS "user_312a098d".time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (slot_date, slot_time)
);

ALTER TABLE "user_312a098d".time_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read" ON "user_312a098d".time_slots;
CREATE POLICY "anon_read" ON "user_312a098d".time_slots
  FOR SELECT TO anon USING (true);
GRANT SELECT ON "user_312a098d".time_slots TO anon;

DROP POLICY IF EXISTS "anon_update" ON "user_312a098d".time_slots;
CREATE POLICY "anon_update" ON "user_312a098d".time_slots
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
GRANT UPDATE ON "user_312a098d".time_slots TO anon;

-- Seed: next 14 days, Sun–Thu only, 16:00–20:00 (5 slots/day)
DO $$
DECLARE
  d DATE;
  dow INT;
  hr INT;
BEGIN
  FOR i IN 0..13 LOOP
    d := CURRENT_DATE + i;
    dow := EXTRACT(DOW FROM d);
    IF dow IN (0,1,2,3,4) THEN
      FOR hr IN 16..20 LOOP
        INSERT INTO "user_312a098d".time_slots (slot_date, slot_time, is_available)
        VALUES (d, make_time(hr, 0, 0), true)
        ON CONFLICT (slot_date, slot_time) DO NOTHING;
      END LOOP;
    END IF;
  END LOOP;
END $$;
