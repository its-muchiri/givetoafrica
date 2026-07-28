import type { PaymentProvider, ProviderId } from './types.js';
export declare function getPaymentProvider(id: ProviderId): PaymentProvider;
export declare function isSupportedProvider(id: string): id is ProviderId;
export declare function getAvailableProviders(): ProviderId[];
export { stripeProvider } from './stripe.js';
export { paypalProvider } from './paypal.js';
export { nowpaymentsProvider } from './nowpayments.js';
export { bankWireProvider } from './bank-wire.js';
export type { PaymentProvider, ProviderId, CreatePaymentInput, PaymentSession, WebhookEvent, PaymentStatus } from './types.js';
