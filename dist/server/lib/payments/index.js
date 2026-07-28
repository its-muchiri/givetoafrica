import { stripeProvider } from './stripe.js';
import { paypalProvider } from './paypal.js';
import { nowpaymentsProvider } from './nowpayments.js';
import { bankWireProvider } from './bank-wire.js';
const providers = {
    stripe: stripeProvider,
    paypal: paypalProvider,
    nowpayments: nowpaymentsProvider,
    bank_wire: bankWireProvider,
};
export function getPaymentProvider(id) {
    const provider = providers[id];
    if (!provider)
        throw new Error(`Unknown payment provider: ${id}`);
    return provider;
}
export function isSupportedProvider(id) {
    return id in providers;
}
export function getAvailableProviders() {
    return Object.keys(providers);
}
export { stripeProvider } from './stripe.js';
export { paypalProvider } from './paypal.js';
export { nowpaymentsProvider } from './nowpayments.js';
export { bankWireProvider } from './bank-wire.js';
