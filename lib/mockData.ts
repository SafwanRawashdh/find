import type { Product } from "@/types";

// Mock products for development
export const mockProducts: Product[] = [
  {
    id: "1",
    title: "Apple AirPods Pro (2nd Generation) with MagSafe Charging Case",
    description: "Active Noise Cancellation, Personalized Spatial Audio, Adaptive Transparency",
    price: 189.99,
    originalPrice: 249.99,
    currency: "USD",
    imageUrl: "https://m.media-amazon.com/images/I/61f1YfTkTDL._AC_SL1500_.jpg",
    marketplace: "amazon",
    productUrl: "https://amazon.com/dp/example",
    rating: 4.7,
    ratingCount: 125420,
    condition: "new",
    category: "Electronics",
    shippingEstimate: "2-3 days",
    isBestDeal: true,
    priceHistory: [
      { date: "2024-11-01", price: 249.99 },
      { date: "2024-11-15", price: 229.99 },
      { date: "2024-12-01", price: 199.99 },
      { date: "2024-12-05", price: 189.99 },
    ],
  },
  {
    id: "2",
    title: "Apple AirPods Pro 2nd Gen - Open Box Like New",
    price: 159.99,
    currency: "USD",
    imageUrl: "https://i.ebayimg.com/images/g/example/s-l1600.jpg",
    marketplace: "ebay",
    productUrl: "https://ebay.com/itm/example",
    rating: 4.5,
    ratingCount: 342,
    condition: "refurbished",
    category: "Electronics",
    shippingEstimate: "3-5 days",
  },
  {
    id: "3",
    title: "Logitech G Pro X Superlight Wireless Gaming Mouse",
    description: "Ultra-lightweight, LIGHTSPEED Wireless, HERO 25K Sensor",
    price: 129.99,
    originalPrice: 159.99,
    currency: "USD",
    imageUrl: "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg",
    marketplace: "amazon",
    productUrl: "https://amazon.com/dp/example2",
    rating: 4.8,
    ratingCount: 45230,
    condition: "new",
    category: "Electronics",
    shippingEstimate: "1-2 days",
    isBestDeal: true,
  },
  {
    id: "4",
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    description: "Industry Leading Noise Cancellation, 30hr Battery Life",
    price: 328.00,
    originalPrice: 399.99,
    currency: "USD",
    imageUrl: "https://m.media-amazon.com/images/I/61vJtKbAssL._AC_SL1500_.jpg",
    marketplace: "amazon",
    productUrl: "https://amazon.com/dp/example3",
    rating: 4.6,
    ratingCount: 18920,
    condition: "new",
    category: "Electronics",
    shippingEstimate: "2-3 days",
  },
  {
    id: "5",
    title: "Sony WH-1000XM5 Headphones - Excellent Condition",
    price: 275.00,
    currency: "USD",
    imageUrl: "https://i.ebayimg.com/images/g/example2/s-l1600.jpg",
    marketplace: "ebay",
    productUrl: "https://ebay.com/itm/example2",
    rating: 4.4,
    ratingCount: 89,
    condition: "used",
    category: "Electronics",
    shippingEstimate: "4-6 days",
  },
  {
    id: "6",
    title: 'Amazon Kindle Paperwhite (16 GB) - 6.8" Display',
    description: "Adjustable warm light, Waterproof, Ad-Supported",
    price: 139.99,
    originalPrice: 149.99,
    currency: "USD",
    imageUrl: "https://m.media-amazon.com/images/I/61idr75SJUL._AC_SL1000_.jpg",
    marketplace: "amazon",
    productUrl: "https://amazon.com/dp/example4",
    rating: 4.7,
    ratingCount: 89340,
    condition: "new",
    category: "Electronics",
    shippingEstimate: "1-2 days",
  },
  {
    id: "7",
    title: "MacBook Air 13-inch M2 Chip 256GB - Midnight",
    description: "Apple M2 chip, 8GB RAM, 256GB SSD",
    price: 999.00,
    originalPrice: 1199.00,
    currency: "USD",
    imageUrl: "https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg",
    marketplace: "amazon",
    productUrl: "https://amazon.com/dp/example5",
    rating: 4.8,
    ratingCount: 5420,
    condition: "new",
    category: "Computers",
    shippingEstimate: "2-4 days",
    isBestDeal: true,
  },
  {
    id: "8",
    title: "MacBook Air M2 13 inch 256GB - Like New",
    price: 849.00,
    currency: "USD",
    imageUrl: "https://i.ebayimg.com/images/g/example3/s-l1600.jpg",
    marketplace: "ebay",
    productUrl: "https://ebay.com/itm/example3",
    rating: 4.6,
    ratingCount: 156,
    condition: "refurbished",
    category: "Computers",
    shippingEstimate: "3-5 days",
  },
];

// Filter products based on query and filters
export function filterProducts(
  products: Product[],
  query: string,
  filters: {
    marketplaces: { amazon: boolean; ebay: boolean };
    condition: "all" | "new" | "used" | "refurbished";
    minPrice?: number | "";
    maxPrice?: number | "";
    sortBy: "price_asc" | "price_desc" | "rating_desc" | "newest" | "shipping_asc";
  }
): Product[] {
  let filtered = products;

  // Filter by query
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }

  // Filter by marketplace
  filtered = filtered.filter((p) => {
    if (p.marketplace === "amazon") return filters.marketplaces.amazon;
    if (p.marketplace === "ebay") return filters.marketplaces.ebay;
    return true;
  });

  // Filter by condition
  if (filters.condition !== "all") {
    filtered = filtered.filter((p) => p.condition === filters.condition);
  }

  // Filter by price (handle empty string)
  const minPrice = filters.minPrice === "" ? undefined : filters.minPrice;
  const maxPrice = filters.maxPrice === "" ? undefined : filters.maxPrice;
  
  if (minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  // Sort
  switch (filters.sortBy) {
    case "price_asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating_desc":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      // For demo, keep original order
      break;
  }

  return filtered;
}
