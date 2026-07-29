import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Calendar, Clock, ChevronRight, ChevronLeft, Search } from 'lucide-react'
import { categories } from '@/lib/categories'
import { getPublishedPosts, getBlogCategorySlugs, paginatePosts } from '@/lib/blog'
import Seo from '@/components/Seo'

export default function BlogListingPage() {
  const allPosts = getPublishedPosts()
  const blogCategorySlugs = getBlogCategorySlugs()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  let filtered = allPosts
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      p => p.title.toLowerCase().includes(q) || p.metaDescription.toLowerCase().includes(q)
    )
  }
  if (selectedCategory) {
    filtered = filtered.filter(p => p.categorySlug === selectedCategory)
  }

  const paginated = paginatePosts(filtered, page, 9)

  return (
    <><Seo
        title="Blog — GiveToAfrica"
        description="Read the latest stories about our work across Africa. Impact updates, field reports, and insights from our team."
        url="/blog"
      />
      {/* Hero */}
      <section className="bg-indigo py-16 text-white md:py-20">
        <div className="container-page">
          <span className="text-label text-ochre-light">Blog & News</span>
          <h1 className="mt-4 font-display text-4xl font-medium md:text-5xl">Stories of Impact</h1>
          <p className="mt-4 max-w-xl text-lg text-white/70">Read the latest updates from the field, learn about our impact, and stay informed about the communities we serve.</p>
          <div className="mt-6 flex items-center gap-3 text-sm text-white/60">
            <span>{allPosts.length} articles</span>
            <span>·</span>
            <span>{blogCategorySlugs.length} categories</span>
          </div>
        </div>
      </section>

      {/* Search & Filter + Grid */}
      <section className="py-12 md:py-16">
        <div className="container-page">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="input-field pl-10"
              placeholder="Search articles..."
            />
          </div>

          {/* Category pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => { setSelectedCategory(null); setPage(1) }}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${!selectedCategory ? 'bg-ink text-white' : 'bg-ink/8 text-ink-soft hover:bg-ink/12'}`}
            >
              All
            </button>
            {blogCategorySlugs.map(slug => {
              const cat = categories.find(c => c.slug === slug)
              return (
                <button
                  key={slug}
                  onClick={() => { setSelectedCategory(slug); setPage(1) }}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${selectedCategory === slug ? 'bg-ink text-white' : 'bg-ink/8 text-ink-soft hover:bg-ink/12'}`}
                >
                  {cat?.name || slug}
                </button>
              )
            })}
          </div>

          {/* Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.posts.map(post => {
              const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              return (
                <Link key={post.id} to={`/blog/${post.slug}`} className="card group overflow-hidden p-0">
                  <div className="relative h-44 overflow-hidden">
                    <img src={post.featuredImage.src} alt={post.featuredImage.alt} className="h-full w-full object-cover transition-transform duration-350 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-ochre/10 px-2.5 py-0.5 text-[11px] font-semibold text-ochre-dark ring-1 ring-ochre/8">{post.categoryName}</span>
                    <h3 className="mt-3 font-display text-lg font-medium leading-snug text-ink transition-colors group-hover:text-ochre-dark">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs text-ink-soft">{post.metaDescription}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-ink/8 pt-3">
                      <div className="flex items-center gap-3 text-xs text-ink-soft">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formattedDate}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingTimeMinutes} min</span>
                      </div>
                      <span className="text-xs font-semibold text-ochre-dark">Read More <ChevronRight className="h-3 w-3 inline" /></span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {paginated.posts.length === 0 && <p className="py-12 text-center text-ink-soft">No articles found.</p>}

          {/* Pagination */}
          {paginated.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={!paginated.hasPrev} className="btn-outline text-xs disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button>
              <span className="mono-number text-sm text-ink-soft">Page {paginated.page} of {paginated.totalPages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={!paginated.hasNext} className="btn-outline text-xs disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
