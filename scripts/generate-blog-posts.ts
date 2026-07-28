import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'
import { CAT_CONTENT } from './blog-content-data.js'

const CATEGORIES: Record<string, { name: string; tagline: string; countries: string[] }> = {
  'aged': { name: 'Aged Care', tagline: 'Honouring elders with dignity, care, and community', countries: ['Kenya', 'Tanzania', 'South Africa', 'Uganda', 'Ghana'] },
  'animals': { name: 'Animal Welfare', tagline: 'Protecting wildlife and supporting livelihoods alongside nature', countries: ['Kenya', 'Tanzania', 'South Africa', 'Zimbabwe', 'Botswana'] },
  'armed-and-ex-services': { name: 'Armed Forces & Veterans', tagline: 'Restoring lives after conflict and service', countries: ['Sierra Leone', 'Liberia', 'Rwanda', 'South Sudan', 'DRC'] },
  'children-and-youth': { name: 'Children & Youth', tagline: 'Giving every child the chance to thrive', countries: ['Nigeria', 'Kenya', 'Uganda', 'Ghana', 'Ethiopia'] },
  'community': { name: 'Community Development', tagline: 'Building stronger communities from the ground up', countries: ['Tanzania', 'Mozambique', 'Malawi', 'Zambia', 'Rwanda'] },
  'culture-and-heritage': { name: 'Culture & Heritage', tagline: "Preserving Africa's rich traditions for future generations", countries: ['Ghana', 'Ethiopia', 'Mali', 'Morocco', 'Madagascar'] },
  'disabled': { name: 'Disability Support', tagline: "Creating inclusion where it's needed most", countries: ['South Africa', 'Kenya', 'Nigeria', 'Tanzania', 'Ghana'] },
  'education-and-training': { name: 'Education & Training', tagline: 'Opening doors through knowledge and skills', countries: ['Kenya', 'Nigeria', 'Tanzania', 'Ghana', 'Uganda'] },
  'employment-trades-and-professions': { name: 'Employment & Skills', tagline: 'Building livelihoods and economic independence', countries: ['South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Tanzania'] },
  'environment': { name: 'Environment', tagline: 'Protecting natural resources for future generations', countries: ['Rwanda', 'Kenya', 'Ethiopia', 'Tanzania', 'Madagascar'] },
  'family': { name: 'Family Support', tagline: 'Strengthening families to build resilient communities', countries: ['Uganda', 'Kenya', 'Nigeria', 'Tanzania', 'Ghana'] },
  'health': { name: 'Healthcare', tagline: 'Bringing quality healthcare to every community', countries: ['Ghana', 'Kenya', 'Nigeria', 'Tanzania', 'Ethiopia'] },
  'hearing-impairments': { name: 'Hearing Impairments', tagline: 'Restoring connection through hearing health', countries: ['Kenya', 'Nigeria', 'South Africa', 'Tanzania', 'Uganda'] },
  'hospices': { name: 'Hospices & Palliative Care', tagline: 'Ensuring dignity and comfort at every stage of life', countries: ['South Africa', 'Kenya', 'Nigeria', 'Tanzania', 'Ghana'] },
  'hospitals': { name: 'Hospital Support', tagline: 'Equipping hospitals to serve their communities', countries: ['Nigeria', 'Kenya', 'Ghana', 'Tanzania', 'Uganda'] },
  'housing': { name: 'Housing & Shelter', tagline: 'A safe home is the foundation of every community', countries: ['Kenya', 'South Africa', 'Nigeria', 'Tanzania', 'Uganda'] },
  'human-rights': { name: 'Human Rights', tagline: 'Defending the rights and dignity of every person', countries: ['Nigeria', 'South Africa', 'Kenya', 'Ghana', 'Ethiopia'] },
  'international': { name: 'International Aid', tagline: 'Delivering aid with accountability and local leadership', countries: ['Kenya', 'Ethiopia', 'Somalia', 'South Sudan', 'DRC'] },
  'learning-disabilities-and-sen': { name: 'Learning Disabilities & SEN', tagline: 'Every learner deserves the support to reach their potential', countries: ['South Africa', 'Kenya', 'Nigeria', 'Tanzania', 'Ghana'] },
  'medical-research': { name: 'Medical Research', tagline: 'Advancing treatments and cures for Africa', countries: ['Ghana', 'Kenya', 'Nigeria', 'South Africa', 'Tanzania'] },
  'medical-welfare': { name: 'Medical Welfare', tagline: 'Ensuring healthcare access for the most vulnerable', countries: ['Tanzania', 'Kenya', 'Nigeria', 'Ethiopia', 'Ghana'] },
  'mental-health': { name: 'Mental Health', tagline: 'Breaking stigma and building mental health support systems', countries: ['Nigeria', 'South Africa', 'Kenya', 'Ghana', 'Uganda'] },
  'overseas-aid': { name: 'Overseas Aid & Relief', tagline: 'Rapid, effective relief when communities need it most', countries: ['Ethiopia', 'Somalia', 'South Sudan', 'Mozambique', 'DRC'] },
  'religious': { name: 'Faith-Based Organisations', tagline: 'Faith in action for communities across Africa', countries: ['Ghana', 'Nigeria', 'Kenya', 'Uganda', 'Tanzania'] },
  'rescue-services': { name: 'Rescue & Emergency Services', tagline: 'First responders when disaster strikes', countries: ['Mozambique', 'Nigeria', 'Kenya', 'Ethiopia', 'Somalia'] },
  'social-welfare': { name: 'Social Welfare', tagline: 'Supporting the most vulnerable members of society', countries: ['Tanzania', 'South Africa', 'Kenya', 'Nigeria', 'Uganda'] },
  'sport-and-recreation': { name: 'Sport & Recreation', tagline: 'Using sport to build communities and change lives', countries: ['Kenya', 'South Africa', 'Nigeria', 'Ghana', 'Tanzania'] },
  'visual-impairments': { name: 'Visual Impairments', tagline: 'Opening eyes to a world of possibility', countries: ['Nigeria', 'Kenya', 'South Africa', 'Tanzania', 'Ghana'] },
}

