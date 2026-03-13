# ☕ Brew Haven Café — Full Stack E-Commerce

A complete, production-ready café e-commerce web application built with React + Vite, Node.js/Express, and MongoDB.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** — running locally or a MongoDB Atlas URI
- **npm** v9+

---

### 1. Clone & Install Dependencies

```bash
# Install root dependencies (for concurrently)
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

---

### 2. Configure Environment Variables

Create `server/.env` (already included as a template):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brew-haven
JWT_SECRET=brew_haven_super_secret_jwt_key_2024
NODE_ENV=development
```

> **For MongoDB Atlas:** Replace `MONGODB_URI` with your Atlas connection string.

---

### 3. Seed the Database

```bash
npm run seed
```

This will:
- Seed **20 café products** across all categories
- Create an **admin account**: `admin@brewhaven.com` / `admin123`

---

### 4. Start the App

```bash
# Run both server + client simultaneously
npm run dev
```

Or run individually:
```bash
npm run server   # Backend on http://localhost:5000
npm run client   # Frontend on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 🔑 Demo Credentials

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@brewhaven.com      | admin123   |
| User  | Register a new account   | any 6+ chars|

---

## 🗂️ Project Structure

```
brew-haven/
├── package.json              ← Root (runs both services)
│
├── server/                   ← Node.js + Express Backend
│   ├── server.js             ← Express app entry point
│   ├── seed.js               ← Database seeder
│   ├── .env                  ← Environment variables
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   └── Wishlist.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── wishlist.js
│   │   ├── orders.js
│   │   └── users.js
│   └── middleware/
│       └── auth.js           ← JWT + Admin guards
│
└── client/                   ← React + Vite Frontend
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx            ← Routes (13 pages)
        ├── index.css          ← Global styles + Tailwind
        ├── utils/
        │   └── api.js         ← Axios instance w/ JWT interceptor
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── CartContext.jsx
        │   └── WishlistContext.jsx
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx
        │   │   └── Footer.jsx
        │   ├── common/
        │   │   ├── ProductCard.jsx
        │   │   ├── Skeletons.jsx
        │   │   ├── ProtectedRoute.jsx
        │   │   └── AdminRoute.jsx
        │   └── admin/
        │       └── AdminLayout.jsx
        └── pages/
            ├── HomePage.jsx
            ├── MenuPage.jsx
            ├── ProductDetailPage.jsx
            ├── CartPage.jsx
            ├── WishlistPage.jsx
            ├── CheckoutPage.jsx
            ├── OrderConfirmationPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── ProfilePage.jsx
            ├── OrdersPage.jsx
            ├── NotFoundPage.jsx
            └── admin/
                ├── AdminDashboardPage.jsx
                ├── AdminProductsPage.jsx
                ├── AdminOrdersPage.jsx
                └── AdminUsersPage.jsx
```

---

## 🛒 Features

### User Features
- ✅ Register / Login with JWT authentication
- ✅ Browse all 20 café products
- ✅ Search products by name/description
- ✅ Filter by category (8 categories)
- ✅ Sort by price, rating, name
- ✅ Add to Cart with quantity control
- ✅ Remove from Cart
- ✅ Update item quantity
- ✅ Add/Remove Wishlist items
- ✅ Move items from wishlist → cart
- ✅ Product detail page with related products
- ✅ 3-step Checkout (Shipping → Payment → Review)
- ✅ Mock payment system
- ✅ Order confirmation with status tracker
- ✅ Order history page
- ✅ User profile with address book
- ✅ Password change
- ✅ Responsive on all screen sizes

### Cart System
- ✅ Persistent via localStorage
- ✅ Cart icon badge with count
- ✅ Dynamic subtotal, delivery fee, tax calculation
- ✅ Free delivery threshold at $30

### Admin Features
- ✅ Admin-protected routes
- ✅ Dashboard with revenue stats, order counts, category breakdown
- ✅ Full product CRUD (Create, Edit, Delete)
- ✅ Image preview when adding products
- ✅ Order management with status updates
- ✅ User management with role promotion/demotion

---

## 🎨 Design System

- **Font Pair:** Playfair Display (headings) + Lato (body) + Dancing Script (accent)
- **Color Palette:** Warm espresso browns (`#2c1a0e`) + cream (`#fdf8f0`) + amber accents
- **Tailwind custom colors:** `brew`, `cream`, `espresso`, `mocha`, `latte`
- **Components:** Reusable `card`, `btn-primary`, `btn-secondary`, `btn-outline`, `input-field`, `badge`
- **Loading states:** Skeleton shimmer animations for all data-fetching screens
- **Notifications:** React Hot Toast with custom café theme

