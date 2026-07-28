const BANK_ACCOUNTS = {
    USD: {
        bankName: 'JPMorgan Chase Bank',
        accountName: 'GiveToAfrica Foundation',
        accountNumber: '4460-8921-0001',
        swift: 'CHASUS33',
        routingNumber: '021000021',
        currency: 'USD',
        instructions: 'Include the reference code in your transfer memo. Wire transfers typically take 1-3 business days to arrive.',
    },
    EUR: {
        bankName: 'Deutsche Bank',
        accountName: 'GiveDirectly Foundation',
        accountNumber: 'DE89 3704 0044 0532 0130 00',
        iban: 'DE89370400440532013000',
        swift: 'COBADEFFXXX',
        currency: 'EUR',
        instructions: 'Include the reference code in your transfer memo. SEPA transfers take 1-2 business days.',
    },
    GBP: {
        bankName: 'Barclays Bank',
        accountName: 'GiveDirectly Foundation',
        accountNumber: '2045 6789 0123',
        swift: 'BARCGB22',
        routingNumber: '20-45-67',
        currency: 'GBP',
        instructions: 'Include the reference code in your transfer memo. UK transfers typically arrive same day.',
    },
    KES: {
        bankName: 'Equity Bank Kenya',
        accountName: 'GiveToAfrica Foundation KE',
        accountNumber: '012-001-998-765-432',
        swift: 'EQBLKENA',
        currency: 'KES',
        instructions: 'Include the reference code in your transfer memo. M-Pesa to bank transfers are also accepted.',
    },
};
function generateWireReference() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ref = 'DTA-';
    for (let i = 0; i < 10; i++) {
        ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ref;
}
export function getWireDetails(currency) {
    const config = BANK_ACCOUNTS[currency.toUpperCase()] || BANK_ACCOUNTS['USD'];
    const reference = generateWireReference();
    return {
        bankName: config.bankName,
        accountName: config.accountName,
        accountNumber: config.accountNumber,
        iban: config.iban,
        swift: config.swift,
        routingNumber: config.routingNumber,
        reference,
        instructions: config.instructions,
    };
}
export const bankWireProvider = {
    id: 'bank_wire',
    async createPayment(input) {
        const wireDetails = getWireDetails(input.currency);
        return {
            status: 'awaiting_payment',
            wireReference: wireDetails.reference,
            wireDetails,
            metadata: {
                donationId: input.donationId,
                idempotencyKey: input.idempotencyKey,
            },
        };
    },
    async verifyWebhook(_req) {
        return null;
    },
    async getStatus(_providerTransactionId) {
        return { status: 'pending', amount: 0, currency: 'USD' };
    },
};
