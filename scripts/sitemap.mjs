import { writeFileSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')

const SITE_URL = 'https://donatetoafrica.org'

const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/causes', priority: 0.8, changefreq: 'weekly' },
  { path: '/charities', priority: 0.8, changefreq: 'weekly' },
  { path: '/impact', priority: 0.6, changefreq: 'monthly' },
  { path: '/get-involved', priority: 0.6, changefreq: 'monthly' },
  { path: '/news', priority: 0.6, changefreq: 'weekly' },
  { path: '/blog', priority: 0.9, changefreq: 'daily' },
  { path: '/contact', priority: 0.5, changefreq: 'monthly' },
  { path: '/faq', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
]

const CATEGORY_SLUGS = [
  'aged', 'animals', 'armed-and-ex-services', 'children-and-youth',
  'community', 'culture-and-heritage', 'disabled', 'education-and-training',
  'employment-trades-and-professions', 'environment', 'family', 'health',
  'hearing-impairments', 'hospices', 'hospitals', 'housing', 'human-rights',
  'international', 'learning-disabilities-and-sen', 'medical-research',
  'medical-welfare', 'mental-health', 'overseas-aid', 'religious',
  'rescue-services', 'social-welfare', 'sport-and-recreation', 'visual-impairments',
]

function getBlogPosts() {
  try {
    const jsonPath = join(ROOT, 'src', 'data', 'blogPosts.json')
    if (existsSync(jsonPath)) {
      return JSON.parse(readFileSync(jsonPath, 'utf-8'))
    }
  } catch { }
  return []
}

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0]
  const blogPosts = getBlogPosts()
  const publishedPosts = blogPosts.filter(p => !p.needsImageReview && !p.needsFactCheck)
  const blogCategorySlugs = [...new Set(publishedPosts.map(p => p.categorySlug))]

  const urls = []

  for (const route of STATIC_ROUTES) {
    urls.push(`  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`)
  }

  for (const slug of CATEGORY_SLUGS) {
    urls.push(`  <url>
    <loc>${SITE_URL}/causes/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
    urls.push(`  <url>
    <loc>${SITE_URL}/charities/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
  }

  for (const slug of blogCategorySlugs) {
    urls.push(`  <url>
    <loc>${SITE_URL}/blog/category/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`)
  }

  for (const post of publishedPosts) {
    const postDate = post.publishedAt ? post.publishedAt.split('T')[0] : today
    urls.push(`  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  writeFileSync(join(DIST, 'sitemap.xml'), sitemap)
  console.log(`Generated sitemap.xml with ${urls.length} URLs`)
}

generateSitemap()
