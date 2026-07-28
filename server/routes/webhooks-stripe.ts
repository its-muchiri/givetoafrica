import { Router } from 'express'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { logAuditEvent, generateReceiptNumber } from '../lib/audit'
import { sendReceiptEmail } from '../lib/email'

const router = Router()
const prisma = new PrismaClient()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10',
})

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const donationId = paymentIntent.metadata.donationId
        if (donationId) {
          const donation = await prisma.donation.update({
            where: { id: donationId },
            data: {
              status: 'completed',
              providerTransactionId: paymentIntent.id,
            },
            include: { donor: true, campaign: true },
          })

          const receipt = await prisma.receipt.create({
            data: {
              receiptNumber: generateReceiptNumber(),
              donationId: donation.id,
              sentAt: new Date(),
            },
          })

          if (donation.campaignId) {
            await prisma.campaign.update({
              where: { id: donation.campaignId },
              data: { raisedAmount: { increment: donation.amount } },
            })
          }

          try {
            await sendReceiptEmail({
              to: donation.donor!.email,
              donorName: donation.donor!.name,
              amount: donation.amount,
              currency: donation.currency,
              receiptNumber: receipt.receiptNumber,
              campaignName: donation.campaign?.title,
              isRecurring: donation.isRecurring,
            })
          } catch (emailError) {
            console.error('Failed to send receipt email:', emailError)
          }

          await logAuditEvent('donation_completed', {
            donationId,
            amount: donation.amount,
            provider: 'stripe',
            transactionId: paymentIntent.id,
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string
        if (subscriptionId) {
          const sub = await prisma.subscription.findFirst({
            where: { providerSubscriptionId: subscriptionId },
          })
          if (sub) {
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { status: 'past_due' },
            })
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subscription.id },
          data: { status: 'canceled' },
        })
        break
      }
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

export { router as stripeWebhookRoutes }
