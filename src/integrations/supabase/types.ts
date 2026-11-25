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
      admin_activity: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          details: Json | null
          id: string
          record_id: string | null
          table_name: string | null
        }
        Insert: {
          action: string
          actor_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          body: string
          created_at: string
          id: string
          is_published: boolean
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: Database["public"]["Enums"]["inquiry_status"]
          topic: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: Database["public"]["Enums"]["inquiry_status"]
          topic?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: Database["public"]["Enums"]["inquiry_status"]
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          duration: string | null
          fee_lrd: number | null
          id: string
          is_published: boolean
          slug: string
          sort_order: number
          start_date: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          fee_lrd?: number | null
          id?: string
          is_published?: boolean
          slug: string
          sort_order?: number
          start_date?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          fee_lrd?: number | null
          id?: string
          is_published?: boolean
          slug?: string
          sort_order?: number
          start_date?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      creative_inquiries: {
        Row: {
          admin_notes: string | null
          budget: string | null
          created_at: string
          details: string
          email: string
          id: string
          name: string
          organization: string | null
          phone: string | null
          service: string
          status: Database["public"]["Enums"]["inquiry_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          budget?: string | null
          created_at?: string
          details: string
          email: string
          id?: string
          name: string
          organization?: string | null
          phone?: string | null
          service: string
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          budget?: string | null
          created_at?: string
          details?: string
          email?: string
          id?: string
          name?: string
          organization?: string | null
          phone?: string | null
          service?: string
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Relationships: []
      }
      financial_aid_applications: {
        Row: {
          admin_notes: string | null
          amount_awarded_lrd: number | null
          amount_requested_lrd: number | null
          created_at: string
          document_paths: string[]
          email: string
          essay: string
          full_name: string
          household_situation: string | null
          id: string
          status: Database["public"]["Enums"]["aid_status"]
          training_application_id: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount_awarded_lrd?: number | null
          amount_requested_lrd?: number | null
          created_at?: string
          document_paths?: string[]
          email: string
          essay: string
          full_name: string
          household_situation?: string | null
          id?: string
          status?: Database["public"]["Enums"]["aid_status"]
          training_application_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount_awarded_lrd?: number | null
          amount_requested_lrd?: number | null
          created_at?: string
          document_paths?: string[]
          email?: string
          essay?: string
          full_name?: string
          household_situation?: string | null
          id?: string
          status?: Database["public"]["Enums"]["aid_status"]
          training_application_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_aid_applications_training_application_id_fkey"
            columns: ["training_application_id"]
            isOneToOne: false
            referencedRelation: "training_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_inquiries: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string
          name: string
          organization: string | null
          status: Database["public"]["Enums"]["inquiry_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          inquiry_type?: string
          message: string
          name: string
          organization?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          organization?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          body: string | null
          category: string | null
          client_name: string | null
          completed_on: string | null
          cover_image_path: string | null
          created_at: string
          id: string
          is_published: boolean
          project_url: string | null
          slug: string
          sort_order: number
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          category?: string | null
          client_name?: string | null
          completed_on?: string | null
          cover_image_path?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          project_url?: string | null
          slug: string
          sort_order?: number
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          category?: string | null
          client_name?: string | null
          completed_on?: string | null
          cover_image_path?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          project_url?: string | null
          slug?: string
          sort_order?: number
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      promotion_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string
          details: string
          email: string
          id: string
          link: string | null
          name: string
          promo_type: string
          status: Database["public"]["Enums"]["promotion_status"]
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          details: string
          email: string
          id?: string
          link?: string | null
          name: string
          promo_type: string
          status?: Database["public"]["Enums"]["promotion_status"]
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          details?: string
          email?: string
          id?: string
          link?: string | null
          name?: string
          promo_type?: string
          status?: Database["public"]["Enums"]["promotion_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          body: string
          created_at: string
          ends_on: string | null
          id: string
          image_path: string | null
          is_published: boolean
          link: string | null
          promo_type: string
          published_at: string | null
          starts_on: string | null
          submission_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          ends_on?: string | null
          id?: string
          image_path?: string | null
          is_published?: boolean
          link?: string | null
          promo_type: string
          published_at?: string | null
          starts_on?: string | null
          submission_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          ends_on?: string | null
          id?: string
          image_path?: string | null
          is_published?: boolean
          link?: string | null
          promo_type?: string
          published_at?: string | null
          starts_on?: string | null
          submission_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "promotion_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_applications: {
        Row: {
          admin_notes: string | null
          county: string | null
          course_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          motivation: string
          phone: string
          program_name: string
          requests_financial_aid: boolean
          status: Database["public"]["Enums"]["training_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          county?: string | null
          course_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          motivation: string
          phone: string
          program_name: string
          requests_financial_aid?: boolean
          status?: Database["public"]["Enums"]["training_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          county?: string | null
          course_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          motivation?: string
          phone?: string
          program_name?: string
          requests_financial_aid?: boolean
          status?: Database["public"]["Enums"]["training_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_applications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      aid_status:
        | "submitted"
        | "under_review"
        | "approved"
        | "partially_approved"
        | "declined"
      app_role: "admin"
      inquiry_status: "new" | "in_progress" | "closed"
      promotion_status:
        | "submitted"
        | "under_review"
        | "changes_requested"
        | "approved"
        | "rejected"
        | "published"
      training_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "shortlisted"
        | "not_selected"
        | "waitlisted"
        | "accepted"
        | "confirmed"
        | "enrolled"
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
    Enums: {
      aid_status: [
        "submitted",
        "under_review",
        "approved",
        "partially_approved",
        "declined",
      ],
      app_role: ["admin"],
      inquiry_status: ["new", "in_progress", "closed"],
      promotion_status: [
        "submitted",
        "under_review",
        "changes_requested",
        "approved",
        "rejected",
        "published",
      ],
      training_status: [
        "draft",
        "submitted",
        "under_review",
        "shortlisted",
        "not_selected",
        "waitlisted",
        "accepted",
        "confirmed",
        "enrolled",
      ],
    },
  },
} as const
