import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react'
import { categories } from '@/lib/categories'
import { getPostsByCategory, paginatePosts } from '@/lib/blog'
import Seo from '@/components/Seo'

export default function BlogCategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState(1)

  const category = categories.find(c => c.slug === slug)
  const posts = slug ? getPostsByCategory(slug) : []
  const paginated = paginatePosts(posts, page, 6)

  useEffect(() => { setPage(1) }, [slug])

  if (!category) {
    return (
      <><Seo title="Category Not Found — GiveToAfrica Blog" />
      <section className="bg-indigo py-20 text-white text-center">
        <div className="container-page">
          <h1 className="font-display text-3xl font-medium">Category Not Found</h1>
          <p className="mt-4 text-white/70">The category you are looking for does not exist.</p>
          <Link to="/blog" className="btn-primary mt-6 inline-flex">
            Back to Blog
          </Link>
        </div>
      </section></>
    )
  }

  const SITE_URL = 'https://donatetoafrica.org'
  const categoryUrl = `${SITE_URL}/blog/category/${category.slug}`
  const itemListElements = posts.map((post, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "url": `${SITE_URL}/blog/${post.slug}`,
    "name": post.title
  }))

  return (
    <><Seo
        title={`${category.name} Articles — GiveToAfrica Blog`}
        description={`Read the latest articles about ${category.name.toLowerCase()} in Africa. Impact stories, field updates, and more from GiveToAfrica.`}
        url={`/blog/category/${slug}`}
      />
      {/* Hero */}
      <section className="bg-indigo py-16 text-white md:py-20">
        <div className="container-page">
          <nav className="flex items-center gap-2 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/80">{category.name}</span>
          </nav>
          <h1 className="mt-6 font-display text-3xl font-medium md:text-5xl">{category.name}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/70">{category.tagline}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
            {posts.length} article{posts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    <div className="flex items-center gap-3 text-xs text-ink-soft">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formattedDate}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingTimeMinutes} min</span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-medium leading-snug text-ink transition-colors group-hover:text-ochre-dark">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs text-ink-soft">{post.metaDescription}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ochre-dark">Read More <ChevronRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              )
            })}
          </div>

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

      {/* CollectionPage + ItemList JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${category.name} Articles | GiveDirectly`,
        "description": category.description,
        "url": categoryUrl,
        "mainEntity": {
          "@type": "ItemList",
          "name": `${category.name} Articles`,
          "numberOfItems": posts.length,
          "itemListElement": itemListElements
        }
      }) }} />

      {/* BreadcrumbList JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
          { "@type": "ListItem", "position": 3, "name": category.name, "item": categoryUrl }
        ]
      }) }} />
    </>
  )
}
