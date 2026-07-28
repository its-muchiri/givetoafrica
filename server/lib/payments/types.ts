import type { Request } from 'express'

export type ProviderId = 'stripe' | 'paypal' | 'nowpayments' | 'bank_wire'

export interface CreatePaymentInput {
  amount: number
  currency: string
  donorEmail: string
  donorName: string
  campaignSlug?: string
  campaignName?: string
  isRecurring: boolean
  idempotencyKey: string
  donationId: string
}

export interface PaymentSession {
  redirectUrl?: string
  clientSecret?: string
  providerTransactionId?: string
  wireReference?: string
  wireDetails?: WireDetails
  status: 'pending' | 'awaiting_payment' | 'redirect'
  metadata?: Record<string, unknown>
}

export interface WireDetails {
  bankName: string
  accountName: string
  accountNumber: string
  iban?: string
  swift: string
  routingNumber?: string
  reference: string
  instructions: string
}

export interface WebhookEvent {
  type: string
  providerTransactionId: string
  status: 'completed' | 'failed' | 'refunded'
  amount: number
  currency: string
  usdAmount?: number
  metadata?: Record<string, unknown>
}

export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  amount: number
  currency: string
}

export interface PaymentProvider {
  id: ProviderId
  createPayment(input: CreatePaymentInput): Promise<PaymentSession>
  verifyWebhook(req: Request): Promise<WebhookEvent | null>
  getStatus(providerTransactionId: string): Promise<PaymentStatus>
}
