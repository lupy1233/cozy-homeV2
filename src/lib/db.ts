import { supabase } from "./supabase";
import { Database } from "./database.types";

type Tables = Database["public"]["Tables"];
type Enums = Database["public"]["Enums"];

// Profile operations
export const profiles = {
  async get(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async update(userId: string, updates: Partial<Tables["profiles"]["Update"]>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Firm operations
export const firms = {
  async get(firmId: string) {
    const { data, error } = await supabase
      .from("firms")
      .select("*")
      .eq("id", firmId)
      .single();

    if (error) throw error;
    return data;
  },

  async create(firm: Tables["firms"]["Insert"]) {
    const { data, error } = await supabase
      .from("firms")
      .insert(firm)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(firmId: string, updates: Partial<Tables["firms"]["Update"]>) {
    const { data, error } = await supabase
      .from("firms")
      .update(updates)
      .eq("id", firmId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Home operations
export const homes = {
  async get(homeId: string) {
    const { data, error } = await supabase
      .from("homes")
      .select("*")
      .eq("id", homeId)
      .single();

    if (error) throw error;
    return data;
  },

  async listByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from("homes")
      .select("*")
      .eq("owner_id", ownerId)
      .is("deleted_at", null);

    if (error) throw error;
    return data;
  },

  async create(home: Tables["homes"]["Insert"]) {
    const { data, error } = await supabase
      .from("homes")
      .insert(home)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Furniture request operations
export const furnitureRequests = {
  async get(requestId: string) {
    const { data, error } = await supabase
      .from("furniture_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (error) throw error;
    return data;
  },

  async listByCreator(creatorId: string) {
    const { data, error } = await supabase
      .from("furniture_requests")
      .select("*")
      .eq("creator_id", creatorId)
      .is("deleted_at", null);

    if (error) throw error;
    return data;
  },

  async create(request: Tables["furniture_requests"]["Insert"]) {
    const { data, error } = await supabase
      .from("furniture_requests")
      .insert(request)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(
    requestId: string,
    updates: Partial<Tables["furniture_requests"]["Update"]>
  ) {
    const { data, error } = await supabase
      .from("furniture_requests")
      .update(updates)
      .eq("id", requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
