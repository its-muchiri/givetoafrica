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
  if (lower.includes('hospital') || lower.includes('medical equipment') || lower.includes('healthcare staffing') || lower.includes('medical supplies') || lower.includes('clinical training')) return 'hospitals'
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

const TRANSITION_WORDS = [
  'Additionally', 'Furthermore', 'Moreover', 'Therefore', 'However', 'Meanwhile', 'Subsequently', 'Consequently',
  'For instance', 'For example', 'Similarly', 'Likewise', 'As a result', 'In fact', 'Conversely',
  'In addition', 'On the other hand', 'As well as', 'Not only', 'But also', 'In contrast',
  'To illustrate', 'Specifically', 'In particular', 'Above all', 'Most importantly', 'Equally important',
  'First', 'Second', 'Third', 'Finally', 'In summary', 'To conclude', 'Overall',
]

function pickTransition(): string {
  return TRANSITION_WORDS[Math.floor(Math.random() * TRANSITION_WORDS.length)]
}

function shortSentence(maxLen: number = 18): string {
  return ''
}

function generateArticle(keyword: string, location: string, categorySlug: string): string {
  const cat = CATEGORIES[categorySlug] || CATEGORIES['community']
  const focusKeyword = keyword.toLowerCase()
  const categoryName = cat.name
  const lsiKeywords = cat.lsiBase || []
  const h1 = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase() + ' in ' + location

  const parts: string[] = []

  // H1
  parts.push(`<h1>${h1}</h1>`)

// Introduction (expanded)
  parts.push(`<p>${pickTransition()}, ${focusKeyword} in ${location} is one of the most impactful ways to support sustainable development across Africa. At GiveToAfrica, we channel donations directly into community-led initiatives that address poverty, inequality, and lack of access to essential services. Every contribution, no matter the size, creates lasting change for generations to come.</p>`)

  parts.push(`<p>${pickTransition()}, your ${focusKeyword} donation in ${location} reaches the people who need it most. We do not believe in handouts; we believe in hand-ups. Our programmes are designed to be transparent, measurable, and community-driven, ensuring that your contribution creates meaningful, long-term impact.</p>`)

  parts.push(`<p>${pickTransition()}, Africa needs targeted, sustained support now more than ever. From Nairobi to rural Ethiopia, from coastal Mozambique to the Sahel, the need for focused giving has never been greater. GiveToAfrica has built relationships with local partners who understand community needs at the grassroots level.</p>`)

  parts.push(`<p>${pickTransition()}, ${focusKeyword} in ${location} represents a critical opportunity to address some of the continent's most pressing challenges. Communities in ${location} face unique obstacles that require thoughtful, sustained intervention. GiveToAfrica works alongside local organisations to design programmes that are culturally appropriate, economically viable, and environmentally sustainable.</p>`)

  parts.push(`<p>${pickTransition()}, this article provides a comprehensive guide to ${focusKeyword} in ${location}. You will learn why this work matters, how your donation helps, the different ways you can contribute, and answers to frequently asked questions. Whether you are a first-time donor or a seasoned supporter, we hope this resource helps you make an informed decision about how to direct your generosity for maximum impact.</p>`)

  // Why it matters section (expanded)
  parts.push(`<h2>Why ${focusKeyword} in ${location} Matters</h2>`)

  parts.push(`<p>${pickTransition()}, the need for ${focusKeyword} in ${location} has never been greater. Communities across ${location} face interconnected challenges that require targeted, sustained, and well-coordinated support. Poverty, inequality, lack of access to education, inadequate healthcare infrastructure, food insecurity, and climate vulnerability are just some of the factors that compound the difficulties faced by vulnerable populations.</p>`)

  parts.push(`<p>${pickTransition()}, GiveToAfrica delivers results you can see and measure. Our ${focusKeyword} programmes are at the forefront of this effort. ${pickTransition()}, when you donate to ${focusKeyword} efforts in ${location}, you invest in futures. Families gain access to resources they could never afford on their own. Children get the chance to learn, grow, and thrive in environments that nurture their potential.</p>`)

  parts.push(`<p>${pickTransition()}, the impact of ${focusKeyword} in ${location} extends far beyond the immediate beneficiaries. When a child receives proper nutrition through a school meal programme, they are more likely to attend school regularly, perform better academically, and eventually contribute to their community's development. When a village gains access to clean water through a borehole project, the health outcomes improve dramatically.</p>`)

  parts.push(`<p>${pickTransition()}, every ${focusKeyword} initiative we fund is designed with sustainability at its core. We do not simply provide temporary relief; we build capacity, train local leaders, establish community-owned structures, and create systems that continue to deliver impact long after the initial investment. This approach ensures that the benefits of your donation compound over time, reaching more and more people with each passing year.</p>`)

  parts.push(`<p>${pickTransition()}, GiveToAfrica maintains the highest standards of financial accountability and transparency. We publish detailed annual reports, provide regular updates to donors, and undergo independent audits to ensure that every penny is spent effectively. When you choose to ${focusKeyword} in ${location} through GiveToAfrica, you can be confident that your donation is making a real difference.</p>`)

  // Our Services section with 7 H3 subheadings (expanded)
  parts.push(`<h2>Our Services in ${location}</h2>`)

  const serviceHeadings = [
    `Community-Led ${categoryName} Programmes`,
    `Education and Skills Development`,
    `Healthcare Access and Prevention`,
    `Economic Empowerment and Livelihoods`,
    `Environmental Conservation`,
    `Water and Sanitation Infrastructure`,
    `Women and Youth Empowerment`,
  ]

  const serviceParagraphs = [
    `<p>${pickTransition()}, our community-led ${categoryName} programmes in ${location} are designed and managed by local leaders. These grassroots initiatives ensure solutions are culturally appropriate and sustainable. Community members take ownership of their progress, building capacity that lasts for generations. ${pickTransition()}, at least 85% of every donation goes directly to programme costs in ${location}.</p>
<p>${pickTransition()}, our ${categoryName} programmes address the root causes of poverty and inequality in ${location}. We work with community-based organisations to identify the most pressing needs and design targeted interventions. ${pickTransition()}, every programme we fund includes monitoring and evaluation components to ensure measurable results.</p>`,
    `<p>${pickTransition()}, education is at the heart of our ${focusKeyword} mission in ${location}. We fund school construction, teacher training, scholarship programmes, and vocational centres. Our education programmes have helped thousands of children access quality learning opportunities. ${pickTransition()}, we also provide school meals and learning materials to remove barriers to attendance.</p>
<p>${pickTransition()}, we believe that education is the most powerful tool for breaking the cycle of poverty. In ${location}, many children lack access to basic educational resources. Our programmes provide textbooks, classroom supplies, and technology to create stimulating learning environments. ${pickTransition()}, we also support adult literacy programmes that empower parents to engage more effectively in their children's education.</p>`,
    `<p>${pickTransition()}, access to quality healthcare remains a challenge in many parts of ${location}. Our ${focusKeyword} initiatives fund mobile clinics, medical supplies, and health worker training. We focus on preventive care, maternal health, and treatment of common diseases. ${pickTransition()}, our healthcare programmes serve thousands of beneficiaries every year in ${location}.</p>
<p>${pickTransition()}, we work with local health facilities to improve service delivery and expand access to essential medicines. Our programmes train community health workers who provide frontline care in remote areas. ${pickTransition()}, we also support health education campaigns that promote hygiene, nutrition, and disease prevention in ${location}.</p>`,
    `<p>${pickTransition()}, we believe in empowering communities to lift themselves out of poverty. Our ${focusKeyword} programmes support microfinance, vocational training, and small business development. By providing tools, training, and capital, we help people build livelihoods that sustain their families. ${pickTransition()}, economic empowerment creates ripple effects that strengthen entire communities in ${location}.</p>
<p>${pickTransition()}, our economic empowerment programmes in ${location} target both men and women, recognising that inclusive economic growth benefits everyone. We support cooperatives, savings groups, and market linkages that help entrepreneurs scale their businesses. ${pickTransition()}, we also provide business mentorship and networking opportunities that connect local entrepreneurs with broader markets.</p>`,
    `<p>${pickTransition()}, protecting the natural environment is essential for long-term well-being in ${location}. Our ${focusKeyword} initiatives include reforestation, sustainable agriculture training, and clean energy programmes. These efforts protect natural heritage for future generations. ${pickTransition()}, environmental conservation and community development must go hand in hand.</p>
<p>${pickTransition()}, we work with farming communities in ${location} to adopt sustainable agricultural practices that protect soil health and increase yields. Our programmes also promote renewable energy solutions that reduce dependence on firewood and charcoal. ${pickTransition()}, by linking environmental conservation with economic opportunity, we create incentives for communities to protect their natural surroundings.</p>`,
    `<p>${pickTransition()}, access to clean water is fundamental to health and dignity in ${location}. Our ${focusKeyword} programmes include borehole drilling, water purification, and sanitation facility construction. These projects bring clean water to communities that need it most. ${pickTransition()}, every water project we fund reduces disease and frees up time for education and economic activity.</p>
<p>${pickTransition()}, we also support community-led water management committees in ${location} that ensure the sustainability of water infrastructure. These committees train local residents in maintenance and repair, creating jobs and building local capacity. ${pickTransition()}, our water programmes in ${location} have transformed daily life for thousands of families who previously spent hours each day collecting water.</p>`,
    `<p>${pickTransition()}, we are committed to ensuring women and youth in ${location} have equal access to opportunities. Our ${focusKeyword} programmes target barriers that prevent full participation in community life. We support women-led businesses, youth leadership programmes, and skills training. ${pickTransition()}, empowering women and young people creates a more just and prosperous ${location} for everyone.</p>
<p>${pickTransition()}, our women and youth programmes in ${location} provide mentorship, leadership training, and economic opportunities specifically designed for girls and young women. We recognise that investing in women and youth yields the highest returns for community development. ${pickTransition()}, by creating safe spaces and supportive networks, we help the next generation of leaders in ${location} thrive.</p>`,
  ]

  for (let i = 0; i < serviceHeadings.length; i++) {
    parts.push(`<h3>${serviceHeadings[i]}</h3>`)
    parts.push(serviceParagraphs[i])
  }

  // How Your Donation Helps (expanded)
  parts.push(`<h2>How Your Donation Helps</h2>`)

  parts.push(`<p>${pickTransition()}, when you donate to ${focusKeyword} in ${location} through GiveToAfrica, your contribution goes directly to on-the-ground programmes. Funds reach local organisations and community leaders who implement projects in ${location}. These partners understand the unique cultural, social, and economic context of their communities.</p>`)

  parts.push(`<p>${pickTransition()}, we provide transparent reporting on how your donation is used. Donors receive quarterly newsletters, annual impact reports, and personalised updates. You can see the real-world impact of your ${focusKeyword} contribution in ${location}. ${pickTransition()}, we maintain detailed financial records and publish annual reports for full accountability.</p>`)

  parts.push(`<p>${pickTransition()}, your ${focusKeyword} donation in ${location} is tax-deductible in the United States. GiveToAfrica is a registered 501(c)(3) charity. We provide receipts for all donations. ${pickTransition()}, many employers offer matching gift programmes that can double your contribution at no extra cost.</p>`)

  parts.push(`<p>${pickTransition()}, you can also include GiveToAfrica in your will or estate plan. Legacy gifts provide stable, long-term funding for large-scale programmes. ${pickTransition()}, your commitment to ${focusKeyword} in ${location} can continue making a difference for generations to come through planned giving.</p>`)

  parts.push(`<p>${pickTransition()}, corporate donations to ${focusKeyword} in ${location} are welcome and can be structured to maximise tax benefits for your organisation. We work with corporate partners to design giving programmes that align with their CSR goals and create meaningful impact. ${pickTransition()}, your company can become a valued partner in supporting ${focusKeyword} initiatives in ${location}.</p>`)

  // Ways to Contribute (expanded)
  parts.push(`<h2>Ways to Contribute to ${focusKeyword} in ${location}</h2>`)

  parts.push(`<p>${pickTransition()}, there are many meaningful ways to support ${focusKeyword} in ${location}. Whether you donate monthly, make a one-time gift, or sponsor a specific project, every contribution counts and makes a real difference in the lives of people in ${location}.</p>`)

  parts.push(`<p>${pickTransition()}, monthly giving provides sustained support for ${focusKeyword} programmes in ${location}. Monthly donors are the backbone of our organisation, providing predictable funding that allows us to plan long-term projects, hire local staff, and build lasting infrastructure. ${pickTransition()}, even a small monthly contribution of $10 or $25 can fund a child's school supplies for an entire year or provide a family with clean water for a month.</p>`)

  parts.push(`<p>${pickTransition()}, you can donate online at <a href="${BASE_URL}/donate">${BASE_URL}/donate</a>. Our secure platform accepts credit cards, bank transfers, PayPal, and cryptocurrency. ${pickTransition()}, you can also donate by check, stock, or securities for additional tax benefits. Contact us at <a href="mailto:info@givetoafrica.net">info@givetoafrica.net</a> for bank details and instructions.</p>`)

  parts.push(`<p>${pickTransition()}, corporate matching can double your ${focusKeyword} contribution to ${location}. Many companies match employee donations dollar-for-dollar. ${pickTransition()}, you can also sponsor a specific project and receive detailed updates on its progress. Project sponsorship connects you directly with the impact of your donation.</p>`)

  parts.push(`<p>${pickTransition()}, we also accept cryptocurrency donations in Bitcoin, Ethereum, and other major currencies. Cryptocurrency donations are tax-efficient and allow you to support ${focusKeyword} initiatives in ${location} with minimal transaction fees. ${pickTransition()}, contact our crypto team at <a href="mailto:crypto@givetoafrica.net">crypto@givetoafrica.net</a> for wallet addresses and instructions.</p>`)

  // Internal linking section
  parts.push(`<h2>Explore More Ways to Support Africa</h2>`)

  parts.push(`<p>${pickTransition()}, ${focusKeyword} in ${location} is just one of many ways to support transformative change across Africa. Explore our broader range of initiatives:</p>`)

  parts.push(`<ul>`)
  parts.push(`<li><a href="${BASE_URL}/causes">Community Development Causes</a> — Support grassroots projects across the continent</li>`)
  parts.push(`<li><a href="${BASE_URL}/donate">Donate Now</a> — Make a secure online donation today</li>`)
  parts.push(`<li><a href="${BASE_URL}/blog">Blog Posts</a> — Read stories from the communities we serve</li>`)
  parts.push(`<li><a href="${BASE_URL}/impact">Impact Reports</a> — See the measurable results of your generosity</li>`)
  parts.push(`<li><a href="${BASE_URL}/about">About Us</a> — Learn about our mission and history</li>`)
  parts.push(`<li><a href="${BASE_URL}/contact">Contact Us</a> — Get in touch with our team</li>`)
  parts.push(`</ul>`)

  parts.push(`<p>${pickTransition()}, for more information about our work in ${location}, visit our <a href="${BASE_URL}/about">About Us</a> page or contact us at <a href="mailto:info@givetoafrica.net">info@givetoafrica.net</a>. We are always happy to answer questions and help you find the best way to support ${focusKeyword} in ${location}.</p>`)

  // FAQ section with 5 concise FAQs
  parts.push(`<h2>Frequently Asked Questions</h2>`)

  parts.push(`<p><strong>How can I donate to ${focusKeyword} in ${location}?</strong> Visit ${BASE_URL}/donate, select ${focusKeyword} in ${location} as your cause, and complete your donation securely. You can also donate by bank transfer, check, stock, or cryptocurrency. All donations are tax-deductible.</p>`)

  parts.push(`<p><strong>What impact does ${focusKeyword} have in ${location}?</strong> Our ${focusKeyword} programmes in ${location} have reached thousands of beneficiaries. We deliver measurable improvements in education, healthcare, and economic opportunity. We publish detailed impact reports documenting our results.</p>`)

  parts.push(`<p><strong>Where does the money go for ${focusKeyword} in ${location}?</strong> At least 85% of every donation goes directly to programme costs in ${location}. We publish transparent financial reports showing exactly how funds are allocated. Administrative costs are kept to a minimum.</p>`)

  parts.push(`<p><strong>Can I sponsor a specific ${focusKeyword} project?</strong> Yes! You can sponsor a specific project and receive detailed updates. Contact us at <a href="mailto:info@givetoafrica.net">info@givetoafrica.net</a> for current project opportunities and sponsorship packages.</p>`)

  parts.push(`<p><strong>Is GiveToAfrica a registered charity?</strong> Yes, GiveToAfrica is a registered 501(c)(3) nonprofit in the United States. All donations are tax-deductible. We are also registered in Kenya and partner with local organisations in ${location} and across Africa.</p>`)

  // CTA section
  parts.push(`<h2>Make a Difference Today</h2>`)

  parts.push(`<p>${pickTransition()}, your ${focusKeyword} donation in ${location} can transform lives today. Every contribution matters, and together, we can create lasting change that echoes for generations.</p>`)

  parts.push(`<p><a href="${BASE_URL}/donate" style="display:inline-block;padding:12px 24px;background-color:#b87333;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold;">Donate Now to ${focusKeyword} in ${location}</a></p>`)

  parts.push(`<p>${pickTransition()}, if you have questions about how to support ${focusKeyword} in ${location}, please contact us:</p>`)

  parts.push(`<ul>`)
  parts.push(`<li><strong>Email:</strong> <a href="mailto:info@givetoafrica.net">info@givetoafrica.net</a></li>`)
  parts.push(`<li><strong>Phone:</strong> <a href="tel:+254700000000">+254 700 000 000</a></li>`)
  parts.push(`<li><strong>WhatsApp:</strong> <a href="https://wa.me/254700000000">Chat with us on WhatsApp</a></li>`)
  parts.push(`<li><strong>Address:</strong> GiveToAfrica, P.O. Box 12345, Nairobi, Kenya</li>`)
  parts.push(`</ul>`)

  parts.push(`<p>${pickTransition()}, we look forward to working with you to support ${focusKeyword} in ${location}. Together, we can build a brighter future for African communities.</p>`)

  return parts.join('\n')
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
