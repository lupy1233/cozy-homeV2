"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Home {
  id: string;
  name: string;
  country: string;
  county: string;
  city: string;
  street: string;
  number: string;
  createdAt: string;
  isDefault?: boolean;
}

interface HomeContextType {
  homes: Home[];
  selectedHome: Home | null;
  addHome: (home: Omit<Home, "id" | "createdAt">) => void;
  selectHome: (homeId: string) => void;
  deleteHome: (homeId: string) => void;
  updateHome: (homeId: string, updates: Partial<Home>) => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [homes, setHomes] = useState<Home[]>([]);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);

  useEffect(() => {
    // Load homes from localStorage or API
    const savedHomes = localStorage.getItem("cozy-homes");
    if (savedHomes) {
      const parsedHomes = JSON.parse(savedHomes);
      setHomes(parsedHomes);

      // Set default home as selected
      const defaultHome = parsedHomes.find((h: Home) => h.isDefault);
      if (defaultHome) {
        setSelectedHome(defaultHome);
      }
    }
  }, []);

  const saveHomes = (newHomes: Home[]) => {
    setHomes(newHomes);
    localStorage.setItem("cozy-homes", JSON.stringify(newHomes));
  };

  const addHome = (homeData: Omit<Home, "id" | "createdAt">) => {
    const newHome: Home = {
      ...homeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isDefault: homes.length === 0, // First home is default
    };

    const newHomes = [...homes, newHome];
    saveHomes(newHomes);

    // If this is the first home, select it
    if (homes.length === 0) {
      setSelectedHome(newHome);
    }
  };

  const selectHome = (homeId: string) => {
    const home = homes.find((h) => h.id === homeId);
    if (home) {
      setSelectedHome(home);
    }
  };

  const deleteHome = (homeId: string) => {
    const newHomes = homes.filter((h) => h.id !== homeId);
    saveHomes(newHomes);

    // If deleted home was selected, select another one
    if (selectedHome?.id === homeId) {
      setSelectedHome(newHomes.length > 0 ? newHomes[0] : null);
    }
  };

  const updateHome = (homeId: string, updates: Partial<Home>) => {
    const newHomes = homes.map((h) =>
      h.id === homeId ? { ...h, ...updates } : h
    );
    saveHomes(newHomes);

    // Update selected home if it was the one being updated
    if (selectedHome?.id === homeId) {
      setSelectedHome({ ...selectedHome, ...updates });
    }
  };

  return (
    <HomeContext.Provider
      value={{
        homes,
        selectedHome,
        addHome,
        selectHome,
        deleteHome,
        updateHome,
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
