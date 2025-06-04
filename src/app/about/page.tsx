import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Despre Noi | Mobilier Personalizat România",
  description:
    "Aflați despre misiunea noastră de a conecta proprietarii de case cu cei mai buni producători de mobilier din România.",
};

const team = [
  {
    name: "Maria Popescu",
    role: "CEO & Fondator",
    image: "/placeholder-avatar.svg",
    bio: "Cu peste 15 ani de experiență în industria mobilierului, Maria a fondat platforma pentru a face mobilierul personalizat accesibil tuturor.",
  },
  {
    name: "Alexandru Ionescu",
    role: "Director Tehnic",
    image: "/placeholder-avatar.svg",
    bio: "Alexandru conduce inovația tehnică, aducând expertiza sa în dezvoltarea platformelor digitale pentru industria mobilierului.",
  },
  {
    name: "Elena Dumitrescu",
    role: "Director Produs",
    image: "/placeholder-avatar.svg",
    bio: "Elena se asigură că produsele noastre îndeplinesc cele mai înalte standarde de experiență utilizator și funcționalitate.",
  },
  {
    name: "Andrei Radu",
    role: "Director Inginerie",
    image: "/placeholder-avatar.svg",
    bio: "Andrei supraveghează echipa de inginerie, concentrându-se pe crearea de soluții fiabile pentru marketplace-ul de mobilier.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Despre Mobilier Personalizat România
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Suntem în misiunea de a conecta proprietarii de case cu cei mai buni
            producători de mobilier personalizat din România.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Povestea Noastră</h2>
              <p className="text-muted-foreground mb-4">
                Fondată în 2023, platforma noastră a început cu o idee simplă:
                să facem mobilierul personalizat accesibil tuturor românilor. Am
                observat că găsirea producătorilor de calitate era dificilă și
                consumatoare de timp.
              </p>
              <p className="text-muted-foreground mb-4">
                Echipa noastră de experți în tehnologie și design a creat o
                platformă care conectează eficient proprietarii de case cu
                producătorii de mobilier. Credem că fiecare român merită să aibă
                mobilierul visurilor sale.
              </p>
              <p className="text-muted-foreground">
                Astăzi, suntem mândri să servim sute de clienți mulțumiți care
                și-au transformat casele cu mobilier personalizat de calitate
                superioară.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-muted">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  Imagine cu biroul nostru
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Valorile Noastre
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-background">
              <h3 className="text-xl font-semibold mb-4">Calitate</h3>
              <p className="text-muted-foreground">
                Colaborăm doar cu producătorii de mobilier care respectă cele
                mai înalte standarde de calitate și artizanat.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background">
              <h3 className="text-xl font-semibold mb-4">Transparență</h3>
              <p className="text-muted-foreground">
                Oferim transparență completă în procesul de ofertare, fără
                costuri ascunse sau surprize neplăcute.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background">
              <h3 className="text-xl font-semibold mb-4">Sustenabilitate</h3>
              <p className="text-muted-foreground">
                Promovăm utilizarea materialelor sustenabile și practicile
                ecologice în industria mobilierului.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Echipa Noastră
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    width={192}
                    height={192}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary mb-4">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Alătură-te Misiunii Noastre
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Fii parte din viitorul industriei mobilierului în România. Căutăm
            mereu persoane talentate care împărtășesc pasiunea noastră pentru
            inovație.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Contactează-ne</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
