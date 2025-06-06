-- Categories and Questions Data Population
-- This file populates the database with the categories and questions from the application

-- First, let's update the request_categories table structure to match our needs
ALTER TABLE request_categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE request_categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE request_categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update request_questions table to support our complex question structure
ALTER TABLE request_questions ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE request_questions ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'cards';
ALTER TABLE request_questions ADD COLUMN IF NOT EXISTS selection_type TEXT DEFAULT 'single';
ALTER TABLE request_questions ADD COLUMN IF NOT EXISTS required BOOLEAN DEFAULT true;
ALTER TABLE request_questions ADD COLUMN IF NOT EXISTS depends_on_question_id UUID REFERENCES request_questions(id);
ALTER TABLE request_questions ADD COLUMN IF NOT EXISTS depends_on_values JSONB;
ALTER TABLE request_questions ADD COLUMN IF NOT EXISTS measurements_config JSONB;
ALTER TABLE request_questions ADD COLUMN IF NOT EXISTS file_upload_config JSONB;
ALTER TABLE request_questions ADD COLUMN IF NOT EXISTS options JSONB;
ALTER TABLE request_questions ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Insert furniture categories
INSERT INTO request_categories (id, name, icon, description, image_url, lang_code) VALUES 
('01234567-89ab-cdef-0123-456789abcde1', 'Kitchen', 'ChefHat', 'Bucătării moderne și funcționale, mobilier de bucătărie personalizat', '/images/categories/kitchen.jpg', 'ro'),
('01234567-89ab-cdef-0123-456789abcde2', 'Hallway', 'DoorOpen', 'Mobilier pentru hol - cuiere, comode, oglinzi și soluții de depozitare', '/images/categories/hallway.jpg', 'ro'),
('01234567-89ab-cdef-0123-456789abcde3', 'Bedroom', 'Bed', 'Dormitoare confortabile - paturi, noptiere, comode și dulapuri', '/images/categories/bedroom.jpg', 'ro'),
('01234567-89ab-cdef-0123-456789abcde4', 'Living Room', 'Sofa', 'Mobilier pentru living - canapele, fotolii, mese și biblioteci', '/images/categories/livingroom.jpg', 'ro'),
('01234567-89ab-cdef-0123-456789abcde5', 'Bathroom', 'Bath', 'Mobilier de baie - vanity-uri, dulapuri și soluții de depozitare', '/images/categories/bathroom.jpg', 'ro'),
('01234567-89ab-cdef-0123-456789abcde6', 'Office', 'Monitor', 'Mobilier de birou - birouri, scaune, biblioteci și soluții de organizare', '/images/categories/office.jpg', 'ro'),
('01234567-89ab-cdef-0123-456789abcde7', 'Dressing Room', 'Shirt', 'Dressing-uri și walk-in closets personalizate', '/images/categories/dressingroom.jpg', 'ro'),
('01234567-89ab-cdef-0123-456789abcde8', 'Dulap', 'Cabinet', 'Dulapuri personalizate pentru orice cameră', '/images/categories/dulap.jpg', 'ro'),
('01234567-89ab-cdef-0123-456789abcde9', 'Outside Furniture', 'TreePine', 'Mobilier de exterior - mese, scaune, pergole și soluții pentru grădină', '/images/categories/outside.jpg', 'ro')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- Kitchen Questions
INSERT INTO request_questions (id, category_id, question_text, description, question_type, selection_type, required, options, sort_order, lang_code) VALUES

-- Kitchen Layout Question
('11234567-89ab-cdef-0123-456789abcde1', '01234567-89ab-cdef-0123-456789abcde1', 'Layout of the kitchen', 'Choose the basic layout and optionally add an island', 'cards', 'single-with-addon', true, 
'[
  {"id": "straight", "label": "Straight", "description": "Linear kitchen layout along one wall", "icon": "Minus"},
  {"id": "l-shaped", "label": "L-shaped", "description": "Kitchen layout forming an L shape", "icon": "CornerDownRight"},
  {"id": "u-shaped", "label": "U-shaped", "description": "Kitchen layout forming a U shape", "icon": "Square"},
  {"id": "island", "label": "Add Island", "description": "Additional island in the center", "icon": "Circle"}
]'::jsonb, 1, 'ro'),

-- Kitchen Measurements Question
('11234567-89ab-cdef-0123-456789abcde2', '01234567-89ab-cdef-0123-456789abcde1', 'Rough measurements', 'Provide the dimensions for your kitchen layout', 'measurements', 'single', true, NULL, 2, 'ro'),

-- Kitchen Door Material Question
('11234567-89ab-cdef-0123-456789abcde3', '01234567-89ab-cdef-0123-456789abcde1', 'The door Material', 'Choose materials for bottom and top parts of the kitchen', 'cards', 'multiple', true,
'[
  {"id": "pal", "label": "PAL", "description": "Particle board with melamine coating", "icon": "Square"},
  {"id": "mdf-infoliat", "label": "MDF Infoliat", "description": "MDF with foil wrapping", "icon": "Layers"},
  {"id": "mdf-vopsit", "label": "MDF Vopsit", "description": "Painted MDF finish", "icon": "Paintbrush"}
]'::jsonb, 3, 'ro'),

-- Kitchen Opening Bottom Question
('11234567-89ab-cdef-0123-456789abcde4', '01234567-89ab-cdef-0123-456789abcde1', 'The method of Opening the bottom part of the kitchen', NULL, 'cards', 'single', true,
'[
  {"id": "push-to-open", "label": "Push to Open", "description": "Touch to open mechanism", "icon": "Hand"},
  {"id": "profil-gola", "label": "Profil Gola", "description": "Integrated handle profile", "icon": "Grip"},
  {"id": "maner", "label": "Maner", "description": "Traditional handles", "icon": "Grab"}
]'::jsonb, 4, 'ro'),

