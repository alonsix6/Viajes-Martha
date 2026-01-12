# Taxi Martha - Expense Management PWA

A Progressive Web App for managing taxi service expenses with real-time synchronization.

## Features

- Real-time expense tracking
- PWA capabilities (offline-first, installable)
- PIN-based authentication
- Multi-device sync via Socket.io
- Senior-friendly UI with large text and high contrast
- PostgreSQL database for reliable data storage

## Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS 3.4+
- Workbox (PWA support via vite-plugin-pwa)
- React Router for navigation
- Lucide React for icons
- Socket.io-client for real-time sync
- Axios for HTTP requests
- date-fns for date formatting

### Backend
- Node.js + Express
- PostgreSQL
- Socket.io for real-time communication
- CORS enabled

## Project Structure

```
Viajes-Martha/
├── .gitignore
├── README.md
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       │   ├── transactionController.js
│       │   └── settingsController.js
│       ├── routes/
│       │   ├── transactions.js
│       │   └── settings.js
│       └── server.js
└── frontend/
    ├── package.json
    ├── .env.example
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── public/
    │   ├── manifest.json
    │   ├── sw.js
    │   ├── icon-192.png
    │   └── icon-512.png
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        ├── hooks/
        ├── services/
        └── utils/
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+

### Installation

#### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

#### 3. Database Setup

Create PostgreSQL database:
```sql
CREATE DATABASE taxi_martha;
```

The database schema will be automatically initialized when you first start the backend server. It includes:
- `transactions` table (id, type, amount, description, category, date, created_at)
- `settings` table (id, pin, updated_at)
- Default PIN: 123456

#### 4. Environment Configuration

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env if needed (default values should work for local development)
```

### Development

Run both frontend and backend in development mode:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will start on http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will start on http://localhost:5173

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Test production build
```

**Backend:**
```bash
cd backend
npm start
```

### PWA Features

- Install prompt on mobile devices
- Offline support with cache-first strategy for assets
- Network-first for API calls with fallback
- Background sync for pending transactions
- Installable on iOS and Android

## Database Schema

### Transactions Table
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('ingreso', 'gasto')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Settings Table
```sql
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  pin VARCHAR(6) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/stats` - Get transaction statistics
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Settings
- `GET /api/settings` - Get settings (excluding sensitive data)
- `POST /api/settings/verify-pin` - Verify PIN authentication
- `PUT /api/settings/pin` - Update PIN

### Health Check
- `GET /health` - Server health check

## Scripts Reference

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build

### Backend Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Default Credentials

- **Default PIN**: 123456
- You can change this from the Settings page after logging in

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers with PWA support

## License

MIT
