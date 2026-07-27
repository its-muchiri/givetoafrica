import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get all active campaigns
router.get('/', async (_req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    })
    res.json(campaigns)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' })
  }
})

// Get campaign by slug
router.get('/:slug', async (req, res) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { slug: req.params.slug },
      include: { _count: { select: { donations: true } } },
    })
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' })
    res.json(campaign)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaign' })
  }
})

export { router as campaignRoutes }
