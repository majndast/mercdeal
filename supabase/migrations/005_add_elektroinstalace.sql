-- Add elektroinstalace category
INSERT INTO categories (name, slug, icon, sort_order)
VALUES ('Elektroinstalace', 'elektroinstalace', 'E', 4)
ON CONFLICT (slug) DO NOTHING;

-- Update sort order for existing categories
UPDATE categories SET sort_order = 5 WHERE slug = 'motor';
UPDATE categories SET sort_order = 6 WHERE slug = 'podvozek';
UPDATE categories SET sort_order = 7 WHERE slug = 'darky';
