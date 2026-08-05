import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const BASE_URL = 'https://givetoafrica.net'
const BLOGS_DIR = join(ROOT, 'dist', 'blogs', 'african_causes')

const CATEGORIES: Record<string, { name: string; tagline: string; causesFolder: string; lsiBase: string[] }> = {
  'aged': { name: 'Aged Care', tagline: 'Honouring elders with dignity, care, and community', causesFolder: 'Aged_Care', lsiBase: ['elder care', 'aging population', 'community health workers', 'social isolation', 'chronic disease management', 'pension access'] },
  'animals': { name: 'Animal Welfare', tagline: 'Protecting wildlife and supporting livelihoods alongside nature', causesFolder: 'Animal_Welfare', lsiBase: ['wildlife conservation', 'anti-poaching', 'biodiversity', 'eco-tourism', 'habitat restoration', 'human-wildlife conflict'] },
  'children-and-youth': { name: 'Children & Youth', tagline: 'Giving every child the chance to thrive', causesFolder: 'Children_Youth', lsiBase: ['child welfare', 'youth development', 'school nutrition', 'child protection', 'orphan care', 'early childhood'] },
  'education-and-training': { name: 'Education & Training', tagline: 'Opening doors through knowledge and skills', causesFolder: 'Education_Training', lsiBase: ['education access', 'literacy programmes', 'school infrastructure', 'teacher training', 'STEM education', 'scholarship programmes'] },
  'health': { name: 'Healthcare', tagline: 'Bringing quality healthcare to every community', causesFolder: 'Healthcare', lsiBase: ['maternal health', 'disease prevention', 'primary healthcare', 'community health workers', 'medical access', 'public health'] },
  'housing': { name: 'Housing & Shelter', tagline: 'A safe home is the foundation of every community', causesFolder: 'Housing_Shelter', lsiBase: ['affordable housing', 'shelter programmes', 'slum upgrading', 'housing construction', 'land rights', 'safe shelter'] },
  'international': { name: 'International Aid', tagline: 'Delivering aid with accountability and local leadership', causesFolder: 'International_Aid_Relief', lsiBase: ['emergency relief', 'food security', 'humanitarian aid', 'disaster response', 'famine prevention', 'relief operations'] },
  'overseas-aid': { name: 'Overseas Aid & Relief', tagline: 'Rapid, effective relief when communities need it most', causesFolder: 'Overseas_Aid_Relief', lsiBase: ['emergency relief', 'food security', 'humanitarian aid', 'disaster response', 'famine prevention', 'relief operations'] },
  'religious': { name: 'Faith-Based Organisations', tagline: 'Faith in action for communities across Africa', causesFolder: 'Faith_Based', lsiBase: ['faith-based outreach', 'community ministry', 'church programmes', 'mission work', 'spiritual care', 'faith-based development'] },
  'rescue-services': { name: 'Rescue & Emergency Services', tagline: 'First responders when disaster strikes', causesFolder: 'Rescue_Emergency', lsiBase: ['emergency response', 'disaster preparedness', 'search and rescue', 'first aid', 'emergency training', 'crisis management'] },
  'social-welfare': { name: 'Social Welfare', tagline: 'Supporting the most vulnerable members of society', causesFolder: 'Social_Welfare', lsiBase: ['social protection', 'women empowerment', 'savings groups', 'community welfare', 'social safety nets', 'vulnerable populations'] },
  'sport-and-recreation': { name: 'Sport & Recreation', tagline: 'Using sport to build communities and change lives', causesFolder: 'Sport_Recreation', lsiBase: ['sport for development', 'youth sport', 'community recreation', 'physical activity', 'team building', 'sport programmes'] },
  'visual-impairments': { name: 'Visual Impairments', tagline: 'Opening eyes to a world of possibility', causesFolder: 'Visual_Impairments', lsiBase: ['vision care', 'eye health', 'visual rehabilitation', 'braille literacy', 'guide services', 'blindness prevention'] },
  'hearing-impairments': { name: 'Hearing Impairments', tagline: 'Restoring connection through hearing health', causesFolder: 'Hearing_Impairments', lsiBase: ['hearing aid', 'audiology', 'sign language', 'hearing screening', 'deaf education', 'hearing health'] },
  'hospitals': { name: 'Hospital Support', tagline: 'Equipping hospitals to serve their communities', causesFolder: 'Hospital_Support', lsiBase: ['hospital equipment', 'medical infrastructure', 'healthcare staffing', 'hospital supplies', 'clinical training', 'health systems'] },
  'hospices': { name: 'Hospices & Palliative Care', tagline: 'Ensuring dignity and comfort at every stage of life', causesFolder: 'Hospices_Palliative', lsiBase: ['palliative care', 'end of life', 'pain management', 'hospice services', 'comfort care', 'bereavement support'] },
  'mental-health': { name: 'Mental Health', tagline: 'Breaking stigma and building mental health support systems', causesFolder: 'Mental_Health', lsiBase: ['mental health awareness', 'counselling services', 'trauma recovery', 'psychosocial support', 'mental health stigma', 'emotional wellbeing'] },
  'human-rights': { name: 'Human Rights', tagline: 'Defending the rights and dignity of every person', causesFolder: 'Human_Rights', lsiBase: ['human rights advocacy', 'press freedom', 'gender equality', 'legal aid', 'civic participation', 'rights protection'] },
  'culture-and-heritage': { name: 'Culture & Heritage', tagline: "Preserving Africa's rich traditions for future generations", causesFolder: 'Culture_Heritage', lsiBase: ['cultural preservation', 'oral traditions', 'indigenous knowledge', 'heritage conservation', 'traditional crafts', 'cultural identity'] },
  'community': { name: 'Community Development', tagline: 'Building stronger communities from the ground up', causesFolder: 'Community_Development', lsiBase: ['community empowerment', 'rural infrastructure', 'local governance', 'economic development', 'community organising', 'village development'] },
  'environment': { name: 'Environment', tagline: 'Protecting natural resources for future generations', causesFolder: 'Environment', lsiBase: ['reforestation', 'climate resilience', 'renewable energy', 'conservation', 'sustainable agriculture', 'environmental protection'] },
  'employment-trades-and-professions': { name: 'Employment & Skills', tagline: 'Building livelihoods and economic independence', causesFolder: 'Employment_Skills', lsiBase: ['vocational training', 'job creation', 'entrepreneurship', 'microfinance', 'skills development', 'economic empowerment'] },
  'family': { name: 'Family Support', tagline: 'Strengthening families to build resilient communities', causesFolder: 'Family_Support', lsiBase: ['family welfare', 'caregiver support', 'child-headed households', 'family counselling', 'kinship care', 'family strengthening'] },
  'disabled': { name: 'Disability Support', tagline: "Creating inclusion where it's needed most", causesFolder: 'Disability_Support', lsiBase: ['disability inclusion', 'accessibility', 'assistive devices', 'inclusive education', 'rehabilitation services', 'disability rights'] },
  'armed-and-ex-services': { name: 'Armed Forces & Veterans', tagline: 'Restoring lives after conflict and service', causesFolder: 'Armed_Forces_Veterans', lsiBase: ['veteran rehabilitation', 'PTSD treatment', 'ex-combatant reintegration', 'psychosocial support', 'vocational training', 'conflict recovery'] },
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim().slice(0, 80)
}

