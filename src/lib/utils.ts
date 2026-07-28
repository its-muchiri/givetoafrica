import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat(getLocaleForCurrency(currency), {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100)
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

function getLocaleForCurrency(currency: string): string {
  const localeMap: Record<string, string> = {
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    KES: 'en-KE',
    NGN: 'en-NG',
    GHS: 'en-GH',
    ZAR: 'en-ZA',
    UGX: 'en-UG',
    TZS: 'en-TZ',
  }
  return localeMap[currency] || 'en-US'
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', flag: '🇬🇭' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', flag: '🇺🇬' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', flag: '🇹🇿' },
] as const

export const SUGGESTED_AMOUNTS: Record<string, number[]> = {
  USD: [5000, 10000, 25000, 35900, 50000, 70000, 100000],
  EUR: [5000, 10000, 25000, 35900, 50000, 70000, 100000],
  GBP: [4000, 8000, 20000, 28000, 40000, 56000, 80000],
  KES: [650000, 1300000, 3250000, 4640000, 6500000, 9100000, 13000000],
  NGN: [75000, 150000, 375000, 538000, 750000, 1050000, 1500000],
  GHS: [6000, 12000, 30000, 43000, 60000, 84000, 120000],
  ZAR: [900, 1800, 4500, 6460, 9000, 12600, 18000],
  UGX: [185000, 370000, 925000, 1330000, 1850000, 2590000, 3700000],
  TZS: [125000, 250000, 625000, 900000, 1250000, 1750000, 2500000],
}

export const AMOUNT_IMPACT: Record<number, string> = {
  5000: 'Provides school supplies for one student for a term',
  10000: 'Delivers clean water to one family for a month',
  25000: 'Funds a health screening for 20 community members',
  35900: 'Builds a rainwater harvesting system for a school',
  50000: 'Trains a community health worker for six months',
  70000: 'Equips a classroom with desks and learning materials',
  100000: 'Builds a water well serving an entire village',
}

export const AFRICAN_COUNTRIES = [
  'Kenya', 'Nigeria', 'Ghana', 'South Africa', 'Uganda', 'Tanzania',
  'Rwanda', 'Ethiopia', 'Senegal', 'Cameroon', 'Mozambique', 'Zimbabwe',
  'Zambia', 'Malawi', 'Mali', 'Burkina Faso', 'Niger', 'Chad',
  'Somalia', 'Sudan', 'Democratic Republic of Congo', 'Central African Republic',
  'Gabon', 'Congo', 'Benin', 'Togo', 'Sierra Leone', 'Liberia',
  'Guinea', 'Ivory Coast', 'Angola', 'Namibia', 'Botswana', 'Lesotho',
  'Eswatini', 'Madagascar', 'Mauritius', 'Seychelles', 'Cape Verde',
  'Comoros', 'Djibouti', 'Eritrea', 'Gambia', 'Guinea-Bissau',
  'Equatorial Guinea', 'São Tomé and Príncipe', 'Burundi', 'South Sudan',
]

export type PaymentProviderId = 'nowpayments' | 'bank_wire'

export interface PaymentMethod {
  id: PaymentProviderId
  label: string
  description: string
  provider: string
  trustBadge: string
  supportsRecurring: boolean
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'nowpayments',
    label: 'Cryptocurrency',
    description: 'BTC, ETH, USDT, USDC & more — pay with any crypto wallet',
    provider: 'NOWPayments',
    trustBadge: 'Crypto payments',
    supportsRecurring: false,
  },
  {
    id: 'bank_wire',
    label: 'Bank Transfer',
    description: 'Direct wire / SEPA transfer — manual confirmation',
    provider: 'Bank Wire',
    trustBadge: 'Manual transfer',
    supportsRecurring: false,
  },
]

export function getPaymentMethods(_isRecurring: boolean): PaymentMethod[] {
  return PAYMENT_METHODS
}
