import blogPostsData from '@/data/blogPosts.json'

export interface BlogPost {
  id: string
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  categorySlug: string
  categoryName: string
  country: string
  featuredImage: { src: string; alt: string }
  secondaryImage: { src: string; alt: string } | null
  publishedAt: string
  readingTimeMinutes: number
  tags: string[]
  needsImageReview: boolean
  needsFactCheck: boolean
  sourceKeyword: string
  source?: string
  wordCount?: number
  bodyHtml: string
  ctaMidArticle: { categorySlug: string; categoryName: string; copy: string }
  ctaEndOfArticle: { categorySlug: string; categoryName: string; copy: string }
}

export const blogPosts: BlogPost[] = blogPostsData as BlogPost[]

export function getPublishedPosts(): BlogPost[] {
  return blogPosts
    .filter((post) => !post.needsImageReview && !post.needsFactCheck)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getPostsByCategory(slug: string): BlogPost[] {
  return getPublishedPosts().filter((post) => post.categorySlug === slug)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getRelatedPosts(post: BlogPost, max: number = 3): BlogPost[] {
  return getPublishedPosts()
    .filter((p) => p.categorySlug === post.categorySlug && p.id !== post.id)
    .slice(0, max)
}

export function getBlogCategorySlugs(): string[] {
  const slugs = new Set(getPublishedPosts().map((post) => post.categorySlug))
  return Array.from(slugs)
}

export function getBlogPostCount(): number {
  return getPublishedPosts().length
}

export function paginatePosts(
  posts: BlogPost[],
  page: number,
  perPage: number
): {
  posts: BlogPost[]
  page: number
  totalPages: number
  totalPosts: number
  hasNext: boolean
  hasPrev: boolean
} {
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / perPage)
  const safePage = Math.max(1, Math.min(page, totalPages || 1))
  const start = (safePage - 1) * perPage
  const paginatedPosts = posts.slice(start, start + perPage)

  return {
    posts: paginatedPosts,
    page: safePage,
    totalPages,
    totalPosts,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  }
}
