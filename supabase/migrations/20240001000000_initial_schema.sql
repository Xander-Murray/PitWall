-- demo_scenarios: stores the 5 hardcoded demo scenarios
CREATE TABLE IF NOT EXISTS demo_scenarios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  quote_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- analyses: stores every analysis run (anonymous, no auth)
CREATE TABLE IF NOT EXISTS analyses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_text text,
  vehicle_context jsonb,
  result jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Allow anonymous reads/writes (no auth in this app)
ALTER TABLE demo_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_anon_read_scenarios" ON demo_scenarios
  FOR SELECT USING (true);

CREATE POLICY "allow_anon_read_analyses" ON analyses
  FOR SELECT USING (true);

CREATE POLICY "allow_anon_insert_analyses" ON analyses
  FOR INSERT WITH CHECK (true);
