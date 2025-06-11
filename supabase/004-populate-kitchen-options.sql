-- Populate Kitchen Question Options
-- Run this in your Supabase SQL Editor to add comprehensive options for kitchen questions

-- Update Layout of the kitchen question
UPDATE request_questions 
SET options = '[
  {
    "id": "straight", 
    "label": "În linie", 
    "description": "Bucătărie în linie dreaptă de-a lungul unui perete", 
    "icon": "Minus"
  },
  {
    "id": "l-shaped", 
    "label": "În formă de L", 
    "description": "Bucătărie dispusă în unghi de 90 de grade", 
    "icon": "CornerDownRight"
  },
  {
    "id": "u-shaped", 
    "label": "În formă de U", 
    "description": "Bucătărie pe trei laturi, în formă de U", 
    "icon": "Square"
  },
  {
    "id": "parallel", 
    "label": "Paralelă", 
    "description": "Bucătărie pe două laturi paralele", 
    "icon": "Equal"
  },
  {
    "id": "island", 
    "label": "Cu insulă", 
    "description": "Bucătărie cu insulă centrală", 
    "icon": "Circle"
  }
]'::jsonb,
selection_type = 'single'
WHERE question_text ILIKE '%Layout of the kitchen%' 
  AND category_id = '01234567-89ab-cdef-0123-456789abcde1';

-- Update Door Material question
UPDATE request_questions 
SET options = '[
  {
    "id": "pal", 
    "label": "PAL (Melaminat)", 
    "description": "Plăci aglomerate cu înveliș melaminat - rezistent și economic", 
    "icon": "Square"
  },
  {
    "id": "mdf-infoliat", 
    "label": "MDF Înfoliat", 
    "description": "MDF cu folie PVC - aspect modern și ușor de întreținut", 
    "icon": "Layers"
  },
  {
    "id": "mdf-vopsit", 
    "label": "MDF Vopsit", 
    "description": "MDF vopsit în culori mate sau lucioase", 
    "icon": "Paintbrush"
  },
  {
    "id": "lacuit", 
    "label": "Lacuit", 
    "description": "Finisaj lacuit de înaltă calitate cu aspect lucios", 
    "icon": "Sparkles"
  },
  {
    "id": "furnir", 
    "label": "Furnir", 
    "description": "Furnir din lemn natural pentru aspect elegant", 
    "icon": "TreePine"
  },
  {
    "id": "lemn-masiv", 
    "label": "Lemn Masiv", 
    "description": "Lemn masiv - cea mai naturală și durabilă opțiune", 
    "icon": "Tree"
  }
]'::jsonb,
selection_type = 'multiple'
WHERE question_text ILIKE '%door Material%' 
  AND category_id = '01234567-89ab-cdef-0123-456789abcde1';

-- Update Bottom Opening Method question
UPDATE request_questions 
SET options = '[
  {
    "id": "push-to-open", 
    "label": "Push to Open", 
    "description": "Deschidere prin apăsare - fără mânere vizibile", 
    "icon": "Hand"
  },
  {
    "id": "profil-gola", 
    "label": "Profil Gola", 
    "description": "Mâner integrat în profil - aspect minimalist", 
    "icon": "Grip"
  },
  {
    "id": "manere-clasice", 
    "label": "Mânere Clasice", 
    "description": "Mânere tradiționale din metal sau lemn", 
    "icon": "Grab"
  },
  {
    "id": "manere-moderne", 
    "label": "Mânere Moderne", 
    "description": "Mânere contemporane din aluminiu sau inox", 
    "icon": "Menu"
  }
]'::jsonb,
selection_type = 'single'
WHERE question_text ILIKE '%Opening the bottom part%' 
  AND category_id = '01234567-89ab-cdef-0123-456789abcde1';

-- Update Top Opening Method question
UPDATE request_questions 
SET options = '[
  {
    "id": "push-to-open", 
    "label": "Push to Open", 
    "description": "Deschidere prin apăsare pentru dulapuri suspendate", 
    "icon": "Hand"
  },
  {
    "id": "profil-banda-led", 
    "label": "Profil cu Bandă LED", 
    "description": "Mâner cu iluminare LED integrată", 
    "icon": "Lightbulb"
  },
  {
    "id": "manere-suspendate", 
    "label": "Mânere Suspendate", 
    "description": "Mânere speciale pentru dulapuri suspendate", 
    "icon": "Grab"
  },
  {
    "id": "deschidere-verticala", 
    "label": "Deschidere Verticală", 
    "description": "Uși care se deschid în sus cu amortizoare", 
    "icon": "ArrowUp"
  }
]'::jsonb,
selection_type = 'single'
WHERE question_text ILIKE '%opening the top part%' 
  AND category_id = '01234567-89ab-cdef-0123-456789abcde1';

