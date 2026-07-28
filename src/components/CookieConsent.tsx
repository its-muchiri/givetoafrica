import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
  }

  const reject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6" role="dialog" aria-label="Cookie consent">
      <div className="mx-auto max-w-2xl rounded-2xl border border-ink/12 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-ink">We respect your privacy</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              We use essential cookies to make our site work. With your consent, we may also use
              analytics cookies to improve your experience. You can accept all cookies or choose
              only essential ones. See our{' '}
              <a href="/privacy#cookies" className="underline hover:text-ochre-dark">
                Cookie Policy
              </a>{' '}
              for details. GDPR &amp; POPIA compliant.
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="rounded-lg p-1 text-ink-soft hover:text-ink"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button onClick={reject} className="btn-outline text-xs">
            Essential Only
          </button>
          <button onClick={accept} className="btn-primary text-xs">
            Accept All Cookies
          </button>
        </div>
      </div>
    </div>
  )
}
