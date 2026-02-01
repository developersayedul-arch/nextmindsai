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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_login_attempts: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          email: string
          failure_reason: string | null
          id: string
          ip_address: string | null
          os: string | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          email: string
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          os?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          email?: string
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          os?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_whitelist: {
        Row: {
          added_by: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
        }
        Update: {
          added_by?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      analyses: {
        Row: {
          budget_range: string
          business_idea: string
          business_type: string
          created_at: string
          id: string
          is_paid: boolean
          location: string | null
          results: Json | null
          updated_at: string
          user_id: string
          whatsapp_number: string
        }
        Insert: {
          budget_range: string
          business_idea: string
          business_type: string
          created_at?: string
          id?: string
          is_paid?: boolean
          location?: string | null
          results?: Json | null
          updated_at?: string
          user_id: string
          whatsapp_number: string
        }
        Update: {
          budget_range?: string
          business_idea?: string
          business_type?: string
          created_at?: string
          id?: string
          is_paid?: boolean
          location?: string | null
          results?: Json | null
          updated_at?: string
          user_id?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      anonymous_analyses: {
        Row: {
          budget_range: string | null
          business_idea: string | null
          business_type: string | null
          converted_at: string | null
          converted_to_user: boolean | null
          converted_user_id: string | null
          created_at: string
          form_step: string | null
          id: string
          ip_address: string | null
          location: string | null
          session_id: string
          updated_at: string
          user_agent: string | null
          visitor_id: string | null
          whatsapp_number: string | null
        }
        Insert: {
          budget_range?: string | null
          business_idea?: string | null
          business_type?: string | null
          converted_at?: string | null
          converted_to_user?: boolean | null
          converted_user_id?: string | null
          created_at?: string
          form_step?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          session_id: string
          updated_at?: string
          user_agent?: string | null
          visitor_id?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          budget_range?: string | null
          business_idea?: string | null
          business_type?: string | null
          converted_at?: string | null
          converted_to_user?: boolean | null
          converted_user_id?: string | null
          created_at?: string
          form_step?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          session_id?: string
          updated_at?: string
          user_agent?: string | null
          visitor_id?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anonymous_analyses_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          status: string
          updated_at: string
          user_id: string | null
          visitor_name: string | null
          visitor_session_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          visitor_name?: string | null
          visitor_session_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          visitor_name?: string | null
          visitor_session_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          sender_type: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          sender_type: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      dodo_products: {
        Row: {
          created_at: string
          display_name: string
          display_name_bn: string | null
          display_order: number
          dodo_product_id: string
          duration_info: string | null
          id: string
          is_active: boolean
          price_bdt: number
          product_key: string
          product_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          display_name_bn?: string | null
          display_order?: number
          dodo_product_id: string
          duration_info?: string | null
          id?: string
          is_active?: boolean
          price_bdt?: number
          product_key: string
          product_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          display_name_bn?: string | null
          display_order?: number
          dodo_product_id?: string
          duration_info?: string | null
          id?: string
          is_active?: boolean
          price_bdt?: number
          product_key?: string
          product_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      follow_up_reminders: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          id: string
          lead_id: string | null
          notes: string | null
          reminder_type: string
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          reminder_type?: string
          scheduled_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          reminder_type?: string
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_reminders_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          budget_range: string | null
          business_idea: string | null
          business_type: string | null
          created_at: string
          form_step: string | null
          id: string
          is_completed: boolean | null
          location: string | null
          session_id: string | null
          updated_at: string
          user_id: string | null
          visitor_id: string | null
          whatsapp_number: string | null
        }
        Insert: {
          budget_range?: string | null
          business_idea?: string | null
          business_type?: string | null
          created_at?: string
          form_step?: string | null
          id?: string
          is_completed?: boolean | null
          location?: string | null
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
          visitor_id?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          budget_range?: string | null
          business_idea?: string | null
          business_type?: string | null
          created_at?: string
          form_step?: string | null
          id?: string
          is_completed?: boolean | null
          location?: string | null
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
          visitor_id?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_type: string
          session_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_type: string
          session_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_type?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentorship_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_session_types: {
        Row: {
          created_at: string
          description_bn: string | null
          display_order: number
          duration_minutes: number
          icon_name: string | null
          id: string
          is_active: boolean
          label_bn: string
          price: number
          session_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_bn?: string | null
          display_order?: number
          duration_minutes?: number
          icon_name?: string | null
          id?: string
          is_active?: boolean
          label_bn: string
          price?: number
          session_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_bn?: string | null
          display_order?: number
          duration_minutes?: number
          icon_name?: string | null
          id?: string
          is_active?: boolean
          label_bn?: string
          price?: number
          session_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          business_idea: string | null
          created_at: string
          duration_minutes: number
          id: string
          meeting_link: string | null
          mentor_name: string
          notes: string | null
          payment_status: string
          price: number
          session_date: string
          session_type: string
          status: string
          topics: string[] | null
          updated_at: string
          user_id: string | null
          whatsapp_number: string
        }
        Insert: {
          business_idea?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          mentor_name?: string
          notes?: string | null
          payment_status?: string
          price?: number
          session_date: string
          session_type: string
          status?: string
          topics?: string[] | null
          updated_at?: string
          user_id?: string | null
          whatsapp_number: string
        }
        Update: {
          business_idea?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          mentor_name?: string
          notes?: string | null
          payment_status?: string
          price?: number
          session_date?: string
          session_type?: string
          status?: string
          topics?: string[] | null
          updated_at?: string
          user_id?: string | null
          whatsapp_number?: string
        }
        Relationships: []
      }
      mentorship_settings: {
        Row: {
          coming_soon_message: string | null
          id: string
          is_enabled: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          coming_soon_message?: string | null
          id?: string
          is_enabled?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          coming_soon_message?: string | null
          id?: string
          is_enabled?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: string
          page_path: string
          page_title: string | null
          session_id: string
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          page_path: string
          page_title?: string | null
          session_id: string
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          page_path?: string
          page_title?: string | null
          session_id?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          account_name: string | null
          account_number: string | null
          created_at: string
          display_order: number
          id: string
          instructions: string | null
          is_active: boolean
          logo_url: string | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          created_at?: string
          display_order?: number
          id?: string
          instructions?: string | null
          is_active?: boolean
          logo_url?: string | null
          name: string
          type?: string
          updated_at?: string
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          created_at?: string
          display_order?: number
          id?: string
          instructions?: string | null
          is_active?: boolean
          logo_url?: string | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          analysis_id: string | null
          created_at: string
          id: string
          notes: string | null
          payment_method: string
          sender_number: string | null
          status: string
          transaction_id: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          amount: number
          analysis_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method: string
          sender_number?: string | null
          status?: string
          transaction_id: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          amount?: number
          analysis_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          sender_number?: string | null
          status?: string
          transaction_id?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          is_active: boolean
          payment_id: string | null
          plan_type: string
          starts_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          is_active?: boolean
          payment_id?: string | null
          plan_type: string
          starts_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          payment_id?: string | null
          plan_type?: string
          starts_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
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
      visitors: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          ip_address: string | null
          landing_page: string | null
          os: string | null
          referrer: string | null
          session_id: string
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          landing_page?: string | null
          os?: string | null
          referrer?: string | null
          session_id: string
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          landing_page?: string | null
          os?: string | null
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      website_leads: {
        Row: {
          budget_range: string | null
          business_idea: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          service_interest: string
          source: string | null
          status: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          budget_range?: string | null
          business_idea?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          service_interest: string
          source?: string | null
          status?: string
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          budget_range?: string | null
          business_idea?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          service_interest?: string
          source?: string | null
          status?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_rate_limit: { Args: { _email: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_whitelisted: { Args: { _email: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
