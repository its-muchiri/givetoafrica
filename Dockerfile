FROM node:20-alpine AS base

# Install dependencies only
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Build
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npx tsc -p tsconfig.server.json

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4000

CMD ["node", "dist/server/index.js"]
