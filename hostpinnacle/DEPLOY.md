# GiveToAfrica — HostPinnacle Deployment Guide

## Prerequisites

- A HostPinnacle hosting account with SSH access enabled
- Node.js 20+ and npm installed on the server
- PostgreSQL 16+ database configured via HostPinnacle's database manager
- A registered domain pointing to your HostPinnacle server

## Deployment Steps

### 1. Connect to Your HostPinnacle Server via SSH

```bash
ssh yourusername@your-server.hostpinnacle.com
cd ~/domains/givetoafrica.org/public_html
```

### 2. Upload Files

Upload all project files to your HostPinnacle server using SFTP/SCP or Git:

```bash
# Option A: Git clone
git clone <repo-url> ~/domains/givetoafrica.org/
cd ~/domains/givetoafrica.org

# Option B: Upload via SFTP
# Use FileZilla or WinSCP to upload the project folder
```

### 3. Install Dependencies

```bash
npm install
npx prisma generate
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your real values:

```bash
cp .env.example .env
nano .env
```

Set the following for production:
- `NODE_ENV=production`
- `DATABASE_URL=postgresql://user:password@localhost:5432/givetoafrica`
- `PORT=4000`
- `VITE_APP_URL=https://givetoafrica.org`
- `VITE_API_URL=https://givetoafrica.org/api`
- All Stripe, PayPal, NOWPayments, Resend keys

### 5. Build the Project

```bash
npm run build
```

This creates the frontend dist and built server files.

### 6. Start the Server

Start the Node.js backend with PM2 (recommended for production):

```bash
npm install -g pm2
pm2 start dist/server/index.js --name givetoafrica
pm2 save
pm2 startup
```

Or use `nohup` for a simpler approach:

```bash
nohup node dist/server/index.js > server.log 2>&1 &
```

### 7. Configure Apache Reverse Proxy (.htaccess)

The `.htaccess` file at the project root already handles proxying API requests to the Node.js backend on port 4000. Ensure Apache's `mod_proxy` and `mod_proxy_http` modules are enabled:

```bash
# On HostPinnacle, check with:
apache2ctl -M | grep proxy
```

If not enabled, add to your `.htaccess`:

```
RewriteEngine On
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^/?(.*) "ws://127.0.0.1:4000/$1" [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^/?(.*) "http://127.0.0.1:4000/$1" [P,L]
```

### 8. Set Up Database

```bash
npx prisma db push
# Or for migrations:
npx prisma migrate deploy
```

### 9. Verify Deployment

Visit `https://givetoafrica.org` in your browser and verify:
- The frontend loads correctly
- API routes respond at `https://givetoafrica.org/api/health`
- Donations can be created and processed
- Email receipts are sent

## File Structure on HostPinnacle

```
~/domains/givetoafrica.org/
├── .htaccess                  # Apache reverse proxy config
├── .env                       # Environment variables
├── .env.example               # Template for env vars
├── dist/                      # Built frontend (served statically)
├── server/                    # Backend Express app
├── prisma/                    # Database schema & migrations
├── package.json
├── pm2.log                    # PM2 log file
└── server.log                 # Application log
```

## SSL/HTTPS

HostPinnacle includes free SSL via Let's Encrypt. Ensure your domain's DNS points to your HostPinnacle server and enable SSL in cPanel.

## Updating the Site

To deploy updates:

```bash
cd ~/domains/givetoafrica.org
git pull origin main
npm install
npm run build
pm2 restart givetoafrica
npx prisma migrate deploy
```