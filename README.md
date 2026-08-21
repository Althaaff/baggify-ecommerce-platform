# 🛍️ BAGGIFY — Full-Stack E-Commerce Platform

BAGGiFY is a full-stack **MERN e-commerce application** designed for shopping bags online.

The platform provides customers with a complete online shopping experience, including browsing products, searching and filtering products, managing a shopping cart, checking out, making payments, managing their account, and tracking orders.

It also includes a dedicated **admin dashboard** for managing products, categories, users, orders, and order tracking.

---

## ✨ Project Overview

BAGGIFY is divided into two main applications:

- **Client** — React-based frontend application
- **Server** — Node.js and Express-based REST API

The client communicates with the server through REST APIs, while the server manages authentication, business logic, payments, file uploads, orders, and MongoDB data.

### 🛍️ Customer Features

- Browse bags and products
- View product details
- Product variants
- Product availability
- Product reviews
- Featured products
- New arrivals
- Product collections
- Search products
- Filter products
- Sort products
- Price filtering
- Shopping cart
- Buy Now
- Checkout
- Address management
- Stripe payments
- OTP authentication
- Google authentication
- Profile management
- Order management
- Order tracking

### 🧑‍💼 Admin Features

- Admin dashboard
- Product management
- Category management
- User management
- Order management
- Order status management
- Order tracking updates
- Product image management
- Order statistics

---

# 🛠️ Tech Stack

## Frontend

- **React**
- **Vite**
- **JavaScript (ES6+)**
- **Tailwind CSS**
- **Redux Toolkit**
- **React Context API**
- **React Router**
- **Axios**

## Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT Authentication**

## Third-Party Services

- **Stripe** — Payment processing
- **Google OAuth** — Authentication
- **Cloudinary** — Image/file storage
- **Gmail SMTP** — OTP/email delivery

---

# 📋 Prerequisites

Before running BAGGIFY locally, make sure you have the following installed:

- **Node.js**
- **npm**
- **MongoDB** or a MongoDB Atlas database

Verify Node.js and npm:

```bash
node --version
npm --version
```

You will also need valid credentials/configuration for the third-party services used by the application if you want to use their functionality locally.

---

# 🚀 Quick Start

## 1. Clone the Repository

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd <project-directory>
```

---

## 2. Install Client Dependencies

Open a terminal:

```bash
cd client
npm install
```

---

## 3. Install Server Dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 4. Configure Environment Variables

Create the required `.env` files:

```text
project-root/
│
├── client/
│   └── .env
│
└── server/
    └── .env
```

### Client

The client requires:

```env
VITE_API_URL=http://localhost:5000/api
```

### Server

The server requires environment variables for:

- Server port
- MongoDB connection
- JWT authentication
- Frontend URL
- Email/OTP service
- Google OAuth
- Cloudinary
- Stripe
- Client URL

Refer to the dedicated server documentation for the complete backend environment configuration.

> ⚠️ Never commit `.env` files or real credentials to Git.

---

# ▶️ Running the Application

BAGGIFY consists of two separate applications that need to run simultaneously.

## Start the Backend

From the project root:

```bash
cd server
npm run dev
```

The backend API will normally run at:

```text
http://localhost:5000
```

---

## Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

The frontend communicates with the backend through:

```text
http://localhost:5000/api
```

---

# 🔄 Application Architecture

The general architecture of BAGGIFY is:

```text
                    ┌─────────────────────┐
                    │      Customer       │
                    │      / Admin        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       React        │
                    │      Frontend      │
                    └──────────┬──────────┘
                               │
                            REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Express / Node  │
                    │       Backend      │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
             ┌──────────────┐      ┌──────────────┐
             │   MongoDB    │      │  Services    │
             │   Database   │      │ Stripe/etc.  │
             └──────────────┘      └──────────────┘
```

---

# 📁 Project Structure

```text
baggify-ecommerce-platform/
│
├── client/
│   ├── README.md
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
│
├── server/
│   ├── README.md
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 🗂️ Directory Map

## 🎨 Client — Frontend

The React frontend contains the customer storefront and admin interface.

📖 **Frontend documentation:**

[`client/README.md`](./client/README.md)

Main frontend areas include:

