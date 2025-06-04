import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function RFQSuccess() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="mb-4 text-3xl font-bold">Cererea a fost Trimisă!</h1>
          <p className="mb-8 text-gray-500">
            Mulțumim pentru cererea ta. Producătorii verificați vor analiza
            detaliile și îți vor trimite oferte personalizate în curând.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Vei primi notificări prin email când:
            </p>
            <ul className="mx-auto max-w-md space-y-2 text-left text-sm text-gray-500">
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Un producător îți trimite o ofertă
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Oferta ta este acceptată
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Este timpul să lași o recenzie
              </li>
            </ul>
          </div>
          <div className="mt-8 space-x-4">
            <Button asChild>
              <Link href="/dashboard">Vezi Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Înapoi la Pagina Principală</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
