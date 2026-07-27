import { Router } from 'express'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import { logAuditEvent, generateReceiptNumber } from '../lib/audit'
import { sendReceiptEmail } from '../lib/email'

const router = Router()
const prisma = new PrismaClient()

router.post('/', async (req, res) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(req.body.toString())
    .digest('hex')

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  const payload = JSON.parse(req.body.toString())
  const { event, data } = payload

  if (event === 'charge.success') {
    const reference = data.reference
    const donationId = reference.replace('GF-', '')

    try {
      const donation = await prisma.donation.findFirst({
        where: { id: { startsWith: donationId } },
        include: { donor: true, campaign: true },
      })

      if (donation && donation.status === 'pending') {
        const updated = await prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: 'completed',
            providerTransactionId: data.id.toString(),
          },
          include: { donor: true, campaign: true },
        })

        const receipt = await prisma.receipt.create({
          data: {
            receiptNumber: generateReceiptNumber(),
            donationId: updated.id,
            sentAt: new Date(),
          },
        })

        if (updated.campaignId) {
          await prisma.campaign.update({
            where: { id: updated.campaignId },
            data: { raisedAmount: { increment: updated.amount } },
          })
        }

        try {
          await sendReceiptEmail({
            to: updated.donor.email,
            donorName: updated.donor.name,
            amount: updated.amount,
            currency: updated.currency,
            receiptNumber: receipt.receiptNumber,
            campaignName: updated.campaign?.title,
            isRecurring: updated.isRecurring,
          })
        } catch (emailError) {
          console.error('Failed to send receipt email:', emailError)
        }

        await logAuditEvent('donation_completed', {
          donationId: updated.id,
          amount: updated.amount,
          provider: 'paystack',
          transactionId: data.id.toString(),
        })
      }
    } catch (error) {
      console.error('Paystack webhook error:', error)
    }
  }

  res.json({ received: true })
})

export { router as paystackWebhookRoutes }
