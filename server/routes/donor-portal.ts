import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Simple auth middleware (in production, use JWT verification)
function requireAuth(req: any, _res: any, next: any) {
  const donorId = req.headers['x-donor-id']
  if (!donorId) return _res.status(401).json({ error: 'Authentication required' })
  req.donorId = donorId
  next()
}

// Get donor profile and donation history
router.get('/profile', requireAuth, async (req: any, res) => {
  try {
    const donor = await prisma.donor.findUnique({
      where: { id: req.donorId },
      include: {
        donations: {
          orderBy: { createdAt: 'desc' },
          include: { campaign: true, receipt: true },
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!donor) return res.status(404).json({ error: 'Donor not found' })

    const totalDonated = donor.donations
      .filter((d) => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0)

    const activeSubscriptions = donor.subscriptions.filter((s) => s.status === 'active')

    res.json({
      ...donor,
      stats: {
        totalDonated,
        donationCount: donor.donations.filter((d) => d.status === 'completed').length,
        activeSubscriptions: activeSubscriptions.length,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Get receipts for donor
router.get('/receipts', requireAuth, async (req: any, res) => {
  try {
    const receipts = await prisma.receipt.findMany({
      where: { donation: { donorId: req.donorId } },
      include: { donation: { include: { campaign: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json(receipts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch receipts' })
  }
})

// Cancel a subscription
router.post('/subscriptions/:id/cancel', requireAuth, async (req: any, res) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { id: req.params.id, donorId: req.donorId },
    })

    if (!subscription) return res.status(404).json({ error: 'Subscription not found' })

    // Cancel with the appropriate provider
    if (subscription.provider === 'stripe') {
      const { getStripe } = await import('../lib/stripe')
      await getStripe().subscriptions.cancel(subscription.providerSubscriptionId)
    }
    // Add Flutterwave and Paystack cancellation logic as needed

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'canceled', cancelAtPeriodEnd: true },
    })

    res.json({ message: 'Subscription canceled successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' })
  }
})

export { router as donorPortalRoutes }
