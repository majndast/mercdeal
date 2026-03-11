-- Create mercedes_classes table
CREATE TABLE IF NOT EXISTS mercedes_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mercedes_generations table
CREATE TABLE IF NOT EXISTS mercedes_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES mercedes_classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  year_from INTEGER,
  year_to INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mercedes_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercedes_generations ENABLE ROW LEVEL SECURITY;

-- RLS policies - everyone can read
CREATE POLICY "Anyone can read classes" ON mercedes_classes FOR SELECT USING (true);
CREATE POLICY "Anyone can read generations" ON mercedes_generations FOR SELECT USING (true);

-- Only admins can modify (via service role)
CREATE POLICY "Admins can insert classes" ON mercedes_classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update classes" ON mercedes_classes FOR UPDATE USING (true);
CREATE POLICY "Admins can delete classes" ON mercedes_classes FOR DELETE USING (true);

CREATE POLICY "Admins can insert generations" ON mercedes_generations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update generations" ON mercedes_generations FOR UPDATE USING (true);
CREATE POLICY "Admins can delete generations" ON mercedes_generations FOR DELETE USING (true);

-- Insert default classes
INSERT INTO mercedes_classes (name, slug, sort_order) VALUES
  ('A-Třída', 'a-trida', 1),
  ('B-Třída', 'b-trida', 2),
  ('C-Třída', 'c-trida', 3),
  ('E-Třída', 'e-trida', 4),
  ('S-Třída', 's-trida', 5),
  ('CLA', 'cla', 6),
  ('CLS', 'cls', 7),
  ('GLA', 'gla', 8),
  ('GLB', 'glb', 9),
  ('GLC', 'glc', 10),
  ('GLE', 'gle', 11),
  ('GLS', 'gls', 12),
  ('G-Třída', 'g-trida', 13),
  ('AMG GT', 'amg-gt', 14)
ON CONFLICT (slug) DO NOTHING;

-- Insert default generations
INSERT INTO mercedes_generations (class_id, name, slug, year_from, year_to) VALUES
  ((SELECT id FROM mercedes_classes WHERE slug = 'a-trida'), 'W177', 'w177', 2018, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'a-trida'), 'W176', 'w176', 2012, 2018),
  ((SELECT id FROM mercedes_classes WHERE slug = 'b-trida'), 'W247', 'w247', 2018, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'b-trida'), 'W246', 'w246', 2011, 2018),
  ((SELECT id FROM mercedes_classes WHERE slug = 'c-trida'), 'W206', 'w206', 2021, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'c-trida'), 'W205', 'w205', 2014, 2021),
  ((SELECT id FROM mercedes_classes WHERE slug = 'c-trida'), 'W204', 'w204', 2007, 2014),
  ((SELECT id FROM mercedes_classes WHERE slug = 'e-trida'), 'W214', 'w214', 2023, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'e-trida'), 'W213', 'w213', 2016, 2023),
  ((SELECT id FROM mercedes_classes WHERE slug = 'e-trida'), 'W212', 'w212', 2009, 2016),
  ((SELECT id FROM mercedes_classes WHERE slug = 's-trida'), 'W223', 'w223', 2020, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 's-trida'), 'W222', 'w222', 2013, 2020),
  ((SELECT id FROM mercedes_classes WHERE slug = 'cla'), 'C118', 'c118', 2019, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'cla'), 'C117', 'c117', 2013, 2019),
  ((SELECT id FROM mercedes_classes WHERE slug = 'cls'), 'C257', 'c257', 2018, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'gla'), 'H247', 'h247', 2020, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'gla'), 'X156', 'x156', 2013, 2020),
  ((SELECT id FROM mercedes_classes WHERE slug = 'glb'), 'X247', 'x247', 2019, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'glc'), 'X254', 'x254', 2022, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'glc'), 'X253', 'x253', 2015, 2022),
  ((SELECT id FROM mercedes_classes WHERE slug = 'gle'), 'V167', 'v167', 2019, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'gle'), 'W166', 'w166', 2011, 2019),
  ((SELECT id FROM mercedes_classes WHERE slug = 'gls'), 'X167', 'x167', 2019, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'g-trida'), 'W463', 'w463', 2018, NULL),
  ((SELECT id FROM mercedes_classes WHERE slug = 'amg-gt'), 'C190', 'c190', 2014, NULL)
ON CONFLICT (slug) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_generations_class ON mercedes_generations(class_id);
