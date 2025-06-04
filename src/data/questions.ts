export type QuestionType = "cards" | "measurements" | "file-upload";
export type SelectionType = "single" | "multiple" | "single-with-addon";

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  image?: string;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  selectionType?: SelectionType;
  options?: QuestionOption[];
  required: boolean;
  dependsOn?: {
    questionId: string;
    values: string[];
  };
  measurements?: {
    fields: {
      id: string;
      label: string;
      required: boolean;
    }[];
    units: string[];
    defaultUnit: string;
  };
  fileUpload?: {
    acceptedTypes: string[];
    maxSize: number; // in MB
    maxFiles: number;
    description: string;
    helpGif?: string;
  };
}

export interface CategoryQuestions {
  categoryId: string;
  questions: Question[];
}

export const categoryQuestions: CategoryQuestions[] = [
  {
    categoryId: "kitchen",
    questions: [
      {
        id: "kitchen-layout",
        title: "Layout of the kitchen",
        description: "Choose the basic layout and optionally add an island",
        type: "cards",
        selectionType: "single-with-addon",
        required: true,
        options: [
          {
            id: "straight",
            label: "Straight",
            description: "Linear kitchen layout along one wall",
            icon: "Minus",
          },
          {
            id: "l-shaped",
            label: "L-shaped",
            description: "Kitchen layout forming an L shape",
            icon: "CornerDownRight",
          },
          {
            id: "u-shaped",
            label: "U-shaped",
            description: "Kitchen layout forming a U shape",
            icon: "Square",
          },
          {
            id: "island",
            label: "Add Island",
            description: "Additional island in the center",
            icon: "Circle",
          },
        ],
      },
      {
        id: "kitchen-measurements",
        title: "Rough measurements",
        description: "Provide the dimensions for your kitchen layout",
        type: "measurements",
        required: true,
        dependsOn: {
          questionId: "kitchen-layout",
          values: ["straight", "l-shaped", "u-shaped", "island"],
        },
        measurements: {
          fields: [
            { id: "length-a", label: "A Length", required: true },
            { id: "height", label: "Height", required: true },
          ],
          units: ["m", "cm", "mm"],
          defaultUnit: "cm",
        },
      },
      {
        id: "kitchen-door-material",
        title: "The door Material",
        description: "Choose materials for bottom and top parts of the kitchen",
        type: "cards",
        selectionType: "multiple",
        required: true,
        options: [
          {
            id: "pal",
            label: "PAL",
            description: "Particle board with melamine coating",
            icon: "Square",
          },
          {
            id: "mdf-infoliat",
            label: "MDF Infoliat",
            description: "MDF with foil wrapping",
            icon: "Layers",
          },
          {
            id: "mdf-vopsit",
            label: "MDF Vopsit",
            description: "Painted MDF finish",
            icon: "Paintbrush",
          },
        ],
      },
      {
        id: "kitchen-opening-bottom",
        title: "The method of Opening the bottom part of the kitchen",
        type: "cards",
        selectionType: "single",
        required: true,
        options: [
          {
            id: "push-to-open",
            label: "Push to Open",
            description: "Touch to open mechanism",
            icon: "Hand",
          },
          {
            id: "profil-gola",
            label: "Profil Gola",
            description: "Integrated handle profile",
            icon: "Grip",
          },
          {
            id: "maner",
            label: "Maner",
            description: "Traditional handles",
            icon: "Grab",
          },
        ],
      },
      {
        id: "kitchen-opening-top",
        title: "The method of opening the top part",
        type: "cards",
        selectionType: "single",
        required: true,
        options: [
          {
            id: "push-to-open",
            label: "Push to open",
            description: "Touch to open mechanism",
            icon: "Hand",
          },
          {
            id: "profil-banda-led",
            label: "Profil Banda led",
            description: "LED strip profile handle",
            icon: "Lightbulb",
          },
          {
            id: "maner",
            label: "Maner",
            description: "Traditional handles",
            icon: "Grab",
          },
        ],
      },
      {
        id: "kitchen-worktop-material",
        title: "The Material of the Worktop",
        type: "cards",
        selectionType: "single",
        required: true,
        options: [
          {
            id: "wood",
            label: "Wood",
            description: "Natural wood worktop",
            icon: "TreePine",
          },
          {
            id: "stone",
            label: "Stone",
            description: "Natural stone surface",
            icon: "Mountain",
          },
          {
            id: "granite",
            label: "Granite",
            description: "Granite countertop",
            icon: "Gem",
          },
        ],
      },
      {
        id: "kitchen-contrablat-material",
        title: "The Material of the ContraBlat",
        type: "cards",
        selectionType: "single",
        required: true,
        options: [
          {
            id: "none",
            label: "None",
            description: "No backsplash",
            icon: "X",
          },
          {
            id: "wood",
            label: "Wood",
            description: "Wood backsplash",
            icon: "TreePine",
          },
          {
            id: "stone",
            label: "Stone",
            description: "Stone backsplash",
            icon: "Mountain",
          },
          {
            id: "glass",
            label: "Glass",
            description: "Glass backsplash",
            icon: "Square",
          },
        ],
      },
      {
        id: "kitchen-files",
        title: "File upload",
        description: "Upload your kitchen sketch and reference images",
        type: "file-upload",
        required: false,
        fileUpload: {
          acceptedTypes: ["image/*", ".pdf", ".doc", ".docx"],
          maxSize: 500,
          maxFiles: 10,
          description: "Upload sketches, measurements, or inspiration images",
          helpGif: "/gifs/how-to-draw-kitchen-sketch.gif",
        },
      },
    ],
  },
];

// Helper functions
export const getQuestionsForCategory = (categoryId: string): Question[] => {
  const categoryData = categoryQuestions.find(
    (cq) => cq.categoryId === categoryId
  );
  return categoryData?.questions || [];
};

export const getQuestionById = (
  categoryId: string,
  questionId: string
): Question | undefined => {
  const questions = getQuestionsForCategory(categoryId);
  return questions.find((q) => q.id === questionId);
};

// Generate default questions for other categories
export const generateDefaultQuestions = (categoryId: string): Question[] => {
  return [
    {
      id: `${categoryId}-measurements`,
      title: "Rough measurements",
      description: "Provide the dimensions for your furniture",
      type: "measurements",
      required: true,
      measurements: {
        fields: [
          { id: "length", label: "Length", required: true },
          { id: "width", label: "Width", required: true },
          { id: "height", label: "Height", required: true },
        ],
        units: ["m", "cm", "mm"],
        defaultUnit: "cm",
      },
    },
    {
      id: `${categoryId}-door-material`,
      title: "The door Material",
      type: "cards",
      selectionType: "multiple",
      required: true,
      options: [
        {
          id: "pal",
          label: "PAL",
          description: "Particle board with melamine coating",
          icon: "Square",
        },
        {
          id: "mdf-infoliat",
          label: "MDF Infoliat",
          description: "MDF with foil wrapping",
          icon: "Layers",
        },
        {
          id: "mdf-vopsit",
          label: "MDF Vopsit",
          description: "Painted MDF finish",
          icon: "Paintbrush",
        },
      ],
    },
    {
      id: `${categoryId}-opening-method`,
      title: "The method of Opening",
      type: "cards",
      selectionType: "single",
      required: true,
      options: [
        {
          id: "push-to-open",
          label: "Push to Open",
          description: "Touch to open mechanism",
          icon: "Hand",
        },
        {
          id: "maner",
          label: "Maner",
          description: "Traditional handles",
          icon: "Grab",
        },
      ],
    },
  ];
};
