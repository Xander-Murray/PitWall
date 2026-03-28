CREATE TABLE IF NOT EXISTS repair_outcomes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  repair_name text NOT NULL,
  briefing_id uuid,
  vehicle_year int,
  vehicle_make text,
  vehicle_model text,
  quoted_price numeric,
  actual_price_paid numeric,
  approved boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE repair_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_anon_read_outcomes" ON repair_outcomes
  FOR SELECT USING (true);

CREATE POLICY "allow_anon_insert_outcomes" ON repair_outcomes
  FOR INSERT WITH CHECK (true);

CREATE INDEX idx_repair_outcomes_name ON repair_outcomes (repair_name);
