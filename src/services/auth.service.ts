/**
 * Auth Service
 * 
 * Handles authentication and user operations with Supabase.
 */

import { supabase } from '../lib/supabase';
import type { IUser } from '../types';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthState {
  user: IUser | null;
  session: Session | null;
  isLoading: boolean;
}

interface DbUserProfile {
  id: string;
  email: string;
  display_name: string;
  default_country: string;
  default_currency: string;
}

/**
 * Map Supabase user to application user type
 */
function mapSupabaseUser(user: SupabaseUser, profile?: Partial<IUser>): IUser {
  return {
    _id: user.id,
    email: user.email || '',
    displayName: profile?.displayName || user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
    defaultCountry: profile?.defaultCountry || 'US',
    defaultCurrency: profile?.defaultCurrency || 'USD',
    favorites: profile?.favorites || [],
  };
}

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<IUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Try to get user profile from database
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    const typedProfile = profile as DbUserProfile;
    // Get user's favorites
    const { data: favorites } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    return {
      _id: typedProfile.id,
      email: typedProfile.email,
      displayName: typedProfile.display_name,
      defaultCountry: typedProfile.default_country,
      defaultCurrency: typedProfile.default_currency,
      favorites: ((favorites || []) as { product_id: string }[]).map(f => f.product_id),
    };
  }

  return mapSupabaseUser(user);
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<IUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Sign in failed');
  }

  return mapSupabaseUser(data.user);
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, displayName?: string): Promise<IUser> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split('@')[0],
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Sign up failed');
  }

  // Create user profile in database
  const { error: profileError } = await supabase
    .from('users')
    .insert({
      id: data.user.id,
      email: email,
      display_name: displayName || email.split('@')[0],
    } as Record<string, unknown>);

  if (profileError) {
    console.warn('Failed to create user profile:', profileError);
  }

  return mapSupabaseUser(data.user, { displayName });
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: Partial<Pick<IUser, 'displayName' | 'defaultCountry' | 'defaultCurrency'>>): Promise<IUser> {
  const dbUpdates: Record<string, string> = {};
  
  if (updates.displayName) dbUpdates.display_name = updates.displayName;
  if (updates.defaultCountry) dbUpdates.default_country = updates.defaultCountry;
  if (updates.defaultCurrency) dbUpdates.default_currency = updates.defaultCurrency;

  const { data, error } = await supabase
    .from('users')
    .update(dbUpdates as Record<string, unknown>)
    .eq('id', userId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to update profile: ${error?.message || 'Unknown error'}`);
  }

  const typedData = data as DbUserProfile;

  // Get user's favorites
  const { data: favorites } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId);

  return {
    _id: typedData.id,
    email: typedData.email,
    displayName: typedData.display_name,
    defaultCountry: typedData.default_country,
    defaultCurrency: typedData.default_currency,
    favorites: ((favorites || []) as { product_id: string }[]).map(f => f.product_id),
  };
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: IUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
}

/**
 * Create a demo/guest user for testing (stored locally)
 */
export function createDemoUser(): IUser {
  return {
    _id: 'demo-user-123',
    email: 'demo@example.com',
    displayName: 'Demo User',
    defaultCountry: 'US',
    defaultCurrency: 'USD',
    favorites: [],
  };
}
