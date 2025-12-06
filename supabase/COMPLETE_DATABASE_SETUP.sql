-- =====================================================
-- FIND Database - Complete Setup Script
-- =====================================================
-- Run this entire script in your Supabase SQL Editor
-- URL: https://xxqbwckwcyhubyekyhxk.supabase.co
-- =====================================================

-- =====================================================
-- PART 1: SCHEMA SETUP
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace TEXT NOT NULL CHECK (marketplace IN ('AMAZON', 'EBAY')),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP')),
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
  shipping_estimate TEXT,
  condition TEXT DEFAULT 'new' CHECK (condition IN ('new', 'used')),
  ships_to TEXT[] DEFAULT ARRAY[]::TEXT[],
  product_url TEXT,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  default_country TEXT DEFAULT 'US',
  default_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Price History Table
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_marketplace ON products(marketplace);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_date ON price_history(date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PART 2: ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Products: Public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Users: Users can read/update own profile
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Favorites: Users can manage own favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Price History: Public read access
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Price history is viewable by everyone" ON price_history;
CREATE POLICY "Price history is viewable by everyone"
  ON price_history FOR SELECT
  USING (true);

-- =====================================================
-- PART 3: HELPER FUNCTIONS
-- =====================================================

-- Function to get product with price history (for easier querying)
CREATE OR REPLACE FUNCTION get_product_with_history(product_uuid UUID)
RETURNS TABLE (
  id UUID,
  marketplace TEXT,
  title TEXT,
  image_url TEXT,
  price DECIMAL,
  currency TEXT,
  rating DECIMAL,
  rating_count INTEGER,
  shipping_estimate TEXT,
  condition TEXT,
  ships_to TEXT[],
  product_url TEXT,
  description TEXT,
  category TEXT,
  price_history JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.marketplace,
    p.title,
    p.image_url,
    p.price,
    p.currency,
    p.rating,
    p.rating_count,
    p.shipping_estimate,
    p.condition,
    p.ships_to,
    p.product_url,
    p.description,
    p.category,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'date', ph.date,
            'price', ph.price
          ) ORDER BY ph.date
        )
        FROM price_history ph
        WHERE ph.product_id = p.id
      ),
      '[]'::jsonb
    ) as price_history
  FROM products p
  WHERE p.id = product_uuid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 4: SEED DATA - PRODUCTS
-- =====================================================

-- Clear existing data (uncomment if needed)
-- TRUNCATE products, price_history CASCADE;

-- Insert Products
INSERT INTO products (id, marketplace, title, image_url, price, currency, rating, rating_count, shipping_estimate, condition, ships_to, product_url, description, category) VALUES
-- Electronics - Amazon
('a0000001-0000-0000-0000-000000000001', 'AMAZON', 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop', 348.00, 'USD', 4.7, 15234, 'Dec 8-10', 'new', ARRAY['US', 'CA', 'UK'], NULL, 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal-clear hands-free calling with 8 microphones. Up to 30 hours of battery life.', 'Electronics'),

