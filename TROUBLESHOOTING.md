# 🩺 TradingApp Troubleshooting Guide

This guide covers common development and production problems for TradingApp.

For initial AWS setup and release instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🔍 Quick Health Check

Run these commands on the EC2 server to inspect the main services:

```bash
cd ~/Trading-web
pm2 status
pm2 logs trading-web --lines 100
sudo systemctl status nginx
sudo nginx -t
curl -I http://127.0.0.1:3000
curl -I https://tradingweb.dev
```

These checks usually reveal whether the problem is coming from the application, PM2, Nginx, HTTPS, or an external service.

## ⚙️ Application Is Not Running

Check the PM2 process and application logs:

```bash
pm2 status
pm2 logs trading-web --lines 100
curl -I http://127.0.0.1:3000
```

Common causes include:

- Missing environment variables
- A failed production build
- A database connection error
- The PM2 process being stopped

Rebuild and restart the application:

```bash
cd ~/Trading-web
npm run build
pm2 restart trading-web --update-env
```

If the PM2 process does not exist:

```bash
pm2 start npm --name trading-web -- start
pm2 save
```

## 🌐 Nginx Returns `502 Bad Gateway`

A `502` response usually means Nginx cannot reach the Next.js application.

```bash
pm2 status
sudo nginx -t
sudo systemctl status nginx
curl -I http://127.0.0.1:3000
```

Restart the application and reload Nginx:

```bash
pm2 restart trading-web --update-env
sudo systemctl reload nginx
```

Confirm that Nginx forwards requests to:

```text
http://127.0.0.1:3000
```

## 🔐 Google Sign-In Fails

Confirm:

- `NEXTAUTH_URL` is exactly `https://tradingweb.dev`
- `GOOGLE_ID`, `GOOGLE_SECRET`, and `NEXTAUTH_SECRET` are set
- The Google OAuth redirect URI matches the production callback
- The EC2 instance can connect to RDS

The production redirect URI should be:

```text
https://tradingweb.dev/api/auth/callback/google
```

Review the application logs:

```bash
pm2 logs trading-web --lines 100
```

After changing authentication environment variables:

```bash
npm run build
pm2 restart trading-web --update-env
```

## 🗄️ Prisma Cannot Connect to RDS

Check:

- The RDS endpoint, username, password, port, and database name
- The RDS security group allows port `5432` from the EC2 security group
- The database URL includes the required SSL configuration
- Special characters in credentials are URL-encoded

The production URL should follow this format:

```env
DATABASE_URL=postgresql://DB_USER:DB_PASSWORD@RDS_HOST:5432/postgres?sslmode=require
```

Test whether the RDS port is reachable:

```bash
nc -zv RDS_HOST 5432
```

Try applying migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

## 🚫 Prisma Error `P1010`

`P1010` usually means the configured database user does not have permission to access the selected database.

Verify:

- The database name exists
- The username is correct
- The user has permission to connect and modify the database
- The connection is using the intended RDS instance

## 🧠 Build Process Is Killed

The EC2 instance may have insufficient memory.

Check available memory:

```bash
free -h
```

Create a 2 GB swap file if needed:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

Persist it across restarts:

```bash
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Confirm that swap is active:

```bash
swapon --show
```

Run the build again:

```bash
npm run build
```

## 🌍 Domain Shows an Old Deployment

Check the DNS result, deployed commit, and application process:

```bash
dig +short tradingweb.dev
git log -1 --oneline
pm2 status
```

Confirm that DNS points to the current EC2 public IP.

Then update and restart the application:

```bash
cd ~/Trading-web
git pull
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart trading-web --update-env
```

DNS changes may take time to propagate because of cached records and TTL settings.

## ⚡ Finnhub Prices Do Not Update

Check:

- `NEXT_PUBLIC_FINNHUB_TOKEN` exists in the production `.env`
- The token was present before `npm run build`
- The browser console does not show Finnhub authentication or WebSocket errors
- The deployed site is using the latest build

After changing the token:

```bash
npm run build
pm2 restart trading-web --update-env
```

Because this variable starts with `NEXT_PUBLIC_`, changing it requires a new production build.

## 🔑 Cannot Connect with SSH

Confirm:

- The EC2 instance is running
- The correct public IP and `ubuntu` user are being used
- Port `22` is allowed from your IP in the EC2 security group
- The private key matches the EC2 instance
- The private key has restricted permissions

Set the required permissions:

```bash
chmod 400 /path/to/your-key.pem
```

Connect again:

```bash
ssh -i /path/to/your-key.pem ubuntu@EC2_PUBLIC_IP
```

## 🔒 HTTPS or Certificate Problems

Check the Nginx configuration and installed certificates:

```bash
sudo nginx -t
sudo certbot certificates
sudo systemctl status nginx
```

Test certificate renewal:

```bash
sudo certbot renew --dry-run
```

Confirm that ports `80` and `443` are open and both domain records point to the current EC2 instance.

## 📋 Useful Logs and Commands

| Command | Purpose |
| --- | --- |
| `pm2 status` | Check whether TradingApp is online |
| `pm2 logs trading-web` | View application and server errors |
| `sudo nginx -t` | Validate the Nginx configuration |
| `sudo journalctl -u nginx` | View Nginx service logs |
| `curl -I http://127.0.0.1:3000` | Test Next.js directly |
| `curl -I https://tradingweb.dev` | Test the public application |
| `dig +short tradingweb.dev` | Check the current DNS result |
| `free -h` | Check server memory |
| `df -h` | Check available disk space |