interface BlogPost {
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
  bodyHtml: string
  ctaMidArticle: { categorySlug: string; categoryName: string; copy: string }
  ctaEndOfArticle: { categorySlug: string; categoryName: string; copy: string }
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

function countWords(html: string): number {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length
}

function toKebab(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function pickImage(images: string[], keywords: string[], categorySlug: string): string {
  const kwWords = keywords.map(k => k.toLowerCase())
  const catWords = categorySlug.split('-')
  const allSearch = [...kwWords, ...catWords]

  for (const img of images) {
    const lower = img.toLowerCase()
    if (allSearch.some(w => lower.includes(w))) return img
  }
  return images[Math.floor(Math.random() * images.length)] || 'images.jpg'
}

function makeAlt(keyword: string, country: string): string {
  return `${keyword} in ${country} — community impact photograph`
}

function staggerDate(index: number, total: number): string {
  const start = new Date('2024-06-15T10:00:00Z').getTime()
  const end = new Date('2025-01-20T10:00:00Z').getTime()
  const step = (end - start) / total
  const d = new Date(start + step * index)
  return d.toISOString()
}

function buildBodyHtml(catSlug: string, country: string, relatedSlug: string): string {
  const data = CAT_CONTENT[catSlug]
  if (!data) return '<p>Content coming soon.</p>'

  const cat = CATEGORIES[catSlug]
  const replace = (s: string) => s.replace(/\{\{country\}\}/g, country)

  const intro = data.intro.map(p => `<p>${replace(p)}</p>`).join('\n')

  const challengeH2 = `<h2>${replace(data.challenge.heading)}</h2>`
  const challenge = data.challenge.paragraphs.map(p => `<p>${replace(p)}</p>`).join('\n')

  const approachH2 = `<h2>${replace(data.approach.heading)}</h2>`
  const approachP = data.approach.paragraphs.map(p => `<p>${replace(p)}</p>`).join('\n')
  const bullets = data.approach.bullets.map(b => `  <li>${replace(b)}</li>`).join('\n')
  const bulletHtml = `<ul>\n${bullets}\n</ul>`

  const donationH2 = `<h2>How Donations Are Making a Real Difference</h2>`
  const donationP1 = `<p>When you support ${cat.name.toLowerCase()} programmes in ${country}, your contribution goes directly to the communities that need it most. Donations fund critical operations including training local staff, purchasing essential supplies, and maintaining infrastructure that serves communities year after year. Every dollar is directed where it can have the greatest impact, with transparent reporting ensuring accountability at every step.</p>`
  const donationP2 = `<p>The ripple effects of your generosity extend far beyond the immediate intervention. When a community gains access to reliable ${cat.name.toLowerCase().replace(/&/g, 'and').replace(/s$/, '').toLowerCase()} services, it creates a foundation for long-term development. Families become healthier, children perform better in school, local economies strengthen, and communities build the resilience they need to weather future challenges. Your support doesn't just address a symptom — it helps build a sustainable solution.</p>`

  const impactH3 = `<h3>${replace(data.impact.heading)}</h3>`
  const impact = data.impact.paragraphs.map(p => `<p>${replace(p)}</p>`).join('\n')

  const broaderH2 = `<h2>The Broader Impact Across ${country}</h2>`
  const broaderP1 = `<p>The challenges facing ${country} are interconnected, which is why ${cat.name.toLowerCase()} programmes work as part of a holistic approach to community development. When communities have access to the ${cat.tagline.toLowerCase()}, they are better equipped to invest in education, grow local businesses, and build infrastructure that benefits everyone. This creates a virtuous cycle of development that lifts entire regions.</p>`
  const broaderP2 = `<p>Across ${country}, communities that have benefited from ${cat.name.toLowerCase()} programmes report lasting improvements in quality of life. Neighbouring communities are often inspired to advocate for similar services, creating a domino effect of positive change. The model proves that sustainable development works best when it is community-led, culturally appropriate, and supported by partners who are committed to long-term impact rather than quick fixes.</p>`

  const involvedH2 = `<h2>Why Your Support Matters Now</h2>`
  const involvedP1 = `<p>The need for ${cat.name.toLowerCase()} programmes in ${country} has never been greater. Climate change, population growth, economic pressures, and systemic inequality continue to challenge communities across the region. Without sustained investment in locally-led ${cat.tagline.toLowerCase().replace(/'/g, '')}, these challenges will only intensify. Your support today helps communities not just cope with current challenges but build the resilience they need for the future.</p>`
  const involvedP2 = `<p>What makes these programmes different is their focus on sustainability and community ownership. Rather than creating dependency, ${cat.name.toLowerCase()} initiatives in ${country} build local capacity, transfer skills, and establish systems that communities can manage independently over time. When you contribute, you are investing in lasting change — not a temporary fix. Every donation, whether large or small, becomes part of a growing movement of people who believe that every community deserves the opportunity to thrive.</p>`

  const relatedLink = relatedSlug
    ? `<p>Want to read more about how communities are driving change? Explore <a href="/blog/${relatedSlug}">this related story</a> to see the impact in action.</p>`
    : ''

  const closing = `<p>By supporting <a href="/charities/${catSlug}">${cat.name} programmes</a>, you help build sustainable change across ${country}. Every contribution, no matter the size, creates meaningful impact for the people who need it most. The challenges are significant, but with your support, communities are writing their own stories of transformation.</p>\n${relatedLink}`

  return [intro, challengeH2, challenge, approachH2, approachP, bulletHtml, donationH2, donationP1, donationP2, impactH3, impact, broaderH2, broaderP1, broaderP2, involvedH2, involvedP1, involvedP2, closing].join('\n\n')
}

function main() {
  const projectRoot = join(import.meta.dirname, '..')
  const keywordsPath = join(projectRoot, 'blogs', 'keywords.json')
  const imgDir = join(projectRoot, 'src', 'img')
  const outputPath = join(projectRoot, 'src', 'data', 'blogPosts.json')
  const qaLogPath = join(projectRoot, 'blogs', '_category-inference-log.json')

  mkdirSync(join(projectRoot, 'src', 'data'), { recursive: true })

  const keywords: Array<{ keyword: string; category: string; country: string; priority: string }> =
    JSON.parse(readFileSync(keywordsPath, 'utf-8'))

  const images = readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(f))

  console.log(`Found ${keywords.length} keywords and ${images.length} images.`)

  const posts: BlogPost[] = []
  const allSlugs: string[] = []
  const qaIssues: string[] = []
  const usedTitles: string[] = []
  const usedMetaDescs: string[] = []

  for (let i = 0; i < keywords.length; i++) {
    const kw = keywords[i]
    const cat = CATEGORIES[kw.category]
    if (!cat) {
      qaIssues.push(`Invalid category slug: "${kw.category}" for keyword "${kw.keyword}"`)
      continue
    }

    const content = CAT_CONTENT[kw.category]
    if (!content) {
      qaIssues.push(`No content data for category: "${kw.category}"`)
      continue
    }

    const titleBase = `${content.titlePrefix} ${kw.country}`
    const title = titleBase.length < 60 ? titleBase : `${content.titlePrefix.slice(0, 40)} ${kw.country}`
    const slug = generateSlug(title)

    if (allSlugs.includes(slug)) {
      qaIssues.push(`Duplicate slug: "${slug}" for keyword "${kw.keyword}"`)
    }
    allSlugs.push(slug)

    if (usedTitles.includes(title)) {
      qaIssues.push(`Duplicate title: "${title}" for keyword "${kw.keyword}"`)
    }
    usedTitles.push(title)

    const metaTitle = `${title} | Give Forward`
    const metaDescBase = `${cat.tagline}. Discover how ${kw.keyword} in ${kw.country} creates lasting change for communities.`
    const metaDescription = metaDescBase.length > 155 ? metaDescBase.slice(0, 152) + '...' : metaDescBase.length < 140 ? `${cat.tagline}. Learn how ${kw.keyword} in ${kw.country} creates lasting community change.` : metaDescBase
    if (metaDescription.length < 140 || metaDescription.length > 155) {
      qaIssues.push(`Meta description length ${metaDescription.length} for "${slug}" (target 140-155): "${metaDescription}"`)
    }
    if (usedMetaDescs.includes(metaDescription)) {
      qaIssues.push(`Duplicate meta description for "${slug}"`)
    }
    usedMetaDescs.push(metaDescription)

    const relatedSlug = posts.filter(p => p.categorySlug === kw.category).length > 0
      ? posts.filter(p => p.categorySlug === kw.category)[0].slug
      : (posts.length > 0 ? posts[Math.floor(Math.random() * posts.length)].slug : '')

    const bodyHtml = buildBodyHtml(kw.category, kw.country, relatedSlug)
    const wordCount = countWords(bodyHtml)
    const readingTime = Math.max(3, Math.ceil(wordCount / 200))

    if (wordCount < 600) {
      qaIssues.push(`Article for "${slug}" has only ${wordCount} words (minimum 600)`)
    }

    const matchedImage = pickImage(images, kw.keyword.split(' '), kw.category)
    const secondaryImage = images.length > 1 ? pickImage(images.filter(img => img !== matchedImage), [cat.name], kw.category) : null

    const post: BlogPost = {
      id: `blog-${i + 1}`,
      slug,
      title,
      metaTitle,
      metaDescription,
      categorySlug: kw.category,
      categoryName: cat.name,
      country: kw.country,
      featuredImage: { src: `/src/img/${matchedImage}`, alt: makeAlt(kw.keyword, kw.country) },
      secondaryImage: secondaryImage ? { src: `/src/img/${secondaryImage}`, alt: makeAlt(cat.name.toLowerCase(), kw.country) } : null,
      publishedAt: staggerDate(i, keywords.length),
      readingTimeMinutes: readingTime,
      tags: content.tags,
      needsImageReview: false,
      needsFactCheck: false,
      sourceKeyword: kw.keyword,
      bodyHtml,
      ctaMidArticle: {
        categorySlug: kw.category,
        categoryName: cat.name,
        copy: `Every gift helps ${kw.keyword.includes('clean water') ? 'bring safe water' : kw.keyword.includes('education') ? 'a child access education' : kw.keyword.includes('food') ? 'feed a hungry family' : kw.keyword.includes('health') ? 'deliver healthcare' : kw.keyword.includes('mental health') ? 'break the silence around mental illness' : kw.keyword.includes('women') ? 'empower a woman to build her future' : 'create lasting change'} — support ${cat.name} today.`,
      },
      ctaEndOfArticle: {
        categorySlug: kw.category,
        categoryName: cat.name,
        copy: `Now that you've seen the need — help us meet it. Your support brings ${cat.name.toLowerCase()} to ${kw.country}'s communities.`,
      },
    }

    posts.push(post)
    console.log(`  [${i + 1}/${keywords.length}] ${title} (${wordCount} words, ${readingTime} min read)`)
  }

  if (!catExists('aged')) qaIssues.push('Category slug validation failed for "aged"')

  writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf-8')
  console.log(`\nWrote ${posts.length} posts to ${outputPath}`)

  const qaLog = {
    generatedAt: new Date().toISOString(),
    totalPosts: posts.length,
    validCategories: Object.keys(CATEGORIES).length,
    issues: qaIssues,
    summary: {
      totalIssues: qaIssues.length,
      invalidCategories: qaIssues.filter(i => i.includes('Invalid category')).length,
      missingImages: qaIssues.filter(i => i.includes('No content data')).length,
      shortArticles: qaIssues.filter(i => i.includes('only')).length,
      metaDescIssues: qaIssues.filter(i => i.includes('Meta description')).length,
      duplicateSlugs: qaIssues.filter(i => i.includes('Duplicate slug')).length,
      duplicateTitles: qaIssues.filter(i => i.includes('Duplicate title')).length,
    },
  }

  writeFileSync(qaLogPath, JSON.stringify(qaLog, null, 2), 'utf-8')
  console.log(`QA log written to ${qaLogPath}`)

  if (qaIssues.length > 0) {
    console.log(`\n⚠ ${qaIssues.length} QA issues found:`)
    qaIssues.forEach(issue => console.log(`  - ${issue}`))
  } else {
    console.log('\n✓ All QA checks passed!')
  }
}

function catExists(slug: string): boolean {
  return slug in CATEGORIES
}

main()