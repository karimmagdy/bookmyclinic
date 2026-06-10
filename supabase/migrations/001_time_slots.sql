SET search_path TO "user_312a098d", public;

-- Create time_slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (slot_date, slot_time)
);

-- Enable RLS
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

-- RLS policies for anon read
DROP POLICY IF EXISTS "anon_read_time_slots" ON time_slots;
CREATE POLICY "anon_read_time_slots" ON time_slots
  FOR SELECT TO anon
  USING (true);

GRANT SELECT ON public.time_slots TO anon;

-- Seed slots: next 14 days, Sun-Thu only, 16:00-21:00 (slots at 16, 17, 18, 19, 20)
DO $$
DECLARE
  start_date DATE := CURRENT_DATE;
  slot_date DATE;
  day_of_week INT;
BEGIN
  FOR day_offset IN 0..13 LOOP
    slot_date := start_date + day_offset;
    day_of_week := EXTRACT(DOW FROM slot_date);
    
    -- 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu (PostgreSQL DOW: 0=Sun, 1=Mon, ... 4=Thu, 5=Fri, 6=Sat)
    IF day_of_week BETWEEN 0 AND 4 THEN
      -- Insert slots at 16:00, 17:00, 18:00, 19:00, 20:00
      INSERT INTO time_slots (slot_date, slot_time, is_available)
      VALUES 
        (slot_date, '16:00'::TIME, true),
        (slot_date, '17:00'::TIME, true),
        (slot_date, '18:00'::TIME, true),
        (slot_date, '19:00'::TIME, true),
        (slot_date, '20:00'::TIME, true)
      ON CONFLICT (slot_date, slot_time) DO NOTHING;
    END IF;
  END LOOP;
END;
$$;
