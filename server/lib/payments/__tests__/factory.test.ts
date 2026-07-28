import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPaymentProvider, isSupportedProvider, getAvailableProviders } from '../index'

describe('Payment Provider Factory', () => {
  it('returns all available providers', () => {
    const providers = getAvailableProviders()
    expect(providers).toContain('stripe')
    expect(providers).toContain('paypal')
    expect(providers).toContain('nowpayments')
    expect(providers).toContain('bank_wire')
    expect(providers).toHaveLength(4)
  })

  it('identifies supported providers', () => {
    expect(isSupportedProvider('stripe')).toBe(true)
    expect(isSupportedProvider('paypal')).toBe(true)
    expect(isSupportedProvider('nowpayments')).toBe(true)
    expect(isSupportedProvider('bank_wire')).toBe(true)
  })

  it('identifies unsupported providers', () => {
    expect(isSupportedProvider('flutterwave')).toBe(false)
    expect(isSupportedProvider('paystack')).toBe(false)
    expect(isSupportedProvider('')).toBe(false)
  })

  it('gets provider by id', () => {
    const stripe = getPaymentProvider('stripe')
    expect(stripe.id).toBe('stripe')
    expect(stripe.createPayment).toBeDefined()
    expect(stripe.verifyWebhook).toBeDefined()
    expect(stripe.getStatus).toBeDefined()
  })

  it('throws for unknown provider', () => {
    expect(() => getPaymentProvider('unknown' as any)).toThrow('Unknown payment provider')
  })
})
