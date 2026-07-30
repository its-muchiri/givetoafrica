import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  Heart, Shield, Building2, Check,
  Lock, ChevronDown, Info, Repeat, Zap, Globe, Bitcoin,
} from 'lucide-react'
import {
  cn, CURRENCIES, SUGGESTED_AMOUNTS,
  AFRICAN_COUNTRIES, getPaymentMethods, type PaymentProviderId,
} from '@/lib/utils'
import { categories } from '@/lib/categories'

const donationSchema = z.object({
  amount: z.number().min(5000, 'Minimum donation is $50.00').max(100000000, 'Amount too large'),
  currency: z.string().min(3).max(3),
  isRecurring: z.boolean(),
  campaignId: z.string().optional(),
  donorName: z.string().min(2, 'Name is required'),
  donorEmail: z.string().email('Valid email required'),
  donorCountry: z.string().min(2, 'Country is required'),
  message: z.string().optional(),
  isAnonymous: z.boolean(),
  coverFees: z.boolean(),
  paymentMethod: z.enum(['crypto', 'bank_transfer']),
  provider: z.enum(['nowpayments', 'bank_wire']),
})

type DonationFormData = z.infer<typeof donationSchema>

const campaignList = [
  { id: '', name: 'Where Most Needed (General Fund)' },
  ...categories.map((c) => ({ id: c.slug, name: c.name })),
]

const PROVIDER_ICONS: Record<PaymentProviderId, typeof Heart> = {
  nowpayments: Bitcoin,
  bank_wire: Building2,
}

const BANK_DETAILS = {
  bankName: 'Citibank',
  bankAddress: '111 Wall Street New York, NY 10043 USA',
  routingNumber: '031100209',
  swiftCode: 'CITIUS33',
  accountNumber: '70588190001175255',
  accountType: 'CHECKING',
  beneficiaryName: 'Brock Sherman',
} as const

const PROVIDER_METHOD_MAP: Record<PaymentProviderId, DonationFormData['paymentMethod']> = {
  nowpayments: 'crypto',
  bank_wire: 'bank_transfer',
}

