# TradingApp

A full-stack paper-trading application for viewing live stock prices, placing simulated buy and sell orders, and tracking portfolio performance.

[View the live application](https://tradingweb.dev)

> TradingApp is an educational project. It does not execute real financial transactions.

## Features

- Google OAuth authentication
- Live market prices through Finnhub WebSocket
- Simulated buy and sell orders
- Portfolio holdings with average price and profit/loss
- Server-side validation and authenticated API routes
- Responsive light and dark interface

## Tech Stack

- Next.js 16, React 19, and TypeScript
- Tailwind CSS 4
- NextAuth.js
- Prisma and PostgreSQL
- Finnhub WebSocket API
- Zod

## Getting Started

### Prerequisites

- Node.js 22 or later
- PostgreSQL
- Google OAuth credentials
- A Finnhub API token

### Installation

1. Clone the repository and install dependencies:

   ```bash
   git clone <repository-url>
   cd Trading-web
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Add your environment variables:

   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/trading
   GOOGLE_ID=your-google-client-id
   GOOGLE_SECRET=your-google-client-secret
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_FINNHUB_TOKEN=your-finnhub-token
   ```

   Generate a NextAuth secret with:

   ```bash
   openssl rand -base64 32
   ```

   Use the following Google OAuth callback URL:

   ```text
   http://localhost:3000/api/auth/callback/google
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Project Structure

```text
src/
├── app/          # Pages and API routes
├── client/       # UI components, hooks, and client services
├── domain/       # Trading entities and business logic
├── server/       # Authentication, validation, and database services
└── shared/       # Shared types and constants
prisma/           # Database schema and migrations
deployment/       # Production deployment guide
```

## Main Routes

| Route | Description |
| --- | --- |
| `/market` | View live stock prices |
| `/orders` | Place simulated orders |
| `/portfolio` | View holdings and profit/loss |

## Deployment

For the AWS EC2, RDS, Nginx, HTTPS, and PM2 setup, see the [deployment guide](deployment/deploy.md).
