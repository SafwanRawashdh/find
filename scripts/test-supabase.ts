// Quick test to verify Supabase connection and data
// Run this with: npx ts-node --esm scripts/test-supabase.ts
// Or import it in your browser console

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxqbwckwcyhubyekyhxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cWJ3Y2t3Y3lodWJ5ZWt5aHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjA1MjEsImV4cCI6MjA4MDQ5NjUyMX0._EjkyIGDfe9nO2eaPkl634R2F6L-iNhhPeIF0z_QW3U';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  // Test 1: Check if products table exists and has data
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, title, marketplace, price, category')
    .limit(5);

  if (productsError) {
    console.error('❌ Error fetching products:', productsError.message);
    console.log('\n⚠️  The "products" table may not exist.');
    console.log('   Please run the SQL script in Supabase SQL Editor:');
    console.log('   supabase/COMPLETE_DATABASE_SETUP.sql\n');
    return;
  }

  console.log(`✅ Products table exists with ${products?.length || 0} rows (showing first 5)`);
  if (products && products.length > 0) {
    console.table(products);
  } else {
    console.log('⚠️  No products found. Please run the seed data script.');
  }

  // Test 2: Check price_history table
  const { data: priceHistory, error: priceError } = await supabase
    .from('price_history')
    .select('*')
    .limit(5);

  if (priceError) {
    console.error('\n❌ Error fetching price_history:', priceError.message);
  } else {
    console.log(`\n✅ Price history table exists with ${priceHistory?.length || 0} sample rows`);
  }

  // Test 3: Count totals
  const productCountResult = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  const historyCountResult = await supabase
    .from('price_history')
    .select('id', { count: 'exact', head: true });

  const productCount = productCountResult.count;
  const historyCount = historyCountResult.count;

  console.log('\n📊 Database Summary:');
  console.log(`   Products: ${productCount || 0}`);
  console.log(`   Price History Records: ${historyCount || 0}`);

  if (productCount && productCount > 0) {
    console.log('\n🎉 Database is set up correctly!');
  }
}

testConnection();
