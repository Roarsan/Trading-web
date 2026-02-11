# 📈 TradingApp

A modern trading simulator that lets users track a live‑simulated market, place buy/sell orders, and monitor portfolio performance. Built with Next.js, Prisma, and NextAuth in a clean domain‑driven structure.

## ✨ Live Demo

Run locally at:

```text
http://localhost:3000
```

## 🚀 Tech Stack

### Backend
- **Next.js App Router** — API routes and server rendering
- **NextAuth** — Google OAuth + database sessions
- **Prisma** — Database ORM
- **PostgreSQL** — Relational database
- **Zod** — Request validation

### Frontend
- **React 19** — UI rendering
- **Tailwind CSS** — Styling
- **Custom Hooks** — Live market + portfolio data

## 🧩 Features

### Core Functionality
- ✅ **Google Sign‑In** — Authenticated user sessions
- ✅ **Live Market Simulation** — In‑memory price updates
- ✅ **Place Orders** — Buy/Sell stocks with validation
- ✅ **Portfolio Dashboard** — Avg cost, current price, P/L
- ✅ **Watchlist UI** — UI scaffold for adding stocks
- ✅ **Centralized API Errors** — Consistent error response shape

### UI/UX
- 🎨 **Modern UI** — Clean, minimal styling
- 📱 **Responsive Layout** — Works across devices

## ✅ Prerequisites

- **Node.js (LTS recommended)**
- **PostgreSQL** database
- **Google OAuth credentials** (client ID + secret)

## 🚀 Development & Setup

### 1. Install

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-random-secret
```

### 3. Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run the App

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🌐 App Routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/market` | Live market prices |
| `/orders` | Place buy/sell orders |
| `/portfolio` | Holdings and P/L |
| `/watchlist` | Watchlist UI |

## 🌐 API Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/portfolio` | Get holdings for current user |
| POST | `/api/orders` | Place a buy/sell order |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handlers |

## 🗄️ Database Schema (Prisma)

### User
```prisma
model User {
  id            String   @id @default(cuid())
  name          String?
  email         String?  @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  holdings      Holding[]
}
```

### Holding
```prisma
model Holding {
  id       String @id @default(cuid())
  userId   String
  symbol   String
  quantity Int
  avgPrice Float

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, symbol])
}
```

## 🧱 Project Structure

```
src/
├── app/            # Next.js routes and pages
├── client/         # Client hooks and API wrappers
├── domain/         # Domain models and errors
├── server/         # Server-side services and auth
├── shared/         # Shared types
prisma/             # Prisma schema + migrations
```

## 🔧 Architecture & Patterns

- **Domain‑driven structure** for core logic (`src/domain`).
- **Service layer** for database updates (`src/server`).
- **API routes** with centralized error handling (`withApiError`).
- **Zod** for request validation.

## 🛡️ Error Handling & Validation

### Error Response Shape
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": {}
  }
}
```

### Validation
- Orders are validated with **Zod**.
- Invalid requests return consistent `400` errors.

## 🔒 Security Considerations

- OAuth handled by **NextAuth**.
- Sessions stored in Postgres via Prisma adapter.
- Environment secrets validated at startup.

## 📌 Notes

- Market prices are simulated in‑memory for demo purposes.
- Orders are processed per‑user and persisted in Postgres.

