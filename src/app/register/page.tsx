"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  accountType: UserRole;
  acceptTerms: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  accountType?: string;
  acceptTerms?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    accountType: "HOMEOWNER",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  // Don't render if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (password.length < 8) errors.push("Minimum 8 caractere");
    if (!/[A-Z]/.test(password)) errors.push("O literă mare");
    if (!/[0-9]/.test(password)) errors.push("Un număr");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("Un simbol special");
    if (/\s/.test(password)) errors.push("Fără spații");
    return errors;
  };

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email-ul este obligatoriu";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email-ul nu este valid";
    }

    // Password validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = `Parola trebuie să conțină: ${passwordErrors.join(
        ", "
      )}`;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Parolele nu se potrivesc";
    }

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Prenumele este obligatoriu";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Numele este obligatoriu";
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Numărul de telefon este obligatoriu";
    } else if (!/^(\+40|0)[0-9]{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Numărul de telefon nu este valid";
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Trebuie să accepți termenii și condițiile";
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear specific field error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (generalError) setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: formData.accountType,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          },
        },
      });

      if (signUpError) {
        // Handle specific error types
        if (signUpError.message.includes("User already registered")) {
          setGeneralError(
            "Un cont cu acest email există deja. Încearcă să te autentifici."
          );
        } else if (signUpError.message.includes("Password")) {
          setGeneralError("Parola nu îndeplinește cerințele de securitate.");
        } else {
          setGeneralError(
            signUpError.message ||
              "A apărut o eroare. Te rugăm să încerci din nou."
          );
        }
        return;
      }

      // Success - redirect to email verification
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setGeneralError(
        "A apărut o eroare neașteptată. Te rugăm să încerci din nou."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth registration with Supabase
      console.log("Google registration - coming soon");
      setGeneralError("Înregistrarea cu Google va fi disponibilă în curând.");
    } catch (err) {
      setGeneralError(
        "Înregistrarea cu Google a eșuat. Te rugăm să încerci din nou."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleRegister = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Apple OAuth registration with Supabase
      console.log("Apple registration - coming soon");
      setGeneralError("Înregistrarea cu Apple va fi disponibilă în curând.");
    } catch (err) {
      setGeneralError(
        "Înregistrarea cu Apple a eșuat. Te rugăm să încerci din nou."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = validatePassword(formData.password);
  const isPasswordValid =
    passwordStrength.length === 0 && formData.password.length > 0;

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Cozy Home
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Creează un cont nou
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sau{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              autentifică-te dacă ai deja un cont
            </Link>
          </p>
        </div>

        {/* General Error Alert */}
        {generalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        )}

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Account Type Selection */}
          <div>
            <Label className="text-base font-medium">Tipul contului</Label>
            <div className="mt-3 flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <span
                  className={`text-sm font-medium ${
                    formData.accountType === "HOMEOWNER"
                      ? "text-primary"
                      : "text-gray-500"
                  }`}
                >
                  Proprietar de casă
                </span>
                <Switch
                  checked={formData.accountType === "ARCHITECT"}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      accountType: checked ? "ARCHITECT" : "HOMEOWNER",
                    }))
                  }
                />
                <span
                  className={`text-sm font-medium ${
                    formData.accountType === "ARCHITECT"
                      ? "text-primary"
                      : "text-gray-500"
                  }`}
                >
                  Arhitect
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <Label htmlFor="firstName">Prenume</Label>
              <div className="mt-1 relative">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`pl-10 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  placeholder="Ion"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName">Nume</Label>
              <div className="mt-1 relative">
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`}
                  placeholder="Popescu"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Adresa de email</Label>
            <div className="mt-1 relative">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                placeholder="nume@exemplu.com"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Număr de telefon</Label>
            <div className="mt-1 relative">
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                placeholder="+40 123 456 789"
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Parola</Label>
            <div className="mt-1 relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
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

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirmă parola</Label>
            <div className="mt-1 relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`pl-10 pr-10 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                placeholder="Confirmă parola"
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

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, acceptTerms: !!checked }))
              }
              className="mt-1"
            />
            <div className="text-sm">
              <Label htmlFor="acceptTerms" className="font-normal">
                Accept{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:text-primary/80"
                >
                  Termenii și Condițiile
                </Link>{" "}
                și{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:text-primary/80"
                >
                  Politica de Confidențialitate
                </Link>
              </Label>
              {errors.acceptTerms && (
                <p className="mt-1 text-red-600">{errors.acceptTerms}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Se creează contul..." : "Creează contul"}
          </Button>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Sau înregistrează-te cu
              </span>
            </div>
          </div>

          {/* Social Registration Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleAppleRegister}
              disabled={isLoading}
              className="w-full"
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Apple
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
