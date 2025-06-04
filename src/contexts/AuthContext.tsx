"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

// Define user roles and types based on our database schema
export type UserRole = Database["public"]["Enums"]["role_enum"];
export type AccountStatus = "active" | "inactive" | "pending" | "suspended";

export interface UserProfile {
  user_id: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string;
  last_login_at: string | null;
  deleted_at: string | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (
    email: string,
    password: string,
    userData: Partial<UserProfile>
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (
    updates: Partial<UserProfile>
  ) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!userProfile;

  // Fetch user profile from database
  const fetchUserProfile = async (
    userId: string
  ): Promise<UserProfile | null> => {
    try {
      console.log("Fetching profile for user:", userId);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Profile doesn't exist, try to create one from user metadata
          console.log(
            "Profile not found, attempting to create from user metadata"
          );

          // Get the current user to access metadata
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user && user.id === userId) {
            const role = (user.user_metadata?.role || "HOMEOWNER") as UserRole;
            const firstName = user.user_metadata?.first_name || null;
            const lastName = user.user_metadata?.last_name || null;
            const phone = user.user_metadata?.phone || null;

            // Create profile
            const { data: newProfile, error: insertError } = await supabase
              .from("profiles")
              .insert({
                user_id: userId,
                role: role,
                first_name: firstName,
                last_name: lastName,
                phone: phone,
              })
              .select()
              .single();

            if (insertError) {
              console.error("Error creating profile:", insertError);
              return null;
            }

            console.log("Profile created successfully:", newProfile);
            return {
              ...newProfile,
              email: user.email || "",
            } as UserProfile;
          }
        }

        console.error("Error fetching user profile:", error);
        return null;
      }

      console.log("Profile fetched successfully:", data);

      // Get email from auth user since it's not in profiles table
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return {
        ...data,
        email: user?.email || "",
      } as UserProfile;
    } catch (error) {
      console.error("Unexpected error fetching user profile:", error);
      return null;
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);
    }
  };

  // Sign up function
  const signUp = async (
    email: string,
    password: string,
    userData: Partial<UserProfile>
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userData.role || "HOMEOWNER",
          },
        },
      });

      if (error) {
        return { error };
      }

      // Create profile in profiles table
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: data.user.id,
          role: userData.role || "HOMEOWNER",
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          return { error: new Error(profileError.message) as AuthError };
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Update last_login_at
      if (data.user) {
        await supabase
          .from("profiles")
          .update({ last_login_at: new Date().toISOString() })
          .eq("user_id", data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (!error) {
        setUser(null);
        setUserProfile(null);
        setSession(null);
      }

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error("No user logged in") };
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) {
        return { error: new Error(error.message) };
      }

      // Refresh profile after update
      await refreshProfile();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }

        if (session?.user && mounted) {
          console.log("Initial session found:", session.user.email);
          setUser(session.user);
          setSession(session);

          // Fetch user profile
          const profile = await fetchUserProfile(session.user.id);
          if (mounted) {
            setUserProfile(profile);
            console.log(
              "Initial profile loaded:",
              profile?.first_name || profile?.user_id
            );
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("Auth state changed:", event, session?.user?.email);

      if (session?.user) {
        setUser(session.user);
        setSession(session);
        const profile = await fetchUserProfile(session.user.id);
        if (mounted) {
          setUserProfile(profile);
          console.log(
            "Profile updated:",
            profile?.first_name || profile?.user_id
          );
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setSession(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        session,
        isLoading,
        isAuthenticated,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
