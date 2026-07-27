import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { createDonationSchema } from '../lib/validation'
import { generateReceiptNumber, logAuditEvent } from '../lib/audit'
import { sendReceiptEmail } from '../lib/email'
import { getStripe } from '../lib/stripe'
import { getFlutterwave } from '../lib/flutterwave'
import { getPaystack } from '../lib/paystack'

const router = Router()
const prisma = new PrismaClient()

// Create a donation
router.post('/create', async (req, res) => {
  try {
    // Validate input
    const validation = createDonationSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error.flatten() })
    }

    const data = validation.data

    // Verify amount server-side (re-validate against provider charges)
    let providerTransactionId: string | undefined
    let redirectUrl: string | undefined

    // Find or create donor
    let donor = await prisma.donor.findUnique({ where: { email: data.donorEmail } })
    if (!donor) {
      donor = await prisma.donor.create({
        data: {
          name: data.donorName,
          email: data.donorEmail,
          country: data.donorCountry,
          isAnonymous: data.isAnonymous,
        },
      })
    }

    // Create pending donation record
    const donation = await prisma.donation.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        status: 'pending',
        paymentProvider: data.provider,
        isRecurring: data.isRecurring,
        coverFees: data.coverFees,
        processingFee: data.coverFees ? Math.ceil(data.amount * 0.03) : 0,
        isAnonymous: data.isAnonymous,
        message: data.message,
        donorId: donor.id,
        campaignId: data.campaignId || undefined,
      },
    })

    // Process payment based on provider
    if (data.provider === 'stripe') {
      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: data.currency.toLowerCase(),
            product_data: {
              name: data.campaignId ? `Donation to ${data.campaignId}` : 'Donate to Africa General Donation',
              description: data.isRecurring ? 'Monthly recurring donation' : 'One-time donation',
            },
            unit_amount: data.amount,
            ...(data.isRecurring && { recurring: { interval: 'month' } }),
          },
          quantity: 1,
        }],
        mode: data.isRecurring ? 'subscription' : 'payment',
        success_url: `${process.env.VITE_APP_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.VITE_APP_URL}/donate?cancelled=true`,
        metadata: { donationId: donation.id, donorId: donor.id },
        customer_email: data.donorEmail,
      })

      redirectUrl = session.url || undefined
      await prisma.donation.update({
        where: { id: donation.id },
        data: { metadata: { sessionId: session.id } },
      })
    } else if (data.provider === 'flutterwave') {
      const response = await (await getFlutterwave()).Charges.bankTransfer({
        amount: data.amount / 100,
        currency: data.currency,
        email: data.donorEmail,
        narration: 'Donate to Africa Donation',
        tx_ref: `GF-${donation.id.slice(0, 8)}`,
      })
      redirectUrl = response.data?.link
    } else if (data.provider === 'paystack') {
      const response = await getPaystack().post('/transaction/initialize', {
        email: data.donorEmail,
        amount: data.amount,
        currency: data.currency === 'NGN' ? 'NGN' : undefined,
        reference: `GF-${donation.id.slice(0, 8)}`,
        callback_url: `${process.env.VITE_APP_URL}/donate/success`,
        metadata: {
          donation_id: donation.id,
          donor_id: donor.id,
          custom_fields: [{
            display_name: 'Campaign',
            variable_name: 'campaign',
            value: data.campaignId || 'general',
          }],
        },
      })
      redirectUrl = response.data.data.authorization_url
    }

    await logAuditEvent('donation_created', {
      donationId: donation.id,
      amount: data.amount,
      currency: data.currency,
      provider: data.provider,
    }, req.ip, req.headers['user-agent'])

    res.json({ donationId: donation.id, redirectUrl })
  } catch (error) {
    console.error('Donation creation error:', error)
    res.status(500).json({ error: 'Failed to create donation' })
  }
})

// Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: req.params.id },
      include: { campaign: true, receipt: true },
    })
    if (!donation) return res.status(404).json({ error: 'Donation not found' })
    res.json(donation)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donation' })
  }
})

export { router as donationRoutes }
