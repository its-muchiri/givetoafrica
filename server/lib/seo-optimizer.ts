export interface SeoResult {
  title: string
  slug: string
  metaDescription: string
  focusKeyword: string
  content: string
  schemaJsonLd: string
  score: number
  notes: string[]
}

export interface SeoOptions {
  focusKeyword?: string
  title?: string
  content?: string
  excerpt?: string
  url?: string
  imageUrl?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

const MAX_META_LENGTH = 160
const MAX_TITLE_LENGTH = 60
const MIN_WORD_COUNT = 300
const TARGET_KEYWORD_DENSITY = 0.012

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80)
}

function stripPrefixes(text: string): string {
  const prefixes = [
    'how to ',
    'what is ',
    'what are ',
    'best way to ',
    'why ',
    'when ',
    'where ',
    'who ',
    'which ',
    'can ',
    'do ',
    'does ',
    'is ',
    'are ',
    'was ',
    'were ',
  ]
  let cleaned = text.trim()
  for (const prefix of prefixes) {
    if (cleaned.toLowerCase().startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length).trim()
      break
    }
  }
  return cleaned
}

function extractFocusKeyword(title: string): string {
  const parts = title.split(/[|–—:]/)
  let best = parts[0].trim()
  for (const part of parts) {
    const cleaned = stripPrefixes(part.trim())
    const wordCount = cleaned.split(/\s+/).length
    if (wordCount >= 3 && wordCount <= 6) {
      best = cleaned
      break
    }
    if (wordCount > 1 && wordCount < best.split(/\s+/).length) {
      best = cleaned
    }
  }
  return best.slice(0, 60)
}

function ensureKeywordInSlug(slug: string, keyword: string): string {
  const keywordSlug = slugify(keyword)
  if (slug.includes(keywordSlug)) return slug
  const combined = `${keywordSlug}-${slug}`
  return combined.slice(0, 80)
}

function generateMetaDescription(content: string, keyword: string): string {
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20)
  let desc = ''
  for (const sentence of sentences) {
    const candidate = `${desc}${sentence.trim()}. `
    if (candidate.length > MAX_META_LENGTH - 10) break
    desc = candidate
  }
  desc = desc.trim()
  if (desc.length > MAX_META_LENGTH) {
    desc = desc.slice(0, desc.lastIndexOf(' ', MAX_META_LENGTH - 3)) + '...'
  }
  if (!desc.toLowerCase().includes(keyword.toLowerCase())) {
    const prefix = `${keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase()}: `
    const candidate = `${prefix}${desc}`
    if (candidate.length <= MAX_META_LENGTH) {
      desc = candidate
    } else {
      desc = prefix + desc.slice(0, MAX_META_LENGTH - prefix.length - 4) + '...'
    }
  }
  return desc
}

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.split(/\s+/).filter(Boolean).length
}

function countKeywordOccurrences(text: string, keyword: string): number {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escaped, 'gi')
  const matches = text.match(regex)
  return matches ? matches.length : 0
}

function ensureH1(content: string, keyword: string): string {
  const h1Match = content.match(/<h1[^>]*>.*?<\/h1>/i)
  if (h1Match) return content
  const h2Match = content.match(/<h2[^>]*>(.*?)<\/h2>/i)
  if (h2Match) {
    return content.replace(
      h2Match[0],
      `<h1>${h2Match[1]}</h1>`
    )
  }
  return `<h1>${keyword}</h1>\n${content}`
}

function ensureKeywordInHeadings(content: string, keyword: string): string {
  const h2Match = content.match(/<h2[^>]*>(.*?)<\/h2>/i)
  if (h2Match && !h2Match[1].toLowerCase().includes(keyword.toLowerCase())) {
    content = content.replace(
      h2Match[0],
      `<h2>${keyword}: ${h2Match[1]}</h2>`
    )
  }
  const h3Match = content.match(/<h3[^>]*>(.*?)<\/h3>/i)
  if (h3Match && !h3Match[1].toLowerCase().includes(keyword.toLowerCase())) {
    content = content.replace(
      h3Match[0],
      `<h3>${keyword} — ${h3Match[1]}</h3>`
    )
  }
  return content
}

