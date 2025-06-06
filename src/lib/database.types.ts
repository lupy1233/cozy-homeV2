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
          creator_id: string | null;
          home_id: string | null;
          primary_category_id: string | null;
          title: string | null;
          brief_text: string | null;
          status: Database["public"]["Enums"]["req_status_enum"] | null;
          expires_at: string | null;
          created_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          creator_id?: string | null;
          home_id?: string | null;
          primary_category_id?: string | null;
          title?: string | null;
          brief_text?: string | null;
          status?: Database["public"]["Enums"]["req_status_enum"] | null;
          expires_at?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          creator_id?: string | null;
          home_id?: string | null;
          primary_category_id?: string | null;
          title?: string | null;
          brief_text?: string | null;
          status?: Database["public"]["Enums"]["req_status_enum"] | null;
          expires_at?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
        };
      };
      request_categories: {
        Row: {
          id: string;
          name: string | null;
          lang_code: string | null;
          translation_of: string | null;
          icon: string | null;
          description: string | null;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          lang_code?: string | null;
          translation_of?: string | null;
          icon?: string | null;
          description?: string | null;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          lang_code?: string | null;
          translation_of?: string | null;
          icon?: string | null;
          description?: string | null;
          image_url?: string | null;
        };
      };
      request_questions: {
        Row: {
          id: string;
          category_id: string | null;
          question_text: string | null;
          input_type: string | null;
          lang_code: string | null;
          translation_of: string | null;
          description: string | null;
          question_type: string | null;
          selection_type: string | null;
          required: boolean | null;
          depends_on_question_id: string | null;
          depends_on_values: any | null;
          measurements_config: any | null;
          file_upload_config: any | null;
          options: any | null;
          sort_order: number | null;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          question_text?: string | null;
          input_type?: string | null;
          lang_code?: string | null;
          translation_of?: string | null;
          description?: string | null;
          question_type?: string | null;
          selection_type?: string | null;
          required?: boolean | null;
          depends_on_question_id?: string | null;
          depends_on_values?: any | null;
          measurements_config?: any | null;
          file_upload_config?: any | null;
          options?: any | null;
          sort_order?: number | null;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          question_text?: string | null;
          input_type?: string | null;
          lang_code?: string | null;
          translation_of?: string | null;
          description?: string | null;
          question_type?: string | null;
          selection_type?: string | null;
          required?: boolean | null;
          depends_on_question_id?: string | null;
          depends_on_values?: any | null;
          measurements_config?: any | null;
          file_upload_config?: any | null;
          options?: any | null;
          sort_order?: number | null;
        };
      };
      request_answers: {
        Row: {
          id: string;
          request_id: string | null;
          question_id: string | null;
          answer_json: any | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          request_id?: string | null;
          question_id?: string | null;
          answer_json?: any | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          request_id?: string | null;
          question_id?: string | null;
          answer_json?: any | null;
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
