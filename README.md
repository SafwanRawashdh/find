<div align="center">

# 🔍 FIND - Fast Integrated Network of Deals

**A unified product search platform for comparing prices across Amazon and eBay**

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com/)

</div>

## ✨ Features

- 🛒 **Multi-Marketplace Search** - Search products across Amazon and eBay simultaneously
- 📊 **Price History Tracking** - View 7-day price trends for any product
- ❤️ **Favorites** - Save products to your favorites list
- 🛍️ **Shopping Cart** - Add products to cart for easy checkout
- 🔔 **Price Alerts** - Set alerts for price drops
- 🎨 **Modern UI** - Clean, responsive design with filters and sorting
- 🔐 **User Authentication** - Secure login via Supabase Auth

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SafwanRawashdh/FIND.git
   cd find
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🗄️ Database Setup (Supabase)

The app uses Supabase as its backend. To set up the database:

1. Go to [Supabase](https://supabase.com/) and create a project
2. Open the **SQL Editor** in your Supabase dashboard
3. Run the complete database setup script located at:
   ```
   supabase/COMPLETE_DATABASE_SETUP.sql
   ```

This will create:
- **products** - 36 sample products from Amazon & eBay
- **users** - User profiles linked to Supabase Auth
- **favorites** - User's saved products
- **price_history** - 7-day price tracking for each product

### Configure Supabase Credentials

Update `lib/supabase.ts` with your project credentials:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

## 📁 Project Structure

```
find/
├── components/
│   ├── filters/          # Search filters, presets
│   ├── layout/           # Header, notifications
│   └── products/         # Product cards, modals, charts
├── context/              # React contexts (Auth, Cart)
├── lib/                  # Supabase client
├── pages/                # Route pages (Cart, Favorites, Profile)
├── services/             # API services (mock & Supabase)
├── server/               # Go backend (optional)
├── supabase/
│   └── migrations/       # Database schema & seed data
├── App.tsx               # Main application component
├── types.ts              # TypeScript type definitions
└── index.tsx             # Application entry point
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript |
| Build Tool | Vite |
| Database | Supabase (PostgreSQL) |
| Styling | CSS (custom) |
| Backend (optional) | Go |

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🔒 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Sample Data

The app includes 36 sample products across 5 categories:

| Category | Products |
|----------|----------|
| Electronics | 17 |
| Computers | 8 |
| Toys | 5 |
| Books | 4 |
| Home | 4 |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
Made with ❤️ by Safwan Rawashdeh
</div>
