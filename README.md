# FIND – Fast Integrated Network of Deals

FIND is a modern **price comparison and deals aggregator** application. It allows users to search for products across multiple marketplaces (e.g., Amazon, eBay) to find the best offers.

> **Note:** This is a frontend-focused application. It aggregates data but does **not** handle payments or checkout natively. Transactions are completed on the respective marketplace websites.

## 🚀 Technology Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Frontend-only Auth Context (Mock implementation tailored for demo)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## 📂 Project Structure

```
├── app/                  # Next.js App Router
│   ├── (public)/         # Public routes (Home, Search)
│   ├── (auth)/           # Authentication pages (Login, Register)
│   ├── (protected)/      # Protected routes (Favorites, Alerts)
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── globals.css       # Global styles & Tailwind
├── components/           # Reusable UI components
│   ├── layout/           # Header, Footer, Shell
│   ├── products/         # ProductCard, ProductGrid
│   ├── search/           # SearchBar
│   ├── modals/           # AuthRequiredModal
│   └── ui/               # Base UI elements (Button, Card)
├── context/              # React Context (AuthContext)
├── lib/                  # Utilities and Mock Data
└── types/                # TypeScript definitions
```

## ✨ Key Features

- **Search First Experience:** Clean home page focused on product discovery.
- **Guest Access:**
  - Search and browse products freely.
  - Restricted actions (Favorites, Price Alerts) prompt for login.
- **Authentication:**
  - Login / Register flows.
  - **Protected Routes:** `/favorites`, `/alerts`, and `/comparison` are only accessible to authenticated users.
- **Responsive Design:** Fully responsive UI built with Tailwind CSS.

## 🛠️ Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open Application**
   Visit [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).

## 🔐 Authentication & Guest Behavior

The application differentiates between **Guests** and **Authenticated Users**:

| Feature | Guest | Authenticated User |
| :--- | :---: | :---: |
| **Search Products** | ✅ | ✅ |
| **View Details** | ✅ | ✅ |
| **Add to Favorites** | ❌ (Prompts Login) | ✅ |
| **Set Price Alerts** | ❌ (Prompts Login) | ✅ |
| **Product Comparison** | ❌ (Prompts Login) | ✅ |

*Current Auth implementation uses a mock `AuthContext` with local storage persistence for demonstration purposes.*

## 📝 Notes

- **Backend:** This repo focuses on the Frontend. Backend services (e.g., Supabase) are integrated via service layers but currently use mock data/implementations for the demo experience.
- **Environment:** If integrating real Supabase Auth, refer to `SUPABASE_SETUP.md` and configure `.env.local`.

---

*Built with Next.js and Tailwind CSS.*