function injectKeywordInIntro(content: string, keyword: string): string {
  const firstPMatch = content.match(/<p[^>]*>(.*?)<\/p>/i)
  if (!firstPMatch) return content
  const firstP = firstPMatch[1]
  if (firstP.toLowerCase().includes(keyword.toLowerCase())) return content
  const keywordSentence = `<p><strong>${keyword}</strong> is a critical area of focus that requires sustained attention and community-driven solutions.</p>\n`
  return content.replace(firstPMatch[0], `${keywordSentence}${firstPMatch[0]}`)
}

function boostKeywordDensity(content: string, keyword: string): string {
  const text = content.replace(/<[^>]*>/g, ' ')
  const wordCount = text.split(/\s+/).filter(Boolean).length
  if (wordCount === 0) return content
  const currentDensity = countKeywordOccurrences(text, keyword) / wordCount
  if (currentDensity >= TARGET_KEYWORD_DENSITY) return content

  const paragraphs = content.match(/<p[^>]*>.*?<\/p>/gi) || []
  let modified = content
  let injections = 0
  const targetInjections = Math.max(1, Math.round((TARGET_KEYWORD_DENSITY * wordCount) - countKeywordOccurrences(text, keyword)))

  for (let i = 0; i < paragraphs.length && injections < targetInjections; i++) {
    const p = paragraphs[i]
    if (!p.toLowerCase().includes(keyword.toLowerCase())) {
      const insertion = ` <strong>${keyword}</strong>`
      modified = modified.replace(p, p.replace('</p>', `${insertion}</p>`))
      injections++
    }
  }
  return modified
}

function fixImageAltText(content: string, keyword: string): string {
  return content.replace(
    /<img([^>]*?)>/gi,
    (match, attrs) => {
      if (attrs.toLowerCase().includes('alt=')) {
        return match.replace(
          /alt="([^"]*)"/i,
          (_, existingAlt) => `alt="${existingAlt} ${keyword}".trim()`
        )
      }
      return match.replace('>', ` alt="${keyword}">`)
    }
  )
}

function addInternalLinks(content: string): string {
  const linkPatterns = [
    { text: 'donate', url: '/donate' },
    { text: 'causes', url: '/causes' },
    { text: 'impact', url: '/impact' },
    { text: 'about us', url: '/about' },
    { text: 'contact', url: '/contact' },
  ]
  for (const { text, url } of linkPatterns) {
    if (content.toLowerCase().includes(text.toLowerCase()) && !content.includes(`href="${url}"`)) {
      content = content.replace(
        new RegExp(`(${text})`, 'gi'),
        `<a href="${url}">$1</a>`
      )
      break
    }
  }
  return content
}

function addExternalLink(content: string): string {
  if (content.toLowerCase().includes('wikipedia')) return content
  const externalLink = ' <a href="https://en.wikipedia.org/wiki/International_development" target="_blank" rel="noopener noreferrer">learn more</a>'
  const lastP = content.match(/<p[^>]*>.*?<\/p>/gi)
  if (lastP && lastP.length > 0) {
    const last = lastP[lastP.length - 1]
    content = content.replace(last, last.replace('</p>', `${externalLink}</p>`))
  }
  return content
}

function ensureMinWordCount(content: string, keyword: string): string {
  const wordCount = countWords(content)
  if (wordCount >= MIN_WORD_COUNT) return content

  const faqSection = `
<h2>Frequently Asked Questions About ${keyword}</h2>
<p><strong>How can I contribute to ${keyword} efforts?</strong> You can donate, volunteer, or spread awareness through social media.</p>
<p><strong>What impact does ${keyword} have on communities?</strong> Targeted support creates measurable change in the lives of those who need it most.</p>
<p><strong>Where does the funding go for ${keyword} initiatives?</strong> Every contribution is directed to on-the-ground programs with transparent reporting.</p>
`
  return content + faqSection
}

