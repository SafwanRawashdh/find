# Supabase Integration Setup

This project is now integrated with Supabase for database and authentication services.

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxqbwckwcyhubyekyhxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cWJ3Y2t3Y3lodWJ5ZWt5aHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjA1MjEsImV4cCI6MjA4MDQ5NjUyMX0._EjkyIGDfe9nO2eaPkl634R2F6L-iNhhPeIF0z_QW3U
```

**Note:** The `.env.local` file is gitignored for security. The Supabase client will fallback to hardcoded values if environment variables are not set.

## Database Schema

The following tables are expected in your Supabase database:

### `products` Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  shipping_estimate TEXT,
  condition TEXT DEFAULT 'new',
  ships_to TEXT[] DEFAULT ARRAY[]::TEXT[],
  product_url TEXT,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `users` Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  default_country TEXT DEFAULT 'US',
  default_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `favorites` Table
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

### `price_history` Table
```sql
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, date)
);
```

## Row Level Security (RLS)

Enable RLS on all tables and create policies:

### Products (Public Read)
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);
```

### Users (User can read/update own data)
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### Favorites (User can manage own favorites)
```sql
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
```

### Price History (Public Read)
```sql
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Price history is viewable by everyone"
  ON price_history FOR SELECT
  USING (true);
```

## Usage

### Import Supabase Client
```typescript
import { supabase } from './lib/supabase';
```

### Use Supabase Services
```typescript
import { supabaseProductService, supabaseAuthService } from './services/supabaseService';

// Search products
const products = await supabaseProductService.search(filters);

// Sign in
const { user, session } = await supabaseAuthService.signIn(email, password);

// Get favorites
const favorites = await supabaseAuthService.getFavorites(userId);
```

## Migration from Mock Backend

The project currently uses a mock Go backend. To fully migrate to Supabase:

1. **Update AuthContext** to use `supabaseAuthService` instead of `authService`
2. **Update productService** to use `supabaseProductService` instead of mock backend
3. **Seed database** with initial product data
4. **Set up authentication** with Supabase Auth

## Current Implementation

- ✅ Supabase client configured
- ✅ Service layer created (`supabaseService.ts`)
- ✅ Type definitions included
- ⚠️ Currently using mock backend (Go server)
- ⚠️ Database schema needs to be created in Supabase
- ⚠️ RLS policies need to be configured

## Next Steps

1. Create the database tables in Supabase Dashboard
2. Set up RLS policies as shown above
3. Seed the database with product data
4. Optionally migrate from mock backend to Supabase-only

## Security Notes

- The anon key is safe to use in the browser with RLS enabled
- Never commit the service_role key to the repository
- Always use RLS policies to protect user data
- The anon key in the code is a fallback - prefer environment variables

