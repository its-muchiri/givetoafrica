import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCategoryBySlug, categories } from '@/lib/categories'
import { causeImages, causeGalleryImages } from '@/lib/images'
import { causeArticles } from '@/data/cause-articles'
import { getPostsByCategory, getPublishedPosts } from '@/lib/blog'
import Seo from '@/components/Seo'

function pct(raised: number, goal: number) {
  return Math.min(100, Math.round((raised / goal) * 100))
}

function ProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const p = pct(raised, goal)
  return (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ color: '#8A7260' }}>
        <span>
          <strong style={{ color: '#C2571A', fontSize: '1rem', fontFamily: 'var(--font-display-figma)' }}>
            ${raised.toLocaleString()}
          </strong>{' '}
          raised
        </span>
        <span>Goal: ${goal.toLocaleString()}</span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ background: '#EDE5D8' }}>
        <div
          className="cause-progress-fill h-2 rounded-full"
          style={{ width: `${p}%`, background: '#C2571A' }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: '#8A7260' }}>
        <span>{p}% funded</span>
        <span>Goal: ${goal.toLocaleString()}</span>
      </div>
    </div>
  )
}

function Breadcrumb({ category }: { category: string }) {
  return (
    <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: '#8A7260' }}>
      <Link to="/" className="hover:underline">Home</Link>
      <span>/</span>
      <Link to="/causes" className="hover:underline">Our Causes</Link>
      <span>/</span>
      <span style={{ color: '#C2571A' }}>{category}</span>
    </nav>
  )
}

