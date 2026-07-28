import { Router } from 'express'
import { PrismaClient, Prisma } from '@prisma/client'
import { logAuditEvent, generateReceiptNumber } from '../lib/audit'
import { sendReceiptEmail } from '../lib/email'
import { nowpaymentsProvider } from '../lib/payments'

const router = Router()
const prisma = new PrismaClient()

router.post('/', async (req, res) => {
  const event = await nowpaymentsProvider.verifyWebhook(req)

  if (!event) {
    return res.status(400).json({ error: 'Invalid webhook' })
  }

  try {
    if (event.status === 'completed') {
      const donation = await prisma.donation.findFirst({
        where: {
          OR: [
            { id: event.metadata?.donationId as string },
            { providerTransactionId: event.providerTransactionId },
          ],
          status: { in: ['pending', 'pending_wire'] },
        },
        include: { donor: true, campaign: true },
      })

      if (donation) {
        const updated = await prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: 'completed',
            providerTransactionId: event.providerTransactionId,
            usdAmount: event.usdAmount || donation.usdAmount,
            metadata: {
              ...((donation.metadata as Record<string, unknown>) || {}),
              payCurrency: event.metadata?.payCurrency,
              payAmount: event.metadata?.payAmount,
            } as Prisma.InputJsonValue,
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
            to: updated.donor!.email,
            donorName: updated.donor!.name,
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
          provider: 'nowpayments',
          transactionId: event.providerTransactionId,
          payCurrency: event.metadata?.payCurrency,
        })
      }
    }

    if (event.status === 'failed') {
      await prisma.donation.updateMany({
        where: { providerTransactionId: event.providerTransactionId },
        data: { status: 'failed' },
      })
    }
  } catch (error) {
    console.error('NOWPayments webhook error:', error)
  }

  res.json({ received: true })
})

export { router as nowpaymentsWebhookRoutes }
