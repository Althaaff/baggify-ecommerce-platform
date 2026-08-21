# ⚙️ BAGGIFY — Backend

The backend API for **BAGGIFY**, a full-stack MERN e-commerce platform for shopping bags online.

The backend provides REST APIs for the frontend and handles authentication, users, products, categories, cart management, addresses, orders, payments, reviews, image uploads, order tracking, and admin operations.

---

# 📦 Project Overview

BAGGIFY's backend is built with **Node.js, Express.js, MongoDB, and Mongoose**.

The backend is responsible for:

- 👤 User authentication and authorization
- 🔐 JWT authentication
- 📧 OTP-based authentication
- 🔵 Google authentication
- 🛍️ Product management
- 🗂️ Category management
- 🛒 Cart management
- 📍 Address management
- 📦 Order management
- 🚚 Order tracking
- ⭐ Product reviews
- 💳 Stripe payments
- ☁️ Cloudinary image uploads
- 🧑‍💼 Admin operations
- 📊 Dashboard data
- 📧 Email/OTP delivery

The React frontend communicates with this backend through REST APIs.

---

# ✨ Features

## 👤 Authentication

- User authentication
- JWT-based authentication
- OTP-based login
- Email OTP delivery
- Google OAuth authentication
- Protected routes
- Role-based authorization
- Admin authorization
- User account management

## 🛍️ Product Management

- Create products
- Update products
- Delete products
- Get all products
- Get product by ID
- Search products
- Filter products
- Sort products
- Price range filtering
- Product variants
- Product availability
- Product collections
- Featured products
- New arrivals
- Product reviews

## 🗂️ Category Management

- Create categories
- Update categories
- Delete categories
- Get categories
- Parent/child categories
- Category images
- Active/inactive categories

## 🛒 Cart Management

- Add products to cart
- Update product quantities
- Remove products from cart
- Get user cart
- Clear cart
- Cart validation

## 📍 Address Management

- Add addresses
- Update addresses
- Delete addresses
- Get user addresses
- Select address during checkout

## 📦 Order Management

- Create orders
- Get user orders
- Get order details
- Update order status
- Cancel orders
- Order tracking
- Estimated delivery
- Courier information
- Tracking ID
- Tracking URL
- Delivery location

## 💳 Payment Management

- Stripe payment integration
- Stripe webhook handling
- Payment verification
- Payment status management

## ☁️ Image/File Management

- Product image uploads
- Category image uploads
- Cloudinary integration
- Image deletion
- Image replacement

## 🧑‍💼 Admin

- Admin dashboard
- Product management
- Category management
- User management
- Order management
- Order status management
- Order tracking updates
- Product image management
- Dashboard statistics

---

# 🛠️ Tech Stack

## Backend

- **Node.js** — JavaScript runtime
- **Express.js** — REST API framework
- **JavaScript (ES6+)**
- **MongoDB** — Database
- **Mongoose** — MongoDB ODM
- **JWT** — Authentication

## Third-Party Services

- **Stripe** — Payment processing
- **Google OAuth** — Authentication
- **Cloudinary** — Image/file storage
- **Gmail SMTP** — OTP/email delivery

---

# 📋 Prerequisites

Before running the backend, make sure you have:

- **Node.js**
- **npm**
- **MongoDB** or **MongoDB Atlas**
- Cloudinary account
- Stripe account
- Google OAuth credentials
- Gmail SMTP/app-password configuration

Verify Node.js and npm:

```bash
node --version
npm --version
```

---

# 🚀 Installation & Setup

## 1. Clone the Repository

From the project repository:

```bash
git clone https://github.com/Althaaff/baggify-ecommerce-platform.git
```

Navigate into the project:

```bash
cd baggify-ecommerce-platform
```

---

## 2. Navigate to the Server

```bash
cd server
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Create Environment Variables

Create a `.env` file inside the `server` directory:

```text
server/
├── .env
├── src/
├── package.json
└── README.md
```

Configure the required environment variables.

---

# 🔐 Environment Variables

Create:

```text
server/.env
```

Example configuration:

```env
PORT=5000

