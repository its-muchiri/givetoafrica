import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Filter } from 'lucide-react'
import { categories } from '@/lib/categories'
import { images } from '@/lib/images'

const allTags = Array.from(new Set(categories.flatMap((c) => c.countries)))

export default function CausesPage() {
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('All')

  const filtered = categories.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    const matchesCountry = selectedCountry === 'All' || c.countries.includes(selectedCountry)
    return matchesSearch && matchesCountry
  })

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo py-20 text-white md:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.heroes.causes})` }}
        />
        <div className="absolute inset-0 bg-indigo/85" />
        <div className="container-page relative">
          <span className="text-label text-ochre-light">Our Work</span>
           <h1 className="mt-4 font-display text-4xl font-medium md:text-5xl lg:text-6xl">
            28 Ways to <span className="text-transparent bg-clip-text bg-gradient-to-r from-ochre-light to-ochre">Change Lives</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            From aged care to wildlife protection, every cause represents a real need and a proven path to impact.
            Choose the cause that matters most to you.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Search causes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder-ink-muted backdrop-blur-sm focus:border-ochre focus:outline-none focus:ring-2 focus:ring-ochre/8"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="appearance-none rounded-xl border border-white/10 bg-white/10 py-3 pl-10 pr-8 text-sm text-white backdrop-blur-sm focus:border-ochre focus:outline-none focus:ring-2 focus:ring-ochre/8"
              >
                <option value="All" className="text-ink">All Countries</option>
                {allTags.sort().map((t) => (
                  <option key={t} value={t} className="text-ink">{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="mb-6 text-sm text-ink-soft">
            Showing {filtered.length} of {categories.length} causes
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((cat, i) => {
              const progress = Math.round((cat.raisedAmount / cat.goalAmount) * 100)
              const Icon = cat.icon
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.5) }}
                >
                  <Link
                    to={`/blog/category/${cat.slug}`}
                    className="card group flex h-full flex-col"
                  >
                    <div className={`inline-flex w-fit rounded-xl p-2.5 ring-1 ${cat.bgColor} ${cat.ringColor} ${cat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-display text-base font-medium text-ink group-hover:text-ochre-dark transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft line-clamp-2">
                      {cat.tagline}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {cat.countries.slice(0, 3).map((c) => (
                        <span key={c} className="rounded-md bg-parchment px-1.5 py-0.5 text-[10px] font-medium text-ink-soft">
                          {c}
                        </span>
                      ))}
                      {cat.countries.length > 3 && (
                        <span className="rounded-md bg-parchment px-1.5 py-0.5 text-[10px] text-ink-soft">
                          +{cat.countries.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto pt-4">
                      <div className="flex justify-between text-[11px] font-medium text-ink-soft">
                        <span>${(cat.raisedAmount / 1000).toFixed(0)}K raised</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/8">
                        <div
                          className={`h-full rounded-full ${cat.bgColor.replace('bg-', 'bg-')}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-ink-soft">No causes match your search. Try different keywords.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-ochre-dark to-ochre-dark py-16 text-center">
        <div className="container-page">
          <h2 className="font-display text-3xl font-medium md:text-4xl text-white">
            Can't Find What You're Looking For?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            Donate to the General Fund and we'll direct your gift to where it's needed most across all 28 causes.
          </p>
          <Link to="/donate" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-ink shadow-lg transition-all hover:bg-parchment">
            Donate to General Fund <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
