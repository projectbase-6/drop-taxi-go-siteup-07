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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          actual_fare: number | null
          created_at: string
          destination: string
          distance_km: number | null
          driver_name: string | null
          driver_phone: string | null
          duration_minutes: number | null
          estimated_fare: number | null
          id: string
          passenger_email: string | null
          passenger_name: string
          passenger_phone: string
          pickup_date: string
          pickup_location: string
          pickup_time: string
          status: string
          trip_type: string | null
          updated_at: string
          vehicle_type: string | null
        }
        Insert: {
          actual_fare?: number | null
          created_at?: string
          destination: string
          distance_km?: number | null
          driver_name?: string | null
          driver_phone?: string | null
          duration_minutes?: number | null
          estimated_fare?: number | null
          id?: string
          passenger_email?: string | null
          passenger_name: string
          passenger_phone: string
          pickup_date: string
          pickup_location: string
          pickup_time: string
          status?: string
          trip_type?: string | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Update: {
          actual_fare?: number | null
          created_at?: string
          destination?: string
          distance_km?: number | null
          driver_name?: string | null
          driver_phone?: string | null
          duration_minutes?: number | null
          estimated_fare?: number | null
          id?: string
          passenger_email?: string | null
          passenger_name?: string
          passenger_phone?: string
          pickup_date?: string
          pickup_location?: string
          pickup_time?: string
          status?: string
          trip_type?: string | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      queries: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          phone: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          phone?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      routes: {
        Row: {
          created_at: string
          distance_km: number | null
          from_destination: string
          id: string
          price: number
          profile_image: string | null
          rating: number | null
          to_destination: string
          trip_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          distance_km?: number | null
          from_destination: string
          id?: string
          price: number
          profile_image?: string | null
          rating?: number | null
          to_destination: string
          trip_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          distance_km?: number | null
          from_destination?: string
          id?: string
          price?: number
          profile_image?: string | null
          rating?: number | null
          to_destination?: string
          trip_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      tariffs: {
        Row: {
          base_fare: number
          created_at: string
          currency: string
          drop_trip_rate_per_km: number
          id: string
          per_minute_rate: number
          round_trip_rate_per_km: number
          trip_type: string
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          base_fare?: number
          created_at?: string
          currency?: string
          drop_trip_rate_per_km?: number
          id?: string
          per_minute_rate?: number
          round_trip_rate_per_km?: number
          trip_type?: string
          updated_at?: string
          vehicle_type?: string
        }
        Update: {
          base_fare?: number
          created_at?: string
          currency?: string
          drop_trip_rate_per_km?: number
          id?: string
          per_minute_rate?: number
          round_trip_rate_per_km?: number
          trip_type?: string
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      vehicle_categories: {
        Row: {
          base_multiplier: number
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          base_multiplier?: number
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          base_multiplier?: number
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      vehicle_types: {
        Row: {
          base_fare: number | null
          category_id: string
          created_at: string
          description: string | null
          drop_trip_rate_per_km: number | null
          id: string
          is_active: boolean
          min_135km_fare: number | null
          min_20km_fare: number | null
          name: string
          per_minute_rate: number | null
          price_multiplier: number
          round_trip_rate_per_km: number | null
          updated_at: string
        }
        Insert: {
          base_fare?: number | null
          category_id: string
          created_at?: string
          description?: string | null
          drop_trip_rate_per_km?: number | null
          id?: string
          is_active?: boolean
          min_135km_fare?: number | null
          min_20km_fare?: number | null
          name: string
          per_minute_rate?: number | null
          price_multiplier?: number
          round_trip_rate_per_km?: number | null
          updated_at?: string
        }
        Update: {
          base_fare?: number | null
          category_id?: string
          created_at?: string
          description?: string | null
          drop_trip_rate_per_km?: number | null
          id?: string
          is_active?: boolean
          min_135km_fare?: number | null
          min_20km_fare?: number | null
          name?: string
          per_minute_rate?: number | null
          price_multiplier?: number
          round_trip_rate_per_km?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_types_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
