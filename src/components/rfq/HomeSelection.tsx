"use client";

import { useState } from "react";
import { useHomes } from "@/contexts/HomeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Home,
  MapPin,
  Check,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HomeSelection() {
  const { homes, selectedHome, addHome, selectHome, deleteHome, updateHome } =
    useHomes();
  const [isAddingHome, setIsAddingHome] = useState(false);
  const [editingHome, setEditingHome] = useState<string | null>(null);
  const [newHome, setNewHome] = useState({
    name: "",
    country: "România",
    county: "",
    city: "",
    street: "",
    number: "",
  });

  const handleAddHome = () => {
    if (
      newHome.name.trim() &&
      newHome.county.trim() &&
      newHome.city.trim() &&
      newHome.street.trim() &&
      newHome.number.trim()
    ) {
      if (editingHome) {
        updateHome(editingHome, newHome);
        setEditingHome(null);
      } else {
        addHome(newHome);
      }
      setNewHome({
        name: "",
        country: "România",
        county: "",
        city: "",
        street: "",
        number: "",
      });
      setIsAddingHome(false);
    }
  };

  const handleEditHome = (home: any) => {
    setNewHome({
      name: home.name,
      country: home.country,
      county: home.county,
      city: home.city,
      street: home.street,
      number: home.number,
    });
    setEditingHome(home.id);
    setIsAddingHome(true);
  };

  const handleDeleteHome = (homeId: string) => {
    if (confirm("Ești sigur că vrei să ștergi această casă?")) {
      deleteHome(homeId);
    }
  };

  const handleCancelEdit = () => {
    setIsAddingHome(false);
    setEditingHome(null);
    setNewHome({
      name: "",
      country: "România",
      county: "",
      city: "",
      street: "",
      number: "",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Selectează Casa</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Alege casa pentru care dorești să creezi cererea de mobilier.
        </p>
      </div>

      {/* Existing Homes */}
      {homes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {homes.map((home) => (
            <Card
              key={home.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedHome?.id === home.id
                  ? "ring-2 ring-primary border-primary"
                  : ""
              }`}
              onClick={() => selectHome(home.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{home.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {home.street} {home.number}, {home.city}, {home.county}
                      </div>
                      {home.isDefault && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                          Implicit
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedHome?.id === home.id && (
                      <div className="p-1 bg-primary rounded-full">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditHome(home)}>
                          <Edit className="h-3 w-3 mr-2" />
                          Editează
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteHome(home.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Șterge
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Home */}
      <Dialog open={isAddingHome} onOpenChange={setIsAddingHome}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <Plus className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="font-medium">Adaugă o Casă Nouă</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Creează o nouă locație pentru cererea ta
                </p>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingHome ? "Editează Casa" : "Adaugă o Casă Nouă"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="home-name">Numele Casei</Label>
              <Input
                id="home-name"
                placeholder="ex: Casa Principală, Apartament București"
                value={newHome.name}
                onChange={(e) =>
                  setNewHome({ ...newHome, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="home-country">Țara</Label>
                <Input
                  id="home-country"
                  value={newHome.country}
                  onChange={(e) =>
                    setNewHome({ ...newHome, country: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="home-county">Județul</Label>
                <Input
                  id="home-county"
                  placeholder="ex: București, Cluj, Iași"
                  value={newHome.county}
                  onChange={(e) =>
                    setNewHome({ ...newHome, county: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="home-city">Orașul</Label>
              <Input
                id="home-city"
                placeholder="ex: București, Cluj-Napoca, Iași"
                value={newHome.city}
                onChange={(e) =>
                  setNewHome({ ...newHome, city: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="home-street">Strada</Label>
                <Input
                  id="home-street"
                  placeholder="ex: Strada Exemplu"
                  value={newHome.street}
                  onChange={(e) =>
                    setNewHome({ ...newHome, street: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="home-number">Numărul</Label>
                <Input
                  id="home-number"
                  placeholder="ex: 123"
                  value={newHome.number}
                  onChange={(e) =>
                    setNewHome({ ...newHome, number: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Anulează
              </Button>
              <Button
                onClick={handleAddHome}
                disabled={
                  !newHome.name.trim() ||
                  !newHome.county.trim() ||
                  !newHome.city.trim() ||
                  !newHome.street.trim() ||
                  !newHome.number.trim()
                }
              >
                {editingHome ? "Salvează Modificările" : "Adaugă Casa"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* No homes message */}
      {homes.length === 0 && (
        <div className="text-center py-8">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Home className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nicio casă adăugată</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Pentru a continua, trebuie să adaugi cel puțin o casă.
          </p>
          <Button onClick={() => setIsAddingHome(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă Prima Casă
          </Button>
        </div>
      )}
    </div>
  );
}
