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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      authority_chairs: {
        Row: {
          biography: string | null
          country_code: string
          country_name: string
          created_at: string
          end_date: string | null
          full_name: string
          honorific: string
          id: string
          is_published: boolean
          language_versions: Json
          official_source: string | null
          official_title: string
          portrait_alt: string | null
          portrait_bucket: string | null
          portrait_path: string | null
          published_at: string
          role: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          biography?: string | null
          country_code: string
          country_name: string
          created_at?: string
          end_date?: string | null
          full_name: string
          honorific?: string
          id?: string
          is_published?: boolean
          language_versions?: Json
          official_source?: string | null
          official_title: string
          portrait_alt?: string | null
          portrait_bucket?: string | null
          portrait_path?: string | null
          published_at?: string
          role?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          biography?: string | null
          country_code?: string
          country_name?: string
          created_at?: string
          end_date?: string | null
          full_name?: string
          honorific?: string
          id?: string
          is_published?: boolean
          language_versions?: Json
          official_source?: string | null
          official_title?: string
          portrait_alt?: string | null
          portrait_bucket?: string | null
          portrait_path?: string | null
          published_at?: string
          role?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      careers_jobs: {
        Row: {
          age_exemption_notes: string | null
          age_requirement: string | null
          application_email: string | null
          application_method: string | null
          archived_at: string | null
          assessment_information: string | null
          career_area: string
          city: string
          closing_date: string
          competencies: string[]
          country: string
          created_at: string
          directorate: string | null
          division: string | null
          documents_required: string[]
          duty_station: string
          employment_status: string
          experience: string[]
          featured: boolean
          grade: string
          id: string
          institution: string
          is_published: boolean
          job_code: string
          language_requirements: string | null
          official_job_profile_url: string
          official_source_name: string
          official_source_url: string
          official_title: string
          publication_date: string
          published_at: string | null
          qualifications: string[]
          reports_to: string | null
          responsibilities: string[]
          role_overview: string
          salary_grade: string | null
          salary_notes: string | null
          salary_ua: number | null
          salary_usd: number | null
          slug: string
          source_last_verified_at: string
          source_publication_date: string
          source_status: string
          summary: string
          supervises: string[]
          tags: string[]
          updated_at: string
        }
        Insert: {
          age_exemption_notes?: string | null
          age_requirement?: string | null
          application_email?: string | null
          application_method?: string | null
          archived_at?: string | null
          assessment_information?: string | null
          career_area: string
          city: string
          closing_date: string
          competencies?: string[]
          country: string
          created_at?: string
          directorate?: string | null
          division?: string | null
          documents_required?: string[]
          duty_station: string
          employment_status: string
          experience?: string[]
          featured?: boolean
          grade: string
          id?: string
          institution: string
          is_published?: boolean
          job_code: string
          language_requirements?: string | null
          official_job_profile_url: string
          official_source_name: string
          official_source_url: string
          official_title: string
          publication_date: string
          published_at?: string | null
          qualifications?: string[]
          reports_to?: string | null
          responsibilities?: string[]
          role_overview: string
          salary_grade?: string | null
          salary_notes?: string | null
          salary_ua?: number | null
          salary_usd?: number | null
          slug: string
          source_last_verified_at?: string
          source_publication_date: string
          source_status?: string
          summary: string
          supervises?: string[]
          tags?: string[]
          updated_at?: string
        }
        Update: {
          age_exemption_notes?: string | null
          age_requirement?: string | null
          application_email?: string | null
          application_method?: string | null
          archived_at?: string | null
          assessment_information?: string | null
          career_area?: string
          city?: string
          closing_date?: string
          competencies?: string[]
          country?: string
          created_at?: string
          directorate?: string | null
          division?: string | null
          documents_required?: string[]
          duty_station?: string
          employment_status?: string
          experience?: string[]
          featured?: boolean
          grade?: string
          id?: string
          institution?: string
          is_published?: boolean
          job_code?: string
          language_requirements?: string | null
          official_job_profile_url?: string
          official_source_name?: string
          official_source_url?: string
          official_title?: string
          publication_date?: string
          published_at?: string | null
          qualifications?: string[]
          reports_to?: string | null
          responsibilities?: string[]
          role_overview?: string
          salary_grade?: string | null
          salary_notes?: string | null
          salary_ua?: number | null
          salary_usd?: number | null
          slug?: string
          source_last_verified_at?: string
          source_publication_date?: string
          source_status?: string
          summary?: string
          supervises?: string[]
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      contact_audit: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          id: string
          record_id: string | null
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          id?: string
          record_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          id?: string
          record_id?: string | null
        }
        Relationships: []
      }
      contact_enquiries: {
        Row: {
          assigned_unit: string | null
          consent_recorded: boolean
          country: string | null
          created_at: string
          email: string
          enquiry_type: string
          first_name: string
          id: string
          last_name: string
          message: string
          organization: string | null
          preferred_language: string
          reference_number: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_unit?: string | null
          consent_recorded: boolean
          country?: string | null
          created_at?: string
          email: string
          enquiry_type: string
          first_name: string
          id?: string
          last_name: string
          message: string
          organization?: string | null
          preferred_language: string
          reference_number?: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_unit?: string | null
          consent_recorded?: boolean
          country?: string | null
          created_at?: string
          email?: string
          enquiry_type?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          organization?: string | null
          preferred_language?: string
          reference_number?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_notes: {
        Row: {
          actor_id: string
          created_at: string
          enquiry_id: string
          id: string
          note: string
        }
        Insert: {
          actor_id: string
          created_at?: string
          enquiry_id: string
          id?: string
          note: string
        }
        Update: {
          actor_id?: string
          created_at?: string
          enquiry_id?: string
          id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_notes_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "contact_enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_routes: {
        Row: {
          assigned_unit: string
          created_at: string
          destination_email: string | null
          enabled: boolean
          enquiry_type: string
          updated_at: string
        }
        Insert: {
          assigned_unit: string
          created_at?: string
          destination_email?: string | null
          enabled?: boolean
          enquiry_type: string
          updated_at?: string
        }
        Update: {
          assigned_unit?: string
          created_at?: string
          destination_email?: string | null
          enabled?: boolean
          enquiry_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_staff: {
        Row: {
          can_export: boolean
          created_at: string
          user_id: string
        }
        Insert: {
          can_export?: boolean
          created_at?: string
          user_id: string
        }
        Update: {
          can_export?: boolean
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      oag_ai_messages: {
        Row: {
          citations: Json
          content: string
          created_at: string
          id: string
          query_mode: string
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          citations?: Json
          content: string
          created_at?: string
          id?: string
          query_mode?: string
          role: string
          thread_id: string
          user_id: string
        }
        Update: {
          citations?: Json
          content?: string
          created_at?: string
          id?: string
          query_mode?: string
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oag_ai_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "oag_ai_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      oag_ai_threads: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_assets: {
        Row: {
          alt_text: string
          asset_key: string
          bucket_id: string
          created_at: string
          display_order: number
          id: string
          institution_name: string
          is_active: boolean
          storage_path: string
          updated_at: string
        }
        Insert: {
          alt_text: string
          asset_key: string
          bucket_id?: string
          created_at?: string
          display_order?: number
          id?: string
          institution_name: string
          is_active?: boolean
          storage_path: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          asset_key?: string
          bucket_id?: string
          created_at?: string
          display_order?: number
          id?: string
          institution_name?: string
          is_active?: boolean
          storage_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: Json
          content_key: string
          created_at: string
          display_order: number
          id: string
          is_placeholder: boolean
          is_published: boolean
          section: string
          updated_at: string
        }
        Insert: {
          content: Json
          content_key: string
          created_at?: string
          display_order?: number
          id?: string
          is_placeholder?: boolean
          is_published?: boolean
          section: string
          updated_at?: string
        }
        Update: {
          content?: Json
          content_key?: string
          created_at?: string
          display_order?: number
          id?: string
          is_placeholder?: boolean
          is_published?: boolean
          section?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
