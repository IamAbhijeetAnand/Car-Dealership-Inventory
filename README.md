# DrivePulse - Enterprise Car Dealership Inventory System
Live Link - https://car-dealership-inventory-red.vercel.app/

[![Stack](https://img.shields.io/badge/MERN-Node%20%7C%20Express%20%7C%20MongoDB%20%7C%20React-cyan)](https://drivepulse.com)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20MVC%20%2B%20Services-blue)](#)

## Overview
DrivePulse is a full-stack, enterprise-grade Car Dealership Inventory System built with Node.js, Express.js, MongoDB Atlas, Mongoose, and React (Vite) + Tailwind CSS.

Key highlights:
- **ACID Transaction Security**: Atomic session-locked vehicle purchases preventing race conditions and negative inventory overselling.
- **Dual-Engine AI Vehicle Matchmaker**: Combines LLM prompt execution (Gemini/OpenAI) with a mathematical Multi-Attribute Utility Scoring fallback engine.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions securing Admin inventory creation, restocking, and sales analytics.
- **Multi-Filter & Debounced Search**: Fast O(1) B-tree compound indexing supporting make, model, VIN, price range, transmission, fuel, and paginated response streams.

---

## Technical Stack & Architecture

### Backend
- **Runtime**: Node.js & Express.js (MVC + Service Layer)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Security**: JWT (Bearer tokens), bcryptjs (salt 12), Helmet HTTP Headers, CORS Guard, Express Rate Limiter
- **Validation**: express-validator middleware harvesting
- **Testing**: Jest & Supertest integration test suite

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom glassmorphism design tokens
- **HTTP Client**: Axios with request/response interceptors for Bearer token injection
- **State Management**: Context API (`AuthContext`, `ToastContext`) + Custom Hooks (`useDebounce`, `useAuth`)

---

## Project Folder Structure

```
car-dealership-inventory/
├── backend/
│   ├── config/              # env loading & Mongoose database setup
│   ├── models/              # User, Vehicle, PurchaseHistory Mongoose Schemas
│   ├── controllers/         # Thin HTTP Controllers
│   ├── services/            # Rich Business Logic & ACID Session Services
│   ├── middleware/          # JWT Protect, Role Guards, Rate Limiter, Error Handler
│   ├── validators/          # express-validator rules
│   ├── utils/               # ApiError, ApiResponse, JWT helpers
│   ├── database/            # Database Seeder script
│   └── tests/               # Supertest integration tests
└── frontend/
    ├── src/
    │   ├── components/      # Navbar, VehicleCard, FilterBar, Modals
    │   ├── pages/           # Home, Inventory, VehicleDetails, Dashboard, Admin, AI Assistant
    │   ├── context/         # AuthContext, ToastContext
    │   ├── services/        # Axios API callers
    │   └── hooks/           # useAuth, useDebounce
```

---

## Environment Variables Configuration

Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/car_dealership_db
JWT_SECRET=super_secret_enterprise_jwt_key_2026_change_in_prod
JWT_EXPIRES_IN=7d
CLIENT_URL=https://car-dealership-inventory-red.vercel.app
# Optional LLM integration
GEMINI_API_KEY=
OPENAI_API_KEY=
```

---

## Quick Start Installation & Local Execution

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed       # Seeds demo admin & customer accounts + sample inventory
npm run dev        # Starts Express server on http://localhost:5000
```

**Demo Accounts**:
- **Admin**: `admin@dealership.com` / `AdminPassword123!`
- **Customer**: `customer@gmail.com` / `CustomerPassword123!`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

---

## Deployment Checklist

- **Backend (Render)**:
  - Deploy Node.js web service listening on `process.env.PORT`.
  - Configure Environment Variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
  - https://car-dealership-inventory-46py.onrender.com/
- **Frontend (Vercel)**:
  - Deploy React SPA with Vite build output (`dist`).
  - Configure rewrite rule to `index.html` for client-side routing.
  - https://car-dealership-inventory-red.vercel.app/
- **Database (MongoDB Atlas)**:
  - Configure IP Whitelist (`0.0.0.0/0` for Render app instances).
