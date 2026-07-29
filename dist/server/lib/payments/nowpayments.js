import axios from 'axios';
import crypto from 'crypto';
function nowpaymentsApi() {
    return axios.create({
        baseURL: 'https://api.nowpayments.io/v1',
        headers: {
            'x-api-key': process.env.NOWPAYMENTS_API_KEY || '',
            'Content-Type': 'application/json',
        },
    });
}
export const nowpaymentsProvider = {
    id: 'nowpayments',
    async createPayment(input) {
        const api = nowpaymentsApi();
        const resp = await api.post('/invoice', {
            price_amount: input.amount / 100,
            price_currency: input.currency.toLowerCase(),
            order_id: input.donationId,
            order_description: `Donation to ${input.campaignName || 'GiveToAfrica'}`,
        });
        const data = resp.data;
        return {
            redirectUrl: data.invoice_url,
            providerTransactionId: data.id?.toString() || data.invoice_id?.toString(),
            status: 'redirect',
            metadata: {
                invoiceId: data.id,
                payAddress: data.pay_address,
                payAmount: data.pay_amount,
                payCurrency: data.pay_currency,
            },
        };
    },
    async verifyWebhook(req) {
        const secret = process.env.NOWPAYMENTS_IPN_SECRET;
        if (!secret)
            return null;
        const sig = req.headers['x-nowpayments-sig'];
        if (!sig)
            return null;
        const sortedKeys = Object.keys(req.body).sort();
        const sortedBody = {};
        for (const key of sortedKeys) {
            sortedBody[key] = req.body[key];
        }
        const hmac = crypto.createHmac('sha512', secret).update(JSON.stringify(sortedBody)).digest('hex');
        if (hmac !== sig)
            return null;
        const { payment_status, payment_id, pay_address, price_amount, price_currency, pay_amount, pay_currency } = req.body;
        let status = 'failed';
        if (payment_status === 'finished')
            status = 'completed';
        return {
            type: 'ipn',
            providerTransactionId: payment_id?.toString(),
            status,
            amount: Math.round((price_amount || 0) * 100),
            currency: (price_currency || 'USD').toUpperCase(),
            usdAmount: Math.round((price_amount || 0) * 100),
            metadata: {
                payAddress: pay_address,
                payAmount: pay_amount,
                payCurrency: pay_currency,
                paymentStatus: payment_status,
            },
        };
    },
    async getStatus(providerTransactionId) {
        try {
            const api = nowpaymentsApi();
            const resp = await api.get(`/payment/${providerTransactionId}`);
            const data = resp.data;
            return {
                status: data.payment_status === 'finished' ? 'completed' : data.payment_status === 'failed' ? 'failed' : 'pending',
                amount: Math.round((data.price_amount || 0) * 100),
                currency: (data.price_currency || 'USD').toUpperCase(),
            };
        }
        catch {
            return { status: 'pending', amount: 0, currency: 'USD' };
        }
    },
};
