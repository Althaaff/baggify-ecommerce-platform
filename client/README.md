# 🛍️ BAG — Frontend

The frontend application for **BAG**, a full-stack MERN e-commerce platform for shopping bags online.

BAG provides customers with a complete shopping experience, including product browsing, search, filtering, product details, cart management, checkout, payments, authentication, order management, and order tracking.

The frontend also includes a dedicated admin interface for managing products, categories, users, orders, and order tracking.

---

## 📦 Project Overview

BAG is an e-commerce web application built using React and Vite.

The frontend is responsible for:

- 🛍️ Product browsing and discovery
- 🔎 Product search, filtering, and sorting
- 🛒 Shopping cart management
- 💳 Checkout and payment flows
- 👤 Authentication and account management
- 📦 Order management and tracking
- 🧑‍💼 Admin dashboard functionality
- 📱 Responsive user interface
- 🔌 Communication with the backend REST API

The frontend communicates with a separate **Node.js + Express + MongoDB backend**.

---

# ✨ Features

## 🛍️ Product Shopping

- Browse bags and products
- View product details
- Product image carousel
- Product variants
- Product availability
- Product reviews
- Featured products
- New arrivals
- Product collections
- Product filtering
- Price range filtering
- Product sorting
- Product search

## 🛒 Shopping Cart

- Add products to cart
- Update product quantities
- Remove products from cart
- View cart contents
- Buy Now functionality
- Cart summary
- Cart persistence

## 💳 Checkout & Payments

- Multi-step checkout
- Address selection
- Address management
- Order summary
- Stripe payment integration
- PayPal payment integration
- Payment status handling
- Order confirmation

## 👤 Authentication & Account

- User authentication
- OTP-based login
- Google authentication
- Protected routes
- Profile management
- Address management
- Country selection
- State selection
- Country calling codes

## 📦 Orders

- View orders
- View order details
- Track orders
- View tracking information
- View estimated delivery information
- Order status display

## 🧑‍💼 Admin

- Admin dashboard
- Product management
- Category management
- User management
- Order management
- Order status management
- Order tracking updates
- Product image management

---

# 🛠️ Tech Stack

## Frontend

- **React** — UI development
- **Vite** — Development server and build tool
- **JavaScript (ES6+)**
- **Tailwind CSS** — Styling
- **Redux Toolkit** — State management
- **React Context API** — Authentication and global state
- **React Router** — Client-side routing
- **Axios** — HTTP/API communication

## Integrations

- **Stripe** — Payment processing
- **Google OAuth** — Authentication
- **Cloudinary** — Image management through the backend

## Backend

The frontend communicates with a separate:

- Node.js
- Express.js
- MongoDB

backend API.

---

# 📋 Prerequisites

Before running the frontend, make sure the following are installed:

- **Node.js**
- **npm**

Verify your installation:

```bash
node --version
npm --version
```

The BAG backend server should also be configured and running.

---

# 🚀 Installation & Setup

## 1. Clone the Repository

Clone the project repository:

```bash
git clone <repository-url>
```

Navigate into the client directory:

```bash
cd <project-directory>/client
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file inside the `client` directory:

```text
client/
└── .env
```

Add the frontend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

> Do not add backend secrets to the frontend `.env` file.

## 4. Start the Development Server

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

The frontend uses Vite environment variables.

## `VITE_API_URL`

The base URL of the backend REST API.

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

### Environment Variable Security

Only client-safe values should be exposed through Vite.

Never place sensitive backend credentials in the frontend:

```text
MONGODB_URI
JWT_SECRET
GOOGLE_CLIENT_SECRET
CLOUDINARY_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
EMAIL_PASSWORD
```

> Any environment variable beginning with `VITE_` can be exposed to the browser. Never use the `VITE_` prefix for private secrets.

---

# ▶️ Running the Project

Make sure the backend is running first.

### Start Backend

From the project root:

```bash
cd server
npm run dev
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The application will then be available at:

```text
Frontend:
http://localhost:5173

Backend API:
http://localhost:5000/api
```

---

# 🎨 Styling & Component Architecture

The project uses **Tailwind CSS** for styling along with custom CSS files where required.

UI components are organized by their responsibility and application feature.

```text
src/
└── components/
    ├── admin/
    ├── account/
    ├── cart/
    ├── checkout/
    ├── common/
    ├── layout/
    ├── orders/
    ├── products/
    └── search/
```

