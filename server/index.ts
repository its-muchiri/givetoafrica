import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { donationRoutes } from './routes/donations.js'
import { campaignRoutes } from './routes/campaigns.js'
import { stripeWebhookRoutes } from './routes/webhooks-stripe.js'
import { paypalWebhookRoutes } from './routes/webhooks-paypal.js'
import { nowpaymentsWebhookRoutes } from './routes/webhooks-nowpayments.js'
import { authRoutes } from './routes/auth.js'
import { adminRoutes } from './routes/admin.js'
import { donorPortalRoutes } from './routes/donor-portal.js'
import { engagementRoutes } from './routes/engagement.js'
import prismaDeployRoutes from './routes/prisma-deploy.js'

const app = express()
const PORT = process.env.PORT || 4000

// Security
app.use(helmet())
app.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:3000',
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Donation-specific rate limit (stricter)
const donationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many donation attempts. Please try again later.' },
})
app.use('/api/donations/create', donationLimiter)

// Logging
app.use(morgan('combined'))

// Webhook routes need raw body (before JSON parsing)
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhookRoutes)
app.use('/api/webhooks/paypal', express.raw({ type: 'application/json' }), paypalWebhookRoutes)
app.use('/api/webhooks/nowpayments', express.json(), nowpaymentsWebhookRoutes)

// JSON parsing for other routes
app.use(express.json({ limit: '1mb' }))

// API Routes
app.use('/api/donations', donationRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/donor-portal', donorPortalRoutes)
app.use('/api/engagement', engagementRoutes)

// Prisma deploy route (temporary — remove after first deploy)
app.use('/prisma-deploy', prismaDeployRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
