import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, MessageSquare, Star } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex min-h-screen flex-col items-center">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Mobilier Personalizat pentru Casa Ta
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Conectăm proprietarii de case cu producătorii de mobilier de
                  top din România. Primește oferte personalizate pentru
                  mobilierul visurilor tale.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/register">
                    Începe o Cerere
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/how-it-works">Află Mai Multe</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Cum Funcționează
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Trei pași simpli pentru a obține mobilierul perfect pentru
                  casa ta
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">1. Trimite Cererea</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Descrie mobilierul dorit și încarcă schițe sau imagini de
                  referință
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">2. Primește Oferte</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Producătorii verificați îți vor trimite oferte personalizate
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">3. Alege și Colaborează</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Selectează oferta preferată și lucrează direct cu producătorul
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ce Spun Clienții Noștri
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Descoperă experiențele celor care și-au realizat visul
                  mobilierului personalizat
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-2 rounded-lg border p-6 shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200" />
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {testimonial.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const testimonials = [
  {
    name: "Maria Popescu",
    location: "București",
    content:
      "Am primit oferte de la producători de top pentru bucătăria mea. Procesul a fost simplu și eficient.",
  },
  {
    name: "Ioan Dumitrescu",
    location: "Cluj-Napoca",
    content:
      "Biblioteca personalizată a depășit așteptările. Comunicarea cu producătorul a fost excelentă.",
  },
  {
    name: "Elena Ionescu",
    location: "Iași",
    content:
      "Dulapul de la dormitor este exact ce îmi doream. Calitatea și atenția la detalii sunt remarcabile.",
  },
];