```text
client/src/
├── assets/
├── components/
├── config/
├── context/
├── data/
├── features/
├── hooks/
├── pages/
├── routes/
├── services/
├── store/
├── styles/
└── utils/
```

---

## ⚙️ Server — Backend

The Node.js/Express backend provides the REST API and handles:

- Authentication
- Users
- Products
- Categories
- Cart
- Orders
- Payments
- Addresses
- Reviews
- Order tracking
- File uploads
- Admin operations

📖 **Backend documentation:**

[`server/README.md`](./server/README.md)

---

# 🔐 Environment & Security

Environment variables contain configuration and sensitive credentials required by the application.

Never commit:

```text
.env
.env.local
.env.*.local
```

Sensitive values such as the following must remain private:

```text
MONGODB_URI
JWT_SECRET
GOOGLE_CLIENT_SECRET
CLOUDINARY_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
EMAIL_PASSWORD
```

Only public/client-safe configuration should be exposed to the frontend.

---

# 💳 Payments

BAGGIFY supports:

- **Stripe**

Payment processing is divided between the frontend and backend.

The frontend handles the user-facing payment flow, while sensitive payment operations and secret keys remain on the backend.

See the server documentation for backend payment configuration.

---

# 🔑 Authentication

BAGGIFY supports multiple authentication methods:

- Standard authentication
- OTP-based authentication
- Google authentication
- JWT-based authentication
- Protected routes

Authentication-related configuration is handled primarily by the backend, with the React client managing the authenticated user experience.

---

# 📦 Order Management

Customers can:

- View their orders
- View order details
- Track orders
- View tracking information
- View estimated delivery information

Administrators can:

- View customer orders
- Update order statuses
- Update tracking information
- Manage order fulfillment information

---

# 🧑‍💼 Admin Dashboard

BAGGIFY includes an administrative interface for managing the platform.

Administrators can manage:

- Products
- Categories
- Users
- Orders
- Order statuses
- Order tracking
- Product images
- Dashboard statistics

Admin access is protected through the application's authentication and authorization system.

---

# 🧹 Development Conventions

The project separates frontend and backend responsibilities.

### Frontend

```text
Pages
  ↓
Components
  ↓
Hooks / Context / Redux
  ↓
Services
  ↓
Backend API
```

### Backend

```text
Routes
  ↓
Controllers
  ↓
Services / Business Logic
  ↓
Models
  ↓
MongoDB
```

Keep feature-specific code inside its appropriate directory and avoid mixing unrelated responsibilities.

For detailed frontend conventions, see:

[`client/README.md`](./client/README.md)

For backend conventions, see:

[`server/README.md`](./server/README.md)

---

# 📝 Common Commands

## Client

```bash
cd client
npm install
npm run dev
```

Build frontend:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

---

## Server

```bash
cd server
npm install
npm run dev
```

Refer to the server README for the complete list of backend scripts.

---

# 🐛 Troubleshooting

## Frontend cannot connect to backend

Make sure the backend is running:

```text
http://localhost:5000
```

Check the client environment variable:

```env
VITE_API_URL=http://localhost:5000/api
```

Restart the Vite development server after changing `.env`.

---

## MongoDB connection error

Check that:

- MongoDB is running or MongoDB Atlas is accessible.
- `MONGODB_URI` is correct.
- Database credentials are valid.
- Your MongoDB network access configuration allows the connection.

---

## Authentication issues

Check:

- Backend server is running.
- JWT configuration is correct.
- Frontend API URL is correct.
- Google OAuth configuration is correct if using Google login.
- Browser cookies/storage are available.

---

## Payment issues

Check:

- Stripe configuration.
- Backend payment credentials.
- Frontend payment configuration.
- Backend webhook configuration where applicable.

---

# 🚧 Project Status

**Status:** In Development

BAGGIFY is currently being developed and has not yet been deployed to production.

The current configuration is intended for local development.

---

# 📚 Documentation

| Documentation                            | Description                                           |
| ---------------------------------------- | ----------------------------------------------------- |
| [`README.md`](./README.md)               | Complete project overview                             |
| [`client/README.md`](./client/README.md) | Frontend setup and architecture                       |
| [`server/README.md`](./server/README.md) | Backend setup, API, database, and server architecture |

---

# 🛍️ BAGGIFY

**A modern full-stack e-commerce platform for discovering and shopping bags online.**
