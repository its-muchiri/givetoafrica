import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

interface CauseArticleCtaProps {
  slug: string
  name: string
  raisedAmount: number
  goalAmount: number
  variant?: 'mid-article' | 'end-of-article'
  heroImage?: string
}

export function CauseArticleCta({ slug, name, raisedAmount, goalAmount, variant = 'mid-article', heroImage }: CauseArticleCtaProps) {
  const progress = Math.round((raisedAmount / goalAmount) * 100)

  if (variant === 'end-of-article') {
    return (
      <section className="relative overflow-hidden rounded-lg bg-indigo py-12 text-white">
        {heroImage && (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
            <div className="absolute inset-0 bg-indigo/85" />
          </>
        )}
        <div className="relative text-center">
          <h3 className="font-display text-2xl font-medium">Support {name}</h3>
          <p className="mx-auto mt-2 max-w-md text-white/80 text-sm leading-relaxed">
            Your donation goes directly to programmes that are already working.
            Every dollar creates measurable, lasting impact.
          </p>
          <div className="mx-auto mt-4 flex max-w-xs items-center gap-2 text-sm">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-white/60">
                <span>${(raisedAmount / 1000).toFixed(0)}K raised</span>
                <span>{progress}% of goal</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-ochre" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
          <Link
            to={`/donate?campaign=${slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded bg-white px-8 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-parchment"
          >
            <Heart className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            Donate to {name}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="rounded-lg bg-ochre-dark/5 p-6 ring-1 ring-ochre-dark/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-base font-medium text-ink">Support {name}</h3>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="mono-number font-medium text-ochre-dark">${(raisedAmount / 1000).toFixed(0)}K raised</span>
            <span className="text-ink-soft">{progress}% of {formatAmount(goalAmount)} goal</span>
          </div>
          <div className="mt-2 h-2 w-48 max-w-full overflow-hidden rounded-full bg-ochre-dark/10">
            <div className="h-full rounded-full bg-ochre-dark" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Link
          to={`/donate?campaign=${slug}`}
          className="inline-flex items-center gap-2 rounded bg-ochre-dark px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-ochre-dark whitespace-nowrap"
        >
          <Heart className="h-4 w-4" fill="currentColor" strokeWidth={0} />
          Donate Now
        </Link>
      </div>
    </div>
  )
}

function formatAmount(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount}`
}

export default CauseArticleCta
