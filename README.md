# TradingApp

A full-stack paper-trading application for viewing live stock prices, placing simulated buy and sell orders, and tracking portfolio performance.

**Production:** [https://tradingweb.dev](https://tradingweb.dev)

> TradingApp is an educational project. Orders are simulated and no real financial transactions are executed.

## Features

- Google OAuth authentication
- Live AAPL, AMZN, MSFT, and TSLA prices from Finnhub
- Simulated buy and sell orders
- Server-side order validation
- Per-user holdings stored in PostgreSQL
- Portfolio average cost and live profit/loss calculations
- Responsive light and dark interface
- Consistent API error responses

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- NextAuth.js with Google OAuth
- Prisma 7 and PostgreSQL
- Finnhub WebSocket market data
- Zod validation

## Current Market Data Behavior

The application currently uses Finnhub for market prices in both local development and production:

```text
useLiveMarket
    └── connectLiveMarket
            └── Finnhub WebSocket
```

`src/client/services/marketSimulation.ts` contains a local simulation utility, but it is not currently connected to `useLiveMarket`. Setting `NEXT_PUBLIC_MARKET_MODE` has no effect unless mode-selection logic is implemented in the application.

This means:

- Local development requires `NEXT_PUBLIC_FINNHUB_TOKEN`.
- Production requires `NEXT_PUBLIC_FINNHUB_TOKEN`.
- Orders and holdings are always stored in the database selected by `DATABASE_URL`.

## Local and Production Environments

The local application and deployed application use separate `.env` files.

| Environment | Market data | Database | URL |
| --- | --- | --- | --- |
| Local development | Finnhub | Database in local `.env` | `http://localhost:3000` |
| AWS production | Finnhub | AWS RDS URL on EC2 | `https://tradingweb.dev` |

### Important database rule

`DATABASE_URL` decides where users, sessions, and holdings are stored.

If your local `.env` contains the AWS RDS URL, orders placed on localhost will write to the production database. To keep local testing separate and avoid unnecessary AWS usage, use a local PostgreSQL database in your local `.env`.

Recommended local database:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/trading
```

Production database on EC2:

```env
DATABASE_URL=postgresql://USER:PASSWORD@RDS_HOST:5432/postgres?sslmode=require
```

Never commit either real connection string.

## Local Setup

### Requirements

- Node.js 22 or later
- PostgreSQL
- Google OAuth credentials
- Finnhub API token

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

Copy the example:

```bash
cp .env.example .env
```

Use local development values:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/trading
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-local-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_FINNHUB_TOKEN=your-finnhub-token
```

Generate a NextAuth secret:

```bash
openssl rand -base64 32
```

Add the following callback to the local Google OAuth application:

```text
http://localhost:3000/api/auth/callback/google
```

### 3. Prepare the local database

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Configuration

The `.env` file on the EC2 server should contain production-only values:

```env
DATABASE_URL=postgresql://USER:PASSWORD@RDS_HOST:5432/postgres?sslmode=require
GOOGLE_ID=your-production-google-client-id
GOOGLE_SECRET=your-production-google-client-secret
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://tradingweb.dev
NEXT_PUBLIC_FINNHUB_TOKEN=your-finnhub-token
```

The production Google OAuth application must include:

```text
Origin:       https://tradingweb.dev
Redirect URI: https://tradingweb.dev/api/auth/callback/google
```

`NEXT_PUBLIC_*` variables are included in the browser build. Change them before running `npm run build`.

## Does a Local Change Affect AWS?

Not by itself. Editing files on your computer does not update the live AWS application.

AWS changes only after the new code is:

1. Committed and pushed to GitHub.
2. Pulled onto the EC2 server.
3. Built on EC2.
4. Restarted with PM2.

The usual deployment flow is:

```bash
cd ~/Trading-web
git pull
npm install
npx prisma generate
npm run build
pm2 restart trading-web --update-env
```

Changing your local `.env` also does not change the EC2 `.env`. They are separate files. However, localhost can still access AWS RDS if its own `DATABASE_URL` points to RDS.

## Checking the AWS Deployment

SSH into EC2:

```bash
ssh -i ~/Downloads/tradingwebkey-2.pem ubuntu@13.43.121.177
```

### 1. Check the deployed Git version

```bash
cd ~/Trading-web
git status
git log -1 --oneline
```

Compare the commit with your local machine:

```bash
git log -1 --oneline
```

If the commit hashes differ, AWS is running different code.

### 2. Check the application process

```bash
pm2 status
pm2 logs trading-web --lines 100
```

Look for startup, database, authentication, or Finnhub-related errors.

### 3. Check required environment variables safely

Do not print secret values. Check only whether each variable is present:

```bash
cd ~/Trading-web
for key in DATABASE_URL GOOGLE_ID GOOGLE_SECRET NEXTAUTH_SECRET NEXTAUTH_URL NEXT_PUBLIC_FINNHUB_TOKEN; do
  grep -q "^${key}=" .env && echo "$key: set" || echo "$key: missing"
done
```

Confirm the public URL without exposing secrets:

```bash
grep '^NEXTAUTH_URL=' .env
```

It should return:

```text
NEXTAUTH_URL=https://tradingweb.dev
```

### 4. Check the application and reverse proxy

```bash
curl -I http://localhost:3000
curl -I https://tradingweb.dev
sudo nginx -t
sudo systemctl status nginx
```

### 5. Check production behavior in the browser

Visit [https://tradingweb.dev](https://tradingweb.dev) and verify:

- Google sign-in completes successfully.
- The Market page receives changing prices.
- A test order is accepted.
- The Portfolio page displays the resulting holding.
- Browser developer tools show no failed Finnhub WebSocket connection.

Use a dedicated test account because production orders are stored in AWS RDS.

## Routes

### Pages

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/market` | Live market prices |
| `/orders` | Place simulated orders |
| `/portfolio` | View holdings and profit/loss |

### APIs

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/portfolio` | Return the signed-in user's holdings |
| `POST` | `/api/orders` | Validate and process an order |
| `GET`, `POST` | `/api/auth/[...nextauth]` | Authentication handlers |

Portfolio and order APIs require an authenticated session.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start local development |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Architecture

```text
Browser
├── Next.js pages
├── Finnhub WebSocket
└── Next.js API routes
    ├── NextAuth
    ├── Zod validation
    ├── Order domain service
    └── Prisma
        └── PostgreSQL
```

## Project Structure

```text
src/
├── app/                 # Pages, layouts, and API routes
├── client/
│   ├── components/      # Client UI
│   ├── hooks/           # Market, portfolio, and auth hooks
│   └── services/        # API and WebSocket clients
├── domain/              # Trading entities and business rules
├── server/              # Auth, database, validation, and services
└── shared/              # Shared constants and types
prisma/
├── migrations/
└── schema.prisma
deployment/
└── deploy.md            # Full AWS deployment guide
```

## Security

- Never commit `.env`, private keys, passwords, OAuth secrets, or database credentials.
- Use separate local and production environment values.
- Use SSL for the AWS RDS connection.
- Use a test account when checking production orders.
- Treat this project as a paper-trading demonstration, not a brokerage platform.

For complete EC2, Nginx, HTTPS, PM2, and RDS instructions, see [deployment/deploy.md](deployment/deploy.md).
