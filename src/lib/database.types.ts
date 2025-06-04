export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          role:
            | "HOMEOWNER"
            | "ARCHITECT"
            | "FIRM_CEO"
            | "FIRM_EMPLOYEE"
            | "ADMIN";
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          last_login_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          user_id: string;
          role:
            | "HOMEOWNER"
            | "ARCHITECT"
            | "FIRM_CEO"
            | "FIRM_EMPLOYEE"
            | "ADMIN";
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          last_login_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          user_id?: string;
          role?:
            | "HOMEOWNER"
            | "ARCHITECT"
            | "FIRM_CEO"
            | "FIRM_EMPLOYEE"
            | "ADMIN";
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          last_login_at?: string | null;
          deleted_at?: string | null;
        };
      };
      firms: {
        Row: {
          id: string;
          name: string;
          vat_number: string | null;
          address_json: Json | null;
          location_point: unknown | null;
          service_radius_km: number | null;
          is_verified: boolean;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          vat_number?: string | null;
          address_json?: Json | null;
          location_point?: unknown | null;
          service_radius_km?: number | null;
          is_verified?: boolean;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          vat_number?: string | null;
          address_json?: Json | null;
          location_point?: unknown | null;
          service_radius_km?: number | null;
          is_verified?: boolean;
          created_at?: string;
          deleted_at?: string | null;
        };
      };
      firm_members: {
        Row: {
          id: string;
          firm_id: string;
          user_id: string;
          member_role: "CEO" | "EMPLOYEE";
          invited_at: string;
          accepted_at: string | null;
          is_active: boolean;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          firm_id: string;
          user_id: string;
          member_role: "CEO" | "EMPLOYEE";
          invited_at?: string;
          accepted_at?: string | null;
          is_active?: boolean;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          firm_id?: string;
          user_id?: string;
          member_role?: "CEO" | "EMPLOYEE";
          invited_at?: string;
          accepted_at?: string | null;
          is_active?: boolean;
          deleted_at?: string | null;
        };
      };
      homes: {
        Row: {
          id: string;
          owner_id: string;
          name: string | null;
          address_json: Json | null;
          home_point: unknown | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name?: string | null;
          address_json?: Json | null;
          home_point?: unknown | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string | null;
          address_json?: Json | null;
          home_point?: unknown | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      furniture_requests: {
        Row: {
          id: string;
          creator_id: string;
          home_id: string | null;
          primary_category_id: string | null;
          title: string | null;
          brief_text: string | null;
          status:
            | "DRAFT"
            | "OPEN"
            | "REDEEMED"
            | "QUOTED"
            | "ACCEPTED"
            | "DECLINED"
            | "EXPIRED";
          expires_at: string | null;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          creator_id: string;
          home_id?: string | null;
          primary_category_id?: string | null;
          title?: string | null;
          brief_text?: string | null;
          status?:
            | "DRAFT"
            | "OPEN"
            | "REDEEMED"
            | "QUOTED"
            | "ACCEPTED"
            | "DECLINED"
            | "EXPIRED";
          expires_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          creator_id?: string;
          home_id?: string | null;
          primary_category_id?: string | null;
          title?: string | null;
          brief_text?: string | null;
          status?:
            | "DRAFT"
            | "OPEN"
            | "REDEEMED"
            | "QUOTED"
            | "ACCEPTED"
            | "DECLINED"
            | "EXPIRED";
          expires_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      role_enum:
        | "HOMEOWNER"
        | "ARCHITECT"
        | "FIRM_CEO"
        | "FIRM_EMPLOYEE"
        | "ADMIN";
      req_status_enum:
        | "DRAFT"
        | "OPEN"
        | "REDEEMED"
        | "QUOTED"
        | "ACCEPTED"
        | "DECLINED"
        | "EXPIRED";
      event_type_enum:
        | "message_sent"
        | "message_read"
        | "request_redeemed"
        | "quote_viewed"
        | "offer_read";
    };
  };
}