function buildSchemaJsonLd(options: SeoOptions): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.title || '',
    description: options.excerpt || '',
    keywords: options.focusKeyword || '',
    author: {
      '@type': 'Organization',
      name: 'GiveToAfrica',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GiveToAfrica',
      logo: {
        '@type': 'ImageObject',
        url: 'https://givetoafrica.net/logo-full.svg',
      },
    },
    ...(options.publishedTime ? { datePublished: options.publishedTime } : {}),
    ...(options.modifiedTime ? { dateModified: options.modifiedTime } : {}),
    ...(options.imageUrl ? { image: options.imageUrl } : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': options.url || 'https://givetoafrica.net',
    },
  }
  return JSON.stringify(schema)
}

function scoreSeo(content: string, keyword: string, title: string, slug: string): number {
  let score = 0
  const notes: string[] = []

  if (title.length >= 50 && title.length <= 60) {
    score += 15
  } else {
    notes.push(`Title length is ${title.length} chars (ideal: 50-60)`)
  }

  const text = content.replace(/<[^>]*>/g, ' ')
  const wc = text.split(/\s+/).filter(Boolean).length
  if (wc >= MIN_WORD_COUNT) {
    score += 15
  } else {
    notes.push(`Word count is ${wc} (minimum: ${MIN_WORD_COUNT})`)
  }

  if (slug.includes(slugify(keyword))) {
    score += 15
  } else {
    notes.push('Keyword not in URL slug')
  }

  const first400 = text.slice(0, 400)
  if (first400.toLowerCase().includes(keyword.toLowerCase())) {
    score += 15
  } else {
    notes.push('Keyword not in first 400 characters of content')
  }

  const hasH1 = /<h1[^>]*>/i.test(content)
  const hasH2 = /<h2[^>]*>/i.test(content)
  if (hasH1 && hasH2) {
    score += 15
  } else {
    notes.push('Missing H1 or H2 heading')
  }

  const imagesWithoutAlt = (content.match(/<img(?![^>]*alt=)[^>]*>/gi) || []).length
  if (imagesWithoutAlt === 0) {
    score += 10
  } else {
    notes.push(`${imagesWithoutAlt} image(s) missing alt text`)
  }

  const density = countKeywordOccurrences(text, keyword) / Math.max(wc, 1)
  if (density >= 0.005 && density <= 0.025) {
    score += 15
  } else {
    notes.push(`Keyword density is ${(density * 100).toFixed(2)}% (ideal: 0.5-2.5%)`)
  }

  return score
}

export function optimizePost(options: SeoOptions): SeoResult {
  const title = options.title || ''
  const rawContent = options.content || ''
  const keyword = options.focusKeyword || extractFocusKeyword(title)
  const slug = slugify(title)
  const optimizedSlug = ensureKeywordInSlug(slug, keyword)
  const metaDescription = generateMetaDescription(rawContent, keyword)

  let content = rawContent
  content = ensureH1(content, keyword)
  content = ensureKeywordInHeadings(content, keyword)
  content = injectKeywordInIntro(content, keyword)
  content = boostKeywordDensity(content, keyword)
  content = fixImageAltText(content, keyword)
  content = addInternalLinks(content)
  content = addExternalLink(content)
  content = ensureMinWordCount(content, keyword)

  const schemaJsonLd = buildSchemaJsonLd({
    ...options,
    title,
    excerpt: metaDescription,
    focusKeyword: keyword,
  })

  const score = scoreSeo(content, keyword, title, optimizedSlug)

  const notes: string[] = []
  if (score >= 80) {
    notes.push('SEO score is excellent')
  } else if (score >= 60) {
    notes.push('SEO score is good with room for improvement')
  } else {
    notes.push('SEO score needs improvement')
  }

  return {
    title,
    slug: optimizedSlug,
    metaDescription,
    focusKeyword: keyword,
    content,
    schemaJsonLd,
    score,
    notes,
  }
}
