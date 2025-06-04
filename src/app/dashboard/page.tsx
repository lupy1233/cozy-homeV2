"use client";

import { useState } from "react";
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
} from "lucide-react";

// Mock data for demonstration
const mockRFQs = [
  {
    id: 1,
    title: "Bucătărie modernă pentru apartament",
    category: "Bucătării",
    status: "active",
    offers: 5,
    budget: "15000-20000",
    location: "București",
    createdAt: "2024-01-15",
    description:
      "Caut o bucătărie modernă pentru apartamentul meu de 3 camere. Prefer stilul minimalist cu finisaje de calitate.",
    lastActivity: "2024-01-20",
  },
  {
    id: 2,
    title: "Bibliotecă din lemn masiv",
    category: "Biblioteci",
    status: "completed",
    offers: 8,
    budget: "5000-8000",
    location: "Cluj-Napoca",
    createdAt: "2024-01-10",
    description:
      "Doresc o bibliotecă din lemn masiv pentru biroul de acasă. Dimensiuni: 3m x 2.5m.",
    lastActivity: "2024-01-18",
  },
  {
    id: 3,
    title: "Dulap walk-in pentru dormitor",
    category: "Dulapuri",
    status: "expired",
    offers: 0,
    budget: "8000-12000",
    location: "Iași",
    createdAt: "2024-01-13",
    description:
      "Amenajare walk-in closet în dormitorul principal. Spațiu disponibil: 4m x 2m.",
    lastActivity: "2024-01-13",
  },
];

const mockOffers = [
  {
    id: 1,
    rfqId: 1,
    companyName: "MobilArt SRL",
    price: "17500",
    deliveryTime: "6-8 săptămâni",
    rating: 4.8,
    message:
      "Vă propunem o soluție completă pentru bucătăria dumneavoastră cu materiale premium și design personalizat.",
    status: "pending",
    submittedAt: "2024-01-18",
  },
  {
    id: 2,
    rfqId: 1,
    companyName: "Design Kitchen Pro",
    price: "19200",
    deliveryTime: "4-6 săptămâni",
    rating: 4.9,
    message:
      "Echipa noastră de designeri vă poate oferi o bucătărie modernă cu cele mai noi tehnologii și finisaje.",
    status: "accepted",
    submittedAt: "2024-01-19",
  },
  {
    id: 3,
    rfqId: 2,
    companyName: "Lemn & Artă",
    price: "6800",
    deliveryTime: "3-4 săptămâni",
    rating: 4.7,
    message:
      "Biblioteca va fi realizată din lemn de stejar masiv, cu finisaje naturale și design clasic.",
    status: "completed",
    submittedAt: "2024-01-12",
  },
];

