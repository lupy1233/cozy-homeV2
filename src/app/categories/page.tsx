import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sofa,
  UtensilsCrossed,
  DoorOpen,
  BookOpen,
  Wrench,
  Zap,
  Paintbrush,
} from "lucide-react";

const categories = [
  {
    id: "furniture",
    name: "Mobilier",
    description:
      "Canapele, mese, scaune și alte piese de mobilier personalizat",
    icon: Sofa,
    href: "/categories/furniture",
  },
  {
    id: "kitchens",
    name: "Bucătării",
    description:
      "Bucătării complete personalizate, cu design modern și funcțional",
    icon: UtensilsCrossed,
    href: "/categories/kitchens",
  },
  {
    id: "wardrobes",
    name: "Dulapuri",
    description: "Dulapuri de dormitor, dressing și alte soluții de depozitare",
    icon: DoorOpen,
    href: "/categories/wardrobes",
  },
  {
    id: "libraries",
    name: "Biblioteci",
    description: "Biblioteci și rafturi personalizate pentru orice spațiu",
    icon: BookOpen,
    href: "/categories/libraries",
  },
];

const comingSoon = [
  {
    id: "plumbers",
    name: "Instalatori",
    description: "Servicii de instalare și mentenanță",
    icon: Wrench,
    comingSoon: true,
  },
  {
    id: "electricians",
    name: "Electricieni",
    description: "Instalații electrice și automatizări",
    icon: Zap,
    comingSoon: true,
  },
  {
    id: "painters",
    name: "Zugravi",
    description: "Servicii de zugrăveli și finisaje",
    icon: Paintbrush,
    comingSoon: true,
  },
];

export default function Categories() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Categorii</h1>
          <p className="text-xl text-gray-500">
            Alege categoria de mobilier sau servicii pentru care dorești să
            primești oferte
          </p>
        </div>

        {/* Available Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Mobilier Personalizat</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group block"
              >
                <div className="p-6 rounded-lg border hover:border-primary transition-colors">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-500">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Coming Soon Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-8">În Curând</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoon.map((category) => (
              <div
                key={category.id}
                className="p-6 rounded-lg border bg-muted/50"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    În Curând
                  </span>
                </div>
                <p className="text-gray-500">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Nu Găsești Ce Cauți?</h2>
          <p className="text-gray-500 mb-8">
            Contactează-ne pentru a discuta despre cerințele tale specifice
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Contactează-ne</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