function extractCategory(keyword: string): string {
  const lower = keyword.toLowerCase()
  for (const [slug, cat] of Object.entries(CATEGORIES)) {
    for (const pattern of cat.lsiBase) {
      if (lower.includes(pattern.toLowerCase())) return slug
    }
  }
  if (lower.includes('child') || lower.includes('youth') || lower.includes('orphan') || lower.includes('student') || lower.includes('school')) return 'children-and-youth'
  if (lower.includes('health') || lower.includes('medical') || lower.includes('clinic') || lower.includes('hospital') || lower.includes('disease') || lower.includes('malaria') || lower.includes('vaccine')) return 'health'
  if (lower.includes('water') || lower.includes('borehole') || lower.includes('sanitation') || lower.includes('hygiene')) return 'international'
  if (lower.includes('women') || lower.includes('gender') || lower.includes('empowerment') || lower.includes('microfinance') || lower.includes('cooperative')) return 'social-welfare'
  if (lower.includes('wildlife') || lower.includes('elephant') || lower.includes('rhino') || lower.includes('poaching') || lower.includes('conservation') || lower.includes('animal') || lower.includes('endangered') || lower.includes('ranger') || lower.includes('pangolin') || lower.includes('gorilla') || lower.includes('chimpanzee') || lower.includes('lion') || lower.includes('vulture') || lower.includes('habitat') || lower.includes('mangrove') || lower.includes('coral')) return 'animals'
  if (lower.includes('education') || lower.includes('school') || lower.includes('teacher') || lower.includes('student') || lower.includes('literacy') || lower.includes('scholarship') || lower.includes('classroom') || lower.includes('textbook') || lower.includes('computer') || lower.includes('e-learning') || lower.includes('kindergarten')) return 'education-and-training'
  if (lower.includes('housing') || lower.includes('shelter') || lower.includes('home') || lower.includes('slum') || lower.includes('affordable')) return 'housing'
  if (lower.includes('employment') || lower.includes('vocational') || lower.includes('job') || lower.includes('entrepreneurship') || lower.includes('business') || lower.includes('micro-loan') || lower.includes('microfinance') || lower.includes('skills') || lower.includes('training')) return 'employment-trades-and-professions'
  if (lower.includes('environment') || lower.includes('tree') || lower.includes('forest') || lower.includes('reforestation') || lower.includes('climate') || lower.includes('solar') || lower.includes('renewable') || lower.includes('conservation') || lower.includes('ecosystem') || lower.includes('biodiversity') || lower.includes('carbon')) return 'environment'
  if (lower.includes('disability') || lower.includes('wheelchair') || lower.includes('inclusive') || lower.includes('prosthetic') || lower.includes('accessibility')) return 'disabled'
  if (lower.includes('armed') || lower.includes('veteran') || lower.includes('military') || lower.includes('conflict') || lower.includes('ex-combatant') || lower.includes('soldier')) return 'armed-and-ex-services'
  if (lower.includes('faith') || lower.includes('church') || lower.includes('christian') || lower.includes('mission') || lower.includes('pastor') || lower.includes('evangelis') || lower.includes('worship') || lower.includes('seminary') || lower.includes('deaf ministry') || lower.includes('prison ministry') || lower.includes('addiction recovery') || lower.includes('youth camp')) return 'religious'
  if (lower.includes('rescue') || lower.includes('emergency') || lower.includes('disaster') || lower.includes('flood') || lower.includes('earthquake') || lower.includes('cyclone') || lower.includes('evacuation')) return 'rescue-services'
  if (lower.includes('human right') || lower.includes('freedom') || lower.includes('advocacy') || lower.includes('press freedom') || lower.includes('gender-based') || lower.includes('legal aid') || lower.includes('civic participation')) return 'human-rights'
  if (lower.includes('culture') || lower.includes('heritage') || lower.includes('tradition') || lower.includes('indigenous') || lower.includes('cultural') || lower.includes('museum') || lower.includes('artisan') || lower.includes('handcraft') || lower.includes('basket-weaving')) return 'culture-and-heritage'
  if (lower.includes('community') || lower.includes('rural') || lower.includes('village') || lower.includes('local') || lower.includes('grassroot')) return 'community'
  if (lower.includes('sport') || lower.includes('recreation') || lower.includes('football') || lower.includes('soccer') || lower.includes('playground') || lower.includes('athletic') || lower.includes('youth sport')) return 'sport-and-recreation'
  if (lower.includes('hearing') || lower.includes('deaf') || lower.includes('audi') || lower.includes('hearing aid') || lower.includes('sign language')) return 'hearing-impairments'
  if (lower.includes('visual') || lower.includes('blind') || lower.includes('vision') || lower.includes('eye') || lower.includes('cataract') || lower.includes('retinopathy')) return 'visual-impairments'
  if (lower.includes('hospice') || lower.includes('palliative') || lower.includes('end of life') || lower.includes('comfort care') || lower.includes('bereavement')) return 'hospices'
  if (lower.includes('mental health') || lower.includes('depression') || lower.includes('trauma') || lower.includes('counselling') || lower.includes('psycholog') || lower.includes('stigma') || lower.includes('psychosocial')) return 'mental-health'
  if (lower.includes('hospital') || lower.includes('medical equipment') || lower.includes('healthcare staffing') || lower.includes 'medical supplies' || lower.includes('clinical training')) return 'hospitals'
  return 'community'
}