const mockMessages = [
  {
    id: 1,
    from: "MobilArt SRL",
    subject: "Întrebări despre proiectul bucătăriei",
    preview:
      "Bună ziua! Am câteva întrebări suplimentare despre dimensiunile spațiului...",
    timestamp: "2024-01-21 14:30",
    unread: true,
    rfqId: 1,
  },
  {
    id: 2,
    from: "Design Kitchen Pro",
    subject: "Confirmare detalii proiect",
    preview:
      "Vă mulțumim pentru acceptarea ofertei noastre. Vă trimitem detaliile pentru următorii pași...",
    timestamp: "2024-01-20 16:45",
    unread: false,
    rfqId: 1,
  },
  {
    id: 3,
    from: "Lemn & Artă",
    subject: "Proiectul a fost finalizat",
    preview:
      "Suntem bucuroși să vă anunțăm că biblioteca dumneavoastră a fost finalizată...",
    timestamp: "2024-01-18 10:15",
    unread: false,
    rfqId: 2,
  },
];

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedRFQ, setSelectedRFQ] = useState<any>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [chatModal, setChatModal] = useState<{
    isOpen: boolean;
    companyName: string;
    rfqTitle: string;
  }>({
    isOpen: false,
    companyName: "",
    rfqTitle: "",
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Activ</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Finalizat</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expirat</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Acceptat</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const searchLower = searchTerm.toLowerCase();

  const filteredRFQs = mockRFQs.filter(
    (rfq) =>
      rfq.title.toLowerCase().includes(searchLower) ||
      rfq.category.toLowerCase().includes(searchLower)
  );

  const filteredOffers = mockOffers.filter(
    (offer) =>
      offer.companyName.toLowerCase().includes(searchLower) ||
      mockRFQs
        .find((rfq) => rfq.id === offer.rfqId)
        ?.title.toLowerCase()
        .includes(searchLower)
  );

  const filteredMessages = mockMessages.filter(
    (message) =>
      message.from.toLowerCase().includes(searchLower) ||
      message.subject.toLowerCase().includes(searchLower) ||
      mockRFQs
        .find((rfq) => rfq.id === message.rfqId)
        ?.title.toLowerCase()
        .includes(searchLower)
  );

  const unreadCount = mockMessages.filter((msg) => msg.unread).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar unreadCount={unreadCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bun venit înapoi!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gestionează-ți cererile de mobilier și colaborează cu producătorii.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Cereri Active
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockRFQs.filter((rfq) => rfq.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Oferte Primite
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockOffers.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Mesaje Noi
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {unreadCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Finalizate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {
                      mockRFQs.filter((rfq) => rfq.status === "completed")
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="requests">Cererile Mele</TabsTrigger>
              <TabsTrigger value="offers">Oferte</TabsTrigger>
              <TabsTrigger value="messages">Mesaje</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={
                    activeTab === "requests"
                      ? "Caută cereri..."
                      : activeTab === "offers"
                      ? "Caută oferte..."
                      : "Caută mesaje..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Link href="/rfq/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cerere Nouă
                </Button>
              </Link>
            </div>
          </div>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            {filteredRFQs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Nu ai cereri încă
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Începe prin a crea prima ta cerere de mobilier personalizat.
                  </p>
                  <Link href="/rfq/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Creează Prima Cerere
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredRFQs.map((rfq) => (
                  <Card
                    key={rfq.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{rfq.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {rfq.category} • {rfq.location}
                          </CardDescription>
                        </div>
                        {getStatusBadge(rfq.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {rfq.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Euro className="h-4 w-4 mr-1" />€{rfq.budget}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          {rfq.offers}/3 oferte
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(rfq.createdAt).toLocaleDateString("ro-RO")}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(rfq.lastActivity).toLocaleDateString(
                            "ro-RO"
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRFQ(rfq)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Vezi Detalii
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const relatedMessages = mockMessages.filter(
                                (msg) => msg.rfqId === rfq.id
                              );
                              if (relatedMessages.length > 0) {
                                setChatModal({
                                  isOpen: true,
                                  companyName: relatedMessages[0].from,
                                  rfqTitle: rfq.title,
                                });
                              }
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Mesaje (
                            {
                              mockMessages.filter((msg) => msg.rfqId === rfq.id)
                                .length
                            }
                            )
                          </Button>
                        </div>
                        {rfq.status === "active" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600"
                          >
                            Editează
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-6">
            <div className="grid gap-6">
              {filteredOffers.map((offer) => {
                const rfq = mockRFQs.find((r) => r.id === offer.rfqId);
                return (
                  <Card
                    key={offer.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {offer.companyName}
                          </CardTitle>
                          <CardDescription>
                            Pentru: {rfq?.title}
                          </CardDescription>
                        </div>
                        {getStatusBadge(offer.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {offer.message}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Preț
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            €{offer.price}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Timp livrare
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {offer.deliveryTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Rating
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            ⭐ {offer.rating}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Trimis pe{" "}
                          {new Date(offer.submittedAt).toLocaleDateString(
                            "ro-RO"
                          )}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedOffer({
                                ...offer,
                                rfqTitle: rfq?.title,
                              })
                            }
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Vezi Detalii
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setChatModal({
                                isOpen: true,
                                companyName: offer.companyName,
                                rfqTitle: rfq?.title || "",
                              })
                            }
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Mesaj
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="grid gap-4">
              {filteredMessages.map((message) => {
                const rfq = mockRFQs.find((r) => r.id === message.rfqId);
                return (
                  <Card
                    key={message.id}
                    className={`hover:shadow-md transition-shadow ${
                      message.unread
                        ? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20"
                        : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <h3
                            className={`font-medium ${
                              message.unread ? "font-semibold" : ""
                            }`}
                          >
                            {message.from}
                          </h3>
                          {message.unread && (
                            <Badge variant="secondary" className="text-xs">
                              Nou
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(message.timestamp).toLocaleString("ro-RO")}
                        </p>
                      </div>

                      <h4
                        className={`text-sm mb-2 ${
                          message.unread
                            ? "font-medium"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {message.subject}
                      </h4>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {message.preview}
                      </p>

                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          Referitor la: {rfq?.title}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setChatModal({
                              isOpen: true,
                              companyName: message.from,
                              rfqTitle: rfq?.title || "",
                            })
                          }
                        >
                          Răspunde
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* RFQ Details Modal */}
      <Dialog open={!!selectedRFQ} onOpenChange={() => setSelectedRFQ(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRFQ?.title}</DialogTitle>
            <DialogDescription>
              {selectedRFQ?.category} • {selectedRFQ?.location}
            </DialogDescription>
          </DialogHeader>

          {selectedRFQ && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Descriere</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedRFQ.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Buget</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    €{selectedRFQ.budget}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Status</h4>
                  {getStatusBadge(selectedRFQ.status)}
                </div>
                <div>
                  <h4 className="font-medium mb-1">Data creării</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(selectedRFQ.createdAt).toLocaleDateString(
                      "ro-RO"
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Oferte primite</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedRFQ.offers}/3
                  </p>
                </div>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ofertă de la {selectedOffer?.companyName}</DialogTitle>
            <DialogDescription>
              Pentru: {selectedOffer?.rfqTitle}
            </DialogDescription>
          </DialogHeader>

          {selectedOffer && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Mesajul companiei</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedOffer.message}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Preț</h4>
                  <p className="text-2xl font-bold text-primary">
                    €{selectedOffer.price}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Timp livrare</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedOffer.deliveryTime}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Rating</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    ⭐ {selectedOffer.rating}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Trimis pe{" "}
                  {new Date(selectedOffer.submittedAt).toLocaleDateString(
                    "ro-RO"
                  )}
                </p>
                <div className="flex space-x-2">
                  {selectedOffer.status === "pending" && (
                    <>
                      <Button variant="outline">Respinge</Button>
                      <Button>Acceptă Oferta</Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedOffer(null);
                      setChatModal({
                        isOpen: true,
                        companyName: selectedOffer.companyName,
                        rfqTitle: selectedOffer.rfqTitle || "",
                      });
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Mesaj
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModal.isOpen}
        onClose={() =>
          setChatModal({ isOpen: false, companyName: "", rfqTitle: "" })
        }
        companyName={chatModal.companyName}
        rfqTitle={chatModal.rfqTitle}
      />
    </div>
  );
}
