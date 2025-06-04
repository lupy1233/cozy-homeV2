import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Caracteristici | Mobilier Personalizat România",
  description:
    "Descoperă caracteristicile platformei noastre care te ajută să găsești cel mai bun mobilier personalizat din România.",
};

export default function FeaturesPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Caracteristici Puternice pentru Mobilierul Tău
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descoperă cum platforma noastră poate transforma procesul de găsire
            a mobilierului personalizat perfect pentru casa ta.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* RFQ System */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Sistem RFQ Avansat</h3>
              <p className="text-muted-foreground mb-4">
                Creează cereri detaliate pentru mobilierul dorit cu ușurință.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Întrebări dinamice personalizate</li>
                <li>• Încărcare imagini de referință</li>
                <li>• Specificații detaliate</li>
                <li>• Urmărire progres</li>
              </ul>
            </div>

            {/* Manufacturer Network */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">
                Rețea de Producători
              </h3>
              <p className="text-muted-foreground mb-4">
                Acces la cei mai buni producători de mobilier din România.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Producători verificați</li>
                <li>• Portofolii complete</li>
                <li>• Evaluări și recenzii</li>
                <li>• Certificări de calitate</li>
              </ul>
            </div>

            {/* Offer Comparison */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Comparare Oferte</h3>
              <p className="text-muted-foreground mb-4">
                Compară ofertele primite pentru a lua cea mai bună decizie.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Comparare preț și calitate</li>
                <li>• Timp de livrare</li>
                <li>• Materiale utilizate</li>
                <li>• Garanții oferite</li>
              </ul>
            </div>

            {/* Communication */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Comunicare Directă</h3>
              <p className="text-muted-foreground mb-4">
                Comunică direct cu producătorii pentru detalii suplimentare.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Mesagerie integrată</li>
                <li>• Partajare documente</li>
                <li>• Programare întâlniri</li>
                <li>• Suport în timp real</li>
              </ul>
            </div>

            {/* Project Management */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">
                Gestionare Proiecte
              </h3>
              <p className="text-muted-foreground mb-4">
                Urmărește progresul proiectului tău pas cu pas.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Status în timp real</li>
                <li>• Milestone-uri importante</li>
                <li>• Notificări automate</li>
                <li>• Istoric complet</li>
              </ul>
            </div>

            {/* Quality Assurance */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">
                Asigurarea Calității
              </h3>
              <p className="text-muted-foreground mb-4">
                Garantăm calitatea prin verificări riguroase.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Verificare producători</li>
                <li>• Control calitate materiale</li>
                <li>• Inspecții intermediare</li>
                <li>• Garanție extinsă</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Gata să Îți Transformi Casa?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experimentează viitorul mobilierului personalizat cu
            caracteristicile comprehensive ale platformei noastre.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Începe Acum</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