function getCountryFromKeyword(keyword: string): string {
  const countries = ['Kenya', 'Tanzania', 'Nigeria', 'Ghana', 'Uganda', 'Ethiopia', 'South Africa', 'Rwanda', 'Mozambique', 'Somalia', 'Madagascar', 'Chad', 'Benin', 'Mali', 'Senegal', 'Burundi', 'Zimbabwe', 'Zambia', 'Liberia', 'Sierra Leone', 'Guinea', 'Namibia', 'Botswana', 'Lesotho', 'Eswatini', 'DRC', 'Cameroon', 'Niger', 'Sudan', 'South Sudan', 'DRC', 'Congo']
  for (const country of countries) {
    if (keyword.toLowerCase().includes(country.toLowerCase())) return country
  }
  return 'Africa'
}

function generateMetaTitle(keyword: string, location: string): string {
  const base = `${keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase()} in ${location}`
  if (base.length <= 60) return base
  return `${base.slice(0, 55)}... | GiveToAfrica`
}

function generateMetaDescription(keyword: string, location: string): string {
  const desc = `Support ${keyword} in ${location}. GiveToAfrica delivers transparent, impactful donations that reach the communities who need them most. Donate today and make a difference.`
  if (desc.length <= 160) return desc
  return desc.slice(0, 157) + '...'
}

