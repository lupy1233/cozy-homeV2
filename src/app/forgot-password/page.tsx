"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic email validation
    if (!email) {
      setError("Te rugăm să introduci adresa de email.");
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Te rugăm să introduci o adresă de email validă.");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual password reset logic
      console.log("Password reset request for:", email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Always show success for security reasons (don't reveal if email exists)
      setSuccess(true);
    } catch (err) {
      setError("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Cozy Home
            </Link>
            <CheckCircle className="mx-auto mt-6 h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Verifică-ți email-ul
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Dacă există un cont cu adresa{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {email}
              </span>
              , vei primi instrucțiuni pentru resetarea parolei.
            </p>
          </div>

          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Email-ul a fost trimis! Verifică-ți inbox-ul și folderul de spam.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Button onClick={() => router.push("/login")} className="w-full">
              Înapoi la autentificare
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="text-sm text-primary hover:text-primary/80"
              >
                Încearcă cu alt email
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Nu găsești email-ul?
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Verifică folderul de spam/junk</li>
              <li>• Poate dura până la 10 minute să ajungă</li>
              <li>• Verifică că adresa de email este corectă</li>
              <li>• Contactează suportul dacă problema persistă</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Cozy Home
          </Link>
          <Mail className="mx-auto mt-6 h-16 w-16 text-primary" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Ai uitat parola?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Nu-ți face griji! Introdu adresa de email și îți vom trimite
            instrucțiuni pentru resetarea parolei.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Reset Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Adresa de email</Label>
            <div className="mt-1 relative">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="nume@exemplu.com"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Se trimite..." : "Trimite instrucțiuni"}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Înapoi la autentificare
          </Link>
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nu ai cont încă?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Înregistrează-te aici
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
