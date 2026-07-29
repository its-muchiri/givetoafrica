import Stripe from 'stripe';
let _stripe = null;
function getStripe() {
    if (!_stripe) {
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
            apiVersion: '2024-04-10',
            typescript: true,
        });
    }
    return _stripe;
}
export const stripeProvider = {
    id: 'stripe',
    async createPayment(input) {
        const stripe = getStripe();
        const appUrl = process.env.VITE_APP_URL || 'http://localhost:3000';
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
        });
        return {
            redirectUrl: session.url || undefined,
            providerTransactionId: session.payment_intent || session.subscription || session.id,
            status: 'redirect',
            metadata: { sessionId: session.id },
        };
    },
    async verifyWebhook(req) {
        const sig = req.headers['stripe-signature'];
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!sig || !secret)
            return null;
        let event;
        try {
            event = getStripe().webhooks.constructEvent(req.body, sig, secret);
        }
        catch {
            return null;
        }
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const pi = event.data.object;
                return {
                    type: event.type,
                    providerTransactionId: pi.id,
                    status: 'completed',
                    amount: pi.amount,
                    currency: pi.currency.toUpperCase(),
                    metadata: pi.metadata,
                };
            }
            case 'payment_intent.payment_failed': {
                const pi = event.data.object;
                return {
                    type: event.type,
                    providerTransactionId: pi.id,
                    status: 'failed',
                    amount: pi.amount,
                    currency: pi.currency.toUpperCase(),
                    metadata: pi.metadata,
                };
            }
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                return {
                    type: event.type,
                    providerTransactionId: invoice.payment_intent || invoice.id,
                    status: 'completed',
                    amount: invoice.amount_paid,
                    currency: invoice.currency.toUpperCase(),
                    metadata: { subscriptionId: invoice.subscription },
                };
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                return {
                    type: event.type,
                    providerTransactionId: invoice.payment_intent || invoice.id,
                    status: 'failed',
                    amount: invoice.amount_due,
                    currency: invoice.currency.toUpperCase(),
                    metadata: { subscriptionId: invoice.subscription },
                };
            }
            case 'customer.subscription.deleted': {
                const sub = event.data.object;
                return {
                    type: event.type,
                    providerTransactionId: sub.id,
                    status: 'failed',
                    amount: 0,
                    currency: sub.items.data[0]?.price.currency?.toUpperCase() || 'USD',
                    metadata: { subscriptionId: sub.id },
                };
            }
            default:
                return null;
        }
    },
    async getStatus(providerTransactionId) {
        const stripe = getStripe();
        try {
            const pi = await stripe.paymentIntents.retrieve(providerTransactionId);
            return {
                status: pi.status === 'succeeded' ? 'completed' : pi.status === 'requires_payment_method' ? 'failed' : 'pending',
                amount: pi.amount,
                currency: pi.currency.toUpperCase(),
            };
        }
        catch {
            return { status: 'pending', amount: 0, currency: 'USD' };
        }
    },
};