MONGODB_URI=your-mongodb-connection-string

NODE_ENV=development

FRONTEND_URL=http://localhost:5173

JWT_SECRET=your-secret-key-change-this-in-production

# OTP / Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
APP_NAME=BAG

# Google Login
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-secret

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Frontend
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit real credentials to Git.**

### Sensitive environment variables

The following values must remain private:

```text
MONGODB_URI
JWT_SECRET
EMAIL_PASSWORD
GOOGLE_CLIENT_SECRET
CLOUDINARY_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

---

# ▶️ Running the Project

## Development

From the `server` directory:

```bash
npm run dev
```

The backend normally runs at:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api
```

---

## Production

If the project has a production start script:

```bash
npm start
```

The exact production command depends on the scripts configured in `package.json`.

---

# 🔄 Backend Architecture

The backend follows a layered architecture:

```text
Client Request
      ↓
Route
      ↓
Middleware
      ↓
Controller
      ↓
Service / Business Logic
      ↓
Model
      ↓
MongoDB
      ↓
Response
```

For example:

```text
GET /api/products
        ↓
Product Route
        ↓
Authentication / Validation Middleware
        ↓
Product Controller
        ↓
Product Service
        ↓
Product Model
        ↓
MongoDB
```

This separation keeps routing, HTTP handling, business logic, database operations, and middleware responsibilities organized.

---

# 📁 Server Directory Structure

```text
server/
│
├── src/
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── database.js
│   │   ├── passport.js
│   │   └── stripe.js
│   │
│   ├── controllers/
│   │   ├── address.controller.js
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── category.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   ├── product.controller.js
│   │   ├── review.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── models/
│   │   ├── Address.js
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── address.routes.js
│   │   ├── auth.routes.js
│   │   ├── cart.routes.js
│   │   ├── category.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   ├── product.routes.js
│   │   ├── review.routes.js
│   │   └── user.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── order.service.js
│   │   ├── payment.service.js
│   │   └── user.service.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── sendEmail.js
│   │   └── helpers.js
│   │
│   ├── validations/
│   │   ├── auth.validation.js
│   │   ├── order.validation.js
│   │   ├── product.validation.js
│   │   └── user.validation.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

> The exact files may differ from the current implementation. Keep the structure consistent with the actual project rather than creating unused files.

---

# 🧩 Folder Responsibilities

## `config/`

Contains configuration for databases and external services.

```text
config/
├── cloudinary.js
├── database.js
├── passport.js
└── stripe.js
```

Typical responsibilities:

- MongoDB connection
- Cloudinary configuration
- Stripe configuration
- Google/Passport configuration

---

## `controllers/`

Controllers handle HTTP requests and responses.

A controller should generally:

1. Receive the request
2. Extract request data
3. Perform request-level validation where appropriate
4. Call business logic
5. Return the response

Example:

```text
product.controller.js
```

Controllers should avoid containing large amounts of reusable business logic.

---

## `routes/`

Routes define the API endpoints and connect them to middleware/controllers.

Example:

```text
GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

Routes should remain focused on:

- Endpoint definitions
- Middleware
- Controller references

---

## `models/`

Contains Mongoose schemas and models.

Examples:

```text
Product.js
User.js
Order.js
Cart.js
Category.js
Review.js
Address.js
```

Models define the structure and database behavior of MongoDB documents.

---

## `middleware/`

Contains reusable Express middleware.

Examples:

- Authentication
- Authorization
- Error handling
- File uploads
- Request validation

---

## `services/`

Contains reusable business logic and external-service integrations.

Services are useful for:

- Complex business logic
- Reusable operations
- Payment integrations
- Email operations
- External API communication

Examples:

```text
auth.service.js
email.service.js
order.service.js
payment.service.js
```

---

## `utils/`

Contains small generic helper functions.

Examples:

```text
generateToken.js
sendEmail.js
helpers.js
```

Avoid placing feature-specific business logic inside `utils/`.

---

## `validations/`

Contains request validation schemas and validation logic.

