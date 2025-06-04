"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setError(
        "Link-ul de resetare nu este valid. Te rugăm să soliciți un nou link."
      );
      setTokenValid(false);
      return;
    }

    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      // TODO: Implement actual token validation
      console.log("Validating reset token:", token);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate different scenarios
      if (token === "expired") {
        setError(
          "Link-ul de resetare a expirat. Te rugăm să soliciți un nou link."
        );
        setTokenValid(false);
        return;
      }

      if (token === "invalid") {
        setError(
          "Link-ul de resetare nu este valid. Te rugăm să soliciți un nou link."
        );
        setTokenValid(false);
        return;
      }

      setTokenValid(true);
    } catch (err) {
      setError(
        "A apărut o eroare la validarea link-ului. Te rugăm să încerci din nou."
      );
      setTokenValid(false);
    }
  };

  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (password.length < 8) errors.push("Minimum 8 caractere");
    if (!/[A-Z]/.test(password)) errors.push("O literă mare");
    if (!/[0-9]/.test(password)) errors.push("Un număr");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("Un simbol special");
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(`Parola trebuie să conțină: ${passwordErrors.join(", ")}`);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Parolele nu se potrivesc.");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual password reset
      console.log("Resetting password with token:", token);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);
    } catch (err) {
      setError(
        "A apărut o eroare la resetarea parolei. Te rugăm să încerci din nou."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = validatePassword(formData.password);
  const isPasswordValid =
    passwordStrength.length === 0 && formData.password.length > 0;

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Se validează link-ul...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Success state
  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Mobilier Personalizat
            </Link>
            <CheckCircle className="mx-auto mt-6 h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Parola a fost resetată!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Parola ta a fost schimbată cu succes. Acum te poți autentifica cu
              noua parolă.
            </p>
          </div>

          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Parola a fost actualizată cu succes!
            </AlertDescription>
          </Alert>

          <Button onClick={() => router.push("/login")} className="w-full">
            Autentifică-te acum
          </Button>
        </div>
      </main>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Mobilier Personalizat
            </Link>
            <AlertCircle className="mx-auto mt-6 h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Link invalid
            </h2>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Button
              onClick={() => router.push("/forgot-password")}
              className="w-full"
            >
              Solicită un nou link
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ← Înapoi la autentificare
              </Link>
            </div>
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
            Mobilier Personalizat
          </Link>
          <Lock className="mx-auto mt-6 h-16 w-16 text-primary" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Resetează parola
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {email && (
              <>
                Creează o parolă nouă pentru{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {email}
                </span>
              </>
            )}
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
          {/* New Password */}
          <div>
            <Label htmlFor="password">Parola nouă</Label>
            <div className="mt-1 relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10"
                placeholder="Creează o parolă sigură"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  {isPasswordValid ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={
                      isPasswordValid ? "text-green-600" : "text-red-600"
                    }
                  >
                    {isPasswordValid ? "Parolă sigură" : "Parolă nesigură"}
                  </span>
                </div>
                {passwordStrength.length > 0 && (
                  <p className="text-xs text-red-600">
                    Lipsește: {passwordStrength.join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirmă parola nouă</Label>
            <div className="mt-1 relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10 pr-10"
                placeholder="Confirmă parola nouă"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="mt-1 flex items-center space-x-2 text-xs">
                {formData.password === formData.confirmPassword ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">
                      Parolele se potrivesc
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <span className="text-red-600">
                      Parolele nu se potrivesc
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              !isPasswordValid ||
              formData.password !== formData.confirmPassword
            }
          >
            {isLoading ? "Se resetează..." : "Resetează parola"}
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
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Se încarcă...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
