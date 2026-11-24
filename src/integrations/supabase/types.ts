export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          id: string
          admin_id: string | null
          action: string
          target_table: string
          target_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id?: string | null
          action: string
          target_table: string
          target_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string | null
          action?: string
          target_table?: string
          target_id?: string | null
          details?: Json | null
          created_at?: string
        }
      }
      admin_profiles: {
        Row: {
          user_id: string
          display_name: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          display_name?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          display_name?: string | null
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          body: string
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          body: string
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          body?: string
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          topic: string
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          topic?: string
          message: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          topic?: string
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          status: string
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          status?: string
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          status?: string
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      creative_inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          organization: string | null
          service: string
          budget: string | null
          details: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          organization?: string | null
          service: string
          budget?: string | null
          details: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          organization?: string | null
          service?: string
          budget?: string | null
          details?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      financial_aid_applications: {
        Row: {
          id: string
          school_application_id: string | null
          name: string
          email: string
          phone: string | null
          program: string
          circumstances: string
          motivation: string
          evidence_refs: string | null
          consent_share_sponsor: boolean
          status: string
          sponsor_decision: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_application_id?: string | null
          name: string
          email: string
          phone?: string | null
          program: string
          circumstances: string
          motivation: string
          evidence_refs?: string | null
          consent_share_sponsor?: boolean
          status?: string
          sponsor_decision?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_application_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          program?: string
          circumstances?: string
          motivation?: string
          evidence_refs?: string | null
          consent_share_sponsor?: boolean
          status?: string
          sponsor_decision?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      promotion_submissions: {
        Row: {
          id: string
          submitter_name: string
          submitter_email: string
          category: string
          title: string
          link: string | null
          details: string
          status: string
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          submitter_name: string
          submitter_email: string
          category: string
          title: string
          link?: string | null
          details: string
          status?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          submitter_name?: string
          submitter_email?: string
          category?: string
          title?: string
          link?: string | null
          details?: string
          status?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      school_applications: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          county: string | null
          program: string
          course_id: string | null
          requesting_aid: boolean
          motivation: string
          status: string
          created_at: string
          reviewed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          county?: string | null
          program: string
          course_id?: string | null
          requesting_aid?: boolean
          motivation: string
          status?: string
          created_at?: string
          reviewed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          county?: string | null
          program?: string
          course_id?: string | null
          requesting_aid?: boolean
          motivation?: string
          status?: string
          created_at?: string
          reviewed_at?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      published_promotions: {
        Row: {
          id: string
          category: string
          title: string
          link: string | null
          details: string
          published_at: string | null
          created_at: string
        }
      }
    }
    Functions: {
      is_admin: {
        Args: Record<never, never>
        Returns: boolean
      }
      setup_admin_profile: {
        Args: { target_user_id: string; display_name: string }
        Returns: void
      }
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