function generateArticle(keyword: string, location: string, categorySlug: string): string {
  const cat = CATEGORIES[categorySlug] || CATEGORIES['community']
  const focusKeyword = keyword.toLowerCase()
  const locationLower = location.toLowerCase()
  const categoryName = cat.name

  const h1 = `${keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase()} in ${location}`

  const paragraphs = [
    `<p>${keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase()} in ${location} represents one of the most impactful ways to support sustainable development across the African continent. At GiveToAfrica, we channel donations directly into community-led initiatives that address the root causes of poverty, inequality, and lack of access to essential services. Your contribution, whether large or small, creates lasting change in the lives of vulnerable populations across ${location}.</p>`,
    `<p>Every ${keyword.toLowerCase()} initiative we fund is designed to be transparent, measurable, and community-driven. We partner with local organisations and grassroots leaders who understand the unique challenges facing their communities. This ensures that your donation reaches the people who need it most and creates meaningful, long-term impact.</p>`,
    `<h2>Why ${keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase()} in ${location} Matters</h2>`,
    `<p>The need for ${keyword.toLowerCase()} in ${location} has never been greater. Communities across ${location} face interconnected challenges that require targeted, sustained support. GiveToAfrica has been working across the continent for years, delivering results that you can see and measure.</p>`,
    `<p>When you donate to ${keyword.toLowerCase()} efforts in ${location}, you are not just giving money — you are investing in futures. Families gain access to resources they could never afford on their own. Children get the chance to learn, grow, and thrive. Communities become stronger and more self-sufficient.</p>`,
    `<h3>Our Impact in ${location}</h3>`,
    `<p>GiveToAfrica has supported hundreds of ${keyword.toLowerCase()}-related projects across ${location} and beyond. Our track record of accountability and results means that every shilling, dollar, or euro you donate is put to work effectively. We publish detailed reports on how funds are used, so you always know exactly where your contribution goes.</p>`,
    `<h2>How Your Donation Helps</h2>`,
    `<p>When you choose to ${keyword.toLowerCase()} in ${location} through GiveToAfrica, your donation goes directly to on-the-ground programmes. Here is how your contribution makes a difference:</p>`,
    `<ul><li><strong>Direct community support:</strong> Funds reach local organisations and community leaders who implement ${keyword.toLowerCase()} projects on the ground in ${location}.</li></ul>`,
    `<ul><li><strong>Transparent reporting:</strong> We provide regular updates on how your donation is being used, including photos, stories, and financial reports from the field.</li></ul>`,
    `<ul><li><strong>Sustainable impact:</strong> Our ${keyword.toLowerCase()} initiatives in ${location} are designed to create lasting change, not just temporary relief. We focus on building capacity and empowering communities to help themselves.</li></ul>`,
    `<ul><li><strong>Tax-deductible donations:</strong> GiveToAfrica is a registered 501(c)(3) charity, making your donation tax-deductible in the United States.</li></ul>`,
    `<h2>Ways to Contribute</h2>`,
    `<p>There are many ways to get involved with ${keyword.toLowerCase()} in ${location}. Whether you donate monthly, make a one-time gift, or sponsor a specific project, every contribution counts:</p>`,
    `<ul><li><strong>Monthly giving:</strong> Set up a recurring donation to provide sustained support for ${keyword.toLowerCase()} programmes in ${location}.</li></ul>`,
    `<ul><li><strong>One-time gifts:</strong> Make a single donation to fund a specific ${keyword.toLowerCase()} initiative in ${location}.</li></ul>`,
    `<ul><li><strong>Corporate matching:</strong> If your employer offers matching gift programmes, your donation can be doubled at no extra cost to you.</li></ul>`,
    `<ul><li><strong>Sponsor a project:</strong> Fund a specific ${keyword.toLowerCase()} project in ${location} and receive detailed updates on its progress.</li></ul>`,
    `<h2>Popular ${keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase()} Initiatives in ${location}</h2>`,
    `<p>GiveToAfrica supports a wide range of ${keyword.toLowerCase()} initiatives across ${location}. Our programmes are designed to address the most pressing needs in communities, from education and healthcare to economic empowerment and environmental conservation.</p>`,
    `<h3>Community-Led Development</h3>`,
    `<p>Our ${keyword.toLowerCase()} programmes in ${location} are led by local community members who understand the challenges their communities face. This grassroots approach ensures that solutions are culturally appropriate, sustainable, and effective.</p>`,
    `<h3>Education and Skills Training</h3>`,
    `<p>Education is at the heart of our ${keyword.toLowerCase()} mission in ${location}. We fund school construction, teacher training, scholarship programmes, and vocational training centres that equip young people with the skills they need to build better futures.</p>`,
    `<h3>Healthcare Access</h3>`,
    `<p>Access to quality healthcare remains a challenge in many parts of ${location}. Our ${keyword.toLowerCase()} initiatives fund mobile clinics, medical supplies, health worker training, and hospital equipment upgrades that save lives every day.</p>`,
    `<h3>Economic Empowerment</h3>`,
    `<p>We believe in empowering communities to lift themselves out of poverty. Our ${keyword.toLowerCase()} programmes in ${location} support microfinance, vocational training, cooperative farming, and small business development that create lasting economic opportunities.</p>`,
    `<h2>How to Donate to ${keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase()} in ${location}</h2>`,
    `<p>Donating to ${keyword.toLowerCase()} in ${location} is simple and secure through GiveToAfrica. Our online donation platform accepts credit cards, bank transfers, and cryptocurrency. You can also donate via PayPal or set up a recurring monthly gift.</p>`,
    `<p><strong>To donate by credit card or PayPal:</strong> Visit our donate page at <a href="${BASE_URL}/donate">${BASE_URL}/donate</a> and select ${keyword.toLowerCase()} in ${location} as your cause.</p>`,
    `<p><strong>To donate by bank transfer:</strong> Contact our team at <a href="mailto:info@givetoafrica.net">info@givetoafrica.net</a> for bank details and instructions.</p>`,
    `<p><strong>To donate by check:</strong> Mail your check to GiveToAfrica, P.O. Box 12345, Nairobi, Kenya. Please note ${keyword.toLowerCase()} in ${location} in the memo line.</p>`,
    `<h2>Frequently Asked Questions</h2>`,
    `<p><strong>How can I donate to ${keyword.toLowerCase()} in ${location}?</strong> You can donate online at ${BASE_URL}/donate, by bank transfer, or by check. All donations are tax-deductible.</p>`,
    `<p><strong>What impact does ${keyword.toLowerCase()} have in ${location}?</strong> Our ${keyword.toLowerCase()} programmes in ${location} have reached thousands of beneficiaries, delivering measurable improvements in education, healthcare, and economic opportunity.</p>`,
    `<p><strong>Where does the money go for ${keyword.toLowerCase()} in ${location}?</strong> At least 85% of every donation goes directly to programme costs in ${location}. We maintain transparent financial reporting and publish annual reports.</p>`,
    `<p><strong>Can I sponsor a specific ${keyword.toLowerCase()} project in ${location}?</strong> Yes! You can sponsor a specific project and receive detailed updates on its progress. Contact us at <a href="mailto:info@givetoafrica.net">info@givetoafrica.net</a> for details.</p>`,
    `<p><strong>Is GiveToAfrica a registered charity?</strong> Yes, GiveToAfrica is a registered 501(c)(3) nonprofit organisation. Our tax ID is available on request.</p>`,
    `<h2>Contact Us</h2>`,
    `<p>For more information about ${keyword.toLowerCase()} in ${location}, or to discuss how your donation can make the biggest impact, contact us:</p>`,
    `<ul><li><strong>Email:</strong> <a href="mailto:info@givetoafrica.net">info@givetoafrica.net</a></li></ul>`,
    `<ul><li><strong>Phone:</strong> <a href="tel:+254700000000">+254 700 000 000</a></li></ul>`,
    `<ul><li><strong>WhatsApp:</strong> <a href="https://wa.me/254700000000">Chat with us on WhatsApp</a></li></ul>`,
    `<ul><li><strong>Address:</strong> GiveToAfrica, P.O. Box 12345, Nairobi, Kenya</li></ul>`,
    `<p><a href="${BASE_URL}/donate">Donate now to ${keyword.toLowerCase()} in ${location}</a> and help us build a brighter future for African communities.</p>`,
  ]

  return paragraphs.join('\n')
}

