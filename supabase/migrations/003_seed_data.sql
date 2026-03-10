-- MercDeal Seed Data
-- Run this after RLS policies

-- Insert categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Exteriér', 'exterior', '🚗', 1),
  ('Interiér', 'interior', '🪑', 2),
  ('Osvětlení', 'osvetleni', '💡', 3),
  ('Motor & Výfuk', 'motor', '⚙️', 4),
  ('Podvozek & Brzdy', 'podvozek', '🔧', 5),
  ('Dárky & Merch', 'darky', '🎁', 6);

-- Insert Mercedes models
INSERT INTO mercedes_models (name, slug, code, year_from, year_to) VALUES
  ('A-Třída', 'a-trida', 'W177', 2018, NULL),
  ('B-Třída', 'b-trida', 'W247', 2018, NULL),
  ('C-Třída W205', 'c-trida-w205', 'W205', 2014, 2021),
  ('C-Třída W206', 'c-trida-w206', 'W206', 2021, NULL),
  ('E-Třída W213', 'e-trida-w213', 'W213', 2016, 2023),
  ('E-Třída W214', 'e-trida-w214', 'W214', 2023, NULL),
  ('S-Třída W222', 's-trida-w222', 'W222', 2013, 2020),
  ('S-Třída W223', 's-trida-w223', 'W223', 2020, NULL),
  ('GLA', 'gla', 'H247', 2020, NULL),
  ('GLB', 'glb', 'X247', 2019, NULL),
  ('GLC', 'glc', 'X254', 2022, NULL),
  ('GLE', 'gle', 'V167', 2019, NULL),
  ('GLS', 'gls', 'X167', 2019, NULL),
  ('G-Třída', 'g-trida', 'W463', 2018, NULL),
  ('CLA', 'cla', 'C118', 2019, NULL),
  ('CLS', 'cls', 'C257', 2018, NULL),
  ('AMG GT', 'amg-gt', 'C190', 2014, NULL),
  ('EQC', 'eqc', 'N293', 2019, NULL),
  ('EQS', 'eqs', 'V297', 2021, NULL);

-- Insert sample products
INSERT INTO products (name, slug, description, price, original_price, sku, stock, category_id, badge, is_active, is_featured) VALUES
  (
    'AMG Style přední nárazník pro C-Třídu W205',
    'amg-style-predni-naraznik-c-trida-w205',
    'Vysoce kvalitní přední nárazník v AMG designu pro Mercedes-Benz C-Třída W205. Vyrobeno z odolného ABS plastu. Obsahuje mřížku a všechny potřebné montážní díly.',
    12990,
    15990,
    'EXT-W205-001',
    15,
    (SELECT id FROM categories WHERE slug = 'exterior'),
    'TOP',
    true,
    true
  ),
  (
    'LED ambientní osvětlení 64 barev',
    'led-ambientni-osvetleni-64-barev',
    'Upgrade interiéru s LED ambientním osvětlením. 64 barev, plynulé přechody, ovládání přes aplikaci. Kompatibilní s většinou modelů.',
    4990,
    NULL,
    'INT-AMB-001',
    25,
    (SELECT id FROM categories WHERE slug = 'interior'),
    'NOVINKA',
    true,
    true
  ),
  (
    'Sportovní výfukové koncovky AMG',
    'sportovni-vyfukove-koncovky-amg',
    'Originální AMG style výfukové koncovky z nerezové oceli. Průměr 90mm, černé chromové provedení.',
    3490,
    4290,
    'MOT-EXH-001',
    30,
    (SELECT id FROM categories WHERE slug = 'motor'),
    NULL,
    true,
    true
  ),
  (
    'Karbonové zrcátka pro E-Třídu W213',
    'karbonove-zrcatka-e-trida-w213',
    'Pravý karbon s vysokým leskem. Přímá náhrada originálních krytů. Snadná montáž bez demontáže zrcátek.',
    8990,
    NULL,
    'EXT-W213-001',
    10,
    (SELECT id FROM categories WHERE slug = 'exterior'),
    'TOP',
    true,
    true
  ),
  (
    'Sportovní volant AMG s perforovanou kůží',
    'sportovni-volant-amg-perforovana-kuze',
    'AMG sportovní volant s perforovanou kůží a červeným prošíváním. Včetně airbagu a ovládacích tlačítek.',
    18990,
    22990,
    'INT-STR-001',
    5,
    (SELECT id FROM categories WHERE slug = 'interior'),
    'PREMIUM',
    true,
    true
  ),
  (
    'H&R sportovní pružiny -30mm',
    'hr-sportovni-pruziny-30mm',
    'Originální H&R sportovní pružiny se snížením 30mm. TÜV certifikace. Pro C-Třídu W205 a W206.',
    6990,
    NULL,
    'SUS-SPR-001',
    20,
    (SELECT id FROM categories WHERE slug = 'podvozek'),
    NULL,
    true,
    false
  ),
  (
    'MULTIBEAM LED světlomety upgrade',
    'multibeam-led-svetlomety-upgrade',
    'Upgrade na MULTIBEAM LED světlomety pro E-Třídu W213. Včetně řídící jednotky a kabeláže.',
    45990,
    NULL,
    'LIG-LED-001',
    3,
    (SELECT id FROM categories WHERE slug = 'osvetleni'),
    'PREMIUM',
    true,
    true
  ),
  (
    'Klíčenka Mercedes-AMG originál',
    'klicenka-mercedes-amg-original',
    'Originální Mercedes-AMG klíčenka z broušené oceli s koženým poutkem.',
    990,
    NULL,
    'GIF-KEY-001',
    100,
    (SELECT id FROM categories WHERE slug = 'darky'),
    NULL,
    true,
    false
  );

-- Link products to models
INSERT INTO product_models (product_id, model_id)
SELECT p.id, m.id
FROM products p, mercedes_models m
WHERE p.slug = 'amg-style-predni-naraznik-c-trida-w205' AND m.slug = 'c-trida-w205';

INSERT INTO product_models (product_id, model_id)
SELECT p.id, m.id
FROM products p, mercedes_models m
WHERE p.slug = 'karbonove-zrcatka-e-trida-w213' AND m.slug = 'e-trida-w213';

INSERT INTO product_models (product_id, model_id)
SELECT p.id, m.id
FROM products p, mercedes_models m
WHERE p.slug = 'multibeam-led-svetlomety-upgrade' AND m.slug = 'e-trida-w213';

INSERT INTO product_models (product_id, model_id)
SELECT p.id, m.id
FROM products p, mercedes_models m
WHERE p.slug = 'hr-sportovni-pruziny-30mm' AND m.slug IN ('c-trida-w205', 'c-trida-w206');
