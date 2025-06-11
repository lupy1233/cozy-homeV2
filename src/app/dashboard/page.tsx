"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import ChatModal from "@/components/ChatModal";
import {
  Plus,
  Search,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  MapPin,
  Euro,
  Users,
  Bell,
  Settings,
  LogOut,
  Home,
  Loader2,
  TrendingUp,
  Star,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  furnitureRequests,
  requestAssignments,
  threads,
  homes,
} from "@/lib/db";
import type { Database } from "@/lib/database.types";

type FurnitureRequest =
  Database["public"]["Tables"]["furniture_requests"]["Row"] & {
    homes?: Database["public"]["Tables"]["homes"]["Row"];
    request_categories?: Database["public"]["Tables"]["request_categories"]["Row"];
  };

type RequestAssignment =
  Database["public"]["Tables"]["request_assignments"]["Row"] & {
    firms?: Database["public"]["Tables"]["firms"]["Row"];
    furniture_requests?: Database["public"]["Tables"]["furniture_requests"]["Row"];
  };

type Thread = Database["public"]["Tables"]["threads"]["Row"] & {
  furniture_requests?: Database["public"]["Tables"]["furniture_requests"]["Row"];
  firms?: Database["public"]["Tables"]["firms"]["Row"];
  messages?: Database["public"]["Tables"]["messages"]["Row"][];
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedRFQ, setSelectedRFQ] = useState<FurnitureRequest | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<RequestAssignment | null>(
    null
  );
  const [chatModal, setChatModal] = useState<{
    isOpen: boolean;
    companyName: string;
    rfqTitle: string;
  }>({
    isOpen: false,
    companyName: "",
    rfqTitle: "",
  });

  // Real data states
  const [requests, setRequests] = useState<FurnitureRequest[]>([]);
  const [offers, setOffers] = useState<RequestAssignment[]>([]);
  const [messages, setMessages] = useState<Thread[]>([]);
  const [userHomes, setUserHomes] = useState<
    Database["public"]["Tables"]["homes"]["Row"][]
  >([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      await loadDashboardData(user.id);
    } catch (error) {
      console.error("Error checking user:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (userId: string) => {
    try {
      // Load user's furniture requests
      const userRequests = await furnitureRequests.listByCreator(userId);
      setRequests(userRequests);

      // Load offers for user's requests
      const userOffers = await requestAssignments.listByCreator(userId);
      setOffers(userOffers);

      // Load message threads
      const userThreads = await threads.listByCreator(userId);
      setMessages(userThreads);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleAcceptOffer = async (assignmentId: string) => {
    try {
      await requestAssignments.accept(assignmentId);
      // Reload offers to reflect the change
      if (user) {
        const userOffers = await requestAssignments.listByCreator(user.id);
        setOffers(userOffers);
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
    }
  };

  const handleDeclineOffer = async (assignmentId: string) => {
    try {
      await requestAssignments.decline(assignmentId);
      // Reload offers to reflect the change
      if (user) {
        const userOffers = await requestAssignments.listByCreator(user.id);
        setOffers(userOffers);
      }
    } catch (error) {
      console.error("Error declining offer:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

    switch (status) {
      case "OPEN":
        return (
          <Badge
            className={`${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`}
          >
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5"></div>
            Activ
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge
            className={`${baseClasses} bg-green-50 text-green-700 border border-green-200`}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Acceptat
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge
            className={`${baseClasses} bg-red-50 text-red-700 border border-red-200`}
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Expirat
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge
            className={`${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`}
          >
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case "QUOTED":
        return (
          <Badge
            className={`${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200`}
          >
            <Star className="w-3 h-3 mr-1" />
            Cu oferte
          </Badge>
        );
      case "DECLINED":
        return (
          <Badge
            className={`${baseClasses} bg-red-50 text-red-700 border border-red-200`}
          >
            Refuzat
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getOfferStatusBadge = (assignment: RequestAssignment) => {
    const baseClasses =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

    if (assignment.accepted_at) {
      return (
        <Badge
          className={`${baseClasses} bg-green-50 text-green-700 border border-green-200`}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Acceptat
        </Badge>
      );
    }
    if (assignment.declined_at) {
      return (
        <Badge
          className={`${baseClasses} bg-red-50 text-red-700 border border-red-200`}
        >
          Refuzat
        </Badge>
      );
    }
    if (assignment.quoted_at) {
      return (
        <Badge
          className={`${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`}
        >
          <Euro className="w-3 h-3 mr-1" />
          Ofertat
        </Badge>
      );
    }
    return (
      <Badge
        className={`${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200`}
      >
        <Clock className="w-3 h-3 mr-1" />
        În așteptare
      </Badge>
    );
  };

  const formatPrice = (priceCents: number | null, currency: string = "EUR") => {
    if (!priceCents) return "Preț la cerere";
    return `${(priceCents / 100).toLocaleString("ro-RO")} ${currency}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("ro-RO");
  };

  const getLocationString = (addressJson: any) => {
    if (!addressJson) return "Locație nedefinită";
    return addressJson.city || addressJson.address || "Locație nedefinită";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">
              Se încarcă dashboard-ul...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const searchLower = searchTerm.toLowerCase();

  const filteredRFQs = requests.filter(
    (rfq) =>
      rfq.title?.toLowerCase().includes(searchLower) ||
      rfq.request_categories?.name?.toLowerCase().includes(searchLower)
  );

  const filteredOffers = offers.filter(
    (offer) =>
      offer.furniture_requests?.title?.toLowerCase().includes(searchLower) ||
      offer.firms?.name?.toLowerCase().includes(searchLower)
  );

  const unreadMessages = messages.filter((thread) =>
    thread.messages?.some((msg) => !msg.seen_at && msg.sender_id !== user?.id)
  );

  const activeRequestsCount = requests.filter(
    (r) => r.status === "OPEN"
  ).length;
  const acceptedOffersCount = offers.filter((o) => o.accepted_at).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Navbar unreadCount={unreadMessages.length} />

      <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Cereri Totale
                  </p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {requests.length}
                  </p>
                  <p className="text-xs text-blue-600/60 dark:text-blue-400/60">
                    {activeRequestsCount} active
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950 dark:to-yellow-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    Cereri Active
                  </p>
                  <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                    {activeRequestsCount}
                  </p>
                  <p className="text-xs text-yellow-600/60 dark:text-yellow-400/60">
                    în așteptare de oferte
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -mr-10 -mt-10"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Oferte Primite
                  </p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {offers.length}
                  </p>
                  <p className="text-xs text-green-600/60 dark:text-green-400/60">
                    {acceptedOffersCount} acceptate
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Mesaje Necitite
                  </p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                    {unreadMessages.length}
                  </p>
                  <p className="text-xs text-purple-600/60 dark:text-purple-400/60">
                    conversații active
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center relative">
                  <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  {unreadMessages.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10"></div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Caută cereri, companii sau categorii..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg border-0 bg-muted/30 focus:bg-background transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <div className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger
                value="requests"
                className="h-10 px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium"
              >
                <FileText className="h-4 w-4 mr-2" />
                Cererile Mele ({filteredRFQs.length})
              </TabsTrigger>
              <TabsTrigger
                value="offers"
                className="h-10 px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium"
              >
                <Star className="h-4 w-4 mr-2" />
                Oferte ({filteredOffers.length})
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="h-10 px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium relative"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Mesaje ({messages.length})
                {unreadMessages.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
                    {unreadMessages.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Requests Tab */}
            <TabsContent value="requests" className="space-y-6 mt-8">
              {filteredRFQs.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Nu ai cereri încă
                    </h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Creează prima ta cerere pentru mobilier personalizat și
                      primește oferte de la cei mai buni producători
                    </p>
                    <Link href="/rfq/create">
                      <Button
                        size="lg"
                        className="shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Crează Cerere Nouă
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredRFQs.map((rfq) => (
                    <Card
                      key={rfq.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {rfq.title || "Cerere fără titlu"}
                              </h3>
                              {getStatusBadge(rfq.status || "DRAFT")}
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(rfq.created_at)}
                              </span>
                              <span className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {getLocationString(rfq.homes?.address_json)}
                              </span>
                              <span className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {
                                  offers.filter(
                                    (o) => o.furniture_requests?.id === rfq.id
                                  ).length
                                }{" "}
                                oferte
                              </span>
                            </div>

                            <p className="text-foreground/80 line-clamp-2 leading-relaxed">
                              {rfq.brief_text || "Fără descriere"}
                            </p>

                            <div className="flex items-center justify-between pt-4">
                              <Badge
                                variant="outline"
                                className="text-xs font-medium"
                              >
                                {rfq.request_categories?.name ||
                                  "Categorie nedefinită"}
                              </Badge>

                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedRFQ(rfq)}
                                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Detalii
                                </Button>
                                {rfq.status === "OPEN" && (
                                  <Link href={`/rfq/${rfq.id}/edit`}>
                                    <Button size="sm" className="shadow-sm">
                                      Editează
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Offers Tab */}
            <TabsContent value="offers" className="space-y-6 mt-8">
              {filteredOffers.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                      <Star className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Nu ai oferte încă
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Oferele vor apărea aici când companiile răspund la
                      cererile tale. Creează o cerere pentru a începe!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredOffers.map((offer) => (
                    <Card
                      key={offer.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                  {offer.firms?.name}
                                </h3>
                                <p className="text-muted-foreground mt-1">
                                  Pentru: {offer.furniture_requests?.title}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {getOfferStatusBadge(offer)}
                                {offer.firms?.is_verified && (
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-200 bg-green-50"
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verificat
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span className="flex items-center gap-2 text-lg font-semibold text-green-600">
                                <Euro className="h-5 w-5" />
                                {formatPrice(
                                  offer.price_cents,
                                  offer.currency_code || "EUR"
                                )}
                              </span>
                              <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Ofertat: {formatDate(offer.redeemed_at)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOffer(offer)}
                                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Vezi Detalii
                              </Button>
                              {!offer.accepted_at && !offer.declined_at && (
                                <div className="flex gap-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeclineOffer(offer.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  >
                                    Refuză
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAcceptOffer(offer.id)}
                                    className="bg-green-600 hover:bg-green-700 shadow-sm"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Acceptă
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6 mt-8">
              {messages.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Nu ai mesaje încă
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Conversațiile cu companiile vor apărea aici. Începe prin a
                      crea o cerere!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {messages.map((thread) => {
                    const lastMessage =
                      thread.messages?.[thread.messages.length - 1];
                    const unreadCount =
                      thread.messages?.filter(
                        (msg) => !msg.seen_at && msg.sender_id !== user?.id
                      ).length || 0;

                    return (
                      <Card
                        key={thread.id}
                        className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                      >
                        <CardContent className="p-8">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                  {thread.firms?.name}
                                </h3>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground">
                                    {lastMessage
                                      ? formatDate(lastMessage.sent_at)
                                      : ""}
                                  </span>
                                  {unreadCount > 0 && (
                                    <Badge className="bg-red-500 hover:bg-red-500 animate-pulse">
                                      {unreadCount} nou
                                      {unreadCount > 1 ? "e" : ""}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-muted-foreground text-sm mb-3">
                                {thread.furniture_requests?.title}
                              </p>
                              {lastMessage && (
                                <p className="text-foreground/80 line-clamp-2 leading-relaxed">
                                  {lastMessage.body}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              onClick={() =>
                                setChatModal({
                                  isOpen: true,
                                  companyName: thread.firms?.name || "",
                                  rfqTitle:
                                    thread.furniture_requests?.title || "",
                                })
                              }
                              className="shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Deschide Conversația
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals remain the same but with improved styling */}
        {/* RFQ Details Modal */}
        <Dialog open={!!selectedRFQ} onOpenChange={() => setSelectedRFQ(null)}>
          <DialogContent className="max-w-2xl border-0 shadow-2xl">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-2xl font-bold">
                {selectedRFQ?.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                Detalii despre cererea ta de mobilier
              </DialogDescription>
            </DialogHeader>
            {selectedRFQ && (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-semibold text-foreground">
                      Status
                    </Label>
                    <div>{getStatusBadge(selectedRFQ.status || "DRAFT")}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-foreground">
                      Data creării
                    </Label>
                    <p className="text-muted-foreground">
                      {formatDate(selectedRFQ.created_at)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-foreground">
                    Descriere
                  </Label>
                  <p className="text-foreground/80 leading-relaxed p-4 bg-muted/30 rounded-lg">
                    {selectedRFQ.brief_text || "Fără descriere"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-foreground">
                    Locația
                  </Label>
                  <p className="text-muted-foreground">
                    {getLocationString(selectedRFQ.homes?.address_json)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-foreground">
                    Oferte primite
                  </Label>
                  <p className="text-muted-foreground">
                    {
                      offers.filter(
                        (o) => o.furniture_requests?.id === selectedRFQ.id
                      ).length
                    }{" "}
                    oferte
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Offer Details Modal */}
        <Dialog
          open={!!selectedOffer}
          onOpenChange={() => setSelectedOffer(null)}
        >
          <DialogContent className="max-w-2xl border-0 shadow-2xl">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-2xl font-bold">
                Oferta de la {selectedOffer?.firms?.name}
              </DialogTitle>
              <DialogDescription className="text-base">
                Detalii despre oferta primită
              </DialogDescription>
            </DialogHeader>
            {selectedOffer && (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-semibold text-foreground">
                      Preț
                    </Label>
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(
                        selectedOffer.price_cents,
                        selectedOffer.currency_code || "EUR"
                      )}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-foreground">
                      Status
                    </Label>
                    <div>{getOfferStatusBadge(selectedOffer)}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-foreground">
                    Pentru cererea
                  </Label>
                  <p className="text-muted-foreground">
                    {selectedOffer.furniture_requests?.title}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-foreground">
                    Data ofertei
                  </Label>
                  <p className="text-muted-foreground">
                    {formatDate(selectedOffer.redeemed_at)}
                  </p>
                </div>
                {selectedOffer.quoted_at && (
                  <div className="space-y-2">
                    <Label className="font-semibold text-foreground">
                      Data cotației
                    </Label>
                    <p className="text-muted-foreground">
                      {formatDate(selectedOffer.quoted_at)}
                    </p>
                  </div>
                )}
                <div className="flex gap-3 pt-6 border-t">
                  <Button
                    onClick={() =>
                      setChatModal({
                        isOpen: true,
                        companyName: selectedOffer.firms?.name || "",
                        rfqTitle: selectedOffer.furniture_requests?.title || "",
                      })
                    }
                    className="shadow-sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contactează Compania
                  </Button>
                  {!selectedOffer.accepted_at && !selectedOffer.declined_at && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleDeclineOffer(selectedOffer.id);
                          setSelectedOffer(null);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        Refuză Oferta
                      </Button>
                      <Button
                        onClick={() => {
                          handleAcceptOffer(selectedOffer.id);
                          setSelectedOffer(null);
                        }}
                        className="bg-green-600 hover:bg-green-700 shadow-sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Acceptă Oferta
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Chat Modal */}
        <ChatModal
          isOpen={chatModal.isOpen}
          onClose={() => setChatModal({ ...chatModal, isOpen: false })}
          companyName={chatModal.companyName}
          rfqTitle={chatModal.rfqTitle}
        />
      </div>
    </div>
  );
}
