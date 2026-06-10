SET search_path TO "user_312a098d", public;

-- Create time_slots table
CREATE TABLE IF NOT EXISTS "user_312a098d".time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (slot_date, slot_time)
);

-- Enable RLS
ALTER TABLE "user_312a098d".time_slots ENABLE ROW LEVEL SECURITY;

-- RLS policies for anon read
DROP POLICY IF EXISTS "anon_read_time_slots" ON "user_312a098d".time_slots;
CREATE POLICY "anon_read_time_slots" ON "user_312a098d".time_slots
  FOR SELECT TO anon
  USING (true);

GRANT SELECT ON "user_312a098d".time_slots TO anon;

-- Seed slots: next 14 days, Sun-Thu only, 16:00-21:00 (slots at 16, 17, 18, 19, 20)
DO $$
DECLARE
  d DATE := CURRENT_DATE;
  dow INT;
  day_idx INT;
BEGIN
  day_idx := 0;
  WHILE day_idx <= 13 LOOP
    d := CURRENT_DATE + day_idx;
    dow := EXTRACT(DOW FROM d);
    
    IF dow BETWEEN 0 AND 4 THEN
      INSERT INTO "user_312a098d".time_slots (slot_date, slot_time, is_available)
      VALUES 
        (d, '16:00'::TIME, true),
        (d, '17:00'::TIME, true),
        (d, '18:00'::TIME, true),
        (d, '19:00'::TIME, true),
        (d, '20:00'::TIME, true)
      ON CONFLICT (slot_date, slot_time) DO NOTHING;
    END IF;
    day_idx := day_idx + 1;
  END LOOP;
END;
$$;
