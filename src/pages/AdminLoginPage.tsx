import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Mail, ArrowRight, Check, AlertCircle } from 'lucide-react'

type Step = 'email' | 'sent' | 'verifying'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<Step>('email')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  // Auto-verify if token is in URL
  useState(() => {
    if (token) {
      setStep('verifying')
      verifyToken(token)
    }
  })

  async function verifyToken(verifyToken: string) {
    try {
      const res = await fetch(`/api/auth/verify?token=${verifyToken}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Verification failed')
        setStep('email')
        return
      }

      if (data.role !== 'admin') {
        setError('This magic link is for admin access only.')
        setStep('email')
        return
      }

      // Store session
      localStorage.setItem('admin_session', JSON.stringify(data))
      navigate('/admin')
    } catch {
      setError('Network error. Please try again.')
      setStep('email')
    }
  }

  async function handleRequestMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStep('sent')
    setError('')

    try {
      const res = await fetch('/api/auth/admin/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to send magic link')
        setStep('email')
      }
    } catch {
      setError('Network error. Please try again.')
      setStep('email')
    }
  }

  if (step === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo to-night flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-amber" />
          <p className="mt-4 text-white/70">Verifying your magic link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo to-night flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber/10 ring-1 ring-amber/20">
              <Shield className="h-8 w-8 text-amber" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-medium text-white">
              Admin Access
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Sign in with a magic link. No password required.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleRequestMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@givedirectly.org"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber py-3 text-sm font-semibold text-night hover:bg-amber-light transition-colors"
              >
                Send Magic Link
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 mb-4">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="text-lg font-medium text-white">Check your inbox</h2>
              <p className="mt-2 text-sm text-white/60">
                We sent a magic link to <span className="text-white font-medium">{email}</span>
              </p>
              <p className="mt-1 text-xs text-white/40">
                The link expires in 15 minutes.
              </p>
              <button
                onClick={() => { setStep('email'); setError(''); }}
                className="mt-6 text-sm text-amber hover:text-amber-light transition-colors"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          Only pre-authorized admin emails can access this portal.
        </p>
      </motion.div>
    </div>
  )
}