Examples:

```text
auth.validation.js
product.validation.js
order.validation.js
user.validation.js
```

Keeping validation separate makes controllers easier to maintain.

---

# 🔌 API Architecture

All API endpoints are grouped under:

```text
/api
```

Main API areas include:

```text
/api/auth
/api/users
/api/products
/api/categories
/api/cart
/api/addresses
/api/orders
/api/payments
/api/reviews
/api/dashboard
```

The frontend communicates with these endpoints using Axios.

---

# 👤 Authentication & Authorization

BAG uses JWT-based authentication.

General authentication flow:

```text
User
 ↓
Login / OTP / Google
 ↓
Backend Authentication
 ↓
JWT
 ↓
Authenticated Request
 ↓
Authentication Middleware
 ↓
Authorization
 ↓
Protected Controller
```

The backend supports:

- Login
- OTP authentication
- Google authentication
- JWT authentication
- Protected routes
- Admin authorization

Sensitive authentication information remains on the server.

---

# 📧 OTP / Email Authentication

OTP functionality uses an SMTP email provider.

Example configuration:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
APP_NAME=BAG
```

For Gmail, use an appropriate **App Password** rather than exposing your normal account password.

Never commit email credentials to Git.

---

# 🔵 Google Authentication

Google OAuth configuration:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

The Google client secret must remain on the backend.

The frontend should only receive information that is safe to expose publicly.

---

# 🛍️ Product Management

The product API handles the complete product lifecycle.

Supported functionality includes:

- Create products
- Update products
- Delete products
- Get products
- Get product by ID
- Search
- Filtering
- Sorting
- Price filtering
- Variants
- Availability
- Collections
- Featured products
- New arrivals
- Reviews

Product-related backend code should be separated across:

```text
routes/
controllers/
services/
models/
```

---

# 🗂️ Category Management

Category functionality includes:

- Create category
- Update category
- Delete category
- Get categories
- Parent categories
- Child categories
- Category images
- Active/inactive categories

Category image uploads are handled through Cloudinary.

---

# 🛒 Cart Management

The cart API supports:

- Add item
- Update quantity
- Remove item
- Get cart
- Clear cart
- Cart validation

Cart data is associated with authenticated users.

---

# 📍 Address Management

Users can manage their saved addresses.

Supported operations:

- Create address
- Get addresses
- Update address
- Delete address
- Use address during checkout

---

# 📦 Order Management

The backend manages the complete order lifecycle.

Typical flow:

```text
Cart
 ↓
Checkout
 ↓
Payment
 ↓
Order Creation
 ↓
Processing
 ↓
Shipped
 ↓
Out for Delivery
 ↓
Delivered
```

Order information may include:

- Customer information
- Products
- Quantities
- Pricing
- Shipping address
- Payment information
- Order status
- Courier name
- Tracking ID
- Tracking URL
- Estimated delivery
- Tracking updates
- Delivery location

---

# 🚚 Order Tracking

Administrators can update tracking information including:

- Order status
- Courier name
- Tracking ID
- Tracking URL
- Estimated delivery
- Status update text
- Current location

Customers can retrieve tracking information through the order APIs.

---

# 💳 Payment Integration

BAG supports:

## Stripe

Stripe secret keys must remain on the backend.

```env
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

The backend handles sensitive Stripe operations and webhook events.

The frontend must never receive the Stripe secret key or webhook secret.

Only public/client-safe information should be exposed to the frontend.

---

# ☁️ Cloudinary

Cloudinary is used for image/file storage.

Environment variables:

```env
CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-secret
```

Typical upload flow:

```text
Frontend
   ↓
Multipart/Form Data
   ↓
Upload Middleware
   ↓
Backend
   ↓
Cloudinary
   ↓
Image URL
   ↓
MongoDB
```

Cloudinary credentials must remain private.

---

# 🗄️ Database

BAG uses **MongoDB** with **Mongoose**.

MongoDB connection:

```env
MONGODB_URI=your-mongodb-connection-string
```

Main database entities include:

