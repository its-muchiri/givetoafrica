import { describe, it, expect } from 'vitest'
import { bankWireProvider, getWireDetails } from '../bank-wire.js'
import { nowpaymentsProvider } from '../nowpayments.js'
import { stripeProvider } from '../stripe.js'
import { paypalProvider } from '../paypal.js'

describe('bankWireProvider', () => {
  it('has correct id', () => {
    expect(bankWireProvider.id).toBe('bank_wire')
  })

  it('creates payment with wire details', async () => {
    const result = await bankWireProvider.createPayment({
      amount: 10000,
      currency: 'USD',
      donorEmail: 'test@example.com',
      donorName: 'Test User',
      isRecurring: false,
      idempotencyKey: 'test-key',
      donationId: 'test-donation-id',
    })

    expect(result.status).toBe('awaiting_payment')
    expect(result.wireDetails).toBeDefined()
    expect(result.wireDetails?.bankName).toBeDefined()
    expect(result.wireDetails?.accountNumber).toBeDefined()
    expect(result.wireDetails?.swift).toBeDefined()
    expect(result.wireReference).toMatch(/^DTA-[A-Z0-9]{10}$/)
    expect(result.wireDetails?.instructions).toBeDefined()
  })

  it('returns null for webhook verification', async () => {
    const result = await bankWireProvider.verifyWebhook({} as any)
    expect(result).toBeNull()
  })

  it('returns pending status', async () => {
    const result = await bankWireProvider.getStatus('test-id')
    expect(result.status).toBe('pending')
  })
})

describe('getWireDetails', () => {
  it('returns USD details for USD currency', () => {
    const details = getWireDetails('USD')
    expect(details.bankName).toBe('JPMorgan Chase Bank')
    expect(details.swift).toBe('CHASUS33')
    expect(details.reference).toMatch(/^DTA-[A-Z0-9]{10}$/)
  })

  it('returns EUR details for EUR currency', () => {
    const details = getWireDetails('EUR')
    expect(details.bankName).toBe('Deutsche Bank')
    expect(details.iban).toBeDefined()
    expect(details.swift).toBe('COBADEFFXXX')
  })

  it('returns GBP details for GBP currency', () => {
    const details = getWireDetails('GBP')
    expect(details.bankName).toBe('Barclays Bank')
    expect(details.swift).toBe('BARCGB22')
  })

  it('returns KES details for KES currency', () => {
    const details = getWireDetails('KES')
    expect(details.bankName).toBe('Equity Bank Kenya')
    expect(details.swift).toBe('EQBLKENA')
  })

  it('falls back to USD for unknown currency', () => {
    const details = getWireDetails('XYZ')
    expect(details.bankName).toBe('JPMorgan Chase Bank')
  })

  it('generates unique references', () => {
    const ref1 = getWireDetails('USD').reference
    const ref2 = getWireDetails('USD').reference
    expect(ref1).not.toBe(ref2)
  })
})

describe('nowpaymentsProvider', () => {
  it('has correct id', () => {
    expect(nowpaymentsProvider.id).toBe('nowpayments')
  })

  it('returns null for webhook with no secret', async () => {
    process.env.NOWPAYMENTS_IPN_SECRET = ''
    const result = await nowpaymentsProvider.verifyWebhook({
      headers: {},
      body: {},
    } as any)
    expect(result).toBeNull()
  })

  it('returns null for webhook with no signature', async () => {
    process.env.NOWPAYMENTS_IPN_SECRET = 'test-secret'
    const result = await nowpaymentsProvider.verifyWebhook({
      headers: {},
      body: {},
    } as any)
    expect(result).toBeNull()
  })
})

describe('stripeProvider', () => {
  it('has correct id', () => {
    expect(stripeProvider.id).toBe('stripe')
  })
})

describe('paypalProvider', () => {
  it('has correct id', () => {
    expect(paypalProvider.id).toBe('paypal')
  })
})
