"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Calendar,
  Euro,
  Clock,
  Eye,
  LogOut,
  Settings,
  Users,
  AlertCircle,
  Zap,
} from "lucide-react";
import { FirmSession } from "@/lib/firm-auth";

interface RFQ {
  rfq_id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  is_urgent: boolean;
  county: string;
  city: string;
  categories: string[];
  assignment_status: "new" | "viewed" | "redeemed" | "hidden" | "expired";
  assigned_to_name?: string;
  created_at: string;
  expires_at: string;
}

interface FirmDashboardProps {
  session: FirmSession;
}

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

const CATEGORIES = [
  { value: "kitchen", label: "Bucătărie" },
  { value: "living", label: "Living" },
  { value: "bedroom", label: "Dormitor" },
  { value: "bathroom", label: "Baie" },
  { value: "office", label: "Birou" },
  { value: "wardrobe", label: "Dulap" },
  { value: "dressing", label: "Dressing" },
  { value: "hallway", label: "Hol" },
  { value: "outdoor", label: "Exterior" },
];

export default function FirmDashboard({ session }: FirmDashboardProps) {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    county: "",
    category: "",
    status: "",
    budgetMin: "",
    budgetMax: "",
  });

  const router = useRouter();

  useEffect(() => {
    fetchRFQs();
  }, [currentPage, filters]);

  const fetchRFQs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      });

      const response = await fetch(`/api/firm/rfqs?${params}`);
      const data = await response.json();

      if (data.success) {
        setRfqs(data.rfqs);
        setTotalPages(data.totalPages);
      } else {
        setError(data.error || "Eroare la încărcarea cerințelor");
      }
    } catch (error) {
      setError("Eroare de conexiune");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/firm/auth/logout", { method: "POST" });
      router.push("/firm/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatBudget = (min: number, max: number) => {
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} RON`;
    } else if (min) {
      return `de la ${min.toLocaleString()} RON`;
    } else if (max) {
      return `până la ${max.toLocaleString()} RON`;
    }
    return "Buget nedefinit";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">Nou</Badge>;
      case "viewed":
        return <Badge variant="secondary">Vizualizat</Badge>;
      case "redeemed":
        return <Badge variant="destructive">Răscumpărat</Badge>;
      case "hidden":
        return <Badge variant="outline">Ascuns</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {session.firm.company_name}
                </h1>
                <p className="text-sm text-gray-500">
                  {session.user.role === "ceo" ? "CEO" : "Angajat"} •{" "}
                  {session.user.first_name} {session.user.last_name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {session.user.role === "ceo" && (
                <>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Echipa
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Setări
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Deconectare
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Căutați cerințe..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtre
            </Button>
          </div>

          {showFilters && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="county">Județ</Label>
                    <Select
                      value={filters.county}
                      onValueChange={(value) =>
                        handleFilterChange("county", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toate județele" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toate județele</SelectItem>
                        {COUNTIES.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Categorie</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) =>
                        handleFilterChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toate categoriile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toate categoriile</SelectItem>
                        {CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        handleFilterChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toate statusurile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toate statusurile</SelectItem>
                        <SelectItem value="new">Nou</SelectItem>
                        <SelectItem value="viewed">Vizualizat</SelectItem>
                        <SelectItem value="redeemed">Răscumpărat</SelectItem>
                        <SelectItem value="hidden">Ascuns</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="budgetMin">Buget minim (RON)</Label>
                    <Input
                      id="budgetMin"
                      type="number"
                      placeholder="0"
                      value={filters.budgetMin}
                      onChange={(e) =>
                        handleFilterChange("budgetMin", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="budgetMax">Buget maxim (RON)</Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      placeholder="100000"
                      value={filters.budgetMax}
                      onChange={(e) =>
                        handleFilterChange("budgetMax", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* RFQ List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Se încarcă cerințele...</p>
          </div>
        ) : rfqs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nu există cerințe disponibile
              </h3>
              <p className="text-gray-600">
                Încercați să modificați filtrele pentru a vedea mai multe
                rezultate.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {rfqs.map((rfq) => (
              <Card
                key={rfq.rfq_id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{rfq.title}</CardTitle>
                        {rfq.is_urgent && (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <Zap className="h-3 w-3" />
                            Urgent
                          </Badge>
                        )}
                        {getStatusBadge(rfq.assignment_status)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {rfq.description}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Vezi detalii
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {rfq.city}, {rfq.county}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Euro className="h-4 w-4 mr-2" />
                      {formatBudget(rfq.budget_min, rfq.budget_max)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Termen:{" "}
                      {new Date(rfq.deadline).toLocaleDateString("ro-RO")}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(rfq.created_at).toLocaleDateString("ro-RO")}
                    </div>
                  </div>

                  {rfq.categories.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex flex-wrap gap-2">
                        {rfq.categories.map((category) => (
                          <Badge key={category} variant="secondary">
                            {getCategoryLabel(category)}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}

                  {rfq.assigned_to_name && (
                    <>
                      <Separator className="my-4" />
                      <p className="text-sm text-gray-600">
                        Asignat către:{" "}
                        <span className="font-medium">
                          {rfq.assigned_to_name}
                        </span>
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Pagina {currentPage} din {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Următor
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
