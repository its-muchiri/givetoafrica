import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { categories } from '@/lib/categories'
import { images } from '@/lib/images'
import { causeImages } from '@/lib/images'
import Seo from '@/components/Seo'

const allTags = Array.from(new Set(categories.flatMap((c) => c.countries)))

export default function CausesPage() {
  return (
    <>
      <Seo
        title="Causes — GiveToAfrica"
        description="Browse 28 causes across Africa. Support education, clean water, healthcare, food security, and more. Every donation creates measurable impact."
        url="/causes"
      />
      <CausesContent />
    </>
  )
}

function CausesContent() {
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('All')

  const filtered = categories.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    const matchesCountry = selectedCountry === 'All' || c.countries.includes(selectedCountry)
    return matchesSearch && matchesCountry
  })

  return (
    <div style={{ background: '#FBF7F1', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28 text-white text-center"
        style={{ background: '#1C1612' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${images.heroes.causes})` }}
        />
        <div className="relative container-page max-w-4xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded mb-4"
            style={{ background: '#E8A317', color: '#1C1612' }}>
            Our Work
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-display-figma)' }}>
            {categories.length} Ways to Change Lives
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            From aged care to wildlife protection, every cause represents a real need and a proven path to impact.
            Choose the cause that matters most to you.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.5)' }} />
              <input
                type="text"
                placeholder="Search causes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:ring-2"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              />
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full sm:w-auto rounded-lg py-3 px-4 text-sm outline-none focus:ring-2 appearance-none cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <option value="All" style={{ color: '#1C1612', background: '#FFFFFF' }}>All Countries</option>
              {allTags.sort().map((t) => (
                <option key={t} value={t} style={{ color: '#1C1612', background: '#FFFFFF' }}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="mb-6 text-sm" style={{ color: '#8A7260' }}>
            Showing {filtered.length} of {categories.length} causes
          </p>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((cat) => {
              const progress = Math.round((cat.raisedAmount / cat.goalAmount) * 100)
              const causeImage = causeImages[cat.slug]
              return (
                <Link
                  key={cat.slug}
                  to={`/causes/${cat.slug}`}
                  className="group rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                  style={{ background: '#FFFFFF', border: '1px solid #DDD0BE' }}
                >
                  <div className="h-40 overflow-hidden bg-amber-900">
                    {causeImage ? (
                      <img
                        src={causeImage}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <cat.icon className="h-10 w-10" style={{ color: 'rgba(255,255,255,0.3)' }} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-base font-semibold leading-snug group-hover:text-orange-700 transition-colors"
                      style={{ fontFamily: 'var(--font-display-figma)', color: '#1C1612' }}
                    >
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed line-clamp-2" style={{ color: '#8A7260' }}>
                      {cat.tagline}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {cat.countries.slice(0, 3).map((c) => (
                        <span key={c} className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                          style={{ background: '#EDE5D8', color: '#5A3E28' }}>
                          {c}
                        </span>
                      ))}
                      {cat.countries.length > 3 && (
                        <span className="rounded px-1.5 py-0.5 text-[10px]" style={{ background: '#EDE5D8', color: '#8A7260' }}>
                          +{cat.countries.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs" style={{ color: '#8A7260' }}>
                        <span>${(cat.raisedAmount / 1000).toFixed(0)}K raised</span>
                        <span className="font-medium" style={{ color: '#C2571A' }}>{progress}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full" style={{ background: '#EDE5D8' }}>
                        <div
                          className="h-1.5 rounded-full cause-progress-fill"
                          style={{ width: `${progress}%`, background: '#C2571A' }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg" style={{ color: '#8A7260' }}>No causes match your search. Try different keywords.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center" style={{ background: '#C2571A' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display-figma)' }}>
            Can't Find What You're Looking For?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Donate to the General Fund and we'll direct your gift to where it's needed most across all {categories.length} causes.
          </p>
          <Link
            to="/donate"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-8 py-4 text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#FFFFFF', color: '#C2571A' }}
          >
            Donate to General Fund →
          </Link>
        </div>
      </section>
    </div>
  )
}