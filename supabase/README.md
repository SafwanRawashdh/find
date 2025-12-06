# Supabase Database Setup

This directory contains SQL migrations and setup scripts for the FIND project's Supabase database.

## Quick Setup

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `xxqbwckwcyhubyekyhxk`
3. **Open SQL Editor**
4. **Run the migration**: Copy and paste the contents of `migrations/001_initial_schema.sql`
5. **Execute the SQL**

## What Gets Created

### Tables
- `products` - Product catalog from Amazon and eBay
- `users` - User profiles (extends auth.users)
- `favorites` - User favorite products
- `price_history` - Historical price data for products

### Security
- Row Level Security (RLS) enabled on all tables
- Public read access for products and price history
- User-specific access for favorites and user profiles

### Functions
- `update_updated_at_column()` - Auto-updates `updated_at` timestamps
- `get_product_with_history()` - Helper function to fetch product with price history

## Seeding Data

After running the migration, you can seed the database with initial product data. The Go backend's mock data can be converted and inserted.

## Verification

After setup, verify the tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- products
- users
- favorites
- price_history

