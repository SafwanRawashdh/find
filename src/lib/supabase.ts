/**
 * Supabase client configuration
 * 
 * This module creates and exports a typed Supabase client instance.
 * Uses environment variables with fallback values for development.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxqbwckwcyhubyekyhxk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cWJ3Y2t3Y3lodWJ5ZWt5aHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjA1MjEsImV4cCI6MjA4MDQ5NjUyMX0._EjkyIGDfe9nO2eaPkl634R2F6L-iNhhPeIF0z_QW3U';

// Using 'any' for the generic to avoid complex type issues
// The actual data shapes are defined in database.types.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