## Component Responsibilities

| Folder      | Responsibility                            |
| ----------- | ----------------------------------------- |
| `admin/`    | Admin dashboard components                |
| `account/`  | Profile and address components            |
| `cart/`     | Shopping cart components                  |
| `checkout/` | Checkout components                       |
| `common/`   | Generic reusable UI components            |
| `layout/`   | Global application layout components      |
| `orders/`   | Order and tracking components             |
| `products/` | Product-related components                |
| `search/`   | Search, filtering, and sorting components |

### Common Components

The `common/` directory should contain components that are genuinely reusable across different features.

Examples:

```text
common/
├── Accordion/
├── Drawer.jsx
├── ImageCarousel.jsx
├── Loader.jsx
└── ScrollToTop.jsx
```

### Layout Components

The `layout/` directory contains components responsible for the overall application structure.

Examples:

```text
layout/
├── Footer.jsx
├── Header.jsx
├── NavBar.jsx
├── TopBar.jsx
├── Layout.jsx
└── UserLayout.jsx
```

---

# 📁 Frontend Directory Structure

```text
client/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── admin/
│   │   ├── account/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── orders/
│   │   ├── products/
│   │   └── search/
│   │
│   ├── config/
│   │   └── stripeConfig.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   │
│   ├── features/
│   │   └── cart/
│   │       └── cartSlice.js
│   │
│   ├── hooks/
│   │   ├── useAddresses.jsx
│   │   ├── useAuth.jsx
│   │   ├── useCart.jsx
│   │   ├── useCountryCodes.jsx
│   │   ├── useCountryStates.jsx
│   │   ├── useDebounce.jsx
│   │   ├── useFeaturedProducts.jsx
│   │   └── useNewArrivals.jsx
│   │
│   ├── pages/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── profile/
│   │   ├── Home.jsx
│   │   └── SearchPage.jsx
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── services/
│   │   ├── addressService.js
│   │   ├── adminUserService.js
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   ├── cartService.js
│   │   ├── dashboardService.js
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   └── productService.js
│   │
│   ├── store/
│   │   └── store.js
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── navbar.css
│   │   └── paymentPage.css
│   │
│   ├── utils/
│   │   ├── getUser.js
│   │   └── indexedDB.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

# 🔌 API / Service Architecture

The frontend uses a service layer to communicate with the backend API.

The general request flow is:

```text
Page
  ↓
Component / Hook
  ↓
Service
  ↓
API Client
  ↓
Express API
  ↓
Controller
  ↓
MongoDB
```

For example:

```text
ProductDetailsPage
        ↓
productService.js
        ↓
apiClient.js
        ↓
Backend API
        ↓
Product Controller
        ↓
MongoDB
```

API-related files are located inside:

```text
src/services/
```

The central API client is:

```text
src/services/apiClient.js
```

The backend API URL is configured through:

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 💳 Payment Integration

BAG supports multiple payment methods:

- Stripe

Payment-related frontend functionality is separated from the rest of the application.

Relevant files include:

```text
src/
├── components/
│
├── pages/
│   └── checkout/
│       └── PaymentPage.jsx
│
├── services/
│   └── paymentService.js
│
└── config/
    └── stripeConfig.js
```

Sensitive payment credentials must remain on the backend.

The frontend should only use public/client-safe payment configuration.

---

# 👤 Authentication

BAG supports:

- User authentication
- OTP-based login
- Google authentication
- Protected routes
- Authenticated API requests
- Profile management

Authentication state is managed through:

```text
src/context/AuthContext.jsx
```

Reusable authentication logic is available through:

```text
src/hooks/useAuth.jsx
```

Protected routes are handled through:

```text
src/routes/ProtectedRoute.jsx
```

Authentication API communication is handled through:

```text
src/services/authService.js
```

---

# 🛒 E-commerce Functionality

The frontend contains the main customer shopping flow:

```text
Browse Products
      ↓
Product Details
      ↓
Add to Cart / Buy Now
      ↓
Cart
      ↓
Checkout
      ↓
Payment
      ↓
Order Confirmation
      ↓
