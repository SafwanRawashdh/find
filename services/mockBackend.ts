import { IProduct, Marketplace, IUser, IFilterState } from '../types';

// --- MOCK DATA ---

const MOCK_USER: IUser = {
  _id: 'u123',
  email: 'user@example.com',
  displayName: 'Alex Rogers',
  defaultCountry: 'US',
  defaultCurrency: 'USD',
  favorites: ['p1', 'p5'] // Initial mock favorites
};

const MOCK_PRODUCTS: IProduct[] = [
  // Amazon Products
  {
    _id: 'p1',
    marketplace: Marketplace.AMAZON,
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    imageUrl: 'https://picsum.photos/400/400?random=1',
    price: 348.00,
    currency: 'USD',
    rating: 4.8,
    ratingCount: 12500,
    shippingEstimate: 'Tomorrow, 10 AM',
    condition: 'new',
    shipsTo: ['US', 'CA', 'UK'],
    description: 'The best noise cancelling headphones on the market with 30-hour battery life.',
    category: 'Electronics'
  },
  {
    _id: 'p2',
    marketplace: Marketplace.AMAZON,
    title: 'Apple MacBook Air M2 Chip (13-inch, 8GB RAM)',
    imageUrl: 'https://picsum.photos/400/400?random=2',
    price: 999.00,
    currency: 'USD',
    rating: 4.9,
    ratingCount: 5400,
    shippingEstimate: '2 days',
    condition: 'new',
    shipsTo: ['US', 'UK'],
    description: 'Redesigned around the next-generation M2 chip, MacBook Air is strikingly thin.',
    category: 'Computers'
  },
  {
    _id: 'p3',
    marketplace: Marketplace.AMAZON,
    title: 'Kindle Paperwhite (16 GB) - 6.8" display',
    imageUrl: 'https://picsum.photos/400/400?random=3',
    price: 139.99,
    currency: 'USD',
    rating: 4.7,
    ratingCount: 22000,
    shippingEstimate: 'Today',
    condition: 'new',
    shipsTo: ['US', 'CA', 'EU'],
    description: 'Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life.',
    category: 'Electronics'
  },
  {
    _id: 'p4',
    marketplace: Marketplace.AMAZON,
    title: 'Logitech MX Master 3S - Performance Wireless Mouse',
    imageUrl: 'https://picsum.photos/400/400?random=4',
    price: 99.99,
    currency: 'USD',
    rating: 4.8,
    ratingCount: 8900,
    shippingEstimate: 'Tomorrow',
    condition: 'new',
    shipsTo: ['US'],
    description: 'An icon remastered. Feel every moment of your workflow with even more precision.',
    category: 'Computers'
  },

  // eBay Products
  {
    _id: 'p5',
    marketplace: Marketplace.EBAY,
    title: 'Sony WH-1000XM5 Black - Lightly Used',
    imageUrl: 'https://picsum.photos/400/400?random=5',
    price: 280.00,
    currency: 'USD',
    rating: 4.5,
    ratingCount: 120,
    shippingEstimate: '5-7 days',
    condition: 'used',
    shipsTo: ['US'],
    description: 'Used for 2 weeks, practically new. Comes with original box.',
    category: 'Electronics'
  },
  {
    _id: 'p6',
    marketplace: Marketplace.EBAY,
    title: 'Vintage Film Camera 35mm',
    imageUrl: 'https://picsum.photos/400/400?random=6',
    price: 150.50,
    currency: 'USD',
    rating: 4.2,
    ratingCount: 50,
    shippingEstimate: '1 week',
    condition: 'used',
    shipsTo: ['US', 'UK', 'DE'],
    description: 'Classic film camera in working condition. Lens cap included.',
    category: 'Electronics'
  },
  {
    _id: 'p7',
    marketplace: Marketplace.EBAY,
    title: 'Apple MacBook Air M2 - Open Box',
    imageUrl: 'https://picsum.photos/400/400?random=7',
    price: 850.00,
    currency: 'USD',
    rating: 4.9,
    ratingCount: 10,
    shippingEstimate: '3 days',
    condition: 'new',
    shipsTo: ['US'],
    description: 'Open box return, zero cycles on battery.',
    category: 'Computers'
  },
  {
    _id: 'p8',
    marketplace: Marketplace.EBAY,
    title: 'Rare Collectible Action Figure',
    imageUrl: 'https://picsum.photos/400/400?random=8',
    price: 45.00,
    currency: 'USD',
    rating: 5.0,
    ratingCount: 5,
    shippingEstimate: '2 weeks',
    condition: 'used',
    shipsTo: ['US', 'JP'],
    description: 'Mint condition in box. 1990s edition.',
    category: 'Toys'
  }
];

// --- SIMULATED SERVICES ---

export const authService = {
  login: async (email: string): Promise<{ user: IUser; token: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { ...MOCK_USER }, // Return a copy
          token: 'fake-jwt-token-12345'
        });
      }, 800);
    });
  },
  logout: async (): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
};

export const productService = {
  search: async (filters: IFilterState): Promise<IProduct[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...MOCK_PRODUCTS];

        // Filter by Query
        if (filters.query) {
          const q = filters.query.toLowerCase();
          results = results.filter(p => p.title.toLowerCase().includes(q));
        }

        // Filter by Source
        results = results.filter(p => filters.sources[p.marketplace]);

        // Filter by Price
        if (filters.minPrice !== '') {
          results = results.filter(p => p.price >= (filters.minPrice as number));
        }
        if (filters.maxPrice !== '') {
          results = results.filter(p => p.price <= (filters.maxPrice as number));
        }

        // Advanced Filter: Condition (Simulate backend filtering)
        if (filters.condition !== 'all') {
          results = results.filter(p => p.condition === filters.condition);
        }

        // Advanced Filter: Category
        if (filters.category && filters.category !== 'all') {
          results = results.filter(p => p.category === filters.category);
        }

        // Sort
        if (filters.sortBy === 'price_asc') {
          results.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === 'rating_desc') {
          results.sort((a, b) => b.rating - a.rating);
        }

        resolve(results);
      }, 600);
    });
  },
  
  getProductsByIds: async (ids: string[]): Promise<IProduct[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = MOCK_PRODUCTS.filter(p => ids.includes(p._id));
            resolve(results);
        }, 400);
    });
  }
};

export const favoritesService = {
  toggle: async (userId: string, productId: string): Promise<string[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate updating the user record in DB
    const index = MOCK_USER.favorites.indexOf(productId);
    if (index > -1) {
      MOCK_USER.favorites.splice(index, 1);
    } else {
      MOCK_USER.favorites.push(productId);
    }
    
    // Return fresh list
    return [...MOCK_USER.favorites];
  }
};