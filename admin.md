# npm / Deployment Issue Diagnosis — givetoafrica.net

**Date:** 2026-07-30
**Server:** HostPinnacle cPanel (Node.js 18, nodevenv backend)
**Domain:** givetoafrica.net
**Repo:** https://github.com/its-muchiri/givetoafrica (git repo at `/home2/datingsi/givetoafrica.net`)
**Backend:** `/home2/datingsi/backend` (cPanel Setup Node.js App startup file: `index.js`)

---

## Executive Summary

The root cause of the deployment failure is that **npm/node tooling in cPanel's nodevenv environment is fundamentally unreliable for building TypeScript projects on the production server**. The server's npm resolves to 1 package instead of the full dependency tree, `tsc` is never available in PATH even after `npm install typescript` succeeds, and the cPanel-managed Node.js environment (nodevenv) does not support normal local `node_modules` development workflows. The fix is a **local/CI build + pre-built artifact deploy** model.

---

## Issue Log

### 1. npm resolves only 1 package instead of full dependency tree
- **Symptom:** `npm install` on server reports `audited 1 package` instead of ~199
- **Environment:** `/home2/datingsi/nodevenv/backend/18/bin/npm`
- **Reproducible:** Always
- **Cause:** cPanel's nodevenv npm seems scoped to global modules, not local project `node_modules/`. It does not install dependencies into the project directory normally.
- **Workaround:** Running bare `npm` (not nodevenv path) sometimes works but is inconsistent (engine warnings, tsc not found after install).

### 2. `tsc` command not found after `npm install typescript`
- **Symptom:** `npm install typescript --save-dev --force` reports `removed 198 packages` then `up to date, audited 1 package` — TypeScript is NOT installed in `node_modules/.bin/tsc`
- **Environment:** `/home2/datingsi/nodevenv/backend/18/bin/npm`
- **Confirmed:** Running `ls node_modules/.bin/tsc` returns "No such file or directory"
- **Root Cause:** nodevenv npm doesn't install to local project `node_modules/`; it installs to a global/cached location that's not on PATH
- **Impact:** `npm run build:server` (`tsc -p tsconfig.server.json`) fails with `sh: tsc: command not found`

### 3. `npx` not available at expected nodevenv path
- **Symptom:** `/home2/datingsi/nodevenv/backend/18/bin/npx` does not exist (No such file or directory)
- **Impact:** Cannot use `npx tsc` or `npx prisma` as fallback

### 4. `npm` not in PATH in cPanel terminal
- **Symptom:** `npm` command not found in fresh terminal sessions
- **Cause:** cPanel terminal does not auto-activate the nodevenv environment
- **Workaround:** Must use full path `/home2/datingsi/nodevenv/backend/18/bin/npm`

### 5. `npm ci` fails in nodevenv environment
- **Symptom:** `npm ci --omit=dev` produces npm usage error / help output instead of running
- **Root Cause:** nodevenv npm is a wrapper that doesn't support `npm ci` correctly

### 6. Node.js version mismatch — server has 18, package.json requires 20
- **Symptom:** Engine warnings for `vitest` (requires Node 20+), `puppeteer-core` (requires Node 22+)
- **Server nodevenv:** `/home2/datingsi/nodevenv/backend/18/` (Node v18.20.8)
- **package.json engines:** `"node": "20.x"` (added post-diagnosis)
- **Impact:** Builds work on Node 18 despite warnings (no critical failures), but CI and CI-driven deploys need matching Node version

### 7. cPanel Git Version Control misconfiguration
- **Symptom:** `git pull origin main` fails with `Authentication failed` when using HTTPS password auth
- **Cause:** GitHub deprecated password authentication for Git operations
- **Resolution:** Use GitHub Personal Access Token (PAT) or cPanel's built-in OAuth-based Git integration (cPanel → Git Version Control → Manage → Update)

### 8. Remote repo URL mismatch
- **Symptom:** User initially pointed remote to `https://github.com/its-muchiri/givetoafrica.net.git` (does not exist)
- **Correct URL:** `https://github.com/its-muchiri/givetoafrica.git`
- **Fix:** `git remote set-url origin https://github.com/its-muchiri/givetoafrica.git`

### 9. `.cpanel.yml` copies entire `dist/server` directory instead of contents
- **Original:** `cp -R dist/server $BACKENDPATH` creates `/home2/datingsi/backend/dist/server/` structure
- **Fix:** `cp -R dist/server/. $BACKENDPATH` copies contents directly to `/home2/datingsi/backend/`
- **Where it matters:** cPanel startup file `index.js` expects to find it at backend root, not in a subdirectory

### 10. `.cpanel.yml` has no clean-wipe before deployment
- **Original behavior:** Incremental copy of dist/ contents → stale files accumulate (`.zip`, old binaries, stray dirs)
- **Fix in `.cpanel.yml`:** Added `rm -rf $BACKENDPATH/*` and `rm -rf $FRONTPATH/*` before copy

### 11. `.cpanel.yml` copies `.env` from repo root (should not be in git)
- **Fix:** Removed `.env` copy from `.cpanel.yml`; env vars are set in cPanel Setup Node.js App UI or via server `.env` (managed separately)

### 12. `deploy.sh` uses bare npm/npx which fail on cPanel
- **Original:**
  ```bash
  npm install --production
  npx prisma generate
  npx prisma migrate deploy
  ```
