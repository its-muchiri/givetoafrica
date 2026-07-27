import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { loginSchema } from '../lib/validation'
import { sendMagicLinkEmail } from '../lib/email'
import crypto from 'crypto'

const router = Router()
const prisma = new PrismaClient()

// Request magic link
router.post('/magic-link', async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid email' })
    }

    const { email } = validation.data
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Invalidate old tokens
    await prisma.magicLink.updateMany({
      where: { email, used: false },
      data: { used: true },
    })

    // Create new token
    await prisma.magicLink.create({
      data: { email, token, expiresAt },
    })

    await sendMagicLinkEmail(email, token)

    res.json({ message: 'Magic link sent to your email' })
  } catch (error) {
    console.error('Magic link error:', error)
    res.status(500).json({ error: 'Failed to send magic link' })
  }
})

// Verify magic link
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid token' })
    }

    const magicLink = await prisma.magicLink.findUnique({
      where: { token },
    })

    if (!magicLink || magicLink.used || magicLink.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Mark token as used
    await prisma.magicLink.update({
      where: { id: magicLink.id },
      data: { used: true },
    })

    // Find or create donor
    let donor = await prisma.donor.findUnique({ where: { email: magicLink.email } })
    if (!donor) {
      return res.status(404).json({ error: 'No account found with this email' })
    }

    // Generate session token (in production, use JWT or secure session)
    const sessionToken = crypto.randomBytes(32).toString('hex')

    res.json({
      sessionToken,
      donor: {
        id: donor.id,
        name: donor.name,
        email: donor.email,
      },
    })
  } catch (error) {
    console.error('Magic link verification error:', error)
    res.status(500).json({ error: 'Verification failed' })
  }
})

export { router as authRoutes }
