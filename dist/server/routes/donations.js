import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { createDonationSchema } from '../lib/validation.js';
import { logAuditEvent } from '../lib/audit.js';
import { sendWelcomeEmail } from '../lib/email.js';
import { getPaymentProvider, isSupportedProvider } from '../lib/payments/index.js';
const router = Router();
const prisma = new PrismaClient();
// Create a donation
router.post('/create', async (req, res) => {
    try {
        const validation = createDonationSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid input', details: validation.error.flatten() });
        }
        const data = validation.data;
        if (!isSupportedProvider(data.provider)) {
            return res.status(400).json({ error: 'Unsupported payment provider' });
        }
        // Idempotency check
        const idempotencyKey = req.headers['idempotency-key'] || `${data.donorEmail}-${data.amount}-${Date.now()}`;
        const existingDonation = await prisma.donation.findUnique({ where: { idempotencyKey } });
        if (existingDonation) {
            return res.json({ donationId: existingDonation.id, redirectUrl: existingDonation.metadata?.redirectUrl });
        }
        // Find or create donor
        let donor = await prisma.donor.findUnique({ where: { email: data.donorEmail } });
        let isNewDonor = false;
        if (!donor) {
            donor = await prisma.donor.create({
                data: {
                    name: data.donorName,
                    email: data.donorEmail,
                    country: data.donorCountry,
                    isAnonymous: data.isAnonymous,
                },
            });
            isNewDonor = true;
        }
        // Compute USD equivalent (simplified — providers report actual in webhooks)
        const usdAmount = data.currency === 'USD' ? data.amount : Math.round(data.amount * getExchangeRate(data.currency));
        // Resolve campaign
        let campaignId;
        let campaignName;
        if (data.campaignId && data.campaignId !== '') {
            const campaign = await prisma.campaign.findFirst({
                where: { OR: [{ id: data.campaignId }, { slug: data.campaignId }] },
            });
            if (campaign) {
                campaignId = campaign.id;
                campaignName = campaign.title;
            }
        }
        // Create pending donation
        const donation = await prisma.donation.create({
            data: {
                amount: data.amount,
                currency: data.currency,
                usdAmount,
                status: 'pending',
                paymentProvider: data.provider,
                isRecurring: data.isRecurring,
                coverFees: data.coverFees,
                processingFee: data.coverFees ? Math.ceil(data.amount * 0.03) : 0,
                isAnonymous: data.isAnonymous,
                message: data.message,
                idempotencyKey,
                donorId: donor.id,
                campaignId,
            },
        });
        // Dispatch to provider
        const provider = getPaymentProvider(data.provider);
        const session = await provider.createPayment({
            amount: data.amount,
            currency: data.currency,
            donorEmail: data.donorEmail,
            donorName: data.donorName,
            campaignSlug: data.campaignId || undefined,
            campaignName,
            isRecurring: data.isRecurring,
            idempotencyKey,
            donationId: donation.id,
        });
        // Update donation with provider details
        const metadataUpdate = session.metadata || {};
        if (session.redirectUrl) {
            metadataUpdate.redirectUrl = session.redirectUrl;
        }
        const updateData = {
            metadata: metadataUpdate,
        };
        if (session.providerTransactionId) {
            updateData.providerTransactionId = session.providerTransactionId;
        }
        if (session.wireReference) {
            updateData.wireReference = session.wireReference;
            updateData.status = 'pending_wire';
        }
        await prisma.donation.update({ where: { id: donation.id }, data: updateData });
        // For bank wire, send email with wire details
        if (data.provider === 'bank_wire' && session.wireDetails) {
            try {
                await sendWireDetailsEmail({
                    to: data.donorEmail,
                    donorName: data.donorName,
                    amount: data.amount,
                    currency: data.currency,
                    wireDetails: session.wireDetails,
                    campaignName,
                });
            }
            catch (emailError) {
                console.error('Failed to send wire details email:', emailError);
            }
        }
        // Send welcome email to new donors
        if (isNewDonor) {
            try {
                await sendWelcomeEmail(data.donorEmail, data.donorName);
            }
            catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
            }
        }
        await logAuditEvent('donation_created', {
            donationId: donation.id,
            amount: data.amount,
            currency: data.currency,
            provider: data.provider,
        }, req.ip, req.headers['user-agent']);
        res.json({
            donationId: donation.id,
            redirectUrl: session.redirectUrl,
            wireDetails: session.wireDetails,
            wireReference: session.wireReference,
            status: session.status,
        });
    }
    catch (error) {
        console.error('Donation creation error:', error);
        res.status(500).json({ error: 'Failed to create donation' });
    }
});
// Get donation by ID
router.get('/:id', async (req, res) => {
    try {
        const donation = await prisma.donation.findUnique({
            where: { id: req.params.id },
            include: { campaign: true, receipt: true },
        });
        if (!donation)
            return res.status(404).json({ error: 'Donation not found' });
        res.json(donation);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch donation' });
    }
});
function getExchangeRate(currency) {
    const rates = {
        USD: 1,
        EUR: 1.08,
        GBP: 1.27,
        KES: 0.0077,
        NGN: 0.00065,
        GHS: 0.083,
        ZAR: 0.055,
        UGX: 0.00027,
        TZS: 0.00039,
    };
    return rates[currency] || 1;
}
async function sendWireDetailsEmail(params) {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: params.currency }).format(params.amount / 100);
    await resend.emails.send({
        from: process.env.EMAIL_FROM || 'donations@donatetoafrica.org',
        to: params.to,
        subject: `Wire Transfer Instructions — ${formattedAmount} Donation`,
        html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7A5A15;">Wire Transfer Instructions</h1>
        <p>Thank you, ${params.donorName}! Please complete your wire transfer using the details below.</p>
        <div style="background: #F6EEDD; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top:0;">Bank Details</h3>
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #5B5248;">Bank</td><td style="text-align: right; font-weight: 600;">${params.wireDetails.bankName}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B5248;">Account Name</td><td style="text-align: right; font-weight: 600;">${params.wireDetails.accountName}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B5248;">Account Number</td><td style="text-align: right; font-weight: 600;">${params.wireDetails.accountNumber}</td></tr>
            ${params.wireDetails.iban ? `<tr><td style="padding: 6px 0; color: #5B5248;">IBAN</td><td style="text-align: right; font-weight: 600;">${params.wireDetails.iban}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #5B5248;">SWIFT/BIC</td><td style="text-align: right; font-weight: 600;">${params.wireDetails.swift}</td></tr>
            ${params.wireDetails.routingNumber ? `<tr><td style="padding: 6px 0; color: #5B5248;">Routing Number</td><td style="text-align: right; font-weight: 600;">${params.wireDetails.routingNumber}</td></tr>` : ''}
          </table>
          <div style="margin-top: 16px; padding: 12px; background: white; border-radius: 4px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #5B5248;">Your unique reference code:</p>
            <p style="margin: 4px 0 0; font-size: 20px; font-weight: 700; color: #7A5A15; letter-spacing: 2px;">${params.wireDetails.reference}</p>
          </div>
        </div>
        <p style="font-size: 14px; color: #5B5248;"><strong>Important:</strong> ${params.wireDetails.instructions}</p>
        <p style="font-size: 14px; color: #5B5248;">Amount: <strong>${formattedAmount}</strong>${params.campaignName ? `<br>Campaign: <strong>${params.campaignName}</strong>` : ''}</p>
        <p style="font-size: 12px; color: #8A827A; margin-top: 30px;">GiveToAfrica Foundation · 123 Impact Avenue, Washington DC 20001</p>
      </body>
      </html>
    `,
    });
}
export { router as donationRoutes };
