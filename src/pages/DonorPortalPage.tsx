import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail, Lock, Shield, CreditCard, Download, Pause, X,
  Heart, Receipt, TrendingUp, Calendar, ArrowRight,
} from 'lucide-react'

const mockDonations = [
  { date: '2026-07-15', amount: 100, campaign: 'Education', status: 'Completed', receiptId: 'RCP-2026-0715' },
  { date: '2026-06-15', amount: 100, campaign: 'Education', status: 'Completed', receiptId: 'RCP-2026-0615' },
  { date: '2026-05-10', amount: 250, campaign: 'Clean Water', status: 'Completed', receiptId: 'RCP-2026-0510' },
  { date: '2026-04-22', amount: 50, campaign: 'Healthcare', status: 'Completed', receiptId: 'RCP-2026-0422' },
  { date: '2026-03-01', amount: 500, campaign: 'General Fund', status: 'Completed', receiptId: 'RCP-2026-0301' },
]

export default function DonorPortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [recurringStatus, setRecurringStatus] = useState<'active' | 'paused'>('active')

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setIsLoggedIn(true)
    }, 1200)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment to-white py-16 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-md">
            <div className="card">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ochre/5 text-ochre ring-1 ring-ochre/8">
                  <Lock className="h-6 w-6" />
                </div>
                <h1 className="mt-6 font-display text-2xl font-medium text-ink">
                  Access Your Donor Portal
                </h1>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  Sign in without a password. We'll send a secure magic link to your email.
                </p>
              </div>

              <form onSubmit={handleSendMagicLink} className="mt-8 space-y-4">
                <div>
                  <label className="label-text">Email Address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full py-3.5"
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Magic Link
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-ink-muted leading-relaxed">
                No password needed. Click the link in your email to access your donor dashboard instantly.
              </p>

              <div className="mt-6 rounded-xl bg-savanna/5 p-4 ring-1 ring-savanna/8">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 flex-shrink-0 text-savanna mt-0.5" />
                  <p className="text-xs leading-relaxed text-savanna-dark">
                    Your data is encrypted and never shared. We use industry-standard security to protect your information and donation history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment to-white py-8 md:py-12">
      <div className="container-page">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-medium text-ink md:text-3xl">
              Welcome back, Sarah
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Manage your donations, view receipts, and track your impact.
            </p>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="btn-outline self-start text-xs"
          >
            Sign Out
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Heart, label: 'Total Donated', value: '$4,250', color: 'text-ochre bg-ochre/5' },
            { icon: TrendingUp, label: 'Active Recurring', value: '$50/mo', color: 'text-savanna bg-savanna/5' },
            { icon: Receipt, label: 'Tax Receipts', value: '12', color: 'text-ochre bg-ochre/5' },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-ink-soft">{stat.label}</div>
                  <div className="font-display text-xl font-medium text-ink">{stat.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Donation History */}
        <div className="mt-8 card overflow-hidden p-0">
          <div className="border-b border-ink/8 px-6 py-4">
            <h2 className="font-display text-lg font-medium text-ink">Donation History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/8 bg-parchment/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/8">
                {mockDonations.map((d) => (
                  <tr key={d.receiptId} className="hover:bg-parchment/50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-ink-soft">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-ink-muted" />
                        {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-ink">${d.amount}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-ink-soft">{d.campaign}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-savanna/5 px-2.5 py-0.5 text-xs font-medium text-savanna-dark ring-1 ring-savanna/8">
                        {d.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button className="inline-flex items-center gap-1 text-xs font-medium text-ochre hover:text-ochre-dark">
                        <Download className="h-3.5 w-3.5" />
                        Download Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Manage Recurring */}
          <div className="card">
            <h2 className="font-display text-lg font-medium text-ink">Manage Recurring Donation</h2>
            <div className="mt-4 rounded-xl border border-ink/8 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-ink">$50/month</div>
                  <div className="text-xs text-ink-soft">Education Programs</div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                  recurringStatus === 'active'
                    ? 'bg-savanna/5 text-savanna-dark ring-savanna/8'
                    : 'bg-ink/8 text-ink-soft ring-ink/12'
                }`}>
                  {recurringStatus === 'active' ? 'Active' : 'Paused'}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setRecurringStatus(recurringStatus === 'active' ? 'paused' : 'active')}
                  className="btn-outline flex-1 py-2 text-xs"
                >
                  <Pause className="h-3.5 w-3.5" />
                  {recurringStatus === 'active' ? 'Pause' : 'Resume'}
                </button>
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition-all hover:bg-red-50">
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Update Payment Method */}
          <div className="card">
            <h2 className="font-display text-lg font-medium text-ink">Update Payment Method</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Your current card ending in ****4242 is on file.
            </p>
            <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="label-text">Card Number</label>
                <div className="relative">
                  <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="input-field pl-10"
                    maxLength={19}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-text">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="input-field" maxLength={5} />
                </div>
                <div>
                  <label className="label-text">CVC</label>
                  <input type="text" placeholder="123" className="input-field" maxLength={4} />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3">
                <ArrowRight className="h-4 w-4" />
                Update Card
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