Order Tracking
```

## Products

Product functionality includes:

- Product listings
- Product details
- Product variants
- Product availability
- Product collections
- Featured products
- New arrivals
- Product reviews

## Cart

Cart functionality includes:

- Add to cart
- Remove from cart
- Quantity updates
- Cart summary
- Buy Now

Cart state is managed through:

```text
src/features/cart/cartSlice.js
```

Cart-related reusable logic:

```text
src/hooks/useCart.jsx
```

Cart API communication:

```text
src/services/cartService.js
```

## Search

Search functionality includes:

- Search input
- Search results
- Search filters
- Sorting
- Price filtering
- Search drawer

Search-related components are located in:

```text
src/components/search/
```

## Checkout

Checkout functionality includes:

- Address selection
- Checkout steps
- Order summary
- Payment
- Order confirmation

Checkout components are located in:

```text
src/components/checkout/
```

---

# 🧑‍💼 Admin Functionality

BAG includes a dedicated admin interface.

Admin functionality includes:

- Dashboard
- Product management
- Category management
- User management
- Order management
- Order filtering
- Order status updates
- Order tracking updates
- Product image management

Admin components are located in:

```text
src/components/admin/
```

Admin pages are located in:

```text
src/pages/admin/
```

---

# 🧹 Code & Project Conventions

Follow these conventions when adding or modifying code.

## Components

Use PascalCase for React component filenames:

```text
ProductGrid.jsx
CheckoutForm.jsx
OrderDetails.jsx
```

## Hooks

Use the `use` prefix:

```text
useAuth.jsx
useCart.jsx
useAddresses.jsx
```

## Services

Use camelCase and the `Service` suffix:

```text
productService.js
orderService.js
paymentService.js
```

## Folders

Use clear lowercase folder names:

```text
components/
services/
hooks/
pages/
utils/
```

## Feature Organization

Place feature-specific components inside their relevant feature folder.

For example:

```text
components/
├── cart/
├── checkout/
├── orders/
└── products/
```

Avoid placing feature-specific components inside `common/`.

The `common/` folder should contain only genuinely reusable components.

## API Logic

Do not place API request logic directly inside UI components when it can be handled through the service layer.

Prefer:

```text
Component
   ↓
Service
   ↓
API
```

instead of putting API requests throughout components.

## Secrets

Never commit sensitive credentials or secret keys.

Use `.env` files for environment-specific configuration and keep them out of version control.

---

# 📝 Available npm Scripts

Run these commands from the `client` directory.

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Run ESLint

```bash
npm run lint
```

> Available scripts depend on the scripts defined in `package.json`.

---

# 🐛 Troubleshooting

## Backend Connection Error

Make sure the backend is running on:

```text
http://localhost:5000
```

Verify the frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Restart the frontend after changing environment variables:

```bash
npm run dev
```

---

## Environment Variables Not Updating

Vite loads environment variables when the development server starts.

After modifying `.env`, stop and restart the development server:

```bash
npm run dev
```

---

## Dependency Issues

If dependencies are causing problems, remove `node_modules` and reinstall.

### macOS / Linux

```bash
rm -rf node_modules
npm install
```

### Windows

Delete the `node_modules` folder manually and run:

```bash
npm install
```

---

## API Requests Failing

Check:

1. Backend server is running.
2. `VITE_API_URL` is correct.
3. Backend CORS configuration allows the frontend URL.
4. Browser console for frontend errors.
5. Network tab for failed API requests.

Local frontend URL:

```text
http://localhost:5173
```

Local backend API:

```text
http://localhost:5000/api
```

---

# 🔒 Security Guidelines

Never commit `.env` files containing credentials.

Recommended `.gitignore` entries:

```gitignore
node_modules/
.env
.env.local
.env.*.local
dist/
```

Never expose the following in frontend code:

```text
MongoDB credentials
JWT secrets
Google OAuth secrets
Cloudinary secrets
Stripe secret keys
Stripe webhook secrets
Email passwords
```

Only public/client-safe configuration should be exposed to the browser.

---

# 🔗 Related Documentation

The BAG project contains separate documentation for the root project, frontend, and backend.

```text
Project Root/
│
├── README.md
│   └── Complete project overview
│
├── client/
│   ├── README.md
│   │   └── Frontend documentation
│   └── ...
│
└── server/
    ├── README.md
    │   └── Backend documentation
    └── ...
```

### Documentation

- **Root README:** `../README.md`
- **Server README:** `../server/README.md`
- **Client README:** `./README.md`

---

# 🚧 Project Status

**Status:** In Development

BAG is currently under development and has not yet been deployed to production.

---

## 🛍️ BAG

**A modern e-commerce platform for discovering and shopping bags online.**
