# Trading Web - Deployment Guide

## Architecture

```
Internet
     │
     ▼
HTTPS (Let's Encrypt)
     │
     ▼
Nginx (Reverse Proxy)
     │
     ▼
Next.js App (PM2)
     │
     ▼
Prisma
     │
     ▼
AWS RDS PostgreSQL
```

---

# AWS Resources

## EC2

* OS: Ubuntu 24.04 LTS
* Public IP: 13.43.121.177
* Domain: https://tradingweb.dev
* SSH User: ubuntu

SSH:

```bash
ssh -i ~/Downloads/tradingwebkey-2.pem ubuntu@13.43.121.177
```

---

## RDS

Engine:
PostgreSQL

Database:
postgres

Connection:

```
trading-app-db.ct6imim86thi.eu-west-2.rds.amazonaws.com
```

---

# First Time Server Setup

Update packages

```bash
sudo apt update
sudo apt upgrade -y
```

Install Git

```bash
sudo apt install -y git
```

Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Install PM2

```bash
sudo npm install -g pm2
```

Install Nginx

```bash
sudo apt install -y nginx
```

Enable nginx

```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

# Clone Project

```bash
git clone https://github.com/Roarsan/Trading-web.git
cd Trading-web
```

---

# Environment Variables

Create

```
.env
```

Example:

```env
DATABASE_URL=
GOOGLE_ID=
GOOGLE_SECRET=
NEXT_PUBLIC_FINNHUB_TOKEN=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

Never commit real values.

---

# Install Dependencies

```bash
npm install
```

Generate Prisma

```bash
npx prisma generate
```

Push schema if required

```bash
npx prisma db push
```

---

# Build

```bash
npm run build
```

---

# Start Production

```bash
pm2 start npm --name trading-web -- start
```

Save

```bash
pm2 save
```

Startup

```bash
pm2 startup
```

Run the command PM2 prints.

Then

```bash
pm2 save
```

Useful commands

```bash
pm2 status

pm2 restart trading-web

pm2 logs trading-web

pm2 delete trading-web
```

---

# Nginx

Configuration

```
/etc/nginx/sites-available/default
```

```
server {
    listen 80;

    server_name tradingweb.dev www.tradingweb.dev;

    location / {

        proxy_pass http://localhost:3000;

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

Test

```bash
sudo nginx -t
```

Reload

```bash
sudo systemctl reload nginx
```

---

# HTTPS

Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Generate SSL

```bash
sudo certbot --nginx -d tradingweb.dev -d www.tradingweb.dev
```

Renew

```bash
sudo certbot renew --dry-run
```

---

# Deployment

Whenever new code is pushed

```bash
cd ~/Trading-web

git pull

npm install

npx prisma generate

npm run build

pm2 restart trading-web --update-env
```

---

# Google OAuth

Authorized JavaScript Origin

```
https://tradingweb.dev
```

Authorized Redirect URI

```
https://tradingweb.dev/api/auth/callback/google
```

---

# Troubleshooting

## Cannot SSH

Check

* Correct .pem
* chmod 400
* Security Group allows port 22

---

## npm build gets "Killed"

Server ran out of RAM.

Solution:

Create swap memory.

---

## Site cannot be reached

Check

```bash
pm2 status

sudo systemctl status nginx

sudo nginx -t

curl localhost:3000
```

---

## Domain loads old version

DNS still pointing to old EC2.

Check

```bash
dig +short tradingweb.dev
```

---

## WebSocket not working

Initially browser loaded the old deployment because DNS still pointed to the previous EC2.

Fix:

* Update DNS A record
* Wait for propagation
* Rebuild
* Restart PM2

---

## Google Login Callback Error

Root cause:

Prisma could not access RDS.

Check

```bash
pm2 logs trading-web
```

---

## Prisma P1010

```
User denied access on database
```

Caused by database connection configuration.

---

## pg_hba.conf no encryption

Production RDS required SSL.

Database connection updated to use SSL.

---

## SSL self-signed certificate

Verified AWS RDS CA bundle works.

Current deployment should use the verified production SSL configuration.

---

## Git Push Failed

GitHub passwords are no longer supported.

Use:

* SSH key

or

* Personal Access Token

---

# Backup

Never commit

* .env
* .pem
* passwords
* secrets

Commit

* source code
* deployment documentation
* nginx example config
* .env.example

Keep secrets in a password manager.

