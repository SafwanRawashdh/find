import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to provided values
// Next.js uses process.env for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xxqbwckwcyhubyekyhxk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cWJ3Y2t3Y3lodWJ5ZWt5aHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjA1MjEsImV4cCI6MjA4MDQ5NjUyMX0._EjkyIGDfe9nO2eaPkl634R2F6L-iNhhPeIF0z_QW3U';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Database types (to be updated based on your actual schema)
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          marketplace: string;
          title: string;
          image_url: string;
          price: number;
          currency: string;
          rating: number;
          rating_count: number;
          shipping_estimate: string;
          condition: string;
          ships_to: string[];
          product_url: string | null;
          description: string | null;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          marketplace: string;
          title: string;
          image_url: string;
          price: number;
          currency?: string;
          rating?: number;
          rating_count?: number;
          shipping_estimate?: string;
          condition?: string;
          ships_to?: string[];
          product_url?: string | null;
          description?: string | null;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          marketplace?: string;
          title?: string;
          image_url?: string;
          price?: number;
          currency?: string;
          rating?: number;
          rating_count?: number;
          shipping_estimate?: string;
          condition?: string;
          ships_to?: string[];
          product_url?: string | null;
          description?: string | null;
          category?: string;
          updated_at?: string;
        };
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          display_name?: string;
          default_country?: string;
          default_currency?: string;
          updated_at?: string;
        };
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
          created_at?: string;
        };
        Update: {};
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
          created_at?: string;
        };
        Update: {};
      };
    };
    Views: {};
    Functions: {};
  };
}

