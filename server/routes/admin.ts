import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Admin auth middleware
function requireAdmin(req: any, _res: any, next: any) {
  const role = req.headers['x-admin-role']
  if (!role || !['admin', 'super_admin'].includes(role)) {
    return _res.status(403).json({ error: 'Admin access required' })
  }
  req.adminRole = role
  next()
}

// Dashboard stats
router.get('/dashboard', requireAdmin, async (_req, res) => {
  try {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalRaised, newDonors, activeCampaigns, recentDonations] = await Promise.all([
      prisma.donation.aggregate({
        where: { status: 'completed', createdAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
      prisma.donor.count({
        where: { createdAt: { gte: monthStart } },
      }),
      prisma.campaign.count({ where: { status: 'active' } }),
      prisma.donation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { donor: true, campaign: true },
      }),
    ])

    res.json({
      stats: {
        totalRaised: totalRaised._sum.amount || 0,
        newDonors,
        activeCampaigns,
      },
      recentDonations,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' })
  }
})

// Get all campaigns (admin)
router.get('/campaigns', requireAdmin, async (_req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { donations: true } } },
    })
    res.json(campaigns)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' })
  }
})

// Create campaign
router.post('/campaigns', requireAdmin, async (req, res) => {
  try {
    const campaign = await prisma.campaign.create({ data: req.body })
    res.json(campaign)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create campaign' })
  }
})

// Get all donors
router.get('/donors', requireAdmin, async (req: any, res) => {
  try {
    const donors = await prisma.donor.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { donations: true } },
        donations: { where: { status: 'completed' }, select: { amount: true } },
      },
    })

    const donorsWithStats = donors.map((d) => ({
      ...d,
      totalDonated: d.donations.reduce((sum, don) => sum + don.amount, 0),
      donations: undefined,
    }))

    res.json(donorsWithStats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donors' })
  }
})

// Get all donations
router.get('/donations', requireAdmin, async (_req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { donor: true, campaign: true },
    })
    res.json(donations)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations' })
  }
})

// Audit log
router.get('/audit-log', requireAdmin, async (req: any, res) => {
  if (req.adminRole !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required' })
  }
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    })
    res.json(logs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit log' })
  }
})

export { router as adminRoutes }
