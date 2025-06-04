import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Star,
  CheckCircle,
  Building2,
  Shield,
  Clock,
} from "lucide-react";

export default function HowItWorks() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Cum Funcționează</h1>
          <p className="text-xl text-gray-500">
            Procesul nostru simplu pentru a obține mobilier personalizat de
            calitate
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">1. Trimite Cererea</h2>
              <p className="text-gray-500 mb-4">
                Completează formularul nostru simplu cu detaliile mobilierului
                dorit. Poți include dimensiuni, materiale preferate, și imagini
                de referință.
              </p>
              <ul className="space-y-2 text-gray-500">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Selectează categoria de mobilier
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Specifică camera și dimensiunile
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Încarcă imagini sau schițe
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="aspect-video bg-muted rounded-lg" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="flex-1">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">2. Primește Oferte</h2>
              <p className="text-gray-500 mb-4">
                Producătorii verificați îți vor trimite oferte personalizate în
                funcție de cerințele tale.
              </p>
              <ul className="space-y-2 text-gray-500">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Maxim 3 producători per cerere
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Oferte detaliate cu preț și termen
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Posibilitatea de a întreba detalii
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="aspect-video bg-muted rounded-lg" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                3. Alege și Colaborează
              </h2>
              <p className="text-gray-500 mb-4">
                Selectează oferta preferată și lucrează direct cu producătorul
                pentru a finaliza detaliile.
              </p>
              <ul className="space-y-2 text-gray-500">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Comunicare directă cu producătorul
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Posibilitatea de a face modificări
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Urmărirea progresului
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="aspect-video bg-muted rounded-lg" />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            De Ce Să Alegi Cozy Home
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border">
              <Building2 className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Producători Verificați</h3>
              <p className="text-gray-500">
                Toți producătorii sunt verificați și evaluați pentru calitatea
                serviciilor lor.
              </p>
            </div>
            <div className="p-6 rounded-lg border">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Siguranță Garantată</h3>
              <p className="text-gray-500">
                Plăți securizate și protecție pentru ambele părți în timpul
                colaborării.
              </p>
            </div>
            <div className="p-6 rounded-lg border">
              <Clock className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Economisește Timpul</h3>
              <p className="text-gray-500">
                Primește oferte personalizate fără să cauți și să contactezi
                producători individual.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Gata să Începi?</h2>
          <p className="text-gray-500 mb-8">
            Trimite prima ta cerere de ofertă și primește propuneri
            personalizate de la producătorii noștri verificați.
          </p>
          <Button size="lg" asChild>
            <Link href="/rfq/create">Începe o Cerere</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
