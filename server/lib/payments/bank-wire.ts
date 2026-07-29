import crypto from 'crypto'
import type { Request } from 'express'
import type { PaymentProvider, CreatePaymentInput, PaymentSession, WebhookEvent, PaymentStatus, WireDetails } from './types.js'

interface BankConfig {
  bankName: string
  accountName: string
  accountNumber: string
  iban?: string
  swift: string
  routingNumber?: string
  currency: string
  instructions: string
}

const BANK_ACCOUNTS: Record<string, BankConfig> = {
  USD: {
    bankName: 'Citibank',
    accountName: 'Brock Sherman',
    accountNumber: '70588190001175255',
    swift: 'CITIUS33',
    routingNumber: '031100209',
    currency: 'USD',
    instructions: 'Include the reference code in your transfer memo. Wire transfers typically take 1-3 business days to arrive.',
  },
  EUR: {
    bankName: 'Banking Circle S.A.',
    accountName: 'Brock Sherman',
    accountNumber: 'LU094080000050960177',
    iban: 'LU094080000050960177',
    swift: 'BCIRLULL',
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
}

function generateWireReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'DTA-'
  for (let i = 0; i < 10; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return ref
}

export function getWireDetails(currency: string): WireDetails {
  const config = BANK_ACCOUNTS[currency.toUpperCase()] || BANK_ACCOUNTS['USD']
  const reference = generateWireReference()
  return {
    bankName: config.bankName,
    accountName: config.accountName,
    accountNumber: config.accountNumber,
    iban: config.iban,
    swift: config.swift,
    routingNumber: config.routingNumber,
    reference,
    instructions: config.instructions,
  }
}

export const bankWireProvider: PaymentProvider = {
  id: 'bank_wire',

  async createPayment(input: CreatePaymentInput): Promise<PaymentSession> {
    const wireDetails = getWireDetails(input.currency)

    return {
      status: 'awaiting_payment',
      wireReference: wireDetails.reference,
      wireDetails,
      metadata: {
        donationId: input.donationId,
        idempotencyKey: input.idempotencyKey,
      },
    }
  },

  async verifyWebhook(_req: Request): Promise<WebhookEvent | null> {
    return null
  },

  async getStatus(_providerTransactionId: string): Promise<PaymentStatus> {
    return { status: 'pending', amount: 0, currency: 'USD' }
  },
}
