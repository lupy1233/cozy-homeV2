"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setStatus("error");
          setMessage("A apărut o eroare la verificarea email-ului.");
          return;
        }

        if (data.session) {
          setStatus("success");
          setMessage(
            "Email-ul a fost verificat cu succes! Vei fi redirecționat în câteva secunde..."
          );

          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            "Nu s-a putut verifica email-ul. Te rugăm să încerci din nou."
          );
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setStatus("error");
        setMessage("A apărut o eroare neașteptată.");
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Cozy Home
          </Link>

          {status === "loading" && (
            <>
              <div className="mx-auto mt-6 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                Se verifică email-ul...
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Te rugăm să aștepți câteva secunde.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="mx-auto mt-6 h-16 w-16 text-green-500" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                Email verificat!
              </h2>
              <p className="mt-2 text-sm text-green-600">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="mx-auto mt-6 h-16 w-16 text-red-500" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                Eroare de verificare
              </h2>
              <p className="mt-2 text-sm text-red-600">{message}</p>
              <div className="mt-6 space-y-3">
                <Link
                  href="/login"
                  className="block w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Încearcă să te autentifici
                </Link>
                <Link
                  href="/register"
                  className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Înregistrează-te din nou
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