function StatsBar({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-4 rounded-lg overflow-hidden my-8" style={{ background: '#C2571A' }}>
      {stats.map((s, i) => (
        <div
          key={i}
          className="text-center py-6 px-4"
          style={{
            borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
          }}
        >
          <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display-figma)' }}>
            {s.value}
          </p>
          <p className="text-xs mt-1 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  )
}

function InlineDonationBlock({ slug, name, raised, goal }: { slug: string; name: string; raised: number; goal: number }) {
  return (
    <div className="my-10 rounded-lg overflow-hidden shadow-sm" style={{ border: '1px solid #DDD0BE' }}>
      <div
        className="px-6 py-5 flex items-center gap-4"
        style={{ background: '#FFF4EE', borderBottom: '1px solid #DDD0BE' }}
      >
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl"
          style={{ background: '#C2571A' }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-semibold leading-tight" style={{ fontFamily: 'var(--font-display-figma)', color: '#1C1612' }}>
            Help fund {name.toLowerCase()}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#8A7260' }}>
            Your donation goes directly to programmes supporting this cause.
          </p>
        </div>
      </div>
      <div className="p-6" style={{ background: '#FFFFFF' }}>
        <div className="mb-5">
          <ProgressBar raised={raised} goal={goal} />
        </div>
        <Link
          to={`/donate?campaign=${slug}`}
          className="w-full py-3 rounded font-semibold text-sm tracking-wide transition-opacity hover:opacity-90 active:scale-95 inline-block text-center"
          style={{ background: '#C2571A', color: '#FFFFFF' }}
        >
          Donate Now
        </Link>
      </div>
    </div>
  )
}

function Gallery({ images, name }: { images: string[]; name: string }) {
  if (!images || images.length === 0) return null
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-8">
      {images.map((img, i) => (
        <div key={i} className="rounded-lg overflow-hidden aspect-[4/3] bg-amber-50">
          <img
            src={img}
            alt={`${name} gallery ${i + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      ))}
    </div>
  )
}

function BlogCarousel({ causeSlug }: { causeSlug: string }) {
  const categoryPosts = getPostsByCategory(causeSlug)
  const fallbackPosts = getPublishedPosts().slice(0, 6)
  const posts = categoryPosts.length > 0 ? categoryPosts : fallbackPosts

  if (posts.length === 0) return null

  const displayPosts = [...posts, ...posts]

  return (
    <section className="py-16 overflow-hidden" style={{ background: '#1C1612' }}>
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#E8A317' }}>
              {categoryPosts.length > 0 ? 'Related Stories' : 'From the field'}
            </p>
            <h2 className="text-3xl leading-tight text-white" style={{ fontFamily: 'var(--font-display-figma)' }}>
              {categoryPosts.length > 0
                ? `Stories About ${categories.find((c) => c.slug === causeSlug)?.name || 'This Cause'}`
                : 'Latest Stories & Updates'}
            </h2>
          </div>
          <Link
            to="/blog"
            className="text-sm font-medium pb-0.5 border-b transition-colors"
            style={{ color: '#EDE5D8', borderColor: '#8A7260' }}
          >
            View all stories →
          </Link>
        </div>
      </div>
      <div className="cause-carousel-track">
        {displayPosts.map((post, i) => (
          <Link
            key={`${post.slug}-${i}`}
            to={`/blog/${post.slug}`}
            className="flex-shrink-0 w-80 mx-3 rounded-lg overflow-hidden cursor-pointer group"
            style={{ background: '#27211A' }}
          >
            <div className="relative overflow-hidden h-48">
              <img
                src={post.featuredImage?.src || post.secondaryImage?.src || 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=500&h=340&fit=crop&auto=format'}
                alt={post.featuredImage?.alt || post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span
                className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded"
                style={{ background: '#C2571A', color: '#fff' }}
              >
                {post.categoryName}
              </span>
            </div>
            <div className="p-5">
              <p className="text-xs mb-2" style={{ color: '#8A7260' }}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <h3
                className="text-base font-semibold leading-snug mb-2 text-white group-hover:text-amber-300 transition-colors"
                style={{ fontFamily: 'var(--font-display-figma)' }}
              >
                {post.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: '#8A7260' }}>
                {post.metaDescription.slice(0, 120)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function SidebarDonation({ cause }: { cause: NonNullable<ReturnType<typeof getCategoryBySlug>> }) {
  return (
    <aside
      className="sticky top-24 rounded-lg overflow-hidden shadow-md"
      style={{ background: '#FFFFFF', border: '1px solid #DDD0BE' }}
    >
      <div className="px-5 py-4 text-white" style={{ background: '#C2571A' }}>
        <p className="text-xs font-medium tracking-widest uppercase opacity-80 mb-1">
          Support this cause
        </p>
        <p className="text-lg leading-snug" style={{ fontFamily: 'var(--font-display-figma)' }}>
          {cause.name}
        </p>
      </div>
      <div className="p-5">
        <ProgressBar raised={cause.raisedAmount} goal={cause.goalAmount} />
        <div className="mt-4">
          <Link
            to={`/donate?campaign=${cause.slug}`}
            className="w-full py-3 rounded font-semibold text-sm tracking-wide transition-opacity hover:opacity-90 active:scale-95 inline-block text-center"
            style={{ background: '#C2571A', color: '#FFFFFF' }}
          >
            Donate Now
          </Link>
        </div>
      </div>
      <div
        className="px-5 py-3 text-center text-xs"
        style={{ borderTop: '1px solid #EDE5D8', color: '#8A7260' }}
      >
        Give to Africa is a registered charity · EIN 00-0000000
      </div>
    </aside>
  )
}

export default function CauseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const cause = getCategoryBySlug(slug || '')
  const article = cause ? causeArticles[cause.slug] : undefined
  const causeImage = cause ? causeImages[cause.slug] : undefined

  if (!cause) {
    return (
      <>
        <Seo title="Cause Not Found — GiveToAfrica" url={`/causes/${slug}`} />
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4" style={{ background: '#FBF7F1', minHeight: '60vh' }}>
          <h1 className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-display-figma)', color: '#1C1612' }}>Cause Not Found</h1>
          <p style={{ color: '#8A7260' }}>The cause you're looking for doesn't exist.</p>
          <Link to="/causes" className="px-6 py-3 rounded text-sm font-semibold" style={{ background: '#C2571A', color: '#FFFFFF' }}>
            Browse All Causes
          </Link>
        </div>
      </>
    )
  }

  const url = `/causes/${cause.slug}`

  const relatedCauses = categories
    .filter((c) => c.slug !== cause.slug && c.countries.some((ct) => cause.countries.includes(ct)))
    .slice(0, 3)

  return (
    <>
      <Seo
        title={`${cause.name} — GiveToAfrica`}
        description={cause.tagline || cause.description?.slice(0, 160)}
        image={causeImage}
        url={url}
      />

      <div style={{ background: '#FBF7F1', minHeight: '100vh' }}>
        {/* Hero */}
        <div className="relative w-full h-80 md:h-[440px] overflow-hidden bg-amber-900">
          {causeImage && (
            <img
              src={causeImage}
              alt={cause.name}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.55)' }}
            />
          )}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
            <span
              className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded mb-4 self-start"
              style={{ background: '#E8A317', color: '#1C1612' }}
            >
              {cause.name}
            </span>
            <h1
              className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-2xl"
              style={{ fontFamily: 'var(--font-display-figma)' }}
            >
              {cause.name}
            </h1>
            <p className="mt-3 text-base md:text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {cause.tagline}
            </p>
          </div>
        </div>

        {/* Page content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main column */}
            <main className="lg:col-span-2">
              <Breadcrumb category={cause.name} />

              <p className="text-base leading-relaxed mb-4" style={{ color: '#2E231A', fontFamily: 'var(--font-body-figma)' }}>
                {cause.description}
              </p>

              {cause.problem && (
                <>
                  <h2
                    className="text-2xl font-semibold mb-4 mt-8"
                    style={{ fontFamily: 'var(--font-display-figma)', color: '#1C1612' }}
                  >
                    The Problem
                  </h2>
                  <p className="text-base leading-relaxed mb-4" style={{ color: '#2E231A' }}>
                    {cause.problem}
                  </p>
                </>
              )}

              <InlineDonationBlock
                slug={cause.slug}
                name={cause.name}
                raised={cause.raisedAmount}
                goal={cause.goalAmount}
              />

              {cause.stats && cause.stats.length > 0 && (
                <StatsBar stats={cause.stats} />
              )}

              {cause.approach && cause.approach.length > 0 && (
                <>
                  <h2
                    className="text-2xl font-semibold mb-4 mt-8"
                    style={{ fontFamily: 'var(--font-display-figma)', color: '#1C1612' }}
                  >
                    Our Approach
                  </h2>
                  <div className="space-y-3 mb-6">
                    {cause.approach.map((step, i) => (
                      <div key={i} className="flex items-start gap-4 rounded-lg p-4" style={{ background: '#FFFFFF', border: '1px solid #DDD0BE' }}>
                        <div
                          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-xs font-bold text-white"
                          style={{ background: '#C2571A' }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#2E231A' }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {article?.whyMatters && (
                <>
                  <h2
                    className="text-2xl font-semibold mb-4 mt-8"
                    style={{ fontFamily: 'var(--font-display-figma)', color: '#1C1612' }}
                  >
                    Why Your Support Matters
                  </h2>
                  <p className="text-base leading-relaxed mb-6" style={{ color: '#2E231A' }}>
                    {article.whyMatters}
                  </p>
                </>
              )}

              <Gallery images={causeGalleryImages[cause.slug] || [causeImage].filter(Boolean)} name={cause.name} />

              {cause.budgetAllocation && cause.budgetAllocation.length > 0 && (
                <>
                  <h2
                    className="text-2xl font-semibold mb-4 mt-8"
                    style={{ fontFamily: 'var(--font-display-figma)', color: '#1C1612' }}
                  >
                    Where Your Money Goes
                  </h2>
                  <div className="space-y-4 mb-6">
                    {cause.budgetAllocation.map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: '#2E231A' }}>{item.label}</span>
                          <span className="font-medium" style={{ color: '#C2571A' }}>{item.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: '#EDE5D8' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="h-2 rounded-full"
                            style={{ background: '#C2571A' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div
                className="flex flex-col sm:flex-row items-center gap-6 rounded-lg p-6 mt-4"
                style={{ background: '#F5EDE0', border: '1px solid #DDD0BE' }}
              >
                <div className="flex-1">
                  <p
                    className="text-lg font-semibold mb-1"
                    style={{ fontFamily: 'var(--font-display-figma)', color: '#1C1612' }}
                  >
                    Every contribution matters
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#5A3E28' }}>
                    Your donation goes directly to programmes helping communities across Africa.
                    Join others who have already helped fund this cause.
                  </p>
                </div>
                <Link
                  to={`/donate?campaign=${cause.slug}`}
                  className="flex-shrink-0 px-6 py-3 rounded text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: '#C2571A', color: '#FFFFFF' }}
                >
                  Donate Now
                </Link>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <SidebarDonation cause={cause} />

              <div className="mt-4 p-4 rounded-lg text-center" style={{ background: '#FFFFFF', border: '1px solid #DDD0BE' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#8A7260' }}>
                  Share this cause
                </p>
                <div className="flex gap-2 justify-center">
                  {['Facebook', 'Twitter', 'WhatsApp', 'Email'].map((s) => (
                    <button
                      key={s}
                      className="flex-1 py-2 rounded text-xs font-medium border transition-colors hover:bg-orange-50"
                      style={{ borderColor: '#DDD0BE', color: '#5A3E28' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-5 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #DDD0BE' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#8A7260' }}>
                  Other related causes
                </p>
                {relatedCauses.length > 0 ? (
                  relatedCauses.map((c, i) => {
                    const cpct = Math.round((c.raisedAmount / c.goalAmount) * 100)
                    return (
                      <Link
                        key={c.slug}
                        to={`/causes/${c.slug}`}
                        className="block py-3 group"
                        style={{ borderBottom: i < relatedCauses.length - 1 ? '1px solid #EDE5D8' : 'none' }}
                      >
                        <p className="text-sm font-medium group-hover:text-orange-700 transition-colors" style={{ color: '#1C1612' }}>
                          {c.name}
                        </p>
                        <div className="mt-1.5 h-1.5 rounded-full" style={{ background: '#EDE5D8' }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${cpct}%`, background: '#E8A317' }}
                          />
                        </div>
                        <p className="text-xs mt-1" style={{ color: '#8A7260' }}>{cpct}% funded</p>
                      </Link>
                    )
                  })
                ) : (
                  categories.filter((c) => c.slug !== cause.slug).slice(0, 3).map((c, i) => {
                    const cpct = Math.round((c.raisedAmount / c.goalAmount) * 100)
                    return (
                      <Link
                        key={c.slug}
                        to={`/causes/${c.slug}`}
                        className="block py-3 group"
                        style={{ borderBottom: i < 2 ? '1px solid #EDE5D8' : 'none' }}
                      >
                        <p className="text-sm font-medium group-hover:text-orange-700 transition-colors" style={{ color: '#1C1612' }}>
                          {c.name}
                        </p>
                        <div className="mt-1.5 h-1.5 rounded-full" style={{ background: '#EDE5D8' }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${cpct}%`, background: '#E8A317' }}
                          />
                        </div>
                        <p className="text-xs mt-1" style={{ color: '#8A7260' }}>{cpct}% funded</p>
                      </Link>
                    )
                  })
                )}
              </div>
            </aside>
          </div>
        </div>

        <BlogCarousel causeSlug={cause.slug} />
      </div>
    </>
  )
}