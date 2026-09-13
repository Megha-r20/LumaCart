# LumaCart — Production-Quality MERN Stack E-Commerce Platform

LumaCart is a full-stack e-commerce web application built using the MERN stack (**MongoDB, Express.js, React, Node.js**) featuring a customer-facing storefront and an executive admin console.

![LumaCart Banner](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Features Breakdown

### 🛒 Customer Storefront
- **Modern Landing Page**: Hero showcase banner, category navigation cards, flash sale promo banner, and value proposition badges.
- **Product Discovery & Catalog**: Debounced instant search, category filtering, price range slider, rating threshold, and sorting controls.
- **Product Details & Gallery**: Multi-image preview, specs table tab, star rating breakdown, and customer review submission modal.
- **Shopping Bag & Wishlist**: Dedicated full Shopping Bag page (`/cart`), Free Express Shipping progress meter, promo coupon chips (`LUMA20` for 20% off), itemized summary, and 1-click wishlist toggle.
- **Express Checkout & Order Tracking**: Address selection step, credit card sandbox simulator (Stripe PaymentIntent backend endpoint), order placement, and interactive progress status timeline (`Pending` -> `Processing` -> `Shipped` -> `Delivered`).

### 📊 Executive Admin Console (`/admin`)
- **Role-Based Authorization**: Protected routes (`role === 'admin'`).
- **Dashboard Analytics**: Real-time Gross Revenue, Order Count, Product Count, Registered Customers, Low Stock Alerts, and visual charts using `Recharts`.
- **Product CRUD & Category Manager**: Modals for creating, editing, and deleting products and categories.
- **Centralized Order Fulfillment**: Order table with status filter tabs and status update modal with audit tracking notes.
- **Customer Directory & Review Moderation**: Full user listing and review deletion controls.

---

## 🛠️ Tech Stack & Architecture

- **Backend**: Node.js, Express.js, Mongoose, MongoDB / MongoMemoryServer dynamic fallback, JSON Web Tokens (JWT), bcryptjs, CORS.
- **Frontend**: React (Vite), React Router v6, Lucide Icons, Recharts, Axios, Custom CSS System (Variables, Obsidian dark mode, glassmorphism).
- **Payment Gateway**: Stripe API integration (Test/Sandbox mode) with PaymentIntent creation.

---

## 🔑 Demo Credentials

- **Customer Demo Account**:
  - Email: `user@lumacart.com`
  - Password: `password123`

- **Executive Admin Account**:
  - Email: `admin@lumacart.com`
  - Password: `password123`

- **Promo Coupon Code**:
  - `LUMA20` (20% Off discount)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Megha-r20/LumaCart.git
   cd LumaCart
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   *The backend will automatically start an in-memory MongoDB instance and seed initial sample data if local MongoDB is not running.*

3. **Start Frontend Dev Server**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. Open your browser:
   - **Storefront**: [http://localhost:3000](http://localhost:3000)
   - **Admin Console**: [http://localhost:3000/admin](http://localhost:3000/admin)
   - **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📄 License
This project is open-source under the MIT License.