- **All 3 commands fail** because bare `npm` is not in PATH
- **Fix:** Use full nodevenv paths:
  ```bash
  export NODE=/home2/datingsi/nodevenv/backend/18/bin/node
  export NPM=/home2/datingsi/nodevenv/backend/18/bin/npm
  $NPM ci --omit=dev
  $NPM exec prisma generate
  $NPM exec prisma migrate deploy
  ```

### 13. `git clean -fd` removes `node_modules/` from cPanel terminal
- **Symptom:** `git clean -fd -e .env` removes `node_modules/` (which is in .gitignore)
- **Impact:** All devDependencies (typescript, vite, tsx, etc.) are wiped, breaking future builds
- **Lesson:** `git clean` should only be used after confirming it won't destroy needed artifacts, or better: don't run git clean in the project root on the server

### 14. `dist/` was committed to git (now removed)
- **History:** `dist/server` files were committed in earlier commits (the pre-ESM fix era)
- **Fix:** `dist/` should be in `.gitignore`. Our latest commit removed all `dist/server` files (they were deleted from git)

### 15. `package.json` missing `engines` field and `.nvmrc`
- **Fix applied:** Added `"engines": { "node": "20.x" }` to `package.json`
- **Fix applied:** Added `.nvmrc` containing `20`
- **These are informational** — cPanel Setup Node.js App doesn't read `.nvmrc` or `engines` automatically

### 16. Backend startup file `index.js` is a broken 323-byte cPanel wrapper
- **Content:** Uses `require('http')` (CommonJS) which conflicts with `"type": "module"` in package.json
- **Fix needed:** Either delete this wrapper so cPanel uses the correct startup entry, or replace it

### 17. Payment error `Unexpected token '<', "<!doctype "... is not valid JSON`
- **Root Cause:** The backend Node.js app is not running at all (or is running the old broken code). The frontend SPA serves its `index.html` for all unknown routes (SPA fallback), so API calls return HTML instead of JSON.
- **Specific endpoint failing:** The donation/payment endpoint being called by the frontend gets the SPA's `index.html` rather than the JSON API response — proving the backend server is either not running or not serving API routes correctly.

---

## Recommended Actions for System Administrator

### Immediate (to fix this deployment)

1. **Build locally** (on developer's machine) where `npm run build:hostpinnacle` works correctly:
   ```bash
   npm run build:hostpinnacle
   ```
   This produces `dist/server/index.js` (ESM) and Vite frontend output at `dist/`.

2. **Upload pre-built `dist/` to server** using SFTP/cPanel File Manager:
   - Copy `dist/` → `/home2/datingsi/backend/` (the backend app directory cPanel monitors)
   - Also copy `prisma/schema.prisma`, `package.json`, `package-lock.json` to `/home2/datingsi/backend/`

3. **Install production deps only** on server (no TypeScript/Vite needed):
   ```bash
   cd /home2/datingsi/backend
   /home2/datingsi/nodevenv/backend/18/bin/npm ci --omit=dev
   ```
   Or if `npm ci` fails (nodevenv issue), try:
   ```bash
   /home2/datingsi/nodevenv/backend/18/bin/npm install --omit=dev --force
   ```

4. **Run Prisma:**
   ```bash
   /home2/datingsi/nodevenv/backend/18/bin/npx prisma generate
   /home2/datingsi/nodevenv/backend/18/bin/npx prisma migrate deploy
   ```

5. **Restart Node.js app** via cPanel Setup Node.js App → Restart, or:
   ```bash
   touch /home2/datingsi/backend/tmp/restart.txt
   ```

6. **Update cPanel Startup file** to `dist/server/index.js` (not `index.js`)

7. **Delete the broken `/home2/datingsi/backend/index.js`** (323-byte CJS wrapper that conflicts with `"type": "module"`)

### Long-term

1. **Add GitHub Actions CI/CD** (`.github/workflows/ci.yml` already exists but uses old HostPinnacle SSH deploy — needs updating to cPanel artifact deploy)
2. **Add `.gitignore` entry for `dist/`** to prevent accidental commits
3. **Configure cPanel Git Version Control auto-deploy** to run `.cpanel.yml` tasks after `git pull`
4. **Consider upgrading nodevenv to Node 20** (currently only 18 and 10 are available at `/home2/datingsi/nodevenv/backend/`)
5. **Fix cPanel npm/scoping issue** — nodevenv npm should support local `node_modules/` installs for deployed apps
6. **Set correct DATABASE_URL on server** — currently `.env` on server has `localhost` DB URL which may need updating to the actual HostPinnacle PostgreSQL URL

---

## File Reference

- `.cpanel.yml`: Rewritten with clean wipe + selective copy + Passenger restart trigger
- `deploy.sh`: Rewritten with nodevenv paths + `npm ci --omit=dev` + prisma + restart.txt
- `package.json`: Added `"engines": { "node": "20.x" }`
- `.nvmrc`: Created with `20`
- `tsconfig.server.json`: Already correct (ESM output, `module: ESNext`)
- `package-lock.json`: Now committed to git
- `.github/workflows/ci.yml`: Updated build job to use `build:hostpinnacle`, deploy jobs to use artifact-based cPanel deploy (removed old HostPinnacle SSH/pm2 approach)

---

*End of diagnosis.*
