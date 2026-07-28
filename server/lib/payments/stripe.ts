import Stripe from 'stripe'
import type { Request } from 'express'
import type { PaymentProvider, CreatePaymentInput, PaymentSession, WebhookEvent, PaymentStatus } from './types.js'

let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2024-04-10',
      typescript: true,
    })
  }
  return _stripe
}

export const stripeProvider: PaymentProvider = {
  id: 'stripe',

  async createPayment(input: CreatePaymentInput): Promise<PaymentSession> {
    const stripe = getStripe()
    const appUrl = process.env.VITE_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: input.currency.toLowerCase(),
          product_data: {
            name: input.campaignName ? `Donation to ${input.campaignName}` : 'GiveToAfrica General Donation',
            description: input.isRecurring ? 'Monthly recurring donation' : 'One-time donation',
          },
          unit_amount: input.amount,
          ...(input.isRecurring && { recurring: { interval: 'month' } }),
        },
        quantity: 1,
      }],
      mode: input.isRecurring ? 'subscription' : 'payment',
      success_url: `${appUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/donate?cancelled=true`,
      metadata: {
        donationId: input.donationId,
        idempotencyKey: input.idempotencyKey,
      },
      customer_email: input.donorEmail,
    })

    return {
      redirectUrl: session.url || undefined,
      providerTransactionId: session.payment_intent as string || session.subscription as string || session.id,
      status: 'redirect',
      metadata: { sessionId: session.id },
    }
  },

  async verifyWebhook(req: Request): Promise<WebhookEvent | null> {
    const sig = req.headers['stripe-signature'] as string
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!sig || !secret) return null

    let event: Stripe.Event
    try {
      event = getStripe().webhooks.constructEvent(req.body, sig, secret)
    } catch {
      return null
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        return {
          type: event.type,
          providerTransactionId: pi.id,
          status: 'completed',
          amount: pi.amount,
          currency: pi.currency.toUpperCase(),
          metadata: pi.metadata as Record<string, string>,
        }
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        return {
          type: event.type,
          providerTransactionId: pi.id,
          status: 'failed',
          amount: pi.amount,
          currency: pi.currency.toUpperCase(),
          metadata: pi.metadata as Record<string, string>,
        }
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        return {
          type: event.type,
          providerTransactionId: invoice.payment_intent as string || invoice.id,
          status: 'completed',
          amount: invoice.amount_paid,
          currency: invoice.currency.toUpperCase(),
          metadata: { subscriptionId: invoice.subscription as string },
        }
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        return {
          type: event.type,
          providerTransactionId: invoice.payment_intent as string || invoice.id,
          status: 'failed',
          amount: invoice.amount_due,
          currency: invoice.currency.toUpperCase(),
          metadata: { subscriptionId: invoice.subscription as string },
        }
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        return {
          type: event.type,
          providerTransactionId: sub.id,
          status: 'failed',
          amount: 0,
          currency: sub.items.data[0]?.price.currency?.toUpperCase() || 'USD',
          metadata: { subscriptionId: sub.id },
        }
      }
      default:
        return null
    }
  },

  async getStatus(providerTransactionId: string): Promise<PaymentStatus> {
    const stripe = getStripe()
    try {
      const pi = await stripe.paymentIntents.retrieve(providerTransactionId)
      return {
        status: pi.status === 'succeeded' ? 'completed' : pi.status === 'requires_payment_method' ? 'failed' : 'pending',
        amount: pi.amount,
        currency: pi.currency.toUpperCase(),
      }
    } catch {
      return { status: 'pending', amount: 0, currency: 'USD' }
    }
  },
}