export default function DonatePage() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<'amount' | 'details' | 'payment' | 'processing' | 'success'>('amount')
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [selectedAmount, setSelectedAmount] = useState<number>(5000)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<PaymentProviderId>('nowpayments')
  const {
    register, handleSubmit, watch, setValue, trigger, formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 5000,
      currency: 'USD',
      isRecurring: true,
      campaignId: searchParams.get('campaign') || '',
      donorName: '',
      donorEmail: '',
      donorCountry: '',
      message: '',
      isAnonymous: false,
      coverFees: true,
      paymentMethod: 'crypto',
      provider: 'nowpayments',
    },
  })

  const isRecurring = watch('isRecurring')
  const coverFees = watch('coverFees')

  useEffect(() => {
    const amt = searchParams.get('amount')
    const recurring = searchParams.get('recurring')
    const campaign = searchParams.get('campaign')
    if (amt) { setSelectedAmount(parseInt(amt)); setIsCustom(true); setCustomAmount((parseInt(amt) / 100).toString()); setValue('amount', parseInt(amt)) }
    if (recurring === 'true') setValue('isRecurring', true)
    if (campaign) setValue('campaignId', campaign)
  }, [searchParams, setValue])

  const currency = CURRENCIES.find((c) => c.code === selectedCurrency)!
  const amounts = SUGGESTED_AMOUNTS[selectedCurrency] || [5000, 10000, 25000, 35900, 50000, 70000, 100000]
  const displayAmount = (selectedAmount / 100).toFixed(2)
  const processingFee = coverFees ? Math.ceil(selectedAmount * 0.03) : 0
  const totalAmount = selectedAmount + processingFee
  const availableMethods = getPaymentMethods(isRecurring)

  const getImpactMessage = (amount: number): string => {
    const amt = amount / 100
    if (selectedCurrency === 'USD') {
      if (amt >= 500) return 'Funds a complete classroom with desks and materials'
      if (amt >= 250) return 'Builds a water well serving an entire village'
      if (amt >= 100) return 'Trains 10 community health workers'
      if (amt >= 50) return 'Funds health screenings for 20 community members'
      return 'Provides school supplies for one student for a term'
    }
    return 'Your generosity creates real change'
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setIsCustom(false)
    setCustomAmount('')
    setValue('amount', amount)
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const numVal = parseFloat(value)
    if (!isNaN(numVal) && numVal > 0) {
      const cents = Math.round(numVal * 100)
      setSelectedAmount(cents)
      setValue('amount', cents)
    }
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setSelectedCurrency(newCurrency)
    setValue('currency', newCurrency)
    const newAmounts = SUGGESTED_AMOUNTS[newCurrency]
    if (newAmounts) handleAmountSelect(newAmounts[1])
  }

  const handleProviderSelect = (provider: PaymentProviderId) => {
    setSelectedProvider(provider)
    setValue('provider', provider)
    setValue('paymentMethod', PROVIDER_METHOD_MAP[provider])
  }

  const goToStep = async (target: 'details' | 'payment') => {
    if (target === 'details') setStep('details')
    else if (target === 'payment') {
      const valid = await trigger(['donorName', 'donorEmail', 'donorCountry'])
      if (valid) setStep('payment')
    }
  }

  const processPayment = async (data: DonationFormData) => {
    setStep('processing')
    try {
      const idempotencyKey = `${data.donorEmail}-${data.amount}-${data.isRecurring}`
      const response = await fetch('/api/donations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({ ...data, provider: selectedProvider }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Payment failed')

      if (result.redirectUrl) { window.location.href = result.redirectUrl; return }
      setStep('success')
      toast.success('Thank you for your donation!')
    } catch (err) {
      setStep('payment')
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      toast.error(msg)
    }
  }

  if (step === 'success') {
    return (
      <div className="container-page py-20 text-center">
        <div className="mx-auto max-w-lg">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-sm bg-savanna/10">
              <Check className="h-10 w-10 text-savanna" />
            </div>
          </motion.div>
          <h1 className="mt-8 font-display text-3xl font-medium text-ink">Thank You for Your Generosity</h1>
          <p className="mt-4 text-lg text-ink-soft leading-relaxed">
            Your donation of {currency.symbol}{displayAmount} {isRecurring ? 'every month' : ''} will
            create real, lasting impact.
          </p>
          <div className="mt-6 rounded-sm bg-savanna/8 p-4 text-sm text-savanna ring-1 ring-savanna/20">
            <strong>Impact:</strong> {getImpactMessage(selectedAmount)}
          </div>
          <p className="mt-6 text-sm text-ink-soft">
            A tax-deductible receipt has been sent to your email address.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={() => { setStep('amount'); setSelectedAmount(2500); setIsCustom(false) }} className="btn-primary">
              <Heart className="h-4 w-4" fill="currentColor" strokeWidth={0} /> Donate Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const steps = ['amount', 'details', 'payment'] as const
  const currentIdx = steps.indexOf(step as any)

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container-page">
        <div className="text-center">
          <span className="text-label">Make a Donation</span>
          <h1 className="section-heading mt-3">Your Gift Changes Lives</h1>
          <p className="section-subheading mx-auto">
            100% of your donation goes directly to programs. We cover all operational costs.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-between">
          {['amount', 'details', 'payment'].map((s, i) => {
            const isActive = i <= currentIdx
            return (
              <div key={s} className="flex items-center">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-sm text-xs font-mono font-medium transition-all',
                  isActive ? 'bg-ochre-dark text-white' : 'bg-parchment text-ink-soft'
                )}>
                  {isActive && i < currentIdx ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn('ml-2 text-sm font-medium hidden sm:inline', isActive ? 'text-ink' : 'text-ink-soft')}>
                  {s === 'amount' ? 'Amount' : s === 'details' ? 'Details' : 'Payment'}
                </span>
                  {i < 2 && <div className={cn('mx-3 h-px w-8 sm:w-12', isActive && i < currentIdx ? 'bg-ochre-dark' : 'bg-ink/12')} />}
              </div>
            )
          })}
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-5">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(processPayment)} className="card-static p-8" style={{ boxShadow: '0 4px 24px rgba(42,36,32,0.06)' }}>

              {/* Step 1: Amount */}
              {step === 'amount' && (
                <div className="space-y-6">
                  <div>
                    <label className="label-text">Donation Type</label>
                    <div className="grid grid-cols-2 gap-1 rounded-sm bg-parchment p-1">
                      <button type="button" onClick={() => setValue('isRecurring', true)}
                        className={cn('rounded-sm py-2.5 px-4 text-sm font-medium transition-all',
                          isRecurring ? 'bg-white text-ochre-dark shadow-sm ring-1 ring-ink/8' : 'text-ink-soft hover:text-ink')}>
                        <Repeat className="mr-1 inline h-4 w-4" /> Monthly
                      </button>
                      <button type="button" onClick={() => setValue('isRecurring', false)}
                        className={cn('rounded-sm py-2.5 px-4 text-sm font-medium transition-all',
                          !isRecurring ? 'bg-white text-ochre-dark shadow-sm ring-1 ring-ink/8' : 'text-ink-soft hover:text-ink')}>
                        One-time
                      </button>
                    </div>
                    {isRecurring && (
                      <p className="mt-2 text-2xs text-savanna font-medium">
                        Monthly donors provide 3x more impact over time. You can cancel anytime.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label-text">Currency</label>
                    <div className="relative">
                      <select value={selectedCurrency} onChange={(e) => handleCurrencyChange(e.target.value)}
                        className="input-field appearance-none pr-10">
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Select Amount</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {amounts.map((amount) => (
                        <motion.button key={amount} type="button" onClick={() => handleAmountSelect(amount)}
                          whileTap={{ scale: 0.97 }}
                          className={cn(
                            'relative rounded-sm p-3.5 text-center transition-all',
                            !isCustom && selectedAmount === amount
                              ? 'bg-ochre-dark/10 text-ochre-dark ring-2 ring-ochre-dark'
                              : 'bg-white text-ink ring-1 ring-ink/12 hover:ring-ochre/40 hover:scale-[1.02]'
                          )}
                          style={{ transitionDuration: 'var(--duration-micro)', transitionTimingFunction: 'var(--ease-signature)' }}>
                          {isCustom && selectedAmount === amount && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                               className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ochre-dark">
                              <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                          <span className="mono-number font-mono text-lg font-medium">
                            {currency.symbol}{(amount / 100).toFixed(amount % 100 === 0 ? 0 : 2)}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                    <div className="mt-2 relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft font-mono text-sm">{currency.symbol}</span>
                      <input type="number" placeholder="Custom amount (min $50)" value={customAmount}
                        onFocus={() => setIsCustom(true)}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className={cn('input-field pl-8 font-mono', isCustom && 'border-ochre ring-2 ring-ochre/10')} min="50" step="0.01" />
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Direct My Donation To</label>
                    <div className="relative">
                      <select {...register('campaignId')} className="input-field appearance-none pr-10">
                        {campaignList.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                    </div>
                  </div>

                  <button type="button" onClick={() => goToStep('details')} className="btn-primary w-full py-4 text-base">
                    Continue to Details
                  </button>
                </div>
              )}

              {/* Step 2: Donor Details */}
              {step === 'details' && (
                <div className="space-y-5">
                  <button type="button" onClick={() => setStep('amount')} className="text-sm text-ochre-dark hover:text-ochre-dark font-medium">&larr; Back to amount</button>
                  <div>
                    <label className="label-text">Full Name *</label>
                    <input {...register('donorName')} className="input-field" placeholder="Your full name" />
                    {errors.donorName && <p className="mt-1 text-2xs text-error">{errors.donorName.message}</p>}
                  </div>
                  <div>
                    <label className="label-text">Email Address *</label>
                    <input {...register('donorEmail')} type="email" className="input-field" placeholder="you@example.com" />
                    {errors.donorEmail && <p className="mt-1 text-2xs text-error">{errors.donorEmail.message}</p>}
                  </div>
                  <div>
                    <label className="label-text">Country *</label>
                    <div className="relative">
                      <select {...register('donorCountry')} className="input-field appearance-none pr-10">
                        <option value="">Select your country</option>
                        <optgroup label="African Countries">{AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}</optgroup>
                        <optgroup label="International">
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Australia">Australia</option>
                          <option value="Other">Other</option>
                        </optgroup>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                    </div>
                    {errors.donorCountry && <p className="mt-1 text-2xs text-error">{errors.donorCountry.message}</p>}
                  </div>
                  <div>
                    <label className="label-text">Message (optional)</label>
                    <textarea {...register('message')} rows={3} className="input-field resize-none" placeholder="Leave a note..." />
                  </div>
                  <label className="flex items-center gap-3 rounded-sm p-3 cursor-pointer ring-1 ring-ink/12">
                    <input type="checkbox" {...register('isAnonymous')} className="h-4 w-4 rounded-sm border-ink/20 text-ochre-dark focus:ring-ochre-dark" />
                    <div>
                      <div className="text-sm font-medium text-ink">Donate Anonymously</div>
                      <div className="text-2xs text-ink-soft">Your name won't be publicly displayed</div>
                    </div>
                  </label>
                  <button type="button" onClick={() => goToStep('payment')} className="btn-primary w-full py-4 text-base">
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 'payment' && (
                <div className="space-y-5">
                  <button type="button" onClick={() => setStep('details')} className="text-sm text-ochre-dark hover:text-ochre-dark font-medium">&larr; Back to details</button>
                  <div>
                    <label className="label-text">Payment Method</label>
                    <div className="space-y-2">
                      {availableMethods.map((method) => {
                        const Icon = PROVIDER_ICONS[method.id]
                        return (
                          <label key={method.id}
                            className={cn('flex items-center gap-4 rounded-sm p-3.5 cursor-pointer transition-all',
                              selectedProvider === method.id ? 'bg-ochre-dark/10 text-ochre-dark ring-2 ring-ochre-dark' : 'bg-white ring-1 ring-ink/12 hover:ring-ink/20')}>
                            <input type="radio" checked={selectedProvider === method.id}
                              onChange={() => handleProviderSelect(method.id)} className="sr-only" />
                            <div className={cn('flex h-9 w-9 items-center justify-center rounded-sm',
                              selectedProvider === method.id ? 'bg-ochre-dark/15 text-ochre-dark' : 'bg-parchment text-ink-soft')}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-ink">{method.label}</div>
                              <div className="text-2xs text-ink-soft">{method.description}</div>
                            </div>
                            <span className="text-2xs font-mono text-ink-soft bg-parchment px-2 py-1 rounded-sm">
                              {method.trustBadge}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                    {isRecurring && (
                      <p className="mt-2 text-2xs text-ink-soft">
                        Recurring donations are only available with cryptocurrency. Choose "One-time" for bank transfers.
                      </p>
                    )}
                  </div>

                  {/* Bank transfer details - shown inline when bank_wire is selected */}
                      {selectedProvider === 'bank_wire' && (
                        <div className="rounded-sm border border-ink/10 bg-white p-5">
                          <h4 className="font-display text-sm font-medium text-ink flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-ochre-dark" /> Bank Transfer Details
                          </h4>
                          <div className="mt-4 grid gap-1.5 text-sm">
                            {[
                              ['Bank', BANK_DETAILS.bankName],
                              ['Address', BANK_DETAILS.bankAddress],
                              ['Beneficiary', BANK_DETAILS.beneficiaryName],
                              ['Account Number', BANK_DETAILS.accountNumber],
                              ['Account Type', BANK_DETAILS.accountType],
                              ['Routing (ABA)', BANK_DETAILS.routingNumber],
                              ['SWIFT Code', BANK_DETAILS.swiftCode],
                            ].map(([label, value]) => (
                              <div key={label} className="flex justify-between gap-4">
                                <span className="text-ink-soft">{label}</span>
                                <span className="mono-number text-right font-medium text-ink">{value}</span>
                              </div>
                            ))}
                          </div>
                          <p className="mt-4 text-2xs text-ink-soft leading-relaxed bg-ochre-dark/5 rounded-sm p-2.5">
                            Use the account number as the reference/memo in your wire transfer.
                            Include your name and email for tracking purposes.
                          </p>
                        </div>
                      )}

                      <label className="flex items-start gap-3 rounded-sm p-3.5 cursor-pointer ring-1 ring-ink/12">
                        <input type="checkbox" {...register('coverFees')} className="mt-0.5 h-4 w-4 rounded-sm border-ink/20 text-ochre-dark focus:ring-ochre-dark" />
                        <div>
                          <div className="text-sm font-medium text-ink">
                            Cover transaction fees (+{currency.symbol}{(processingFee / 100).toFixed(2)})
                          </div>
                          <div className="text-2xs text-ink-soft">
                            This ensures 100% of your donation goes to the cause. ~3% for card processing.
                          </div>
                        </div>
                      </label>

                  <div className="flex items-center justify-center gap-6 py-2">
                    <div className="flex items-center gap-1.5 text-2xs text-ink-soft">
                      <Lock className="h-3 w-3" /> SSL Secured
                    </div>
                    <div className="flex items-center gap-1.5 text-2xs text-ink-soft">
                      <Shield className="h-3 w-3" /> PCI-DSS
                    </div>
                    <div className="flex items-center gap-1.5 text-2xs text-ink-soft">
                      <Zap className="h-3 w-3" /> 256-bit
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 text-base">
                    <Heart className="h-5 w-5 btn-icon" fill="currentColor" strokeWidth={0} />
                    Donate {currency.symbol}{(totalAmount / 100).toFixed(2)}{isRecurring ? ' / month' : ''}
                  </button>
                  <p className="text-center text-2xs text-ink-soft leading-relaxed">
                    By proceeding, you agree to our Terms of Service. Your donation is tax-deductible.
                  </p>
                </div>
              )}

              {step === 'processing' && (
                <div className="flex flex-col items-center py-12">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-parchment border-t-ochre" />
                  <p className="mt-6 text-lg font-medium text-ink">Processing your donation...</p>
                  <p className="mt-2 text-sm text-ink-soft">Please don't close this page.</p>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="card-static bg-indigo p-6 text-white">
                <h3 className="font-display text-base font-medium">Donation Summary</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Amount</span>
                    <span className="mono-number font-medium">{currency.symbol}{displayAmount}</span>
                  </div>
                  {coverFees && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Processing fees</span>
                      <span className="mono-number font-medium">+{currency.symbol}{(processingFee / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between text-base">
                    <span className="font-medium">Total</span>
                    <span className="mono-number font-semibold text-ochre-dark">{currency.symbol}{(totalAmount / 100).toFixed(2)}</span>
                  </div>
                  {isRecurring && (
                    <div className="rounded-sm bg-white/5 p-2 text-center text-2xs text-white/60">
                      Charged monthly. Cancel anytime.
                    </div>
                  )}
                </div>
              </div>

              <div className="card-static p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-savanna/10 text-savanna">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-ink">Your Impact</h4>
                    <p className="mt-1 text-2xs leading-relaxed text-ink-soft">
                      {getImpactMessage(selectedAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-static bg-savanna/5 p-5 ring-1 ring-savanna/15">
                <div className="flex items-start gap-3">
                  <Info className="h-4 w-4 flex-shrink-0 text-savanna mt-0.5" />
                  <div className="text-2xs leading-relaxed text-savanna">
                    <strong>100% goes to programs.</strong> GiveToAfrica covers all 
administrative costs through separate funding.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
