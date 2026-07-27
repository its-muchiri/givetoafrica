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
  USD: [1000, 2500, 5000, 10000],
  EUR: [1000, 2500, 5000, 10000],
  GBP: [800, 2000, 4000, 8000],
  KES: [100000, 250000, 500000, 1000000],
  NGN: [1500, 3500, 7000, 14000],
  GHS: [1000, 2500, 5000, 10000],
  ZAR: [150, 400, 800, 1600],
  UGX: [3500, 9000, 18000, 36000],
  TZS: [2500, 6000, 12000, 24000],
}

export const AMOUNT_IMPACT: Record<number, string> = {
  1000: 'Provides school supplies for one student for a term',
  2500: 'Delivers clean water to one family for a month',
  5000: 'Funds a health screening for 20 community members',
  10000: 'Builds a water well serving an entire village',
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

export function getPaymentProvider(country: string, currency: string): 'stripe' | 'flutterwave' | 'paystack' {
  if (currency === 'NGN' || country === 'Nigeria') return 'paystack'
  if (['KES', 'GHS', 'UGX', 'TZS'].includes(currency) || AFRICAN_COUNTRIES.includes(country)) return 'flutterwave'
  return 'stripe'
}
