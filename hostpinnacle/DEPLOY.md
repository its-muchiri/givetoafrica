# GiveToAfrica — cPanel Deployment Guide (Full Stack)

This deploys **both frontend and backend** on cPanel with Node.js support.

---

## Architecture

```
Browser → https://givetoafrrica.net
         ↳ Static files served from public_html/dist/
         ↳ /api/* proxied to Node.js app on port 4000 (same server)
```

---

## Prerequisites

- cPanel with **"Setup Node.js App"** (found under Software)
- PostgreSQL database (create via cPanel → "PostgreSQL Databases")
- Node.js 20+ available in the Node.js selector
- Domain `givetoafrrica.net` pointing to your cPanel server

---

## Step 1: Upload Project Files

### Option A: cPanel File Manager

1. Log into cPanel → **File Manager**
2. Navigate to your domain root (e.g., `~/domains/givetoafrica.org/public_html/` or just `public_html/`)
3. Upload **all project files** (the entire project folder contents):
   - `server/`, `prisma/`, `src/`, `public/`, `scripts/`
   - `package.json`, `package-lock.json`
   - `.htaccess`
   - `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.server.json`, `tailwind.config.js`, `postcss.config.js`
   - `.env` (with your production values)
4. **Do NOT upload** `node_modules/`, `dist/`, `.git/`

### Option B: Git (recommended)

```bash
cd ~/public_html  # or ~/domains/givetoafrica.org/public_html
git clone <your-repo-url> .
```

---

## Step 2: Set Up Node.js App in cPanel

1. In cPanel, go to **"Setup Node.js App"** (under Software)
2. Click **"Create Application"**
3. Configure:
   - **Node.js version**: 20 (or latest available)
   - **Application mode**: Production
   - **Application root**: `public_html` (or `domains/givetoafrica.org/public_html`)
   - **Application URL**: `givetoafrrica.net`
   - **Application startup file**: `server/index.ts`
4. Click **"Create"**

**Note**: If cPanel asks for a startup file, use `server/index.ts` and make sure `tsx` is available (it's in devDependencies). If it only accepts `.js` files, you'll need to build first (see Step 4).

---

## Step 3: Set Up Database

1. In cPanel → **"PostgreSQL Databases"**
2. Create a new database: `givetoafrica`
3. Create a database user with a strong password
4. Add the user to the database with **ALL PRIVILEGES**
5. Note the connection details:
   - Host: `localhost` (usually)
   - Database: `givetoafrica`
   - User: `your_db_user`
   - Password: `your_db_password`

---

## Step 4: Install Dependencies & Build

Open cPanel **Terminal** (or SSH if available):

```bash
cd ~/public_html  # or your app root

# Install all dependencies (including dev for build)
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build the frontend
npm run build

# Build the server (TypeScript → JavaScript)
npx tsc -p tsconfig.server.json
```

---

## Step 5: Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

Set for production:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/givetoafrica

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_WEBHOOK_ID=...
PAYPAL_MODE=live

# NOWPayments
NOWPAYMENTS_API_KEY=...
NOWPAYMENTS_IPN_SECRET=...

# Auth
MAGIC_LINK_SECRET=...  (generate: openssl rand -hex 32)
JWT_SECRET=...         (generate: openssl rand -hex 32)

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=donations@givetoafrrica.net

# Admin
ADMIN_EMAIL=admin@givetoafrrica.net

# App URLs
VITE_APP_URL=https://givetoafrrica.net
VITE_API_URL=https://givetoafrrica.net/api
```

---

## Step 6: Start the Node.js App

### If using cPanel Node.js Selector:

The app should auto-start. If not, go back to **"Setup Node.js App"** → click your app → **"Restart"**.

### Manual start (via Terminal):

```bash
# Using the built JS file
node dist/server/index.js

# Or with PM2 for auto-restart
npm install -g pm2
pm2 start dist/server/index.js --name givetoafrica
pm2 save
```

---

## Step 7: Verify .htaccess

Your `.htaccess` should proxy `/api/*` to the Node.js app. The current file does this correctly:

```apache
RewriteEngine On

# Proxy /api/* to local Node.js backend
RewriteCond %{HTTP:Upgrade} =websocket [NC]
RewriteRule ^/api/(.*) "ws://127.0.0.1:4000/api/$1" [P,L]

RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^/api/(.*) "http://127.0.0.1:4000/api/$1" [P,L]

# SPA fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

If Apache gives 500 errors, your host may need `mod_proxy` enabled. Contact support.

---

## Step 8: Enable SSL

1. cPanel → **"Let's Encrypt SSL"** or **"SSL/TLS"**
2. Issue SSL certificate for `givetoafrrica.net`
3. Enable **Force HTTPS Redirect**

---

## Step 9: Verify Deployment

1. Visit `https://givetoafrrica.net` — frontend loads
2. Visit `https://givetoafrrica.net/api/health` — returns `{"status":"ok",...}`
3. Test the donation flow
4. Check that emails are sent

---

## File Structure on cPanel

```
public_html/
├── .htaccess              # Apache config (proxy + SPA + caching)
├── .env                   # Environment variables (DO NOT upload secrets to git)
├── index.html             # SPA entry point
├── favicon.ico
├── package.json
├── server/                # Backend Express app (TypeScript source)
├── dist/                  # Built frontend + server JS
│   ├── index.html
│   ├── assets/
│   ├── img/
│   ├── blogs/
│   └── server/
│       └── index.js       # Built server entry point
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── node_modules/          # Installed by cPanel
```

---

## Updating the Site

```bash
cd ~/public_html
git pull origin main
npm install
npx prisma migrate deploy
npm run build
npx tsc -p tsconfig.server.json

# Restart the app
# Via cPanel Node.js App → Restart
# Or: pm2 restart givetoafrica
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 500 error on /api/* | `mod_proxy` not enabled — contact host support |
| Blank page | `.htaccess` missing or SPA rewrite not working |
| App won't start | Check Node.js version, ensure `tsx` installed, check startup file path |
| Database connection error | Verify `DATABASE_URL` in `.env`, check cPanel DB user/password |
| "Cannot find module" | Run `npm install` again, check `node_modules` exists |
| CORS errors | Ensure `VITE_APP_URL` in `.env` matches your domain exactly |
