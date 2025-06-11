"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { homes as homeDb } from "@/lib/db";
import { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];

export interface Home {
  id: string;
  owner_id: string;
  name: string | null;
  address_json: any | null;
  home_point: unknown | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Derived fields for compatibility
  country?: string;
  county?: string;
  city?: string;
  street?: string;
  number?: string;
  isDefault?: boolean;
}

interface HomeContextType {
  homes: Home[];
  selectedHome: Home | null;
  loading: boolean;
  addHome: (home: {
    name: string;
    country: string;
    county: string;
    countyCode?: string;
    city: string;
    street: string;
    number: string;
  }) => Promise<void>;
  selectHome: (homeId: string) => void;
  deleteHome: (homeId: string) => Promise<void>;
  updateHome: (
    homeId: string,
    updates: {
      name: string;
      country: string;
      county: string;
      countyCode?: string;
      city: string;
      street: string;
      number: string;
    }
  ) => Promise<void>;
  refreshHomes: () => Promise<void>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [homes, setHomes] = useState<Home[]>([]);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to parse address JSON and add derived fields
  const parseHomeData = (dbHome: Tables["homes"]["Row"]): Home => {
    const addressData = dbHome.address_json as any;
    return {
      ...dbHome,
      country: addressData?.country || "",
      county: addressData?.county || "",
      city: addressData?.city || "",
      street: addressData?.street || "",
      number: addressData?.number || "",
      isDefault: false, // We don't have this field in DB, could add it later
    };
  };

  // Helper function to create address JSON from form data
  const createAddressJson = (homeData: {
    country: string;
    county: string;
    countyCode?: string;
    city: string;
    street: string;
    number: string;
  }) => ({
    country: homeData.country,
    county: homeData.county,
    countyCode: homeData.countyCode,
    city: homeData.city,
    street: homeData.street,
    number: homeData.number,
    fullAddress: `${homeData.street} ${homeData.number}, ${homeData.city}, ${homeData.county}, ${homeData.country}`,
  });

  const refreshHomes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const dbHomes = await homeDb.listByOwner(user.id);
      const parsedHomes = dbHomes.map(parseHomeData);
      setHomes(parsedHomes);

      // If no home is selected and we have homes, select the first one
      if (!selectedHome && parsedHomes.length > 0) {
        setSelectedHome(parsedHomes[0]);
      }
    } catch (error) {
      console.error("Error loading homes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load homes when user changes or authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshHomes();
    } else {
      setHomes([]);
      setSelectedHome(null);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const addHome = async (homeData: {
    name: string;
    country: string;
    county: string;
    countyCode?: string;
    city: string;
    street: string;
    number: string;
  }) => {
    if (!user) throw new Error("User not authenticated");

    try {
      // Log the data we're sending to debug
      const addressJson = createAddressJson(homeData);
      const homeToCreate = {
        owner_id: user.id,
        name: homeData.name,
        address_json: addressJson,
      };

      console.log("Creating home with data:", homeToCreate);

      const newHome = await homeDb.create(homeToCreate);

      const parsedHome = parseHomeData(newHome);
      const newHomes = [...homes, parsedHome];
      setHomes(newHomes);

      // If this is the first home, select it
      if (homes.length === 0) {
        setSelectedHome(parsedHome);
      }
    } catch (error) {
      console.error("Error adding home:", error);
      console.error("Home data that failed:", homeData);
      console.error("User:", user);

      // Create a more descriptive error
      const errorMessage =
        error instanceof Error ? error.message : "Unknown database error";
      throw new Error(`Failed to create home: ${errorMessage}`);
    }
  };

  const selectHome = (homeId: string) => {
    const home = homes.find((h) => h.id === homeId);
    if (home) {
      setSelectedHome(home);
    }
  };

  const deleteHome = async (homeId: string) => {
    try {
      await homeDb.delete(homeId);
      const newHomes = homes.filter((h) => h.id !== homeId);
      setHomes(newHomes);

      // If deleted home was selected, select another one
      if (selectedHome?.id === homeId) {
        setSelectedHome(newHomes.length > 0 ? newHomes[0] : null);
      }
    } catch (error) {
      console.error("Error deleting home:", error);
      throw error;
    }
  };

  const updateHome = async (
    homeId: string,
    updates: {
      name: string;
      country: string;
      county: string;
      countyCode?: string;
      city: string;
      street: string;
      number: string;
    }
  ) => {
    try {
      const updateData = {
        name: updates.name,
        address_json: createAddressJson(updates),
        updated_at: new Date().toISOString(),
      };

      const updatedHome = await homeDb.update(homeId, updateData);
      const parsedHome = parseHomeData(updatedHome);

      const newHomes = homes.map((h) => (h.id === homeId ? parsedHome : h));
      setHomes(newHomes);

      // Update selected home if it was the one being updated
      if (selectedHome?.id === homeId) {
        setSelectedHome(parsedHome);
      }
    } catch (error) {
      console.error("Error updating home:", error);
      throw error;
    }
  };

  return (
    <HomeContext.Provider
      value={{
        homes,
        selectedHome,
        loading,
        addHome,
        selectHome,
        deleteHome,
        updateHome,
        refreshHomes,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}

export function useHomes() {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useHomes must be used within a HomeProvider");
  }
  return context;
}
