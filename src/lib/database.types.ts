/**
 * Database types for Supabase
 * 
 * These types match the database schema defined in supabase/migrations/
 */

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          marketplace: 'AMAZON' | 'EBAY';
          title: string;
          image_url: string;
          price: number;
          currency: string;
          rating: number;
          rating_count: number;
          shipping_estimate: string;
          condition: 'new' | 'used';
          ships_to: string[];
          product_url: string | null;
          description: string | null;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          marketplace: 'AMAZON' | 'EBAY';
          title: string;
          image_url: string;
          price: number;
          currency?: string;
          rating?: number;
          rating_count?: number;
          shipping_estimate?: string;
          condition?: 'new' | 'used';
          ships_to?: string[];
          product_url?: string | null;
          description?: string | null;
          category: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          default_country: string;
          default_currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          display_name: string;
          default_country?: string;
          default_currency?: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
        };
        Update: never;
      };
      price_history: {
        Row: {
          id: string;
          product_id: string;
          date: string;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          date: string;
          price: number;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];
