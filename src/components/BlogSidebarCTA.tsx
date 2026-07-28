import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import ImpactGrid from '@/components/ImpactGrid'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function SidebarContent() {
  const { count, ref } = useCountUp(2450000)

  return (
    <>
      <ImpactGrid cols={6} rows={3} className="mx-auto" />

      <h3 className="mt-5 font-display text-lg font-medium text-ink">
        Support Our Work Across Africa
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Every donation funds education, clean water, healthcare, and food security for
        communities that need it most. Join us in building a brighter future.
      </p>

      <div className="mt-4 rounded bg-indigo px-4 py-3 text-center">
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/60">
          Total Funds Raised
        </p>
        <span ref={ref} className="mono-number block text-2xl font-semibold text-white">
          {formatter.format(count)}
        </span>
      </div>

      <Link to="/donate" className="btn-primary mt-5 w-full">
        <Heart className="h-4 w-4" fill="currentColor" strokeWidth={0} />
        Donate Now
      </Link>
    </>
  )
}

export default function BlogSidebarCTA() {
  return (
    <>
      {/* Desktop — sticky sidebar */}
      <div className="hidden lg:block">
        <div className="card-static sticky top-24">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile — inline card */}
      <div className="mt-8 lg:hidden">
        <div className="card-static">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}
