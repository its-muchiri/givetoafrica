import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { categories } from '@/lib/categories'
import type { BlogPost } from '@/lib/blog'

interface BlogArticleBodyProps {
  post: BlogPost
}

export default function BlogArticleBody({ post }: BlogArticleBodyProps) {
  const parts = post.bodyHtml.split(/<\/h2>/)

  const firstHalf = parts.length > 1 ? parts[0] + '</h2>' : post.bodyHtml
  const secondHalf = parts.length > 2 ? parts.slice(2).join('</h2>') : ''

  const midCategory = categories.find(c => c.slug === post.ctaMidArticle.categorySlug)
  const midCategoryName = midCategory?.name || post.ctaMidArticle.categoryName

  const endCategory = categories.find(c => c.slug === post.ctaEndOfArticle.categorySlug)
  const endCategoryName = endCategory?.name || post.ctaEndOfArticle.categoryName

  return (
    <article className="prose prose-ink max-w-none">
      <div dangerouslySetInnerHTML={{ __html: firstHalf }} />

      {midCategory && (
        <div className="my-10 rounded-lg border border-ochre/20 bg-ochre/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ochre-dark/10">
              <Heart className="h-5 w-5 text-ochre-dark" />
            </div>
            <div>
              <p className="font-display text-sm font-medium text-ink">
                {midCategoryName}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {post.ctaMidArticle.copy}
              </p>
              <Link
                to={`/donate?campaign=${post.ctaMidArticle.categorySlug}`}
                className="btn-primary mt-4 inline-flex text-sm"
              >
                Donate to {midCategoryName}
              </Link>
            </div>
          </div>
        </div>
      )}

      {secondHalf && <div dangerouslySetInnerHTML={{ __html: secondHalf }} />}

      <div className="bg-ochre-dark text-white my-10 rounded-lg py-12 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-2xl font-medium">Take Action Now</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            {post.ctaEndOfArticle.copy}
          </p>
          {endCategory && (
            <Link
              to={`/donate?campaign=${post.ctaEndOfArticle.categorySlug}`}
              className="mt-6 inline-flex items-center rounded bg-white px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
            >
              Donate to {endCategoryName}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
