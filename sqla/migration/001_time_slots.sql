SET search_path TO "user_312a098d", public;

CREATE TABLE IF NOT EXISTS time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (slot_date, slot_time)
);

ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_time_slots" ON time_slots;
CREATE POLICY "anon_select_time_slots" ON time_slots
  FOR SELECT TO anon
  USING (true);
GRANT SELECT ON public.time_slots TO anon;

-- Seed 14 days of Sun–Thu slots at 16:00, 17:00, 18:00, 19:00, 20:00
DO $$
DECLARE
  d DATE;
  t TIME;
  dow INT;
BEGIN
  d := CURRENT_DATE;
  FOR day_offset IN 0..20 LOOP
    d := CURRENT_DATE + day_offset;
    dow := EXTRACT(DOW FROM d);
    -- 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu  (PostgreSQL DOW: 0=Sun, 1=Mon, ..., 6=Sat)
    IF dow BETWEEN 0 AND 4 THEN
      FOR hour_offset IN 0..4 LOOP
        t := TIME '16:00' + (hour_offset || ' hours')::INTERVAL;
        INSERT INTO time_slots (slot_date, slot_time, is_available)
        VALUES (d, t, true)
        ON CONFLICT (slot_date, slot_time) DO NOTHING;
      END LOOP;
    END IF;
  END LOOP;
END;
$$;
