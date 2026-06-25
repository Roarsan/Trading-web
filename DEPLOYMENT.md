# 🚀 TradingApp Deployment Guide

This guide deploys TradingApp to an Ubuntu AWS EC2 instance with PostgreSQL on AWS RDS, Nginx as a reverse proxy, PM2 for process management, and Let's Encrypt for HTTPS.

The production application is available at [https://tradingweb.dev](https://tradingweb.dev).

## 🧱 Deployment Architecture

```text
Browser
   │
   ▼
HTTPS and DNS
   │
   ▼
Nginx reverse proxy
   │
   ▼
Next.js application on port 3000
   │
   ├── PM2 process manager
   ├── Google OAuth
   ├── Finnhub WebSocket API
   │
   ▼
Prisma
   │
   ▼
AWS RDS PostgreSQL
```

## ✅ Prerequisites

- An AWS account
- An Ubuntu 24.04 EC2 instance
- A PostgreSQL RDS database
- A domain name pointing to the EC2 public IP
- Google OAuth credentials
- A Finnhub API token
- SSH access to the EC2 instance

## ☁️ AWS Configuration

### EC2 Security Group

Allow the following inbound traffic:

| Type | Port | Source |
| --- | --- | --- |
| SSH | `22` | Your IP address |
| HTTP | `80` | Anywhere |
| HTTPS | `443` | Anywhere |

Port `3000` does not need to be publicly accessible because Nginx forwards requests to it internally.

### RDS Security Group

Allow PostgreSQL traffic on port `5432` from the EC2 security group.

Avoid allowing public database access from `0.0.0.0/0`.

### DNS Records

Create DNS records that point to the EC2 public IP:

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | EC2 public IP |
| `A` or `CNAME` | `www` | EC2 public IP or root domain |

Confirm the DNS records:

```bash
dig +short tradingweb.dev
dig +short www.tradingweb.dev
```

## 🔑 Connect to EC2

Protect the private key:

```bash
chmod 400 /path/to/your-key.pem
```

Connect to the server:

```bash
ssh -i /path/to/your-key.pem ubuntu@EC2_PUBLIC_IP
```

## 🛠️ First-Time Server Setup

### 1. Update the Server

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Git

```bash
sudo apt install -y git
```

### 3. Install Node.js 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify the installation:

```bash
node --version
npm --version
```

### 4. Install PM2

```bash
sudo npm install -g pm2
```

### 5. Install and Start Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Confirm that Nginx is running:

```bash
sudo systemctl status nginx
```

## 📦 Install the Application

### 1. Clone the Repository

```bash
cd ~
git clone https://github.com/Roarsan/Trading-web.git
cd Trading-web
```

### 2. Install Dependencies

```bash
npm ci
```

Use `npm install` instead if the lock file is intentionally being updated.

## 🔐 Production Environment Variables

Create the production environment file:

```bash
nano .env
```

Add the following values:

```env
DATABASE_URL=postgresql://DB_USER:DB_PASSWORD@RDS_HOST:5432/postgres?sslmode=require
GOOGLE_ID=your-production-google-client-id
GOOGLE_SECRET=your-production-google-client-secret
NEXTAUTH_SECRET=your-production-nextauth-secret
NEXTAUTH_URL=https://tradingweb.dev
NEXT_PUBLIC_FINNHUB_TOKEN=your-finnhub-token
```

Generate a secure NextAuth secret:

```bash
openssl rand -base64 32
```

### Environment Notes

- URL-encode special characters in the database username or password.
- Keep `.env` on the server and never commit it to Git.
- `NEXTAUTH_URL` must match the public HTTPS domain.
- `NEXT_PUBLIC_FINNHUB_TOKEN` is included in browser code and should be treated as public.
- Set all `NEXT_PUBLIC_*` variables before running `npm run build`.

Restrict access to the environment file:

```bash
chmod 600 .env
```

## 🗄️ Prepare the Production Database

Generate the Prisma client:

```bash
npx prisma generate
```

Apply committed database migrations:

```bash
npx prisma migrate deploy
```

Use `prisma migrate deploy` in production. Do not use `prisma migrate dev` or `prisma db push` for normal production deployments.

## 🏗️ Build the Application

```bash
npm run build
```

If the build succeeds, Next.js creates the production output in `.next`.

## ⚙️ Run the Application with PM2

Start TradingApp:

```bash
pm2 start npm --name trading-web -- start
```

Check its status:

```bash
pm2 status
pm2 logs trading-web
```

Save the process list:

```bash
pm2 save
```

Enable PM2 after server restarts:

```bash
pm2 startup
```

Run the command printed by PM2, then save the process list again:

```bash
pm2 save
```

### Useful PM2 Commands

| Command | Description |
| --- | --- |
| `pm2 status` | Show application status |
| `pm2 logs trading-web` | View application logs |
| `pm2 restart trading-web --update-env` | Restart with current environment values |
| `pm2 stop trading-web` | Stop the application |
| `pm2 delete trading-web` | Remove the PM2 process |

## 🌐 Configure Nginx

Create a dedicated site configuration:

```bash
sudo nano /etc/nginx/sites-available/trading-web
```

Add:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name tradingweb.dev www.tradingweb.dev;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/trading-web /etc/nginx/sites-enabled/trading-web
sudo rm /etc/nginx/sites-enabled/default
```

Test and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Verify the application before enabling HTTPS:

```bash
curl -I http://127.0.0.1:3000
curl -I http://tradingweb.dev
```

## 🔒 Enable HTTPS

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Request the certificate:

```bash
sudo certbot --nginx -d tradingweb.dev -d www.tradingweb.dev
```

Test automatic renewal:

```bash
sudo certbot renew --dry-run
```

Confirm the final site:

```bash
curl -I https://tradingweb.dev
```

## 🔐 Configure Google OAuth

In the production Google OAuth client, add:

### Authorized JavaScript Origin

```text
https://tradingweb.dev
```

### Authorized Redirect URI

```text
https://tradingweb.dev/api/auth/callback/google
```

The redirect URI must match exactly, including the protocol and path.

## 🔄 Deploy Future Updates

After new code is pushed to the deployment branch:

```bash
cd ~/Trading-web
git pull
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart trading-web --update-env
```

Check the deployment:

```bash
pm2 status
pm2 logs trading-web --lines 100
curl -I https://tradingweb.dev
```

If `.env` changes, update it before building and restart PM2 with `--update-env`.

## ✅ Production Checklist

- [ ] EC2 allows inbound traffic on ports `22`, `80`, and `443`
- [ ] RDS allows port `5432` from the EC2 security group
- [ ] DNS points to the current EC2 public IP
- [ ] Production environment variables are configured
- [ ] Prisma migrations completed successfully
- [ ] The Next.js production build completed successfully
- [ ] PM2 reports `trading-web` as online
- [ ] Nginx configuration passes `nginx -t`
- [ ] HTTPS certificate is active
- [ ] Google sign-in completes successfully
- [ ] Finnhub prices load on the Market page
- [ ] Orders and portfolio data work for an authenticated user

## 🩺 Need Help?

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions to deployment, authentication, database, DNS, WebSocket, and server issues.

## 🔒 Security and Maintenance

- Never commit `.env`, `.pem`, passwords, API secrets, or database credentials.
- Restrict SSH access to trusted IP addresses.
- Keep the RDS database private and limit access to the EC2 security group.
- Use separate Google OAuth credentials for development and production.
- Keep Ubuntu and npm dependencies updated.
- Review PM2 and Nginx logs regularly.
- Enable AWS backups and RDS automated snapshots.
- Monitor AWS billing and Finnhub API usage.
- Rotate credentials immediately if they are exposed.

## 📁 Files to Keep Private

Never commit:

```text
.env
*.pem
database credentials
OAuth secrets
API secrets
```

Safe to commit:

```text
.env.example
source code
Prisma migrations
deployment documentation
Nginx examples without secrets
```
