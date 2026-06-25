# 📈 TradingApp

A modern full-stack paper-trading platform built with Next.js, TypeScript, PostgreSQL, and Prisma. TradingApp allows users to view live stock prices, place simulated buy and sell orders, and monitor portfolio performance.

> TradingApp is an educational project. No real financial transactions are executed.

## ✨ Live Demo

Visit [https://tradingweb.dev](https://tradingweb.dev) to view the deployed application.

For local development, open [http://localhost:3000](http://localhost:3000) after starting the application.

## 🚀 Tech Stack

### Frontend

- Next.js 16 — React framework using the App Router
- React 19 — User interface
- TypeScript — Static type checking
- Tailwind CSS 4 — Responsive application styling

### Backend

- Next.js API Routes — Server-side endpoints
- NextAuth.js — Authentication and session management
- Zod — Request validation
- Prisma 7 — Database ORM

### Database and Services

- PostgreSQL — Users, sessions, and portfolio holdings
- Google OAuth — User authentication
- Finnhub WebSocket API — Live stock prices

## 🧩 Features

### Core Functionality

- ✅ Live Market Data — View current prices for supported stocks
- ✅ Paper Trading — Place simulated buy and sell orders
- ✅ Portfolio Tracking — View holdings, average prices, and profit/loss
- ✅ Google Authentication — Sign in securely with a Google account
- ✅ Persistent Holdings — Store each user's portfolio in PostgreSQL
- ✅ Order Validation — Validate symbols, quantities, prices, and order types
- ✅ Protected APIs — Require authentication for orders and portfolios
- ✅ Error Handling — Display consistent client and server errors

### UI/UX

- 🎨 Clean Interface — Simple professional trading dashboard
- 📱 Responsive Design — Supports desktop and smaller screens
- 🌙 Dark Mode Styling — Includes light and dark interface styles
- ⚡ Live Updates — Market prices update through a WebSocket connection
- 🧭 Simple Navigation — Home, Market, Orders, and Portfolio pages

## ✅ Prerequisites

- Node.js 22 or later
- npm
- PostgreSQL
- Google OAuth credentials
- Finnhub API token

## 🛠️ Development and Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd Trading-web
npm install
```

### 2. Create the Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

Add the required values:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/trading
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_FINNHUB_TOKEN=your-finnhub-token
```

Generate a NextAuth secret:

```bash
openssl rand -base64 32
```

Add this redirect URI to your Google OAuth application:

```text
http://localhost:3000/api/auth/callback/google
```

### 3. Set Up the Database

Create a PostgreSQL database, then run:

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🗄️ Database Schema

### User

Stores user profile information provided by Google OAuth.

```text
id             String
name           String?
email          String? (unique)
emailVerified  DateTime?
image          String?
```

### Account

Stores the user's linked OAuth account.

```text
userId             String
provider           String
providerAccountId  String
access_token       String?
refresh_token      String?
```

### Session

Stores authenticated database sessions.

```text
sessionToken  String (unique)
userId        String
expires       DateTime
```

### Holding

Stores a user's current stock position.

```text
userId    String
symbol    String
quantity  Integer
avgPrice  Float
```

Each user can have one holding per stock symbol.

## 🌐 Application Routes

### Pages

| Route | Description |
| --- | --- |
| `/` | Application home page |
| `/market` | View live stock prices |
| `/orders` | Place simulated buy and sell orders |
| `/portfolio` | View holdings and profit/loss |

### API Routes

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/orders` | Validate and process a simulated order |
| `GET` | `/api/portfolio` | Return the signed-in user's holdings |
| `GET`, `POST` | `/api/auth/[...nextauth]` | Handle authentication requests |

The order and portfolio APIs require an authenticated session.

## 🧱 Project Structure

```text
Trading-web/
├── prisma/
│   ├── migrations/               # Database migrations
│   └── schema.prisma             # Prisma database schema
├── src/
│   ├── app/
│   │   ├── api/                  # Authentication, order, and portfolio APIs
│   │   ├── market/               # Live market page
│   │   ├── orders/               # Order page
│   │   └── portfolio/            # Portfolio page
│   ├── client/
│   │   ├── components/           # Reusable interface components
│   │   ├── hooks/                # Authentication and market hooks
│   │   └── services/             # API and WebSocket clients
│   ├── domain/
│   │   ├── market/               # Market entities
│   │   ├── orders/               # Order entities and business rules
│   │   └── portfolio/            # Portfolio entities
│   ├── server/
│   │   ├── auth/                 # NextAuth configuration
│   │   ├── db/                   # Prisma database client
│   │   ├── orders/               # Order processing
│   │   ├── portfolio/            # Portfolio queries
│   │   └── validation/           # Zod schemas
│   └── shared/                   # Shared constants and TypeScript types
├── deployment/
│   └── deploy.md                 # AWS deployment instructions
├── .env.example                  # Example environment configuration
└── package.json                  # Dependencies and scripts
```

## 🔧 Architecture and Patterns

TradingApp separates client, domain, and server responsibilities:

- Client layer — Pages, React hooks, API clients, and WebSocket connections
- Domain layer — Trading entities and order-processing rules
- Server layer — Authentication, validation, database access, and API services
- Shared layer — Types and constants used throughout the application

Order requests are validated with Zod before the domain service updates holdings through Prisma.

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## 🔒 Security Considerations

- Never commit `.env` files, OAuth secrets, database credentials, or private keys.
- Use separate databases and environment variables for development and production.
- Restrict Google OAuth redirect URLs to trusted domains.
- Treat `NEXT_PUBLIC_FINNHUB_TOKEN` as publicly visible browser configuration.
- Order and portfolio endpoints require an authenticated session.
- Server requests are validated before database operations are performed.
- This application is for paper trading only and should not be used as a brokerage platform.

## 🚀 Deployment

The production application uses AWS EC2, PostgreSQL on RDS, Nginx, HTTPS, and PM2.

See the [deployment guide](deployment/deploy.md) for complete setup instructions.
