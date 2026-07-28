import type { PaymentProvider, ProviderId } from './types'
import { stripeProvider } from './stripe'
import { paypalProvider } from './paypal'
import { nowpaymentsProvider } from './nowpayments'
import { bankWireProvider } from './bank-wire'

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

export { stripeProvider } from './stripe'
export { paypalProvider } from './paypal'
export { nowpaymentsProvider } from './nowpayments'
export { bankWireProvider } from './bank-wire'
export type { PaymentProvider, ProviderId, CreatePaymentInput, PaymentSession, WebhookEvent, PaymentStatus } from './types'
