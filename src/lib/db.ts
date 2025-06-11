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
    console.log("Inserting home into database:", home);

    const { data, error } = await supabase
      .from("homes")
      .insert(home)
      .select()
      .single();

    if (error) {
      console.error("Database error when creating home:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log("Successfully created home:", data);
    return data;
  },

  async update(homeId: string, updates: Partial<Tables["homes"]["Update"]>) {
    const { data, error } = await supabase
      .from("homes")
      .update(updates)
      .eq("id", homeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(homeId: string) {
    const { data, error } = await supabase
      .from("homes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", homeId)
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
      .select(
        `
        *,
        homes(id, name, address_json),
        request_categories(id, name, icon)
      `
      )
      .eq("id", requestId)
      .single();

    if (error) throw error;
    return data;
  },

  async listByCreator(creatorId: string) {
    const { data, error } = await supabase
      .from("furniture_requests")
      .select(
        `
        *,
        homes(id, name, address_json),
        request_categories(id, name, icon)
      `
      )
      .eq("creator_id", creatorId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

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

// Request assignments (offers) operations
export const requestAssignments = {
  async listByRequest(requestId: string) {
    const { data, error } = await supabase
      .from("request_assignments")
      .select(
        `
        *,
        firms(id, name, is_verified, address_json)
      `
      )
      .eq("request_id", requestId)
      .is("deleted_at", null)
      .order("redeemed_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async listByCreator(creatorId: string) {
    const { data, error } = await supabase
      .from("request_assignments")
      .select(
        `
        *,
        furniture_requests!inner(id, title, creator_id, status),
        firms(id, name, is_verified, address_json)
      `
      )
      .eq("furniture_requests.creator_id", creatorId)
      .is("deleted_at", null)
      .order("redeemed_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async accept(assignmentId: string) {
    const { data, error } = await supabase
      .from("request_assignments")
      .update({ accepted_at: new Date().toISOString() })
      .eq("id", assignmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async decline(assignmentId: string) {
    const { data, error } = await supabase
      .from("request_assignments")
      .update({ declined_at: new Date().toISOString() })
      .eq("id", assignmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Thread and message operations
export const threads = {
  async listByCreator(creatorId: string) {
    const { data, error } = await supabase
      .from("threads")
      .select(
        `
        *,
        furniture_requests!inner(id, title, creator_id),
        firms(id, name),
        messages(id, body, sent_at, seen_at, sender_id)
      `
      )
      .eq("furniture_requests.creator_id", creatorId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getMessages(threadId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        profiles(first_name, last_name, role)
      `
      )
      .eq("thread_id", threadId)
      .is("deleted_at", null)
      .order("sent_at", { ascending: true });

    if (error) throw error;
    return data;
  },
};

// Categories operations
export const categories = {
  async list(langCode: string = "ro") {
    const { data, error } = await supabase
      .from("request_categories")
      .select("*")
      .eq("lang_code", langCode)
      .order("name");

    if (error) throw error;
    return data;
  },
};