---

## 🔌 REST API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | — |
| POST | `/api/auth/login` | Login | — |
| GET | `/api/auth/profile` | Get profile | User |
| PUT | `/api/auth/profile` | Update profile | User |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products (filter/search/sort) | — |
| GET | `/api/products/:id` | Single product | — |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

**Query params for `GET /api/products`:**
- `category` — Filter by category
- `search` — Full-text search
- `featured=true` — Featured only
- `sort` — `price-asc`, `price-desc`, `rating`, `name`
- `page`, `limit` — Pagination

### Cart
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/cart` | Get user cart | User |
| POST | `/api/cart/sync` | Sync localStorage cart | User |
| POST | `/api/cart/add` | Add item | User |
| PUT | `/api/cart/update` | Update quantity | User |
| DELETE | `/api/cart/item/:productId` | Remove item | User |
| DELETE | `/api/cart/clear` | Clear cart | User |

### Wishlist
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/wishlist` | Get wishlist | User |
| POST | `/api/wishlist/toggle` | Toggle item | User |
| DELETE | `/api/wishlist/:productId` | Remove item | User |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Place order | User |
| GET | `/api/orders/my-orders` | User order history | User |
| GET | `/api/orders/admin/all` | All orders | Admin |
| GET | `/api/orders/:id` | Single order | User/Admin |
| PUT | `/api/orders/:id/status` | Update status | Admin |

### Users (Admin)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | All users | Admin |
| PUT | `/api/users/:id/role` | Change role | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS 3.4 |
| State | Context API (Auth, Cart, Wishlist) |
| Routing | React Router DOM v6 |
| HTTP | Axios |
| Notifications | React Hot Toast |
| Backend | Node.js + Express 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT (jsonwebtoken) |
| Password | bcryptjs |
| Dev Tools | nodemon, concurrently |

---

## 🌱 Product Categories

| Category | Products |
|----------|----------|
| ☕ Coffee | Espresso, Cappuccino, Vanilla Latte, Caramel Macchiato |
| 🧊 Cold Drinks | Iced Cold Brew, Mango Iced Tea, Strawberry Smoothie |
| 🍵 Tea | Matcha Latte, Earl Grey |
| 🥪 Sandwiches | Grilled Chicken Panini, Avocado BLT |
| 🎂 Cakes | Tiramisu Slice, Chocolate Fudge Cake |
| 🥐 Pastries | Butter Croissant, Almond Danish, Blueberry Muffin |
| 🍪 Cookies | Chocolate Chip, Snickerdoodle |
| 🍳 Breakfast | Full English, Avocado Toast |

---

## 🛠️ Troubleshooting

**MongoDB not connecting?**
- Ensure MongoDB is running: `mongod --dbpath /data/db`
- Or use MongoDB Atlas and update `MONGODB_URI` in `.env`

**Port already in use?**
- Change `PORT` in `server/.env`
- Change `port` in `client/vite.config.js`

**CORS errors?**
- Ensure the client dev server is on port 5173
- The server is configured for `http://localhost:5173` by default

**Images not loading?**
- Product images use Unsplash URLs — requires internet connection
- Images have fallback handlers for broken URLs
"# brew-haven" 