('a0000001-0000-0000-0000-000000000002', 'AMAZON', 'Apple AirPods Pro (2nd Generation) with MagSafe Case', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop', 249.00, 'USD', 4.8, 45678, 'Dec 7-9', 'new', ARRAY['US', 'CA', 'UK'], NULL, 'Active Noise Cancellation reduces unwanted background noise. Adaptive Transparency lets outside sounds in while reducing loud environmental noise.', 'Electronics'),

('a0000001-0000-0000-0000-000000000003', 'AMAZON', 'Samsung 65" Class OLED 4K S95D Smart TV', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', 1997.99, 'USD', 4.6, 2341, 'Dec 12-15', 'new', ARRAY['US'], NULL, 'OLED HDR+ with Anti-Glare. Dolby Atmos and Object Tracking Sound. Smart Hub with built-in voice assistants.', 'Electronics'),

('a0000001-0000-0000-0000-000000000005', 'AMAZON', 'Kindle Paperwhite Signature Edition - 32GB', 'https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=400&h=400&fit=crop', 189.99, 'USD', 4.7, 12456, 'Dec 8-10', 'new', ARRAY['US', 'CA', 'UK'], NULL, '6.8" display with adjustable warm light. Wireless charging compatible. Up to 10 weeks of battery life.', 'Electronics'),

('a0000001-0000-0000-0000-000000000011', 'AMAZON', 'Google Pixel 8 Pro 128GB - Obsidian', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 799.00, 'USD', 4.6, 12345, 'Dec 7-9', 'new', ARRAY['US', 'CA', 'UK'], NULL, '6.7-inch Super Actua display. Google Tensor G3 chip. 50MP camera with Pro controls. 7 years of security updates.', 'Electronics'),

('a0000001-0000-0000-0000-000000000017', 'AMAZON', 'Sony A7 III Mirrorless Camera Body (Renewed)', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', 1399.00, 'USD', 4.5, 567, 'Dec 9-12', 'used', ARRAY['US'], NULL, 'Amazon Renewed. 24.2MP full-frame sensor. 4K video. 693 phase-detection AF points. Like new condition.', 'Electronics'),

('a0000001-0000-0000-0000-000000000018', 'AMAZON', 'Anker Soundcore Life Q20 Wireless Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 49.99, 'USD', 4.5, 45678, 'Dec 6-8', 'new', ARRAY['US', 'CA', 'UK'], NULL, 'Active noise cancellation. 40-hour battery. BassUp technology. Memory foam ear cups.', 'Electronics'),

('a0000001-0000-0000-0000-000000000019', 'AMAZON', 'LG 77" Class C3 Series OLED 4K Smart TV', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', 2499.99, 'USD', 4.8, 1234, 'Dec 12-15', 'new', ARRAY['US'], NULL, '77-inch OLED display. α9 AI Processor Gen6. Dolby Vision IQ. webOS 23. Perfect blacks.', 'Electronics'),

-- Electronics - eBay
('e0000001-0000-0000-0000-000000000001', 'EBAY', 'Bose QuietComfort Ultra Wireless Headphones', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop', 329.00, 'USD', 4.6, 3421, 'Dec 9-12', 'new', ARRAY['US', 'CA'], NULL, 'World-class noise cancellation. Immersive Audio with Bose Immersive Audio. Up to 24 hours of battery.', 'Electronics'),

('e0000001-0000-0000-0000-000000000002', 'EBAY', 'JBL Charge 5 Portable Bluetooth Speaker - Black', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', 139.95, 'USD', 4.7, 5678, 'Dec 8-11', 'new', ARRAY['US', 'CA', 'UK'], NULL, 'Bold JBL Original Pro Sound. IP67 waterproof and dustproof. 20 hours of playtime.', 'Electronics'),

('e0000001-0000-0000-0000-000000000003', 'EBAY', 'DJI Mini 3 Pro Drone with RC Controller', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop', 759.00, 'USD', 4.5, 1234, 'Dec 10-14', 'new', ARRAY['US'], NULL, 'Under 249g. 4K/60fps HDR Video. 48MP photos. Tri-directional obstacle sensing.', 'Electronics'),

('e0000001-0000-0000-0000-000000000009', 'EBAY', 'Canon EOS R6 Mirrorless Camera - Body Only', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', 1599.00, 'USD', 4.4, 456, 'Dec 10-13', 'used', ARRAY['US', 'CA'], NULL, 'Excellent condition. 20.1MP Full-Frame CMOS Sensor. 4K60 10-Bit Video. Low shutter count.', 'Electronics'),

('e0000001-0000-0000-0000-000000000010', 'EBAY', 'Samsung Galaxy Watch 6 Classic 47mm - Black', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 349.99, 'USD', 4.5, 5678, 'Dec 8-11', 'new', ARRAY['US', 'CA', 'UK'], NULL, 'Rotating bezel. Advanced health monitoring. 40-hour battery life. Sapphire crystal display.', 'Electronics'),

('e0000001-0000-0000-0000-000000000015', 'EBAY', 'iPhone 13 Pro 256GB - Sierra Blue (Unlocked)', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', 649.99, 'USD', 4.6, 1234, 'Dec 8-10', 'used', ARRAY['US', 'CA'], NULL, 'Excellent condition. 95% battery health. All original accessories. No scratches on screen.', 'Electronics'),

('e0000001-0000-0000-0000-000000000016', 'EBAY', 'Fire TV Stick 4K Max Streaming Device', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', 39.99, 'USD', 4.6, 67890, 'Dec 5-7', 'new', ARRAY['US', 'CA', 'UK'], NULL, '4K Ultra HD. Wi-Fi 6 support. Alexa Voice Remote. Dolby Vision and Atmos.', 'Electronics'),

-- Computers - Amazon
('a0000001-0000-0000-0000-000000000004', 'AMAZON', 'Logitech MX Master 3S Wireless Mouse - Graphite', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', 99.99, 'USD', 4.8, 8765, 'Dec 7-8', 'new', ARRAY['US', 'CA', 'UK'], NULL, '8K DPI sensor. Quiet clicks. MagSpeed electromagnetic scrolling. USB-C quick charging.', 'Computers'),

('a0000001-0000-0000-0000-000000000006', 'AMAZON', 'Apple MacBook Air 15" M3 Chip - Space Gray', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', 1299.00, 'USD', 4.9, 8932, 'Dec 7-9', 'new', ARRAY['US', 'CA', 'UK'], NULL, '15.3-inch Liquid Retina display. M3 chip with 8-core CPU and 10-core GPU. 18-hour battery life.', 'Computers'),

('a0000001-0000-0000-0000-000000000007', 'AMAZON', 'Mechanical Gaming Keyboard RGB Backlit - TKL', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop', 79.99, 'USD', 4.4, 6543, 'Dec 8-10', 'new', ARRAY['US', 'CA', 'UK'], NULL, 'Hot-swappable switches. Per-key RGB lighting. Aluminum frame. Programmable macros.', 'Computers'),

('a0000001-0000-0000-0000-000000000012', 'AMAZON', 'Dell XPS 13 Plus Laptop - Intel i7, 16GB RAM, 512GB SSD', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', 1299.99, 'USD', 4.7, 3456, 'Dec 8-10', 'new', ARRAY['US', 'CA', 'UK'], NULL, '13.4-inch OLED touch display. 12th Gen Intel Core i7. InfinityEdge design. Premium build quality.', 'Computers'),

-- Computers - eBay
('e0000001-0000-0000-0000-000000000004', 'EBAY', 'ASUS ROG Strix 27" Gaming Monitor 165Hz', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', 299.99, 'USD', 4.6, 2345, 'Dec 9-12', 'new', ARRAY['US', 'CA'], NULL, '27" WQHD IPS panel. 165Hz refresh rate. 1ms response time. G-SYNC compatible.', 'Computers'),

('e0000001-0000-0000-0000-000000000008', 'EBAY', 'Apple iPad Pro 12.9" (2022) - 256GB WiFi', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', 899.00, 'USD', 4.5, 234, 'Dec 9-11', 'used', ARRAY['US'], NULL, 'Like new condition. M2 chip. Liquid Retina XDR display. Original box included.', 'Computers'),

('e0000001-0000-0000-0000-000000000011', 'EBAY', 'Razer DeathAdder V3 Pro Wireless Gaming Mouse', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', 149.99, 'USD', 4.8, 8901, 'Dec 7-9', 'new', ARRAY['US', 'CA', 'UK'], NULL, '30K DPI Focus Pro sensor. 90-hour battery. HyperSpeed wireless. 8 programmable buttons.', 'Computers'),

('e0000001-0000-0000-0000-000000000017', 'EBAY', 'Apple MacBook Pro 16" M3 Max - 36GB RAM, 1TB SSD', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', 3499.00, 'USD', 4.9, 567, 'Dec 10-14', 'new', ARRAY['US', 'CA'], NULL, '16.2-inch Liquid Retina XDR display. M3 Max chip. Up to 22 hours of battery. Space Black.', 'Computers'),

-- Toys - Amazon
('a0000001-0000-0000-0000-000000000008', 'AMAZON', 'LEGO Star Wars Millennium Falcon Ultimate Collector', 'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?w=400&h=400&fit=crop', 849.99, 'USD', 4.9, 4532, 'Dec 10-14', 'new', ARRAY['US', 'CA', 'UK'], NULL, '7,541 pieces. Includes 4 minifigures. Measures 33" long and 22" wide.', 'Toys'),

('a0000001-0000-0000-0000-000000000013', 'AMAZON', 'PlayStation 5 Console - Disc Edition', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop', 499.99, 'USD', 4.9, 45678, 'Dec 9-12', 'new', ARRAY['US', 'CA'], NULL, 'Ultra-high speed SSD. Ray tracing. 4K gaming. Haptic feedback. Adaptive triggers.', 'Toys'),

('a0000001-0000-0000-0000-000000000014', 'AMAZON', 'Meta Quest 3 128GB VR Headset', 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop', 499.99, 'USD', 4.6, 8901, 'Dec 10-13', 'new', ARRAY['US', 'CA'], NULL, 'Mixed reality passthrough. Snapdragon XR2 Gen 2. 128GB storage. Touch Plus controllers included.', 'Toys'),

-- Toys - eBay
('e0000001-0000-0000-0000-000000000005', 'EBAY', 'Nintendo Switch OLED Model - White', 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop', 349.00, 'USD', 4.8, 9876, 'Dec 8-10', 'new', ARRAY['US', 'CA', 'UK'], NULL, '7-inch OLED screen. Wide adjustable stand. 64GB internal storage. Enhanced audio.', 'Toys'),

('e0000001-0000-0000-0000-000000000012', 'EBAY', 'Xbox Series X Console - 1TB', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', 449.99, 'USD', 4.8, 32109, 'Dec 8-11', 'new', ARRAY['US', 'CA', 'UK'], NULL, '12 Teraflops of processing power. 4K gaming at 60fps. Quick Resume. Backward compatible.', 'Toys'),

-- Books - Amazon
('a0000001-0000-0000-0000-000000000009', 'AMAZON', 'Atomic Habits by James Clear - Hardcover', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 19.99, 'USD', 4.8, 125678, 'Dec 7-8', 'new', ARRAY['US', 'CA', 'UK'], NULL, 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. #1 New York Times bestseller.', 'Books'),

('a0000001-0000-0000-0000-000000000015', 'AMAZON', 'The Seven Husbands of Evelyn Hugo - Taylor Jenkins Reid', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 16.99, 'USD', 4.7, 234567, 'Dec 6-8', 'new', ARRAY['US', 'CA', 'UK'], NULL, 'A captivating novel about a reclusive Hollywood icon. New York Times bestseller.', 'Books'),

-- Books - eBay
('e0000001-0000-0000-0000-000000000006', 'EBAY', 'The Psychology of Money - Morgan Housel', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', 14.99, 'USD', 4.7, 45678, 'Dec 8-11', 'new', ARRAY['US', 'CA', 'UK'], NULL, 'Timeless lessons on wealth, greed, and happiness. International bestseller.', 'Books'),

('e0000001-0000-0000-0000-000000000013', 'EBAY', 'Project Hail Mary by Andy Weir - Hardcover', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', 18.50, 'USD', 4.9, 123456, 'Dec 7-10', 'new', ARRAY['US', 'CA', 'UK'], NULL, 'A lone astronaut must save the earth from disaster. From the author of The Martian.', 'Books'),

-- Home - Amazon
('a0000001-0000-0000-0000-000000000010', 'AMAZON', 'Dyson V15 Detect Cordless Vacuum Cleaner', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop', 749.99, 'USD', 4.6, 7654, 'Dec 9-12', 'new', ARRAY['US', 'CA'], NULL, 'Laser reveals microscopic dust. Piezo sensor measures particles. Up to 60 min runtime.', 'Home'),

('a0000001-0000-0000-0000-000000000016', 'AMAZON', 'KitchenAid Stand Mixer 5.5 Qt - Empire Red', 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400&h=400&fit=crop', 379.99, 'USD', 4.8, 23456, 'Dec 8-10', 'new', ARRAY['US', 'CA', 'UK'], NULL, '10 speeds. Tilt-head design. Includes flat beater, dough hook, and wire whip. Iconic design.', 'Home'),

-- Home - eBay
('e0000001-0000-0000-0000-000000000007', 'EBAY', 'Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker', 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop', 89.95, 'USD', 4.7, 34567, 'Dec 8-10', 'new', ARRAY['US', 'CA', 'UK'], NULL, '9 appliances in 1. Whisper-quiet steam release. 6 quart capacity.', 'Home'),

('e0000001-0000-0000-0000-000000000014', 'EBAY', 'Ninja Foodi 8-in-1 Pressure Cooker & Air Fryer', 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400&h=400&fit=crop', 199.99, 'USD', 4.7, 18901, 'Dec 7-9', 'new', ARRAY['US', 'CA', 'UK'], NULL, '8-in-1 cooking system. 6.5 quart capacity. TenderCrisp technology. 14 one-touch programs.', 'Home')

ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  rating = EXCLUDED.rating,
  rating_count = EXCLUDED.rating_count,
  shipping_estimate = EXCLUDED.shipping_estimate,
  updated_at = NOW();

-- =====================================================
-- PART 5: SEED DATA - PRICE HISTORY
-- =====================================================

-- Generate Price History for each product (7 days)
DO $$
DECLARE
    product_record RECORD;
    base_price DECIMAL;
    day_offset INTEGER;
    varied_price DECIMAL;
BEGIN
    FOR product_record IN SELECT id, price FROM products LOOP
        base_price := product_record.price;
        
        FOR day_offset IN 0..6 LOOP
            -- Generate price with +/- 10% variation, except last day is current price
            IF day_offset = 6 THEN
                varied_price := base_price;
            ELSE
                varied_price := base_price * (0.9 + random() * 0.2);
            END IF;
            
            INSERT INTO price_history (product_id, date, price)
            VALUES (
                product_record.id,
                CURRENT_DATE - (6 - day_offset),
                ROUND(varied_price::NUMERIC, 2)
            )
            ON CONFLICT (product_id, date) DO UPDATE SET
                price = EXCLUDED.price;
        END LOOP;
    END LOOP;
END $$;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check results
SELECT 'Database setup complete!' as status;
SELECT 'Products: ' || COUNT(*) as count FROM products;
SELECT 'Price history records: ' || COUNT(*) as count FROM price_history;
SELECT 'Products by category:' as info;
SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC;
SELECT 'Products by marketplace:' as info;
SELECT marketplace, COUNT(*) as count FROM products GROUP BY marketplace;
