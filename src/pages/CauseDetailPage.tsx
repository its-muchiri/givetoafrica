import { useParams, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Heart, MapPin, ChevronRight, TrendingUp } from 'lucide-react'
import { getCategoryBySlug, categories } from '@/lib/categories'
import { causeImages } from '@/lib/images'
import ImpactGrid from '@/components/ImpactGrid'

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

export default function CauseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const cause = getCategoryBySlug(slug || '')
  const rm = useReducedMotion()

  if (!cause) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="section-heading">Cause Not Found</h1>
        <p className="mt-4 text-ink-soft">The cause you're looking for doesn't exist.</p>
        <Link to="/causes" className="btn-primary mt-6"><ArrowLeft className="h-4 w-4" /> Browse All Causes</Link>
      </div>
    )
  }

  const Icon = cause.icon
  const progress = Math.round((cause.raisedAmount / cause.goalAmount) * 100)
  const causeImage = causeImages[cause.slug]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo py-16 text-white md:py-20">
        {causeImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${causeImage})` }}
            />
            <div className="absolute inset-0 bg-indigo/90" />
          </>
        )}
        <div className="container-page relative">
          <Link to="/causes" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Causes
          </Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm ${cause.bgColor} ${cause.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-medium md:text-4xl">{cause.name}</h1>
                  <p className="mt-2 text-white/70">{cause.tagline}</p>
                </div>
              </div>
              <div className="mt-8">
                <div className="flex items-baseline gap-3">
                  <span className="mono-number font-display text-3xl font-medium">${(cause.raisedAmount / 1000).toFixed(0)}K</span>
                  <span className="text-white/70">of ${(cause.goalAmount / 1000).toFixed(0)}K goal</span>
                  <span className="ml-auto mono-number text-sm font-medium text-ochre-light">{progress}%</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-ochre progress-stripe" />
                </div>
              </div>
              <Link to={`/donate?campaign=${cause.slug}`}
                className="mt-8 inline-flex items-center gap-2 rounded bg-ochre-dark px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-ochre-dark">
                <Heart className="h-4 w-4 btn-icon" fill="currentColor" strokeWidth={0} /> Donate to {cause.name}
              </Link>
            </div>
            {!rm && (
              <div className="hidden lg:flex justify-center">
                <ImpactGrid cols={10} rows={6} regionShape="clustered" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
                <h2 className="font-display text-xl font-medium text-ink">About This Cause</h2>
                {causeImage && (
                  <div className="mt-4 overflow-hidden rounded-sm">
                    <img src={causeImage} alt={cause.name} className="h-56 w-full object-cover" />
                  </div>
                )}
                <p className="mt-4 text-ink-soft leading-relaxed">{cause.description}</p>
              </motion.div>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
                <h2 className="font-display text-xl font-medium text-ink">The Problem</h2>
                <p className="mt-4 text-ink-soft leading-relaxed">{cause.problem}</p>
              </motion.div>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
                <h2 className="font-display text-xl font-medium text-ink">Our Approach</h2>
                <div className="mt-6 space-y-3">
                  {cause.approach.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-sm p-4 ring-1 ring-ink/8">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-sm bg-ochre-dark/10 mono-number text-xs font-medium text-ochre-dark">{i + 1}</div>
                      <p className="text-sm leading-relaxed text-ink-soft">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
                <h2 className="font-display text-xl font-medium text-ink">Where Your Money Goes</h2>
                <div className="mt-6 space-y-4">
                  {cause.budgetAllocation.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink">{item.label}</span>
                        <span className="mono-number font-medium text-ink">{item.pct}%</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-parchment">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full rounded-full ${item.color} progress-stripe`} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="card-static p-5">
                <h3 className="font-display text-base font-medium text-ink">Impact to Date</h3>
                <div className="mt-4 space-y-3">
                  {cause.stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-savanna/10 text-savanna">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="mono-number text-base font-medium text-ink">{stat.value}</div>
                        <div className="text-2xs text-ink-soft">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-static p-5">
                <h3 className="font-display text-base font-medium text-ink">Where We Work</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cause.countries.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 rounded-sm bg-parchment px-2.5 py-1 text-2xs font-medium text-ink-soft">
                      <MapPin className="h-2.5 w-2.5" />{c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card-static bg-ochre-dark p-5 text-white">
                <h3 className="font-display text-base font-medium">Support {cause.name}</h3>
                <p className="mt-2 text-sm text-white/80">Your donation goes directly to programmes helping communities across Africa.</p>
                <Link to={`/donate?campaign=${cause.slug}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-white px-5 py-3 text-sm font-semibold text-ink transition-all hover:bg-parchment">
                  <Heart className="h-4 w-4" fill="currentColor" strokeWidth={0} /> Donate Now
                </Link>
              </div>

              <div className="card-static p-5">
                <h3 className="font-display text-base font-medium text-ink">Other Causes</h3>
                <div className="mt-3 space-y-1">
                  {categories.filter((c) => c.slug !== cause.slug).slice(0, 6).map((c) => {
                    const CIcon = c.icon
                    return (
                      <Link key={c.slug} to={`/blog/category/${c.slug}`}
                        className="flex items-center gap-2.5 rounded-sm p-2 text-sm text-ink-soft transition-colors hover:bg-parchment hover:text-ink">
                        <CIcon className={`h-3.5 w-3.5 flex-shrink-0 ${c.color}`} />
                        <span className="flex-1 truncate">{c.name}</span>
                        <ChevronRight className="h-3 w-3 text-ink-soft" />
                      </Link>
                    )
                  })}
                </div>
                <Link to="/causes" className="mt-3 flex items-center gap-1 text-2xs font-medium text-ochre-dark hover:text-ochre-dark">
                  View all 28 causes <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
