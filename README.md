# CoreVita E-Commerce — MERN Stack

A full-featured e-commerce website built with MongoDB, Express, React, and Node.js — cloned from the CoreVita Bee Pearl supplement store.

## 📁 Project Structure

```
corevita/
├── backend/          # Node.js + Express API
│   ├── models/       # Mongoose models (Product, Order, User)
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   ├── seedData.js   # Auto-seeds product data
│   └── server.js     # Entry point
└── frontend/         # React app
    └── src/
        ├── components/   # Navbar, Footer, CartDrawer
        ├── context/      # Cart state (Context API)
        ├── pages/        # All page components
        └── utils/        # API helpers (axios)
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (already included, edit as needed):
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/corevita
JWT_SECRET=corevita_secret_key_change_in_production
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev       # development (with nodemon)
# or
npm start         # production
```

The backend will auto-seed product data on first run.

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Opens at **http://localhost:3000**

---

### 3. MongoDB Atlas (Cloud)

If using MongoDB Atlas instead of local:
1. Create a free cluster at https://cloud.mongodb.com
2. Get your connection string
3. Replace `MONGO_URI` in `backend/.env`

---

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, benefits, testimonials |
| `/shop` | Product listing page |
| `/products/bee-pearl` | Product detail with pack selector |
| `/checkout` | 2-step checkout (info + payment) |
| `/order-success` | Order confirmation with tracking steps |
| `/track-order` | Order tracking by order# + email |
| `/contact` | Contact form |
| `/refund-policy` | Refund policy |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/shipping-policy` | Shipping policy |

## 🛒 Features

- **Cart** — Persistent (localStorage), slide-out drawer, free shipping progress bar
- **Pack Selector** — Buy 1+1, 2+2, 3+3 with savings badges
- **Auto Refill** — Monthly subscription toggle
- **Checkout** — 2-step form with validation
- **Order Tracking** — By order number + email or tracking number
- **Auth** — JWT-based register/login (backend ready)
- **Responsive** — Mobile-friendly with sticky bottom cart bar

## 🎨 Design System

- **Font**: Barlow + Barlow Condensed (Google Fonts)
- **Primary color**: `#F5C800` (CoreVita Yellow)
- **CSS Variables**: All colors/spacing via `:root` variables in `index.css`

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | All products |
| GET | `/api/products/:slug` | Single product |
| POST | `/api/orders` | Create order |
| POST | `/api/orders/track` | Track order |
| POST | `/api/users/register` | Register user |
| POST | `/api/users/login` | Login user |
| POST | `/api/users/subscribe` | Email subscribe |

## 💳 Payment Integration

The checkout uses a demo flow. To add real payments:

1. Install Stripe: `npm install stripe` (backend)
2. Add `STRIPE_SECRET_KEY` to `.env`
3. Integrate `stripe.paymentIntents.create()` in orders route
4. Add Stripe.js to frontend checkout

## 🌐 Deployment

**Backend** → Render, Railway, or Heroku  
**Frontend** → Vercel or Netlify (set `REACT_APP_API_URL` env var)  
**Database** → MongoDB Atlas
