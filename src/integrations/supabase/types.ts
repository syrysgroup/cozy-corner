export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bulk_import_logs: {
        Row: {
          completed_at: string | null
          created_at: string
          details: Json | null
          error_count: number
          file_name: string
          file_url: string | null
          id: string
          row_count: number
          status: string
          success_count: number
          user_id: string
          warning_count: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          details?: Json | null
          error_count?: number
          file_name: string
          file_url?: string | null
          id?: string
          row_count?: number
          status: string
          success_count?: number
          user_id: string
          warning_count?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          details?: Json | null
          error_count?: number
          file_name?: string
          file_url?: string | null
          id?: string
          row_count?: number
          status?: string
          success_count?: number
          user_id?: string
          warning_count?: number
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          admin_notes: string | null
          document_type: string
          file_url: string
          id: string
          status: string | null
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          document_type: string
          file_url: string
          id?: string
          status?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          document_type?: string
          file_url?: string
          id?: string
          status?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      listing_units: {
        Row: {
          available: boolean | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          id: string
          listing_id: string
          price: number
          unit_name: string
        }
        Insert: {
          available?: boolean | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          id?: string
          listing_id: string
          price: number
          unit_name: string
        }
        Update: {
          available?: boolean | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          id?: string
          listing_id?: string
          price?: number
          unit_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_units_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_versions: {
        Row: {
          changed_at: string
          changed_by: string
          id: string
          listing_id: string
          snapshot: Json
        }
        Insert: {
          changed_at?: string
          changed_by: string
          id?: string
          listing_id: string
          snapshot: Json
        }
        Update: {
          changed_at?: string
          changed_by?: string
          id?: string
          listing_id?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "listing_versions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          address_text: string
          amenities: string[] | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          country: string
          created_at: string
          description_en: string | null
          description_fr: string | null
          formatted_address: string | null
          id: string
          image_urls: string[] | null
          listing_type: string
          lot_size: number | null
          price: number
          property_size: number | null
          province: string
          rent_frequency: string | null
          status: string
          title_en: string
          title_fr: string
          unit_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_text: string
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          country?: string
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          formatted_address?: string | null
          id?: string
          image_urls?: string[] | null
          listing_type: string
          lot_size?: number | null
          price: number
          property_size?: number | null
          province: string
          rent_frequency?: string | null
          status?: string
          title_en: string
          title_fr: string
          unit_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_text?: string
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          country?: string
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          formatted_address?: string | null
          id?: string
          image_urls?: string[] | null
          listing_type?: string
          lot_size?: number | null
          price?: number
          property_size?: number | null
          province?: string
          rent_frequency?: string | null
          status?: string
          title_en?: string
          title_fr?: string
          unit_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          full_name: string | null
          id: string
          kyc_level: string | null
          kyc_status: string | null
          last_name: string | null
          onboarding_step: string | null
          phone: string | null
          preferred_language: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id: string
          kyc_level?: string | null
          kyc_status?: string | null
          last_name?: string | null
          onboarding_step?: string | null
          phone?: string | null
          preferred_language?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          kyc_level?: string | null
          kyc_status?: string | null
          last_name?: string | null
          onboarding_step?: string | null
          phone?: string | null
          preferred_language?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          bathrooms: number | null
          bedrooms: number | null
          city: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          latitude: number | null
          longitude: number | null
          owner_id: string
          postal_code: string
          price: number
          property_type: string | null
          province: string
          sqft: number | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          address: string
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          owner_id: string
          postal_code: string
          price: number
          property_type?: string | null
          province: string
          sqft?: number | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          address?: string
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          owner_id?: string
          postal_code?: string
          price?: number
          property_type?: string | null
          province?: string
          sqft?: number | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_listings: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "tenant"
        | "landlord"
        | "agent"
        | "artisan"
        | "business_manager"
        | "student"
        | "investor"
        | "government_ppp"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "tenant",
        "landlord",
        "agent",
        "artisan",
        "business_manager",
        "student",
        "investor",
        "government_ppp",
        "admin",
      ],
    },
  },
} as const
