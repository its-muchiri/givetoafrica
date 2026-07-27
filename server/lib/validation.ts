import { z } from 'zod'

export const createDonationSchema = z.object({
  amount: z.number().int().min(100).max(100000000),
  currency: z.enum(['USD', 'EUR', 'GBP', 'KES', 'NGN', 'GHS', 'ZAR', 'UGX', 'TZS']),
  isRecurring: z.boolean(),
  campaignId: z.string().uuid().optional().or(z.literal('')),
  donorName: z.string().min(2).max(200),
  donorEmail: z.string().email(),
  donorCountry: z.string().min(2).max(100),
  message: z.string().max(1000).optional(),
  isAnonymous: z.boolean(),
  coverFees: z.boolean(),
  paymentMethod: z.enum(['card', 'mobile_money', 'bank_transfer']),
  provider: z.enum(['stripe', 'flutterwave', 'paystack']),
})

export const createCampaignSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  goalAmount: z.number().int().min(1000),
  currency: z.string().default('USD'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
})

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  mfaCode: z.string().length(6).optional(),
})
