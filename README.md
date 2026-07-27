# Donate to Africa - Donation Platform

A production-grade, scalable donation platform for a nonprofit organization raising funds to support communities across Africa.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + Prisma ORM
- **Database:** PostgreSQL
- **Payments:** Stripe (international) + Flutterwave (Africa) + Paystack (Nigeria)
- **Email:** Resend
- **Deployment:** Docker + CI/CD via GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm or yarn

### Setup

1. Clone and install dependencies:
   ```bash
   git clone <repo-url>
   cd donatetoafrica
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your API keys from:
   - [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - [Flutterwave Dashboard](https://dashboard.flutterwave.com/settings/keys)
   - [Paystack Dashboard](https://dashboard.paystack.com/settings/keys)
   - [Resend](https://resend.com/api-keys)

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start development servers:
   ```bash
   npm run dev:all
   ```
   - Frontend: http://localhost:3000
   - API: http://localhost:4000

### Docker

```bash
docker-compose up
```

## Project Structure

```
├── src/                    # Frontend React app
│   ├── components/         # Shared components (Layout, Navbar, Footer, CookieConsent)
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx    # Landing page with CTAs
│   │   ├── DonatePage.tsx  # Core donation flow
│   │   ├── CausesPage.tsx  # Program listings
│   │   └── ...
│   └── lib/                # Utilities, constants, helpers
├── server/                 # Backend Express API
│   ├── index.ts            # Entry point
│   ├── routes/             # API route handlers
│   │   ├── donations.ts    # Donation creation
│   │   ├── webhooks-*.ts   # Payment provider webhooks
│   │   ├── auth.ts         # Magic link authentication
│   │   ├── admin.ts        # Admin dashboard API
│   │   └── donor-portal.ts # Donor portal API
│   └── lib/                # Server utilities
│       ├── stripe.ts       # Stripe client
│       ├── flutterwave.ts  # Flutterwave client
│       ├── paystack.ts     # Paystack client
│       ├── email.ts        # Email service (Resend)
│       ├── validation.ts   # Zod schemas
│       └── audit.ts        # Audit logging
├── prisma/
│   └── schema.prisma       # Database schema
├── .github/workflows/      # CI/CD pipeline
├── docker-compose.yml
├── Dockerfile
└── tailwind.config.js
```

## Payment Providers

| Provider | Coverage | Methods |
|----------|----------|---------|
| Stripe | International | Cards, Apple Pay, Google Pay |
| Flutterwave | Kenya, Ghana, Uganda, Tanzania, etc. | Mobile Money (M-Pesa, MTN), Bank Transfer, Cards |
| Paystack | Nigeria | Cards, Bank Transfer, USSD |

Provider is automatically selected based on donor country and currency.

## Key Features

- **Donation Flow:** One-time + monthly recurring, 9 currencies, suggested amounts with impact descriptions
- **Payment Security:** PCI-DSS compliant (via providers), webhook signature verification, rate limiting, idempotent processing
- **Donor Portal:** Magic-link auth, donation history, tax receipts, recurring management
- **Admin Dashboard:** Campaign management, donor CRM, financial reporting, audit logs
- **Compliance:** GDPR + POPIA, cookie consent, privacy policy, tax deductibility info

## Deployment

### Environment Variables Required

See `.env.example` for the full list. **Never commit `.env` files.**

### CI/CD

GitHub Actions pipeline:
1. Lint & type-check
2. Run tests
3. Build
4. Deploy to staging (on `staging` branch)
5. Manual approval → Deploy to production (on `main` branch)

## Legal

- Charity Registration: EIN 12-3456789 (501(c)(3))
- All payment processing is PCI-DSS compliant via hosted payment providers
- GDPR compliant (EU donors) and POPIA compliant (South African donors)
