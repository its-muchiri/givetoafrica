import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '@/components/Seo'
import { categories } from '@/lib/categories'
import { images, causeImages } from '@/lib/images'

const allCountries = Array.from(new Set(categories.flatMap((c) => c.countries))).sort()

export default function CharitiesPage() {
  return (
    <>
      <Seo
        title="28 Ways to Change Lives — GiveToAfrica"
        description="Browse 28 causes across Africa. Support education, clean water, healthcare, food security, and more. Every donation creates measurable impact."
        url="/charities"
      />
      <CharitiesContent />
    </>
  )
}

function CharitiesContent() {
  const [selectedCountry, setSelectedCountry] = useState('All')

  const filtered = selectedCountry === 'All'
    ? categories
    : categories.filter((c) => c.countries.includes(selectedCountry))

  return (
    <>
      <section className="relative overflow-hidden bg-indigo py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${images.heroes.causes})` }} />
        <div className="absolute inset-0 bg-indigo/85" />
        <div className="container-page relative">
          <span className="text-label text-ochre-light">Our Work</span>
          <h1 className="mt-4 font-display text-4xl font-medium md:text-5xl lg:text-6xl">
            {categories.length} Ways to <span className="text-transparent bg-clip-text bg-gradient-to-r from-ochre-light to-ochre">Change Lives</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            From aged care to wildlife protection, every cause represents a real need and a proven path to impact.
            Choose the cause that matters most to you.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCountry('All')}
              className={`rounded px-4 py-2 text-sm font-medium transition-all ${
                selectedCountry === 'All'
                  ? 'bg-ochre text-white'
                  : 'bg-parchment text-ink-soft hover:text-ink'
              }`}
            >
              All Countries
            </button>
            {allCountries.map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`rounded px-4 py-2 text-sm font-medium transition-all ${
                  selectedCountry === country
                    ? 'bg-ochre text-white'
                    : 'bg-parchment text-ink-soft hover:text-ink'
                }`}
              >
                {country}
              </button>
            ))}
          </div>

          <div className="mt-6 text-sm text-ink-soft">
            Showing {filtered.length} of {categories.length} causes
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((cat, i) => {
              const progress = Math.round((cat.raisedAmount / cat.goalAmount) * 100)
              const Icon = cat.icon
              const img = causeImages[cat.slug]
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.5) }}
                >
                  <Link
                    to={`/charities/${cat.slug}`}
                    className="card group flex h-full flex-col overflow-hidden"
                  >
                    {img && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={img}
                          alt={cat.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className={`absolute bottom-3 left-3 inline-flex rounded p-1.5 ${cat.bgColor} ${cat.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-display text-base font-medium text-ink group-hover:text-ochre-dark transition-colors">
                        {cat.name}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-ink-soft line-clamp-2">
                        {cat.tagline}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {cat.countries.slice(0, 3).map((c) => (
                          <span key={c} className="rounded bg-parchment px-1.5 py-0.5 text-[10px] font-medium text-ink-soft">
                            {c}
                          </span>
                        ))}
                        {cat.countries.length > 3 && (
                          <span className="rounded bg-parchment px-1.5 py-0.5 text-[10px] text-ink-soft">
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
                            className="h-full rounded-full bg-ochre transition-all duration-700"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-ink-soft">No causes match your country filter.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-ochre-dark to-ochre-dark py-16 text-center">
        <div className="container-page">
          <h2 className="font-display text-3xl font-medium md:text-4xl text-white">
            Can't Find What You're Looking For?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/80">
            Donate to the General Fund and we'll direct your gift to where it's needed most across all {categories.length} causes.
          </p>
          <Link to="/donate" className="mt-6 inline-flex items-center gap-2 rounded bg-white px-8 py-4 text-sm font-bold text-ink shadow-lg transition-all hover:bg-parchment">
            Donate to General Fund
          </Link>
        </div>
      </section>
    </>
  )
}
