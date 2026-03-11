-- Add elektroinstalace category
INSERT INTO categories (name, slug, icon, sort_order)
VALUES ('Elektroinstalace', 'elektroinstalace', 'E', 3)
ON CONFLICT (slug) DO NOTHING;

-- Make osvetleni a subcategory of exterior
UPDATE categories
SET parent_id = (SELECT id FROM categories WHERE slug = 'exterior')
WHERE slug = 'osvetleni';

-- Update sort order for main categories
UPDATE categories SET sort_order = 1 WHERE slug = 'exterior';
UPDATE categories SET sort_order = 2 WHERE slug = 'interior';
UPDATE categories SET sort_order = 3 WHERE slug = 'elektroinstalace';
UPDATE categories SET sort_order = 4 WHERE slug = 'podvozek';
UPDATE categories SET sort_order = 5 WHERE slug = 'motor';
UPDATE categories SET sort_order = 6 WHERE slug = 'darky';
