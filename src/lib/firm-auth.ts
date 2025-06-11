import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for direct DB access
);

export interface FirmUser {
  id: string;
  firm_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: "ceo" | "employee";
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface FirmSession {
  user: FirmUser;
  firm: {
    id: string;
    company_name: string;
    specialties: string[];
    is_verified: boolean;
  };
  expires_at: string;
}

// Generate a secure session token
function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Login firm user
export async function loginFirmUser(
  email: string,
  password: string
): Promise<{
  success: boolean;
  session?: FirmSession;
  error?: string;
}> {
  try {
    // Get user with firm data
    const { data: userData, error: userError } = await supabase
      .from("firm_users")
      .select(
        `
        *,
        firms (
          id,
          company_name,
          specialties,
          is_verified,
          is_active
        )
      `
      )
      .eq("email", email)
      .eq("is_active", true)
      .single();

    if (userError || !userData) {
      return { success: false, error: "Email sau parolă incorectă" };
    }

    // Check if firm is active
    if (!userData.firms.is_active) {
      return { success: false, error: "Firma nu este activă" };
    }

    // Verify password
    const isValidPassword = await verifyPassword(
      password,
      userData.password_hash
    );
    if (!isValidPassword) {
      return { success: false, error: "Email sau parolă incorectă" };
    }

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8); // 8 hour session

    const { error: sessionError } = await supabase
      .from("firm_sessions")
      .insert({
        firm_user_id: userData.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      });

    if (sessionError) {
      return { success: false, error: "Eroare la crearea sesiunii" };
    }

    // Update last login
    await supabase
      .from("firm_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", userData.id);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("firm_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/firm",
    });

    const session: FirmSession = {
      user: {
        id: userData.id,
        firm_id: userData.firm_id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        role: userData.role,
        is_active: userData.is_active,
        created_at: userData.created_at,
        last_login: userData.last_login,
      },
      firm: {
        id: userData.firms.id,
        company_name: userData.firms.company_name,
        specialties: userData.firms.specialties,
        is_verified: userData.firms.is_verified,
      },
      expires_at: expiresAt.toISOString(),
    };

    return { success: true, session };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Eroare de server" };
  }
}

// Get current session
export async function getCurrentFirmSession(): Promise<FirmSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("firm_session")?.value;

    if (!sessionToken) {
      return null;
    }

    // Check session and get user data
    const { data, error } = await supabase
      .from("firm_sessions")
      .select(
        `
        expires_at,
        firm_users!inner (
          id,
          firm_id,
          email,
          first_name,
          last_name,
          phone,
          role,
          is_active,
          created_at,
          last_login,
          firms!inner (
            id,
            company_name,
            specialties,
            is_verified,
            is_active
          )
        )
      `
      )
      .eq("session_token", sessionToken)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (error || !data || !data.firm_users) {
      // Clean up invalid session
      if (sessionToken) {
        await logoutFirmUser();
      }
      return null;
    }

    const userData = data.firm_users as any;

    // Check if user and firm are still active
    if (!userData.is_active || !userData.firms.is_active) {
      await logoutFirmUser();
      return null;
    }

    // Update last accessed
    await supabase
      .from("firm_sessions")
      .update({ last_accessed: new Date().toISOString() })
      .eq("session_token", sessionToken);

    return {
      user: {
        id: userData.id,
        firm_id: userData.firm_id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        role: userData.role,
        is_active: userData.is_active,
        created_at: userData.created_at,
        last_login: userData.last_login,
      },
      firm: {
        id: userData.firms.id,
        company_name: userData.firms.company_name,
        specialties: userData.firms.specialties,
        is_verified: userData.firms.is_verified,
      },
      expires_at: data.expires_at,
    };
  } catch (error) {
    console.error("Session check error:", error);
    return null;
  }
}

// Logout firm user
export async function logoutFirmUser(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("firm_session")?.value;

    if (sessionToken) {
      // Delete session from database
      await supabase
        .from("firm_sessions")
        .delete()
        .eq("session_token", sessionToken);
    }

    // Clear cookie
    cookieStore.delete("firm_session");
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// Register new firm user (CEO only can create employees)
export async function registerFirmUser(
  firmId: string,
  userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: "ceo" | "employee";
  },
  createdBy?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("firm_users")
      .select("id")
      .eq("email", userData.email)
      .single();

    if (existingUser) {
      return { success: false, error: "Email-ul este deja folosit" };
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user
    const { error } = await supabase.from("firm_users").insert({
      firm_id: firmId,
      email: userData.email,
      password_hash: passwordHash,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone,
      role: userData.role,
      created_by: createdBy,
    });

    if (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Eroare la crearea contului" };
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Eroare de server" };
  }
}

// Middleware helper to check authentication
export async function requireFirmAuth(
  requiredRole?: "ceo" | "employee"
): Promise<{
  session: FirmSession | null;
  error?: string;
}> {
  const session = await getCurrentFirmSession();

  if (!session) {
    return { session: null, error: "Nu sunteți autentificat" };
  }

  if (
    requiredRole &&
    session.user.role !== requiredRole &&
    session.user.role !== "ceo"
  ) {
    return { session: null, error: "Nu aveți permisiunile necesare" };
  }

  return { session };
}
