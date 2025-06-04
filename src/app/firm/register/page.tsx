"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Building2, AlertCircle, CheckCircle } from "lucide-react";

const COUNTIES = [
  "Alba",
  "Arad",
  "Argeș",
  "Bacău",
  "Bihor",
  "Bistrița-Năsăud",
  "Botoșani",
  "Brașov",
  "Brăila",
  "București",
  "Buzău",
  "Caraș-Severin",
  "Călărași",
  "Cluj",
  "Constanța",
  "Covasna",
  "Dâmbovița",
  "Dolj",
  "Galați",
  "Giurgiu",
  "Gorj",
  "Harghita",
  "Hunedoara",
  "Ialomița",
  "Iași",
  "Ilfov",
  "Maramureș",
  "Mehedinți",
  "Mureș",
  "Neamț",
  "Olt",
  "Prahova",
  "Satu Mare",
  "Sălaj",
  "Sibiu",
  "Suceava",
  "Teleorman",
  "Timiș",
  "Tulcea",
  "Vaslui",
  "Vâlcea",
  "Vrancea",
];

const SPECIALTIES = [
  { value: "kitchen", label: "Bucătării" },
  { value: "living", label: "Living" },
  { value: "bedroom", label: "Dormitor" },
  { value: "bathroom", label: "Baie" },
  { value: "office", label: "Birou" },
  { value: "wardrobe", label: "Dulapuri" },
  { value: "dressing", label: "Dressing" },
  { value: "hallway", label: "Hol" },
  { value: "outdoor", label: "Exterior" },
];