```text
User
Product
Category
Cart
Address
Order
Review
```

The database connection should be initialized when the server starts.

---

# 🧑‍💼 Admin API

Admin-protected endpoints manage the application.

Admin functionality includes:

- Dashboard
- Products
- Categories
- Users
- Orders
- Order statuses
- Tracking information
- Product images
- Statistics

Admin endpoints should be protected by authentication and authorization middleware.

---

# 🧹 Code & Project Conventions

## Controllers

Use singular resource names:

```text
product.controller.js
order.controller.js
user.controller.js
```

The singular naming represents the resource handled by the controller.

## Routes

Use a consistent naming convention throughout the project.

Recommended:

```text
product.routes.js
order.routes.js
user.routes.js
```

If the existing project already uses:

```text
products.routes.js
orders.routes.js
users.routes.js
```

keep that convention consistently rather than mixing both styles.

## Models

Use PascalCase:

```text
Product.js
User.js
Order.js
Category.js
```

## Services

Use:

```text
product.service.js
order.service.js
payment.service.js
```

## Middleware

Use:

```text
auth.middleware.js
upload.middleware.js
error.middleware.js
```

## General Rules

- Keep controllers focused on HTTP handling.
- Keep business logic in services when appropriate.
- Keep database schemas in models.
- Keep API definitions in routes.
- Keep reusable middleware in `middleware/`.
- Keep generic helpers in `utils/`.
- Keep validation logic in `validations/`.
- Avoid duplicate business logic.
- Avoid unnecessary files and folders.
- Use consistent naming throughout the project.
- Keep secrets in environment variables.

---

# 📝 Available npm Scripts

Run these commands from the `server` directory.

## Install Dependencies

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Lint

```bash
npm run lint
```

> Available commands depend on the scripts defined in `package.json`.

---

# 🐛 Troubleshooting

## MongoDB Connection Error

Check:

- `MONGODB_URI`
- MongoDB Atlas network access
- Database credentials
- MongoDB availability
- Internet connection

---

## Frontend Cannot Connect to Backend

Make sure the backend is running:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api
```

Check the frontend environment variable:

```env
VITE_API_URL=http://localhost:5000/api
```

Also verify the backend CORS configuration.

---

## Authentication Problems

Check:

- `JWT_SECRET`
- Authentication middleware
- Authorization middleware
- Token handling
- Frontend API configuration
- CORS configuration

---

## OTP / Email Problems

Check:

```env
EMAIL_HOST
EMAIL_PORT
EMAIL_USER
EMAIL_PASSWORD
```

Also verify that the email provider allows SMTP authentication.

---

## Google Login Problems

Check:

```env
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Also verify the configured Google OAuth redirect URLs.

---

## Cloudinary Upload Problems

Check:

```env
CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_SECRET
```

Also verify:

- File exists
- Correct multipart/form-data request
- Upload middleware configuration
- Cloudinary credentials
- File size/type restrictions

---

## Stripe Problems

Check:

```env
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

Verify that the Stripe webhook endpoint and secret correspond to the current environment.

---

# 🔒 Security

Never commit secrets to Git.

Recommended `.gitignore`:

```gitignore
node_modules/
.env
.env.local
.env.*.local
logs/
uploads/
```

Never expose or commit:

```text
MONGODB_URI
JWT_SECRET
GOOGLE_CLIENT_SECRET
EMAIL_PASSWORD
CLOUDINARY_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

Use environment variables for all sensitive configuration.

---

# 🌐 Local Development URLs

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:5000
```

### API

```text
http://localhost:5000/api
```

---

# 🔗 Related Documentation

The BAG project contains separate documentation for the root project, frontend, and backend.

```text
BAG/
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
- **Frontend README:** `../client/README.md`
- **Backend README:** `./README.md`

---

# 🚧 Project Status

**Status:** In Development

BAG is currently under development and has not yet been deployed to production.

The current configuration is intended primarily for local development.

---

# 🛍️ BAGGIFY

**A modern full-stack e-commerce platform for discovering and shopping bags online.**