function generateBlogPost(keyword: string): any {
  const categorySlug = extractCategory(keyword)
  const cat = CATEGORIES[categorySlug] || CATEGORIES['community']
  const location = getCountryFromKeyword(keyword)
  const title = `${keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase()} in ${location}`
  const slug = slugify(title)
  const metaTitle = generateMetaTitle(keyword, location)
  const metaDescription = generateMetaDescription(keyword, location)
  const bodyHtml = generateArticle(keyword, location, categorySlug)
  const wordCount = bodyHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length

  return {
    id: `blog-${slug}`,
    title,
    slug,
    categorySlug,
    categoryName: cat.name,
    tagline: cat.tagline,
    metaTitle,
    metaDescription,
    focusKeyword: keyword,
    bodyHtml,
    wordCount,
    publishedAt: new Date().toISOString().split('T')[0],
    url: `${BASE_URL}/blog/${slug}`,
  }
}

function main() {
  const keywordsPath = join(ROOT, 'blog_keywords.txt')
  let keywords: string[] = []

  if (existsSync(keywordsPath)) {
    const content = readFileSync(keywordsPath, 'utf-8')
    keywords = content.split('\n').map((k) => k.trim()).filter(Boolean)
  } else {
    console.log('No blog_keywords.txt file found. Creating sample keywords file.')
    keywords = [
      'donate to help a child in Africa',
      'how to donate to help a child in Africa',
      'donate to feed a child today in Africa',
      'donate to give clean water to a village in Africa',
      'donate to save lives through healthcare in Africa',
      'donate to educate the next generation in Africa',
      'donate to empower African women',
      'donate to support rural African communities',
      'donate to fight hunger in Africa',
      'donate to protect Africa\'s wildlife',
    ]
    writeFileSync(keywordsPath, keywords.join('\n'), 'utf-8')
    console.log(`Created ${keywordsPath} with ${keywords.length} sample keywords.`)
    console.log('Add your full keyword list to this file and re-run the script.')
    return
  }

  console.log(`Processing ${keywords.length} keywords...\n`)

  const posts: any[] = []
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i]
    try {
      const post = generateBlogPost(keyword)

      const categoryDir = join(BLOGS_DIR, post.categorySlug.replace(/[^a-z0-9-]/g, '_'))
      if (!existsSync(categoryDir)) {
        mkdirSync(categoryDir, { recursive: true })
      }

      const postPath = join(categoryDir, `${post.slug}.json`)
      writeFileSync(postPath, JSON.stringify(post, null, 2), 'utf-8')

      posts.push(post)
      successCount++

      if ((i + 1) % 10 === 0) {
        console.log(`  [${i + 1}/${keywords.length}] Generated ${post.slug}`)
      }
    } catch (err) {
      console.error(`  Error processing "${keyword}":`, err)
      errorCount++
    }
  }

  const outputPath = join(ROOT, 'dist', 'blogs', 'generated_posts.json')
  writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf-8')

  console.log(`\nDone! Generated ${successCount} posts, ${errorCount} errors.`)
  console.log(`Posts saved to ${BLOGS_DIR}`)
  console.log(`Summary saved to ${outputPath}`)

  if (successCount > 0) {
    console.log('\nNext steps:')
    console.log('1. Review generated posts for quality')
    console.log('2. Run "npm run build:hostpinnacle" to deploy')
    console.log('3. Submit new URLs to Google Indexing API')
  }
}

main()
