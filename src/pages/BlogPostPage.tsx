import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, Tag, ChevronRight } from 'lucide-react'
import { getPostBySlug, getRelatedPosts } from '@/lib/blog'
import BlogArticleBody from '@/components/BlogArticleBody'
import BlogSidebarCTA from '@/components/BlogSidebarCTA'
import Seo from '@/components/Seo'

const SITE_URL = 'https://donatetoafrica.org'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = getPostBySlug(slug ?? '')
  const relatedPosts = post ? getRelatedPosts(post, 3) : []

  if (!post) {
    return (
      <section className="bg-indigo py-20 text-white text-center">
        <div className="container-page">
          <h1 className="font-display text-3xl font-medium">Article Not Found</h1>
          <p className="mt-4 text-white/70">The article you are looking for does not exist.</p>
          <Link to="/blog" className="btn-primary mt-6 inline-flex">
            Back to Blog
          </Link>
        </div>
      </section>
    )
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const authorName = 'GiveDirectly Editorial Team'

  const articleUrl = `${SITE_URL}/blog/${post.slug}`
    return (
    <><Seo
        title={post.metaTitle}
        description={post.metaDescription}
        image={post.featuredImage.src}
        url={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.publishedAt}
        section={post.categoryName}
        tags={post.tags}
      />
      {/* Hero */}
      <section className="bg-indigo py-12 text-white md:py-16">
        <div className="container-page">
          <nav className="flex items-center gap-2 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/blog/category/${post.categorySlug}`} className="hover:text-white">{post.categoryName}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate max-w-[200px] text-white/80">{post.title}</span>
          </nav>
          <h1 className="mt-6 max-w-3xl font-display text-3xl font-medium md:text-4xl lg:text-5xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formattedDate}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readingTimeMinutes} min read</span>
            <span className="text-white/40">by <Link to="/about" className="hover:text-white/80 font-medium text-white/60">{authorName}</Link></span>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="container-page -mt-6">
        <img src={post.featuredImage.src} alt={post.featuredImage.alt} className="w-full max-h-[500px] rounded-lg object-cover shadow-lg" />
      </section>

      {/* Article + Sidebar Grid */}
      <section className="py-12 md:py-16">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Article Body */}
            <div className="lg:col-span-2">
              <BlogArticleBody post={post} />

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2 border-t border-ink/8 pt-6">
                {post.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-parchment px-3 py-1 text-xs font-medium text-ink-soft">
                    <Tag className="h-3 w-3" /> {tag}
                  </span>
                ))}
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-12 border-t border-ink/8 pt-10">
                  <h2 className="font-display text-xl font-medium text-ink">Related Articles</h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {relatedPosts.map(rp => (
                      <Link key={rp.id} to={`/blog/${rp.slug}`} className="card group">
                        <span className="text-label text-ochre-dark">{rp.categoryName}</span>
                        <h3 className="mt-2 font-display text-base font-medium text-ink transition-colors group-hover:text-ochre-dark">{rp.title}</h3>
                        <p className="mt-2 line-clamp-2 text-xs text-ink-soft">{rp.metaDescription}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ochre-dark">Read More <ChevronRight className="h-3 w-3" /></span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              <BlogSidebarCTA />
            </aside>
          </div>
        </div>
      </section>

      {/* Article JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.metaDescription,
        "image": `${SITE_URL}${post.featuredImage.src}`,
        "url": articleUrl,
        "datePublished": post.publishedAt,
        "author": {
          "@type": "Organization",
          "name": authorName,
          "url": SITE_URL,
          "logo": {
            "@type": "ImageObject",
            "url": `${SITE_URL}/logo.png`
          }
        },
        "publisher": {
          "@type": "Organization",
          "name": "GiveDirectly",
          "url": SITE_URL,
          "logo": {
            "@type": "ImageObject",
            "url": `${SITE_URL}/logo.png`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": articleUrl
        },
        "articleSection": post.categoryName,
        "keywords": post.tags.join(', ')
      }) }} />

      {/* BreadcrumbList JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
          { "@type": "ListItem", "position": 3, "name": post.categoryName, "item": `${SITE_URL}/blog/category/${post.categorySlug}` },
          { "@type": "ListItem", "position": 4, "name": post.title, "item": articleUrl }
        ]
      }) }} />
    </>
  )
}
