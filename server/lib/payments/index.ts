import type { PaymentProvider, ProviderId } from './types.js'
import { stripeProvider } from './stripe.js'
import { paypalProvider } from './paypal.js'
import { nowpaymentsProvider } from './nowpayments.js'
import { bankWireProvider } from './bank-wire.js'

const providers: Record<ProviderId, PaymentProvider> = {
  stripe: stripeProvider,
  paypal: paypalProvider,
  nowpayments: nowpaymentsProvider,
  bank_wire: bankWireProvider,
}

export function getPaymentProvider(id: ProviderId): PaymentProvider {
  const provider = providers[id]
  if (!provider) throw new Error(`Unknown payment provider: ${id}`)
  return provider
}

export function isSupportedProvider(id: string): id is ProviderId {
  return id in providers
}

export function getAvailableProviders(): ProviderId[] {
  return Object.keys(providers) as ProviderId[]
}

export { stripeProvider } from './stripe.js'
export { paypalProvider } from './paypal.js'
export { nowpaymentsProvider } from './nowpayments.js'
export { bankWireProvider } from './bank-wire.js'
export type { PaymentProvider, ProviderId, CreatePaymentInput, PaymentSession, WebhookEvent, PaymentStatus } from './types.js'