-- Update Worktop Material question
UPDATE request_questions 
SET options = '[
  {
    "id": "quartz", 
    "label": "Cuarț", 
    "description": "Suprafață din cuarț - durabilă și nonporoasă", 
    "icon": "Gem"
  },
  {
    "id": "granit", 
    "label": "Granit", 
    "description": "Piatră naturală granit - elegantă și rezistentă", 
    "icon": "Mountain"
  },
  {
    "id": "lemn-masiv", 
    "label": "Lemn Masiv", 
    "description": "Blat din lemn masiv - cald și natural", 
    "icon": "TreePine"
  },
  {
    "id": "laminat", 
    "label": "Laminat", 
    "description": "Laminat HPL - economic și disponibil în multe variante", 
    "icon": "Square"
  },
  {
    "id": "compozit", 
    "label": "Compozit", 
    "description": "Material compozit - rezistent la zgârieturi și pete", 
    "icon": "Layers"
  },
  {
    "id": "marmura", 
    "label": "Marmură", 
    "description": "Marmură naturală - aspect luxos și elegant", 
    "icon": "Crown"
  },
  {
    "id": "inox", 
    "label": "Inox", 
    "description": "Oțel inoxidabil - ideal pentru bucătării profesionale", 
    "icon": "Chrome"
  }
]'::jsonb,
selection_type = 'single'
WHERE question_text ILIKE '%Material of the Worktop%' 
  AND category_id = '01234567-89ab-cdef-0123-456789abcde1';

-- Update ContraBlat Material question
UPDATE request_questions 
SET options = '[
  {
    "id": "fara", 
    "label": "Fără ContraBlat", 
    "description": "Nu se dorește contraBlat", 
    "icon": "X"
  },
  {
    "id": "faience", 
    "label": "Faianță", 
    "description": "Faianță ceramică - clasică și ușor de curățat", 
    "icon": "Square"
  },
  {
    "id": "sticla", 
    "label": "Sticlă", 
    "description": "Panou din sticlă securizată - modern și elegant", 
    "icon": "Sparkles"
  },
  {
    "id": "piatra-naturala", 
    "label": "Piatră Naturală", 
    "description": "Piatră naturală - marmură, granit sau travertin", 
    "icon": "Mountain"
  },
  {
    "id": "mdf-vopsit", 
    "label": "MDF Vopsit", 
    "description": "MDF vopsit în culoarea dorită", 
    "icon": "Paintbrush"
  },
  {
    "id": "lemn", 
    "label": "Lemn", 
    "description": "ContraBlat din lemn masiv sau furnir", 
    "icon": "TreePine"
  },
  {
    "id": "mozaic", 
    "label": "Mozaic", 
    "description": "Mozaic ceramic sau din sticlă", 
    "icon": "Grid3x3"
  }
]'::jsonb,
selection_type = 'single'
WHERE question_text ILIKE '%ContraBlat%' 
  AND category_id = '01234567-89ab-cdef-0123-456789abcde1';

-- Update Rough Measurements question with proper configuration
UPDATE request_questions 
SET measurements_config = '{
  "fields": [
    {
      "id": "length-a", 
      "label": "Lungime A (m)", 
      "required": true,
      "description": "Lungimea principală a bucătăriei"
    },
    {
      "id": "length-b", 
      "label": "Lungime B (m)", 
      "required": false,
      "description": "Lungimea secundară (pentru L sau U)"
    },
    {
      "id": "height", 
      "label": "Înălțime (m)", 
      "required": true,
      "description": "Înălțimea de la podea la tavan"
    },
    {
      "id": "depth", 
      "label": "Adâncime (cm)", 
      "required": false,
      "description": "Adâncimea mobilierului (standard 60cm)"
    }
  ],
  "units": ["m", "cm", "mm"],
  "defaultUnit": "m",
  "helpText": "Măsurătorile aproximative vă ajută să primiți oferte mai precise"
}'::jsonb,
question_type = 'measurements'
WHERE question_text ILIKE '%Rough measurements%' 
  AND category_id = '01234567-89ab-cdef-0123-456789abcde1';

-- Update File Upload question with proper configuration
UPDATE request_questions 
SET file_upload_config = '{
  "acceptedTypes": ["image/*", ".pdf", ".doc", ".docx", ".dwg"],
  "maxSize": 500,
  "maxFiles": 10,
  "description": "Încărcați schițe, măsurători sau imagini inspiraționale pentru bucătărie",
  "helpText": "Acceptăm imagini (JPG, PNG), PDF-uri, documente Word și fișiere AutoCAD",
  "examples": [
    "Schița cu măsurători",
    "Fotografii cu bucătării similare",
    "Planul camerei",
    "Imagini inspiraționale"
  ]
}'::jsonb,
question_type = 'file-upload',
required = false
WHERE question_text ILIKE '%File upload%' 
  AND category_id = '01234567-89ab-cdef-0123-456789abcde1';

-- Update all timestamps
UPDATE request_questions 
SET updated_at = NOW()
WHERE category_id = '01234567-89ab-cdef-0123-456789abcde1';

-- Verify the updates
SELECT 
  question_text,
  question_type,
  selection_type,
  required,
  CASE 
    WHEN options IS NOT NULL THEN jsonb_array_length(options)
    ELSE 0
  END as options_count,
  CASE 
    WHEN measurements_config IS NOT NULL THEN 'Yes'
    ELSE 'No'
  END as has_measurements_config,
  CASE 
    WHEN file_upload_config IS NOT NULL THEN 'Yes'
    ELSE 'No'
  END as has_file_config
FROM request_questions 
WHERE category_id = '01234567-89ab-cdef-0123-456789abcde1'
  AND lang_code = 'ro'
ORDER BY sort_order; 