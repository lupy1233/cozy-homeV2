import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://swidlzoszlkkszwdzcoa.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aWRsem9zemxra3N6d2R6Y29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4OTE4NjUsImV4cCI6MjA2NDQ2Nzg2NX0.9WTGnH7JYR3fG3wvHvbNaEwghxWqGMmu0A9u4vhFWxg";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// For server-side operations (API routes)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aWRsem9zemxra3N6d2R6Y29hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg5MTg2NSwiZXhwIjoyMDY0NDY3ODY1fQ.g2nejUI8rWXOH3cQ2xpUg4vm9W367SD5foO62fptVK0",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
