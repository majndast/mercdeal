-- Add new fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS part_number TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS condition TEXT CHECK (condition IN ('A+', 'A', 'B', 'C'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES mercedes_classes(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS generation_id UUID REFERENCES mercedes_generations(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_class ON products(class_id);
CREATE INDEX IF NOT EXISTS idx_products_generation ON products(generation_id);
CREATE INDEX IF NOT EXISTS idx_products_condition ON products(condition);
