import { useParams, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Heart, MapPin, TrendingUp, ChevronRight } from 'lucide-react'
import { getCategoryBySlug, categories } from '@/lib/categories'
import { causeImages } from '@/lib/images'
import { causeArticles } from '@/data/cause-articles'
import { getBlogCategorySlugs } from '@/lib/blog'
import ImpactGrid from '@/components/ImpactGrid'
import BlogSidebarCTA from '@/components/BlogSidebarCTA'
import CauseArticleCta from '@/components/CauseArticleCta'
import Seo from '@/components/Seo'

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

export default function CharityDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const cause = getCategoryBySlug(slug || '')
  const article = cause ? causeArticles[cause.slug] : undefined
  const rm = useReducedMotion()

  if (!cause || !article) {
    return (
      <>
        <Seo title="Cause Not Found — GiveToAfrica" url={`/charities/${slug}`} />
        <div className="container-page py-20 text-center">
          <h1 className="section-heading">Cause Not Found</h1>
          <p className="mt-4 text-ink-soft">The cause you're looking for doesn't exist.</p>
          <Link to="/charities" className="btn-primary mt-6"><ArrowLeft className="h-4 w-4" /> Browse All Causes</Link>
        </div>
      </>
    )
  }

  const Icon = cause.icon
  const progress = Math.round((cause.raisedAmount / cause.goalAmount) * 100)
  const causeImage = causeImages[cause.slug]
  const url = `/charities/${cause.slug}`

  const relatedCauses = categories
    .filter((c) => c.slug !== cause.slug && c.countries.some((ct) => cause.countries.includes(ct)))
    .slice(0, 3)

  const relatedBlogSlugs = getBlogCategorySlugs()
  const hasRelatedBlog = relatedBlogSlugs.includes(cause.slug)

  return (
    <>
      <Seo
        title={`${cause.name} — GiveToAfrica`}
        description={article.headline || cause.tagline}
        image={causeImage}
        url={url}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo py-16 text-white md:py-20">
        {causeImage && (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${causeImage})` }} />
            <div className="absolute inset-0 bg-indigo/90" />
          </>
        )}
        <div className="container-page relative">
          <Link to="/charities" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Causes
          </Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded ${cause.bgColor} ${cause.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-medium md:text-4xl">{cause.name}</h1>
                  <p className="mt-2 text-white/70 text-lg">{article.headline}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {cause.countries.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
                    <MapPin className="h-3 w-3" />{c}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <div className="flex items-baseline gap-3">
                  <span className="mono-number font-display text-3xl font-medium">${(cause.raisedAmount / 1000).toFixed(0)}K</span>
                  <span className="text-white/70">of ${(cause.goalAmount / 1000).toFixed(0)}K goal</span>
                  <span className="ml-auto mono-number text-sm font-medium text-ochre-light">{progress}%</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-ochre progress-stripe"
                  />
                </div>
              </div>
              <Link
                to={`/donate?campaign=${cause.slug}`}
                className="mt-8 inline-flex items-center gap-2 rounded bg-ochre-dark px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-ochre-dark"
              >
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

      {/* Article Body + Sidebar */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Article */}
            <div className="lg:col-span-2 space-y-10">
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
                <h2 className="font-display text-xl font-medium text-ink">What's your campaign about?</h2>
                {causeImage && (
                  <div className="mt-4 overflow-hidden rounded">
                    <img src={causeImage} alt={cause.name} className="h-64 w-full object-cover" />
                  </div>
                )}
                <div className="mt-6 space-y-5 text-ink-soft leading-relaxed">
                  <p>{cause.problem}</p>
                  <p>{article.bodyWhatFunds}</p>
                  <p>{article.bodyDignity}</p>
                  <p>{article.bodyLocal}</p>
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
                <CauseArticleCta
                  slug={cause.slug}
                  name={cause.name}
                  raisedAmount={cause.raisedAmount}
                  goalAmount={cause.goalAmount}
                  variant="mid-article"
                />
              </motion.div>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
                <h3 className="font-display text-lg font-medium text-ink">Your donation can help support:</h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {article.supportList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 rounded p-2 text-sm text-ink-soft">
                      <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold ${cause.bgColor} ${cause.color}`}>
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
                <h3 className="font-display text-lg font-medium text-ink">Why your support matters</h3>
                <p className="mt-3 text-ink-soft leading-relaxed">{article.whyMatters}</p>
              </motion.div>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
                <CauseArticleCta
                  slug={cause.slug}
                  name={cause.name}
                  raisedAmount={cause.raisedAmount}
                  goalAmount={cause.goalAmount}
                  variant="end-of-article"
                  heroImage={causeImage}
                />
              </motion.div>

              <p className="text-ink-soft leading-relaxed text-lg">{article.closing}</p>

              {relatedCauses.length > 0 && (
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
                  <h3 className="font-display text-lg font-medium text-ink">Related Causes</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {relatedCauses.map((rc) => {
                      const RcIcon = rc.icon
                      return (
                        <Link
                          key={rc.slug}
                          to={`/charities/${rc.slug}`}
                          className="card flex flex-col items-center p-4 text-center transition-all hover:scale-[1.02]"
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded ${rc.bgColor} ${rc.color}`}>
                            <RcIcon className="h-5 w-5" />
                          </div>
                          <h4 className="mt-2 text-sm font-medium text-ink">{rc.name}</h4>
                          <p className="mt-0.5 text-xs text-ink-soft line-clamp-1">{rc.tagline}</p>
                        </Link>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {hasRelatedBlog && (
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
                  <h3 className="font-display text-lg font-medium text-ink">Related Stories</h3>
                  <p className="mt-2 text-sm text-ink-soft">
                    Read more about {cause.name} on our{' '}
                    <Link to={`/blog/category/${cause.slug}`} className="text-ochre-dark hover:underline">
                      blog
                    </Link>.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card-static p-5">
                <h3 className="font-display text-base font-medium text-ink">Impact to Date</h3>
                <div className="mt-4 space-y-3">
                  {cause.stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded bg-savanna/10 text-savanna">
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
                    <span key={c} className="inline-flex items-center gap-1 rounded bg-parchment px-2.5 py-1 text-2xs font-medium text-ink-soft">
                      <MapPin className="h-2.5 w-2.5" />{c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card-static bg-ochre-dark p-5 text-white">
                <h3 className="font-display text-base font-medium">Support {cause.name}</h3>
                <p className="mt-2 text-sm text-white/80">Your donation goes directly to programmes helping communities across Africa.</p>
                <Link
                  to={`/donate?campaign=${cause.slug}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-white px-5 py-3 text-sm font-semibold text-ink transition-all hover:bg-parchment"
                >
                  <Heart className="h-4 w-4" fill="currentColor" strokeWidth={0} /> Donate Now
                </Link>
              </div>

              <div className="card-static p-5">
                <h3 className="font-display text-base font-medium text-ink">Other Causes</h3>
                <div className="mt-3 space-y-1">
                  {categories.filter((c) => c.slug !== cause.slug).slice(0, 6).map((c) => {
                    const CIcon = c.icon
                    return (
                      <Link key={c.slug} to={`/charities/${c.slug}`}
                        className="flex items-center gap-2.5 rounded p-2 text-sm text-ink-soft transition-colors hover:bg-parchment hover:text-ink">
                        <CIcon className={`h-3.5 w-3.5 flex-shrink-0 ${c.color}`} />
                        <span className="flex-1 truncate">{c.name}</span>
                        <ChevronRight className="h-3 w-3 text-ink-soft" />
                      </Link>
                    )
                  })}
                </div>
                <Link to="/charities" className="mt-3 flex items-center gap-1 text-2xs font-medium text-ochre-dark hover:text-ochre-dark">
                  View all {categories.length} causes <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              <BlogSidebarCTA />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