export default function FirmRegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firmData, setFirmData] = useState({
    company_name: "",
    company_description: "",
    company_website: "",
    company_address: "",
    company_phone: "",
    company_email: "",
    tax_id: "",
    county: "",
    city: "",
    specialties: [] as string[],
  });

  const [ceoData, setCeoData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    verification: false,
  });

  const router = useRouter();

  const handleFirmDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFirmData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCeoDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCeoData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFirmData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const validateStep1 = () => {
    const required = [
      "company_name",
      "company_email",
      "tax_id",
      "county",
      "city",
    ];
    return (
      required.every((field) => firmData[field as keyof typeof firmData]) &&
      firmData.specialties.length > 0
    );
  };

  const validateStep2 = () => {
    const required = [
      "first_name",
      "last_name",
      "email",
      "password",
      "confirmPassword",
    ];
    const isValid = required.every(
      (field) => ceoData[field as keyof typeof ceoData]
    );
    const passwordsMatch = ceoData.password === ceoData.confirmPassword;
    const passwordStrong = ceoData.password.length >= 8;

    return isValid && passwordsMatch && passwordStrong;
  };

  const validateStep3 = () => {
    return Object.values(agreements).every(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      setError("Vă rugăm să acceptați toate condițiile");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/firm/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firm: firmData,
          ceo: ceoData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Eroare la înregistrare");
      }
    } catch (error) {
      setError("Eroare de conexiune. Încercați din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Înregistrare Reușită!
            </CardTitle>
            <CardDescription>
              Cererea dumneavoastră a fost trimisă cu succes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Firma dumneavoastră va fi verificată de echipa noastră în
              următoarele 24-48 de ore. Veți primi un email de confirmare când
              contul va fi activat.
            </p>
            <Button
              onClick={() => router.push("/firm/login")}
              className="w-full"
            >
              Înapoi la Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Înregistrare Firmă
          </CardTitle>
          <CardDescription>
            Pasul {step} din 3 -{" "}
            {step === 1
              ? "Informații Firmă"
              : step === 2
              ? "Cont CEO"
              : "Finalizare"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNum}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Firm Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Nume Firmă *</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={firmData.company_name}
                    onChange={handleFirmDataChange}
                    placeholder="Ex: Mobilier Premium SRL"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tax_id">CUI *</Label>
                  <Input
                    id="tax_id"
                    name="tax_id"
                    value={firmData.tax_id}
                    onChange={handleFirmDataChange}
                    placeholder="RO12345678"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company_description">Descriere Firmă</Label>
                <Textarea
                  id="company_description"
                  name="company_description"
                  value={firmData.company_description}
                  onChange={handleFirmDataChange}
                  placeholder="Descrieți activitatea firmei..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_email">Email Firmă *</Label>
                  <Input
                    id="company_email"
                    name="company_email"
                    type="email"
                    value={firmData.company_email}
                    onChange={handleFirmDataChange}
                    placeholder="contact@firma.ro"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company_phone">Telefon Firmă</Label>
                  <Input
                    id="company_phone"
                    name="company_phone"
                    value={firmData.company_phone}
                    onChange={handleFirmDataChange}
                    placeholder="0721234567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company_website">Website</Label>
                <Input
                  id="company_website"
                  name="company_website"
                  value={firmData.company_website}
                  onChange={handleFirmDataChange}
                  placeholder="https://www.firma.ro"
                />
              </div>

              <div>
                <Label htmlFor="company_address">Adresă</Label>
                <Input
                  id="company_address"
                  name="company_address"
                  value={firmData.company_address}
                  onChange={handleFirmDataChange}
                  placeholder="Strada, numărul, orașul"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="county">Județ *</Label>
                  <Select
                    value={firmData.county}
                    onValueChange={(value) =>
                      setFirmData((prev) => ({ ...prev, county: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectați județul" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTIES.map((county) => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">Oraș *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={firmData.city}
                    onChange={handleFirmDataChange}
                    placeholder="Numele orașului"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Specializări * (selectați cel puțin una)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {SPECIALTIES.map((specialty) => (
                    <div
                      key={specialty.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={specialty.value}
                        checked={firmData.specialties.includes(specialty.value)}
                        onCheckedChange={() =>
                          handleSpecialtyToggle(specialty.value)
                        }
                      />
                      <Label htmlFor={specialty.value} className="text-sm">
                        {specialty.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: CEO Account */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Prenume *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={ceoData.first_name}
                    onChange={handleCeoDataChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Nume *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={ceoData.last_name}
                    onChange={handleCeoDataChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email CEO *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={ceoData.email}
                    onChange={handleCeoDataChange}
                    placeholder="ceo@firma.ro"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={ceoData.phone}
                    onChange={handleCeoDataChange}
                    placeholder="0721234567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Parolă *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={ceoData.password}
                    onChange={handleCeoDataChange}
                    placeholder="Minim 8 caractere"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmă Parola *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={ceoData.confirmPassword}
                    onChange={handleCeoDataChange}
                    placeholder="Repetați parola"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {ceoData.password &&
                ceoData.confirmPassword &&
                ceoData.password !== ceoData.confirmPassword && (
                  <p className="text-sm text-red-600">
                    Parolele nu se potrivesc
                  </p>
                )}
            </div>
          )}

          {/* Step 3: Agreements */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreements.terms}
                    onCheckedChange={(checked) =>
                      setAgreements((prev) => ({ ...prev, terms: !!checked }))
                    }
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    Accept{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:underline"
                    >
                      Termenii și Condițiile
                    </Link>{" "}
                    de utilizare a platformei
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={agreements.privacy}
                    onCheckedChange={(checked) =>
                      setAgreements((prev) => ({ ...prev, privacy: !!checked }))
                    }
                  />
                  <Label htmlFor="privacy" className="text-sm leading-relaxed">
                    Accept{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Politica de Confidențialitate
                    </Link>
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="verification"
                    checked={agreements.verification}
                    onCheckedChange={(checked) =>
                      setAgreements((prev) => ({
                        ...prev,
                        verification: !!checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="verification"
                    className="text-sm leading-relaxed"
                  >
                    Înțeleg că firma va fi verificată manual de echipa
                    platformei înainte de activare
                  </Label>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Ce urmează?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Echipa noastră va verifica informațiile firmei</li>
                  <li>
                    • Veți primi un email în 24-48 ore cu statusul verificării
                  </li>
                  <li>• După aprobare, veți putea accesa portalul firmelor</li>
                  <li>
                    • Veți putea vizualiza și răspunde la cerințele de ofertă
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Înapoi
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !validateStep1()) ||
                  (step === 2 && !validateStep2())
                }
              >
                Continuă
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateStep3() || isLoading}
              >
                {isLoading
                  ? "Se înregistrează..."
                  : "Finalizează Înregistrarea"}
              </Button>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Aveți deja cont?{" "}
              <Link
                href="/firm/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Conectați-vă
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