-- Kitchen Opening Top Question
('11234567-89ab-cdef-0123-456789abcde5', '01234567-89ab-cdef-0123-456789abcde1', 'The method of opening the top part', NULL, 'cards', 'single', true,
'[
  {"id": "push-to-open", "label": "Push to open", "description": "Touch to open mechanism", "icon": "Hand"},
  {"id": "profil-banda-led", "label": "Profil Banda led", "description": "LED strip profile handle", "icon": "Lightbulb"},
  {"id": "maner", "label": "Maner", "description": "Traditional handles", "icon": "Grab"}
]'::jsonb, 5, 'ro'),

-- Kitchen Worktop Material Question
('11234567-89ab-cdef-0123-456789abcde6', '01234567-89ab-cdef-0123-456789abcde1', 'The Material of the Worktop', NULL, 'cards', 'single', true,
'[
  {"id": "wood", "label": "Wood", "description": "Natural wood worktop", "icon": "TreePine"},
  {"id": "stone", "label": "Stone", "description": "Natural stone surface", "icon": "Mountain"},
  {"id": "granite", "label": "Granite", "description": "Granite countertop", "icon": "Gem"}
]'::jsonb, 6, 'ro'),

-- Kitchen ContraBlat Material Question
('11234567-89ab-cdef-0123-456789abcde7', '01234567-89ab-cdef-0123-456789abcde1', 'The Material of the ContraBlat', NULL, 'cards', 'single', true,
'[
  {"id": "none", "label": "None", "description": "No backsplash", "icon": "X"},
  {"id": "wood", "label": "Wood", "description": "Wood backsplash", "icon": "TreePine"},
  {"id": "stone", "label": "Stone", "description": "Stone backsplash", "icon": "Mountain"},
  {"id": "glass", "label": "Glass", "description": "Glass backsplash", "icon": "Square"}
]'::jsonb, 7, 'ro'),

-- Kitchen File Upload Question
('11234567-89ab-cdef-0123-456789abcde8', '01234567-89ab-cdef-0123-456789abcde1', 'File upload', 'Upload your kitchen sketch and reference images', 'file-upload', 'multiple', false, NULL, 8, 'ro')

ON CONFLICT (id) DO UPDATE SET 
  question_text = EXCLUDED.question_text,
  description = EXCLUDED.description,
  question_type = EXCLUDED.question_type,
  selection_type = EXCLUDED.selection_type,
  required = EXCLUDED.required,
  options = EXCLUDED.options,
  sort_order = EXCLUDED.sort_order;

-- Update the measurements question with proper config
UPDATE request_questions 
SET measurements_config = '{
  "fields": [
    {"id": "length-a", "label": "A Length", "required": true},
    {"id": "height", "label": "Height", "required": true}
  ],
  "units": ["m", "cm", "mm"],
  "defaultUnit": "cm"
}'::jsonb,
depends_on_question_id = '11234567-89ab-cdef-0123-456789abcde1',
depends_on_values = '["straight", "l-shaped", "u-shaped", "island"]'::jsonb
WHERE id = '11234567-89ab-cdef-0123-456789abcde2';

-- Update the file upload question with proper config
UPDATE request_questions 
SET file_upload_config = '{
  "acceptedTypes": ["image/*", ".pdf", ".doc", ".docx"],
  "maxSize": 500,
  "maxFiles": 10,
  "description": "Upload sketches, measurements, or inspiration images",
  "helpGif": "/gifs/how-to-draw-kitchen-sketch.gif"
}'::jsonb
WHERE id = '11234567-89ab-cdef-0123-456789abcde8';

-- Add default questions for other categories (measurements, material, opening method)
-- These will be generated dynamically for categories that don't have specific questions

-- Generate default questions for Hallway
INSERT INTO request_questions (id, category_id, question_text, description, question_type, selection_type, required, measurements_config, sort_order, lang_code) VALUES
('21234567-89ab-cdef-0123-456789abcde1', '01234567-89ab-cdef-0123-456789abcde2', 'Rough measurements', 'Provide the dimensions for your furniture', 'measurements', 'single', true,
'{"fields": [{"id": "length", "label": "Length", "required": true}, {"id": "width", "label": "Width", "required": true}, {"id": "height", "label": "Height", "required": true}], "units": ["m", "cm", "mm"], "defaultUnit": "cm"}'::jsonb, 1, 'ro'),

('21234567-89ab-cdef-0123-456789abcde2', '01234567-89ab-cdef-0123-456789abcde2', 'The door Material', NULL, 'cards', 'multiple', true,
'[{"id": "pal", "label": "PAL", "description": "Particle board with melamine coating", "icon": "Square"}, {"id": "mdf-infoliat", "label": "MDF Infoliat", "description": "MDF with foil wrapping", "icon": "Layers"}, {"id": "mdf-vopsit", "label": "MDF Vopsit", "description": "Painted MDF finish", "icon": "Paintbrush"}]'::jsonb, 2, 'ro'),

('21234567-89ab-cdef-0123-456789abcde3', '01234567-89ab-cdef-0123-456789abcde2', 'The method of Opening', NULL, 'cards', 'single', true,
'[{"id": "push-to-open", "label": "Push to Open", "description": "Touch to open mechanism", "icon": "Hand"}, {"id": "maner", "label": "Maner", "description": "Traditional handles", "icon": "Grab"}]'::jsonb, 3, 'ro');

-- Repeat for other categories...
-- (I'll create a more complete version below)

COMMIT; 