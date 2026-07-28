import axios from 'axios';
let _accessToken = null;
let _tokenExpiry = 0;
async function getAccessToken() {
    if (_accessToken && Date.now() < _tokenExpiry)
        return _accessToken;
    const resp = await axios.post('https://api-m.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
        auth: {
            username: process.env.PAYPAL_CLIENT_ID || '',
            password: process.env.PAYPAL_CLIENT_SECRET || '',
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    _accessToken = resp.data.access_token;
    _tokenExpiry = Date.now() + (resp.data.expires_in - 60) * 1000;
    return _accessToken;
}
function paypalApi(base) {
    return axios.create({
        baseURL: base,
        headers: { 'Content-Type': 'application/json' },
    });
}
export const paypalProvider = {
    id: 'paypal',
    async createPayment(input) {
        const token = await getAccessToken();
        const appUrl = process.env.VITE_APP_URL || 'http://localhost:3000';
        const paypalApiBase = process.env.PAYPAL_MODE === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
        if (input.isRecurring) {
            const api = paypalApi(paypalApiBase);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const productResp = await api.post('/v1/catalogs/products', {
                name: input.campaignName || 'GiveToAfrica',
                description: 'Monthly recurring donation',
                type: 'SERVICE',
                category: 'CHARITY',
            });
            const productId = productResp.data.id;
            const planResp = await api.post('/v1/billing/plans', {
                product_id: productId,
                name: `${input.campaignName || 'General'} - Monthly`,
                description: 'Monthly recurring donation',
                billing_cycles: [{
                        frequency: { interval_unit: 'MONTH', interval_count: 1 },
                        tenure_type: 'REGULAR',
                        pricing_scheme: { fixed_price: { value: (input.amount / 100).toFixed(2), currency_code: input.currency } },
                    }],
                payment_preferences: { auto_bill_outstanding: true },
            });
            const planId = planResp.data.id;
            const subResp = await api.post('/v1/billing/subscriptions', {
                plan_id: planId,
                subscriber: { email_address: input.donorEmail },
                application_context: {
                    brand_name: 'GiveToAfrica',
                    return_url: `${appUrl}/donate/success?provider=paypal`,
                    cancel_url: `${appUrl}/donate?cancelled=true`,
                },
            });
            return {
                redirectUrl: subResp.data.links.find((l) => l.rel === 'approve')?.href,
                providerTransactionId: subResp.data.id,
                status: 'redirect',
                metadata: { subscriptionId: subResp.data.id },
            };
        }
        const api = paypalApi(paypalApiBase);
        const orderResp = await api.post('/v2/checkout/orders', {
            intent: 'CAPTURE',
            purchase_units: [{
                    amount: {
                        currency_code: input.currency,
                        value: (input.amount / 100).toFixed(2),
                    },
                    description: `Donation to ${input.campaignName || 'GiveToAfrica'}`,
                    custom_id: input.donationId,
                }],
            application_context: {
                brand_name: 'GiveToAfrica',
                return_url: `${appUrl}/donate/success?provider=paypal`,
                cancel_url: `${appUrl}/donate?cancelled=true`,
            },
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return {
            redirectUrl: orderResp.data.links.find((l) => l.rel === 'approve')?.href,
            providerTransactionId: orderResp.data.id,
            status: 'redirect',
        };
    },
    async verifyWebhook(req) {
        const webhookId = process.env.PAYPAL_WEBHOOK_ID;
        const transmissionId = req.headers['paypal-transmission-id'];
        const timestamp = req.headers['paypal-transmission-time'];
        const webhookEvent = req.headers['paypal-transmission-sig'];
        const body = req.body.toString();
        if (!webhookId)
            return null;
        try {
            const token = await getAccessToken();
            const paypalApiBase = process.env.PAYPAL_MODE === 'live'
                ? 'https://api-m.paypal.com'
                : 'https://api-m.sandbox.paypal.com';
            const resp = await axios.post(`${paypalApiBase}/v1/notifications/verify-webhook-signature`, {
                auth_algo: req.headers['paypal-auth-algo'],
                cert_id: req.headers['paypal-cert-id'],
                transmission_id: transmissionId,
                transmission_sig: webhookEvent,
                transmission_time: timestamp,
                webhook_id: webhookId,
                webhook_event: JSON.parse(body),
            }, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (resp.data.verification_status !== 'SUCCESS')
                return null;
            const event = JSON.parse(body);
            const eventType = event.event_type;
            const resource = event.resource;
            switch (eventType) {
                case 'PAYMENT.CAPTURE.COMPLETED':
                    return {
                        type: eventType,
                        providerTransactionId: resource.id,
                        status: 'completed',
                        amount: Math.round(parseFloat(resource.amount.value) * 100),
                        currency: resource.amount.currency_code,
                        metadata: { orderId: resource.custom_id },
                    };
                case 'PAYMENT.CAPTURE.DENIED':
                    return {
                        type: eventType,
                        providerTransactionId: resource.id,
                        status: 'failed',
                        amount: Math.round(parseFloat(resource.amount.value) * 100),
                        currency: resource.amount.currency_code,
                    };
                case 'BILLING.SUBSCRIPTION.CANCELLED':
                case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
                    return {
                        type: eventType,
                        providerTransactionId: resource.id,
                        status: 'failed',
                        amount: 0,
                        currency: 'USD',
                        metadata: { subscriptionId: resource.id },
                    };
                default:
                    return null;
            }
        }
        catch {
            return null;
        }
    },
    async getStatus(providerTransactionId) {
        try {
            const token = await getAccessToken();
            const paypalApiBase = process.env.PAYPAL_MODE === 'live'
                ? 'https://api-m.paypal.com'
                : 'https://api-m.sandbox.paypal.com';
            const resp = await axios.get(`${paypalApiBase}/v2/checkout/orders/${providerTransactionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const status = resp.data.status;
            return {
                status: status === 'COMPLETED' ? 'completed' : status === 'APPROVED' ? 'pending' : 'failed',
                amount: Math.round(parseFloat(resp.data.purchase_units[0]?.amount?.value || '0') * 100),
                currency: resp.data.purchase_units[0]?.amount?.currency_code || 'USD',
            };
        }
        catch {
            return { status: 'pending', amount: 0, currency: 'USD' };
        }
    },
};
