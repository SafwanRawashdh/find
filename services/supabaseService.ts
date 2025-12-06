import { supabase } from '../lib/supabase';
import { IProduct, IUser, IFilterState, Marketplace, IPricePoint } from '../types';

// Convert Supabase product to app product format
const mapSupabaseProduct = (row: any): IProduct => {
  return {
    id: row.id,
    _id: row.id,
    marketplace: row.marketplace as Marketplace,
    title: row.title,
    imageUrl: row.image_url,
    price: row.price,
    currency: row.currency || 'USD',
    rating: row.rating || 0,
    ratingCount: row.rating_count || 0,
    shippingEstimate: row.shipping_estimate || 'Unknown',
    condition: (row.condition || 'new') as 'new' | 'used',
    shipsTo: row.ships_to || [],
    productUrl: row.product_url || undefined,
    description: row.description || undefined,
    category: row.category || 'Electronics',
    priceHistory: row.price_history || [],
  };
};

// Convert app product to Supabase format
const mapToSupabaseProduct = (product: IProduct) => {
  return {
    id: product._id,
    marketplace: product.marketplace,
    title: product.title,
    image_url: product.imageUrl,
    price: product.price,
    currency: product.currency,
    rating: product.rating,
    rating_count: product.ratingCount,
    shipping_estimate: product.shippingEstimate,
    condition: product.condition,
    ships_to: product.shipsTo,
    product_url: product.productUrl || null,
    description: product.description || null,
    category: product.category,
  };
};

export const supabaseProductService = {
  // Search products with filters
  search: async (filters: IFilterState): Promise<IProduct[]> => {
    try {
      let query = supabase
        .from('products')
        .select('*, price_history(date, price)');

      // Apply search query
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%,category.ilike.%${filters.query}%`);
      }

      // Apply marketplace filter (support both 'sources' and 'marketplaces')
      const sources = filters.sources || filters.marketplaces;
      if (sources) {
        const activeSources = Object.entries(sources)
          .filter(([_, isActive]) => isActive)
          .map(([source]) => source.toLowerCase());
        
        if (activeSources.length > 0) {
          query = query.in('marketplace', activeSources);
        }
      }

      // Apply price range
      if (filters.minPrice !== '') {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== '') {
        query = query.lte('price', filters.maxPrice);
      }

      // Apply condition filter
      if (filters.condition && filters.condition !== 'all') {
        query = query.eq('condition', filters.condition);
      }

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'rating_desc':
          query = query.order('rating', { ascending: false });
          break;
        case 'shipping_asc':
          query = query.order('shipping_estimate', { ascending: true });
          break;
        default:
          query = query.order('rating', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase search error:', error);
        return [];
      }

      // Map and format price history
      return (data || []).map((row: any) => {
        const product = mapSupabaseProduct(row);
        // Format price history from nested query
        if (row.price_history && Array.isArray(row.price_history)) {
          product.priceHistory = row.price_history.map((ph: any) => ({
            date: ph.date,
            price: ph.price,
          }));
        }
        return product;
      });
    } catch (error) {
      console.error('Supabase search error:', error);
      return [];
    }
  },

  // Get products by IDs
  getProductsByIds: async (ids: string[]): Promise<IProduct[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, price_history(date, price)')
        .in('id', ids);

      if (error) {
        console.error('Supabase getProductsByIds error:', error);
        return [];
      }

      return (data || []).map((row: any) => {
        const product = mapSupabaseProduct(row);
        if (row.price_history && Array.isArray(row.price_history)) {
          product.priceHistory = row.price_history.map((ph: any) => ({
            date: ph.date,
            price: ph.price,
          }));
        }
        return product;
      });
    } catch (error) {
      console.error('Supabase getProductsByIds error:', error);
      return [];
    }
  },

  // Get single product by ID
  getProductById: async (id: string): Promise<IProduct | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, price_history(date, price)')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Supabase getProductById error:', error);
        return null;
      }

      const product = mapSupabaseProduct(data);
      if (data.price_history && Array.isArray(data.price_history)) {
        product.priceHistory = data.price_history.map((ph: any) => ({
          date: ph.date,
          price: ph.price,
        }));
      }
      return product;
    } catch (error) {
      console.error('Supabase getProductById error:', error);
      return null;
    }
  },

  // Create or update product
  upsertProduct: async (product: IProduct): Promise<IProduct | null> => {
    try {
      const supabaseProduct = mapToSupabaseProduct(product);
      const { data, error } = await supabase
        .from('products')
        .upsert(supabaseProduct, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error('Supabase upsertProduct error:', error);
        return null;
      }

      return mapSupabaseProduct(data);
    } catch (error) {
      console.error('Supabase upsertProduct error:', error);
      return null;
    }
  },
};

export const supabaseAuthService = {
  // Sign up with email
  signUp: async (email: string, password: string, displayName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email!,
          display_name: displayName,
          default_country: 'US',
          default_currency: 'USD',
        });
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Supabase signUp error:', error);
      throw error;
    }
  },

  // Sign in with email
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return { user: data.user, session: data.session, profile: userProfile };
    } catch (error) {
      console.error('Supabase signIn error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Supabase signOut error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      return { user, profile };
    } catch (error) {
      console.error('Supabase getCurrentUser error:', error);
      return null;
    }
  },

  // Get user favorites
  getFavorites: async (userId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Supabase getFavorites error:', error);
        return [];
      }

      return (data || []).map((fav: any) => fav.product_id);
    } catch (error) {
      console.error('Supabase getFavorites error:', error);
      return [];
    }
  },

  // Toggle favorite
  toggleFavorite: async (userId: string, productId: string): Promise<string[]> => {
    try {
      // Check if favorite exists
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (existing) {
        // Remove favorite
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
      } else {
        // Add favorite
        await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            product_id: productId,
          });
      }

      // Return updated favorites list
      return await supabaseAuthService.getFavorites(userId);
    } catch (error) {
      console.error('Supabase toggleFavorite error:', error);
      return [];
    }
  },
};

// Listen to auth state changes
export const subscribeToAuth = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};

