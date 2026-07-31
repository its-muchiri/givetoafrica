import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendReceiptEmail, sendMagicLinkEmail, sendWelcomeEmail, sendNewsletterDigestEmail } from '../email.js'

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null }),
      }
    },
  }
})

describe('email', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_test_key'
    process.env.EMAIL_FROM = 'test@givetoafrica.net'
    process.env.VITE_APP_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('sendReceiptEmail', () => {
    it('sends receipt email with correct data', async () => {
      await expect(
        sendReceiptEmail({
          to: 'donor@example.com',
          donorName: 'John Doe',
          amount: 10000,
          currency: 'USD',
          receiptNumber: 'GF-260728-ABC123',
          campaignName: 'Clean Water',
          isRecurring: false,
        })
      ).resolves.not.toThrow()
    })

    it('handles recurring donations', async () => {
      await expect(
        sendReceiptEmail({
          to: 'donor@example.com',
          donorName: 'Jane Doe',
          amount: 5000,
          currency: 'USD',
          receiptNumber: 'GF-260728-DEF456',
          isRecurring: true,
        })
      ).resolves.not.toThrow()
    })
  })

  describe('sendMagicLinkEmail', () => {
    it('sends magic link email', async () => {
      await expect(
        sendMagicLinkEmail('user@example.com', 'test-token-123')
      ).resolves.not.toThrow()
    })
  })

  describe('sendWelcomeEmail', () => {
    it('sends welcome email', async () => {
      await expect(
        sendWelcomeEmail('newuser@example.com', 'John')
      ).resolves.not.toThrow()
    })
  })

  describe('sendNewsletterDigestEmail', () => {
    it('sends newsletter digest email', async () => {
      await expect(
        sendNewsletterDigestEmail('subscriber@example.com', 'Monthly Impact Update', 'Here are the latest updates from our work across Africa.')
      ).resolves.not.toThrow()
    })
  })
})
