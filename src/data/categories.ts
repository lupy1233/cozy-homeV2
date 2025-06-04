export interface FurnitureCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  image?: string; // Optional image URL
}

export const furnitureCategories: FurnitureCategory[] = [
  {
    id: "kitchen",
    name: "Kitchen",
    icon: "ChefHat",
    description:
      "Bucătării moderne și funcționale, mobilier de bucătărie personalizat",
    image: "/images/categories/kitchen.jpg",
  },
  {
    id: "hallway",
    name: "Hallway",
    icon: "DoorOpen",
    description:
      "Mobilier pentru hol - cuiere, comode, oglinzi și soluții de depozitare",
    image: "/images/categories/hallway.jpg",
  },
  {
    id: "bedroom",
    name: "Bedroom",
    icon: "Bed",
    description:
      "Dormitoare confortabile - paturi, noptiere, comode și dulapuri",
    image: "/images/categories/bedroom.jpg",
  },
  {
    id: "livingroom",
    name: "Living Room",
    icon: "Sofa",
    description:
      "Mobilier pentru living - canapele, fotolii, mese și biblioteci",
    image: "/images/categories/livingroom.jpg",
  },
  {
    id: "bathroom",
    name: "Bathroom",
    icon: "Bath",
    description:
      "Mobilier de baie - vanity-uri, dulapuri și soluții de depozitare",
    image: "/images/categories/bathroom.jpg",
  },
  {
    id: "office",
    name: "Office",
    icon: "Monitor",
    description:
      "Mobilier de birou - birouri, scaune, biblioteci și soluții de organizare",
    image: "/images/categories/office.jpg",
  },
  {
    id: "dressingroom",
    name: "Dressing Room",
    icon: "Shirt",
    description: "Dressing-uri și walk-in closets personalizate",
    image: "/images/categories/dressingroom.jpg",
  },
  {
    id: "dulap",
    name: "Dulap",
    icon: "Cabinet",
    description: "Dulapuri personalizate pentru orice cameră",
    image: "/images/categories/dulap.jpg",
  },
  {
    id: "outside",
    name: "Outside Furniture",
    icon: "TreePine",
    description:
      "Mobilier de exterior - mese, scaune, pergole și soluții pentru grădină",
    image: "/images/categories/outside.jpg",
  },
];

// Helper function to get category by id
export const getCategoryById = (id: string): FurnitureCategory | undefined => {
  return furnitureCategories.find((category) => category.id === id);
};

// Helper function to get multiple categories by ids
export const getCategoriesByIds = (ids: string[]): FurnitureCategory[] => {
  return furnitureCategories.filter((category) => ids.includes(category.id));
};
