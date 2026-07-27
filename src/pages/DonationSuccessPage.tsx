import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Heart, Share2, Facebook, Twitter } from 'lucide-react'
import ImpactGrid from '@/components/ImpactGrid'

export default function DonationSuccessPage() {
  const [searchParams] = useSearchParams()
  const amount = searchParams.get('amount') || '25.00'
  const currency = searchParams.get('currency') || 'USD'

  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          {/* Impact Grid fires once */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <ImpactGrid cols={8} rows={5} regionShape="clustered" />
          </motion.div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-sm bg-savanna/10"
          >
            <Check className="h-10 w-10 text-savanna" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-display text-3xl font-medium text-ink"
          >
            Thank You for Your Generosity
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-lg text-ink-soft leading-relaxed"
          >
            Your donation of <span className="mono-number font-medium text-ink">${amount}</span> will create real, lasting impact in communities across Africa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 rounded-sm bg-savanna/8 p-4 text-sm text-savanna ring-1 ring-savanna/20"
          >
            A tax-deductible receipt has been sent to your email address.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link to="/donate" className="btn-primary">
              <Heart className="h-4 w-4 btn-icon" fill="currentColor" strokeWidth={0} /> Donate Again
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'I just donated to Donate to Africa!', url: window.location.origin })
                }
              }}
              className="btn-outline"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
            <Link to="/" className="btn-outline">Return Home</Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
