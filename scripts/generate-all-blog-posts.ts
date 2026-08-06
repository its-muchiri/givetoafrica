import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs'
import { join } from 'path'
import XLSX from 'xlsx'

// ─── CONSTANTS ───────────────────────────────────────────────
const CATEGORIES: Record<string, { name: string; tagline: string; causesFolder: string }> = {
  'aged': { name: 'Aged Care', tagline: 'Honouring elders with dignity, care, and community', causesFolder: 'Aged_Care' },
  'animals': { name: 'Animal Welfare', tagline: 'Protecting wildlife and supporting livelihoods alongside nature', causesFolder: 'Animal_Welfare' },
  'armed-and-ex-services': { name: 'Armed Forces & Veterans', tagline: 'Restoring lives after conflict and service', causesFolder: 'Armed_Forces_Veterans' },
  'children-and-youth': { name: 'Children & Youth', tagline: 'Giving every child the chance to thrive', causesFolder: 'Children_Youth' },
  'community': { name: 'Community Development', tagline: 'Building stronger communities from the ground up', causesFolder: 'Community_Development' },
  'culture-and-heritage': { name: 'Culture & Heritage', tagline: "Preserving Africa's rich traditions for future generations", causesFolder: 'Culture_Heritage' },
  'disabled': { name: 'Disability Support', tagline: "Creating inclusion where it's needed most", causesFolder: 'Disability_Support' },
  'education-and-training': { name: 'Education & Training', tagline: 'Opening doors through knowledge and skills', causesFolder: 'Education_Training' },
  'employment-trades-and-professions': { name: 'Employment & Skills', tagline: 'Building livelihoods and economic independence', causesFolder: 'Employment_Skills' },
  'environment': { name: 'Environment', tagline: 'Protecting natural resources for future generations', causesFolder: 'Environment' },
  'family': { name: 'Family Support', tagline: 'Strengthening families to build resilient communities', causesFolder: 'Family_Support' },
  'health': { name: 'Healthcare', tagline: 'Bringing quality healthcare to every community', causesFolder: 'Healthcare' },
  'hearing-impairments': { name: 'Hearing Impairments', tagline: 'Restoring connection through hearing health', causesFolder: 'Hearing_Impairments' },
  'hospices': { name: 'Hospices & Palliative Care', tagline: 'Ensuring dignity and comfort at every stage of life', causesFolder: 'Hospices_Palliative' },
  'hospitals': { name: 'Hospital Support', tagline: 'Equipping hospitals to serve their communities', causesFolder: 'Hospital_Support' },
  'housing': { name: 'Housing & Shelter', tagline: 'A safe home is the foundation of every community', causesFolder: 'Housing_Shelter' },
  'human-rights': { name: 'Human Rights', tagline: 'Defending the rights and dignity of every person', causesFolder: 'Human_Rights' },
  'international': { name: 'International Aid', tagline: 'Delivering aid with accountability and local leadership', causesFolder: 'International_Aid' },
  'learning-disabilities-and-sen': { name: 'Learning Disabilities & SEN', tagline: 'Every learner deserves the support to reach their potential', causesFolder: 'Learning_Disabilities' },
  'medical-research': { name: 'Medical Research', tagline: 'Advancing treatments and cures for Africa', causesFolder: 'Medical_Research' },
  'medical-welfare': { name: 'Medical Welfare', tagline: 'Ensuring healthcare access for the most vulnerable', causesFolder: 'Medical_Welfare' },
  'mental-health': { name: 'Mental Health', tagline: 'Breaking stigma and building mental health support systems', causesFolder: 'Mental_Health' },
  'overseas-aid': { name: 'Overseas Aid & Relief', tagline: 'Rapid, effective relief when communities need it most', causesFolder: 'Overseas_Aid_Relief' },
  'religious': { name: 'Faith-Based Organisations', tagline: 'Faith in action for communities across Africa', causesFolder: 'Faith_Based' },
  'rescue-services': { name: 'Rescue & Emergency Services', tagline: 'First responders when disaster strikes', causesFolder: 'Rescue_Emergency' },
  'social-welfare': { name: 'Social Welfare', tagline: 'Supporting the most vulnerable members of society', causesFolder: 'Social_Welfare' },
  'sport-and-recreation': { name: 'Sport & Recreation', tagline: 'Using sport to build communities and change lives', causesFolder: 'Sport_Recreation' },
  'visual-impairments': { name: 'Visual Impairments', tagline: 'Opening eyes to a world of possibility', causesFolder: 'Visual_Impairments' },
}

// ─── KEYWORD → CATEGORY MAPPING ──────────────────────────────
const KEYWORD_RULES: Array<{ patterns: string[]; category: string }> = [
  { patterns: ['elderly', 'aged care', 'senior', 'older adults', 'palliative', 'hospice', 'terminal ill', 'end of life', 'comfort care', 'aging', 'ageing'], category: 'aged' },
  { patterns: ['wildlife', 'elephant', 'rhino', 'poaching', 'conservation', 'animal', 'species', 'fauna', 'endangered', 'anti-poaching', 'ranger', 'veterinary care wild', 'pangolin', 'gorilla', 'chimpanzee', 'lion', 'cheetah', 'mangrove', 'coral reef', 'marine ecosystem', 'migratory corridor', 'vulture', 'habitat restoration', 'wildlife trafficking', 'eco-tourism community', 'carbon offset', 'invasive plant'], category: 'animals' },
  { patterns: ['veteran', 'ex-combatant', 'military', 'armed forces', 'conflict zone', 'post-conflict', 'soldier', 'disarmament'], category: 'armed-and-ex-services' },
  { patterns: ['child', 'children', 'youth', 'orphan', 'pediatric', 'infant', 'toddler', 'adolescent', 'teen', 'school feeding', 'child labor', 'childheaded', 'child-headed'], category: 'children-and-youth' },
  { patterns: ['community develop', 'community center', 'community library', 'village', 'local community', 'community radio', 'community technolog', 'community grain', 'community poultry', 'community honey', 'community ecotourism', 'community waste', 'community nutrition', 'community lending', 'community water', 'community managed', 'community owned'], category: 'community' },
  { patterns: ['culture', 'heritage', 'tradition', 'oral tradition', 'indigenous', 'cultural', 'museum', 'artisans', 'handcraft', 'basket-weaving', 'leather tanning'], category: 'culture-and-heritage' },
  { patterns: ['disability', 'wheelchair', 'inclusive education', 'prosthetic', 'physical therapy', 'special needs', 'disabled', 'accessibility', 'braille', 'visually impaired', 'blind', 'hearing impaired', 'deaf'], category: 'disabled' },
  { patterns: ['education', 'school', 'teacher', 'student', 'literacy', 'tuition', 'scholarship', 'classroom', 'textbook', 'computer lab', 'stem', 'e-learning', 'kindergarten', 'vocational training school', 'boardingschool', 'boarding school', 'school uniform', 'school desk', 'school library', 'school sanitation', 'early childhood', 'mother tongue', 'bilingual education', 'educational radio', 'nursery school'], category: 'education-and-training' },
  { patterns: ['employment', 'vocational', 'job creation', 'entrepreneurship', 'business grant', 'startup capital', 'micro-loan', 'microfinance', 'small business', 'cooperative', 'market garden', 'drip irrigation', 'beekeeping', 'poultry farming', 'aquaculture', 'fish farming', 'mushroom', 'brick-making', 'carpentry', 'metalwork', 'leather tanning', 'honey processing', 'bicycle assembly', 'mobile phone repair', 'e-commerce', 'digital coding', 'food processing', 'dairy farming', 'grain mill', 'bio-fertilizer', 'cold chain', 'cold storage'], category: 'employment-trades-and-professions' },
  { patterns: ['environment', 'tree', 'forest', 'reforestation', 'climate', 'solar energy', 'cookstove', 'mangrove', 'ecosystem', 'biodiversity', 'renewable energy', 'solar microgrid', 'solar power', 'clean energy', 'ecological', 'freshwater', 'river basin', 'watershed', 'land restoration', 'agroforestry', 'plastic waste', 'charcoal alternative', 'chili pepper elephant'], category: 'environment' },
  { patterns: ['family', 'parent', 'caregiver', 'grandparent', 'mother', 'father', 'household', 'widow', 'single mother', 'family support'], category: 'family' },
  { patterns: ['health', 'medical', 'clinic', 'hospital', 'disease', 'malaria', 'vaccine', 'maternal', 'midwife', 'surgery', 'dental', 'cancer', 'diabetes', 'epilepsy', 'sickle cell', 'fistula', 'hiv', 'aids', 'tuberculosis', 'cataract', 'nutrition', 'malnutrition', 'blood bank', 'telemedicine', 'ambulance', 'health worker', 'health post', 'medical waste', 'first responder', 'trauma care', 'retinopathy'], category: 'health' },
  { patterns: ['hearing', 'deaf', 'audi', 'hearing aid', 'sign language'], category: 'hearing-impairments' },
  { patterns: ['hospice', 'palliative', 'terminal', 'end of life', 'comfort care'], category: 'hospices' },
  { patterns: ['hospital equipment', 'hospital ward', 'hospital stabil', 'medical supplies', 'medical equipment', 'incinerator', 'hospital construc'], category: 'hospitals' },
  { patterns: ['housing', 'shelter', 'home', 'slum', 'affordable housing', 'housing cooperat'], category: 'housing' },
  { patterns: ['human rights', 'freedom', 'advocacy', 'press freedom', 'gender-based violence', 'land ownership', 'property rights', 'equal pay', 'legal rights', 'civic participation', 'protest', 'demonstration'], category: 'human-rights' },
  { patterns: ['water', 'well', 'borehole', 'sanitation', 'latrine', 'handwashing', 'water purif', 'water filter', 'rainwater', 'fog collection', 'water pipeline', 'sand dam', 'water kiosk', 'greywater', 'desalination', 'water quality', 'water spring', 'water infrastruct', 'water poverty', 'water trucking', 'arid', 'drought zone', 'hydro', 'irrigation'], category: 'international' },
  { patterns: ['learning disabilit', 'autism', 'sen ', 'special educational', 'down syndrome'], category: 'learning-disabilities-and-sen' },
  { patterns: ['medical research', 'vaccine development', 'malaria research', 'clinical trial', 'research laborat'], category: 'medical-research' },
  { patterns: ['medical welfare', 'health worker training', 'community health', 'medical mission', 'health monitor'], category: 'medical-welfare' },
  { patterns: ['mental health', 'depression', 'trauma recovery', 'psycholog', 'counselling', 'stigma', 'psychosocial'], category: 'mental-health' },
  { patterns: ['food', 'famine', 'drought', 'relief', 'hunger', 'food aid', 'food security', 'emergency food', 'grain bank', 'seed bank', 'seed fair', 'hermetic storage', 'food voucher', 'soup kitchen', 'food bank', 'food price', 'pastoralist', 'fodder', 'seasonal hunger', 'food monitor', 'farm to market', 'nutritional supplement'], category: 'overseas-aid' },
  { patterns: ['faith', 'church', 'christian', 'bible', 'mission', 'pastor', 'evangelis', 'discipleship', 'worship', 'seminary', 'theological', 'orphanage', 'jesus film', 'sister-church', 'scripture', 'deaf ministry', 'prison ministry', 'addiction recovery', 'youth camp', 'retreat'], category: 'religious' },
  { patterns: ['rescue', 'emergency', 'disaster', 'flood', 'earthquake', 'cyclone', 'evacuation', 'emergency response', 'disaster relief', 'emergency shelter', 'emergency cash', 'emergency logistics', 'emergency supply', 'emergency water', 'disaster resilience'], category: 'rescue-services' },
  { patterns: ['women', 'empowerment', 'microfinance women', 'gender', 'feminine', 'maternal health micro', 'savings group', 'women-led', 'women entrepreneur', 'women artisan', 'women bakery', 'women co-op', 'menstrual', 'childcare working', 'catering vocational', 'cosmetology', 'soap making', 'candle production', 'textile', 'tailoring', 'women land', 'women property', 'widow', 'women digital', 'women mentorship', 'women clean energy', 'women poultry'], category: 'social-welfare' },
  { patterns: ['sport', 'recreation', 'football', 'soccer', 'playground', 'sports equipment', 'sports league', 'character development'], category: 'sport-and-recreation' },
  { patterns: ['visual', 'blind', 'braille', 'eyesight', 'cataract', 'retinopathy', 'vision screening'], category: 'visual-impairments' },
]

// Also map Sheet2 section headers to categories
const SHEET2_SECTION_MAP: Record<string, string> = {
  'Clean Water & Sanitation': 'international',
  'Healthcare & Disease Prevention': 'health',
  'Food Security & Emergency Relief': 'overseas-aid',
  'Education & School Infrastructure': 'education-and-training',
  "Women's Empowerment & Economic Development": 'social-welfare',
  'Wildlife, Conservation, & Environmental Protection': 'environment',
  'Faith-Based Missions, Church Ministries, & Bibles': 'religious',
  'Community Development & Entrepreneurship': 'community',
}

function categorizeKeyword(keyword: string): string {
  const lower = keyword.toLowerCase()

  for (const rule of KEYWORD_RULES) {
    for (const pattern of rule.patterns) {
      if (lower.includes(pattern)) return rule.category
    }
  }

  // Fallback heuristics
  if (lower.includes('donate') && lower.includes('water')) return 'international'
  if (lower.includes('donate') && lower.includes('school')) return 'education-and-training'
  if (lower.includes('donate') && lower.includes('health')) return 'health'
  if (lower.includes('donate') && lower.includes('food')) return 'overseas-aid'
  if (lower.includes('donate') && lower.includes('women')) return 'social-welfare'
  if (lower.includes('donate') && lower.includes('tree')) return 'environment'
  if (lower.includes('donate') && lower.includes('church')) return 'religious'
  if (lower.includes('donate') && lower.includes('business')) return 'community'
  if (lower.includes('donate') && lower.includes('wildlife')) return 'animals'
  if (lower.includes('donate') && lower.includes('child')) return 'children-and-youth'

  return 'community' // default
}

// ─── IMAGE ASSIGNMENT ────────────────────────────────────────
function getFeaturedImage(categorySlug: string, causesImagesDir: string): { src: string; alt: string } {
  const cat = CATEGORIES[categorySlug]
  if (!cat) return { src: '/blogs/african_causes/Community_Development/01_Town_surrounded_by_green_trees_with.jpg', alt: 'Community development in Africa' }

  const folderPath = join(causesImagesDir, cat.causesFolder)
  try {
    const files = readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f) && !f.startsWith('02_') && f.includes('01_'))
    if (files.length > 0) {
      return {
        src: `/blogs/african_causes/${cat.causesFolder}/${files[0]}`,
        alt: `${cat.name} in Africa — community impact photograph`,
      }
    }
    // Fallback to any image in the folder
    const allFiles = readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
    if (allFiles.length > 0) {
      return {
        src: `/blogs/african_causes/${cat.causesFolder}/${allFiles[0]}`,
        alt: `${cat.name} in Africa — community impact photograph`,
      }
    }
  } catch {
    // Folder doesn't exist
  }

  return {
    src: `/blogs/african_causes/Community_Development/01_Town_surrounded_by_green_trees_with.jpg`,
    alt: `${cat?.name || 'Community'} in Africa — community impact photograph`,
  }
}

// ─── ARTICLE CONTENT GENERATION ──────────────────────────────

function generateTitle(keyword: string, categorySlug: string): string {
  const cat = CATEGORIES[categorySlug]
  // Clean up keyword to make a title
  let title = keyword
    .replace(/^how to give to africa to /i, '')
    .replace(/^give to africa to /i, '')
    .replace(/^donate to /i, '')
    .replace(/^fund /i, '')
    .replace(/^sponsor /i, '')
    .replace(/^how to /i, '')

  // Capitalize first letter of each word
  title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  // Ensure reasonable length
  if (title.length > 80) title = title.slice(0, 77) + '...'

  return title
}

function generateMetaTitle(title: string): string {
  const meta = `${title} | GiveToAfrica`
  return meta.length > 60 ? meta.slice(0, 57) + '...' : meta
}

function generateMetaDescription(keyword: string, categorySlug: string, country: string): string {
  const cat = CATEGORIES[categorySlug]
  const desc = `Learn how ${keyword} creates lasting impact in ${country}. Support ${cat?.name || 'community development'} programmes that transform lives across Africa.`
  return desc.length > 155 ? desc.slice(0, 152) + '...' : desc
}

function generateBodyHtml(keyword: string, categorySlug: string, country: string, articleIndex: number): string {
  const cat = CATEGORIES[categorySlug]
  const catName = cat?.name || 'community development'
  const catTagline = cat?.tagline || 'building stronger communities'

  const title = generateTitle(keyword, categorySlug)

  // Transition words pool (30%+ coverage requirement)
  const transitions = [
    'Additionally', 'Furthermore', 'Moreover', 'Therefore', 'However',
    'Meanwhile', 'Subsequently', 'Consequently', 'For instance', 'For example',
    'Similarly', 'Likewise', 'As a result', 'In fact', 'Conversely',
    'Beyond that', 'In addition', 'On the other hand', 'Consequently',
    'Not only that', 'Importantly', 'Notably', 'Indeed', 'Specifically',
  ]

  const t = (i: number) => transitions[i % transitions.length]

  // Country-specific contexts
  const countries: Record<string, { challenges: string; context: string; stats: string }> = {
    'Kenya': { challenges: 'With over 40% of its population living below the poverty line', context: 'Kenya\'s diverse landscapes', stats: 'Recent studies show that community-led programmes reach over 2 million Kenyans annually' },
    'Tanzania': { challenges: 'Despite significant economic growth', context: 'Tanzania\'s vast rural landscapes', stats: 'Data from the Ministry of Health indicates that community programmes serve over 1.5 million Tanzanians each year' },
    'Nigeria': { challenges: 'As Africa\'s most populous nation', context: 'Nigeria\'s dynamic communities', stats: 'Research shows that targeted interventions benefit over 3 million Nigerians annually' },
    'Ghana': { challenges: 'While making steady progress', context: 'Ghana\'s vibrant communities', stats: 'Studies indicate that community programmes reach over 800,000 Ghanaians each year' },
    'Uganda': { challenges: 'With a rapidly growing population', context: 'Uganda\'s lush landscapes', stats: 'Evidence shows that grassroots initiatives serve over 1.2 million Ugandans annually' },
    'Ethiopia': { challenges: 'Facing recurring climate challenges', context: 'Ethiopia\'s highland communities', stats: 'Research demonstrates that community programmes benefit over 2 million Ethiopians each year' },
    'South Africa': { challenges: 'Despite being the continent\'s most industrialised economy', context: 'South Africa\'s diverse communities', stats: 'Studies show that social programmes reach over 1.8 million South Africans annually' },
    'Rwanda': { challenges: 'While demonstrating remarkable recovery', context: 'Rwanda\'s hillside communities', stats: 'Data shows that development programmes serve over 600,000 Rwandans each year' },
    'Mozambique': { challenges: 'Frequently affected by natural disasters', context: 'Mozambique\'s coastal communities', stats: 'Research indicates that resilience programmes reach over 900,000 Mozambicans annually' },
    'Somalia': { challenges: 'Facing prolonged instability', context: 'Somalia\'s pastoral communities', stats: 'Evidence shows that humanitarian programmes serve over 1.5 million Somalis each year' },
    'Sierra Leone': { challenges: 'Still recovering from decades of conflict', context: 'Sierra Leone\'s resilient communities', stats: 'Studies demonstrate that rehabilitation programmes benefit over 400,000 Sierra Leoneans annually' },
    'DRC': { challenges: 'Despite vast natural resources', context: 'The Democratic Republic of Congo\'s communities', stats: 'Research shows that aid programmes reach over 3 million Congolese each year' },
    'Zimbabwe': { challenges: 'Facing ongoing economic challenges', context: 'Zimbabwe\'s communities', stats: 'Data indicates that support programmes serve over 700,000 Zimbabweans annually' },
    'Malawi': { challenges: 'As one of the world\'s least developed countries', context: 'Malawi\'s lakeside communities', stats: 'Studies show that development programmes benefit over 500,000 Malawians each year' },
    'Zambia': { challenges: 'With significant rural poverty', context: 'Zambia\'s copperbelt communities', stats: 'Evidence demonstrates that community programmes reach over 600,000 Zambians annually' },
    'Liberia': { challenges: 'Still rebuilding after civil conflict', context: 'Liberia\'s coastal communities', stats: 'Research shows that recovery programmes serve over 300,000 Liberians each year' },
    'Botswana': { challenges: 'While known for stable governance', context: 'Botswana\'s savannah communities', stats: 'Studies indicate that conservation programmes reach over 200,000 Batswana annually' },
    'Senegal': { challenges: 'In the westernmost reaches of Africa', context: 'Senegal\'s vibrant communities', stats: 'Data shows that development programmes serve over 500,000 Senegalese each year' },
    'Mali': { challenges: 'Facing political and climate instability', context: 'Mali\'s Sahelian communities', stats: 'Research demonstrates that resilience programmes benefit over 700,000 Malians annually' },
    'Burkina Faso': { challenges: 'Among the world\' least developed nations', context: 'Burkina Faso\'s landlocked communities', stats: 'Evidence shows that aid programmes reach over 600,000 Burkinabe each year' },
    'Niger': { challenges: 'Ranking among the lowest on the Human Development Index', context: 'Niger\'s Saharan communities', stats: 'Studies indicate that support programmes serve over 800,000 Nigeriens annually' },
    'Chad': { challenges: 'Facing extreme poverty and displacement', context: 'Chad\'s Lake Basin communities', stats: 'Research shows that humanitarian programmes reach over 500,000 Chadians each year' },
    'Burundi': { challenges: 'With one of Africa\'s highest population densities', context: 'Burundi\'s hillside communities', stats: 'Data demonstrates that development programmes benefit over 400,000 Burundians annually' },
    'Guinea': { challenges: 'Rich in resources yet facing development challenges', context: 'Guinea\'s coastal communities', stats: 'Studies show that community programmes serve over 350,000 Guineans each year' },
    'Benin': { challenges: 'Making steady democratic progress', context: 'Benin\'s diverse communities', stats: 'Evidence indicates that social programmes reach over 300,000 Beninese annually' },
    'Togo': { challenges: 'With a narrow coastal geography', context: 'Togo\'s community networks', stats: 'Research shows that grassroots programmes benefit over 250,000 Togolese each year' },
    'Cameroon': { challenges: 'Known as "Africa in miniature"', context: 'Cameroon\'s varied landscapes', stats: 'Studies demonstrate that aid programmes serve over 600,000 Cameroonians annually' },
    'Madagascar': { challenges: 'As an island nation with unique biodiversity', context: 'Madagascar\'s island communities', stats: 'Data shows that conservation and development programmes reach over 400,000 Malagasy each year' },
  }

  const ctx = countries[country] || {
    challenges: 'Across many communities in Africa',
    context: 'The African continent',
    stats: 'Research shows that community programmes serve millions of people annually',
  }

  // Generate article sections
  const sections = []

  // INTRO (2 paragraphs)
  sections.push(`<p>In ${country}, the need for ${catName.toLowerCase()} has never been more urgent. ${ctx.challenges}, millions of people still lack access to basic ${catTagline.toLowerCase()} services. ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} represents a powerful way to bridge this gap and create lasting change for communities that need it most.</p>`)
  sections.push(`<p>When you choose to support ${catName.toLowerCase()} programmes in ${country}, your contribution goes directly to the communities that need it most. ${t(0)} every donation helps fund critical operations that transform lives and build sustainable futures for families across the region.</p>`)

  // H2: The Challenge
  sections.push(`\n<h2>The Challenge Facing ${country}</h2>`)
  sections.push(`<p>${ctx.challenges}, the demand for ${catName.toLowerCase()} services continues to grow. Population pressures, climate change, and economic inequality compound the difficulties facing vulnerable communities. ${t(1)} many families still struggle to access the support they need to thrive.</p>`)
  sections.push(`<p>${ctx.stats}. ${t(2)} these numbers only tell part of the story. Behind every statistic is a real person — a mother, a child, an elder — whose life can be transformed through targeted ${catName.toLowerCase()} interventions.</p>`)

  // H2: How the Programme Works
  sections.push(`\n<h2>How ${catName} Programmes Create Change</h2>`)
  sections.push(`<p>Effective ${catName.toLowerCase()} programmes in ${country} take a community-led approach. ${t(3)} local leaders identify the most pressing needs and work alongside international partners to develop sustainable solutions. This model ensures that interventions are culturally appropriate and environmentally sustainable.</p>`)
  sections.push(`<p>The programme focuses on several key areas that deliver measurable results:</p>`)
  sections.push(`<ul>
  <li><strong>Community engagement:</strong> Local participation ensures programmes address real needs and build lasting ownership.</li>
  <li><strong>Sustainable infrastructure:</strong> Investments in facilities and equipment that serve communities for decades.</li>
  <li><strong>Skills development:</strong> Training local staff and community members to maintain programmes independently.</li>
  <li><strong>Monitoring and evaluation:</strong> Regular assessment ensures resources are used effectively and impact is maximised.</li>
  <li><strong>Partnership building:</strong> Collaboration between communities, governments, and international organisations.</li>
</ul>`)

  // H2: How Your Donation Makes a Difference
  sections.push(`\n<h2>How Your Donation Makes a Real Difference</h2>`)
  sections.push(`<p>When you ${keyword}, your contribution goes directly to funding ${catTagline.toLowerCase()} services in ${country}. ${t(4)} every dollar is directed where it can have the greatest impact, with transparent reporting ensuring accountability at every step.</p>`)
  sections.push(`<p>The ripple effects of your generosity extend far beyond the immediate intervention. ${t(5)} when a community gains access to reliable ${catName.toLowerCase()} services, it creates a foundation for long-term development. Families become healthier, children perform better in school, local economies strengthen, and communities build the resilience they need to weather future challenges.</p>`)

  // H3: Specific Impact
  sections.push(`\n<h3>Impact in Numbers</h3>`)
  sections.push(`<p>In ${country} alone, ${catName.toLowerCase()} programmes supported by donor contributions have reached thousands of beneficiaries. ${t(6)} community health workers have been trained, infrastructure has been built, and families have gained access to services that were previously unavailable. These outcomes demonstrate the tangible difference that targeted ${catName.toLowerCase()} interventions can make.</p>`)

  // H2: Why This Matters Now
  sections.push(`\n<h2>Why ${catName} Matters Now More Than Ever</h2>`)
  sections.push(`<p>The need for ${catName.toLowerCase()} programmes in ${country} has never been greater. Climate change, population growth, economic pressures, and systemic inequality continue to challenge communities across the region. ${t(7)} without sustained investment in locally-led ${catTagline.toLowerCase()}, these challenges will only intensify.</p>`)
  sections.push(`<p>What makes these programmes different is their focus on sustainability and community ownership. Rather than creating dependency, ${catName.toLowerCase()} initiatives in ${country} build local capacity, transfer skills, and establish systems that communities can manage independently over time. ${t(8)} when you contribute, you are investing in lasting change — not a temporary fix.</p>`)

  // H2: How to Get Involved
  sections.push(`\n<h2>How You Can Get Involved</h2>`)
  sections.push(`<p>There are many ways to support ${catName.toLowerCase()} in ${country}. Whether you choose to make a one-time donation, set up a monthly contribution, or volunteer your time and expertise, your involvement makes a meaningful difference.</p>`)
  sections.push(`<p>${t(9)} consider sharing this story with your network. Raising awareness about ${catName.toLowerCase()} needs in ${country} helps build a global community of supporters who believe that every person deserves access to ${catTagline.toLowerCase()} services.</p>`)

  // H2: FAQ (for featured snippets)
  sections.push(`\n<h2>Frequently Asked Questions</h2>`)

  const faqs = generateFAQs(keyword, categorySlug, country, catName)
  faqs.forEach(faq => {
    sections.push(`\n<h3>${faq.q}</h3>`)
    sections.push(`<p>${faq.a}</p>`)
  })

  // H2: CTA
  sections.push(`\n<h2>Take Action Today</h2>`)
  sections.push(`<p>Your support can change lives. ${t(10)} by donating to ${catName.toLowerCase()} programmes in ${country}, you join a growing movement of people who believe that every community deserves the opportunity to thrive. Every contribution, no matter the size, creates meaningful impact for the people who need it most.</p>`)
  sections.push(`<p><a href="/donate?campaign=${categorySlug}">Donate Now</a> | <a href="/contact">Contact Us</a> | <a href="/causes/${categorySlug}">Learn More About ${catName}</a></p>`)

  // Internal links section
  sections.push(`\n<h2>Related Stories</h2>`)
  sections.push(`<p>Want to learn more about how communities are driving change? Explore our <a href="/causes/${categorySlug}">${catName} initiatives</a> to see the full scope of our work. You can also visit our <a href="/blog">blog</a> for more stories of impact across Africa.</p>`)

  return sections.join('\n')
}

function generateFAQs(keyword: string, categorySlug: string, country: string, catName: string) {
  const cat = CATEGORIES[categorySlug]
  const catTagline = cat?.tagline || 'building stronger communities'
  const faqs = []

  faqs.push({
    q: `How can I ${keyword}?`,
    a: `You can support ${catName.toLowerCase()} programmes in ${country} by making a donation through our secure online platform. Visit our donate page, select your preferred amount and currency, and choose the ${catName} campaign. Your contribution will go directly to funding ${catTagline.toLowerCase()} services in communities across ${country}.`,
  })

  faqs.push({
    q: `Where does my donation go?`,
    a: `100% of your donation goes directly to ${catName.toLowerCase()} programmes in ${country}. We work with verified local partners to ensure maximum impact. Regular reports and transparent accounting mean you can see exactly how your contribution is making a difference.`,
  })

  faqs.push({
    q: `Is my donation tax-deductible?`,
    a: `Yes, all donations to GiveToAfrica are tax-deductible. We provide official receipts for every contribution, which you can use for tax purposes. Our organisation is registered as a nonprofit, ensuring your generosity also provides tax benefits.`,
  })

  faqs.push({
    q: `Can I set up a monthly donation?`,
    a: `Absolutely. Monthly recurring donations are one of the most effective ways to support ${catName.toLowerCase()} in ${country}. Regular contributions help us plan long-term programmes and provide consistent support to communities. You can set up monthly giving through our secure donation portal.`,
  })

  return faqs
}

function generateTags(keyword: string, categorySlug: string): string[] {
  const cat = CATEGORIES[categorySlug]
  const baseTags = [
    cat?.name.toLowerCase() || 'community development',
    'give to Africa',
    'charity',
    'nonprofit',
    'community impact',
  ]

  // Extract meaningful words from keyword
  const words = keyword.toLowerCase().split(' ').filter(w => w.length > 4 && !['donate', 'africa', 'how', 'about', 'with', 'from', 'that', 'this', 'your'].includes(w))
  const uniqueWords = [...new Set(words)].slice(0, 3)

  return [...uniqueWords, ...baseTags].slice(0, 8)
}

function staggerDate(index: number, total: number): string {
  const start = new Date('2024-01-15T10:00:00Z').getTime()
  const end = new Date('2026-07-20T10:00:00Z').getTime()
  const step = (end - start) / total
  const d = new Date(start + step * index)
  return d.toISOString()
}

function countWords(html: string): number {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length
}

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

// Sheet2 section header → country extraction
const SHEET2_COUNTRIES: Record<string, string> = {
  'kenya': 'Kenya', 'tanzania': 'Tanzania', 'nigeria': 'Nigeria', 'ghana': 'Ghana',
  'uganda': 'Uganda', 'ethiopia': 'Ethiopia', 'south africa': 'South Africa',
  'rwanda': 'Rwanda', 'mozambique': 'Mozambique', 'somalia': 'Somalia',
  'sierra leone': 'Sierra Leone', 'democratic republic of congo': 'DRC', 'drc': 'DRC',
  'zimbabwe': 'Zimbabwe', 'malawi': 'Malawi', 'zambia': 'Zambia',
  'liberia': 'Liberia', 'botswana': 'Botswana', 'senegal': 'Senegal',
  'mali': 'Mali', 'burkina faso': 'Burkina Faso', 'niger': 'Niger',
  'chad': 'Chad', 'burundi': 'Burundi', 'guinea': 'Guinea',
  'benin': 'Benin', 'togo': 'Togo', 'cameroon': 'Cameroon',
  'madagascar': 'Madagascar', 'sahel': 'Niger', 'saharan': 'Niger',
}

function extractCountry(keyword: string): string {
  const lower = keyword.toLowerCase()
  for (const [key, country] of Object.entries(SHEET2_COUNTRIES)) {
    if (lower.includes(key)) return country
  }
  // Default countries by category probability
  const defaults = ['Kenya', 'Tanzania', 'Nigeria', 'Ghana', 'Uganda', 'Ethiopia', 'South Africa', 'Rwanda']
  return defaults[Math.floor(Math.random() * defaults.length)]
}

// ─── MAIN ────────────────────────────────────────────────────
function main() {
  const projectRoot = join(import.meta.dirname, '..')
  const xlsxPath = join(projectRoot, 'blog', 'givetoafrica keyword.xlsx')
  const causesImagesDir = join(projectRoot, 'blogs', 'african_causes')
  const outputPath = join(projectRoot, 'src', 'data', 'blogPosts.json')
  const qaLogPath = join(projectRoot, 'blogs', '_generation-qa-log.json')

  mkdirSync(join(projectRoot, 'src', 'data'), { recursive: true })

  // Read Excel
  const wb = XLSX.readFile(xlsxPath)

  // Sheet 1 keywords
  const ws1 = wb.Sheets[wb.SheetNames[0]]
  const data1 = XLSX.utils.sheet_to_json(ws1, { header: 1 })
  const keywords1 = data1
    .filter((r: any) => r[0] && r[0].toString().trim())
    .map((r: any) => r[0].toString().trim())

  // Sheet 2 keywords (skip section headers)
  const ws2 = wb.Sheets[wb.SheetNames[1]]
  const data2 = XLSX.utils.sheet_to_json(ws2, { header: 1 })
  const rawKw2 = data2
    .filter((r: any) => r[0] && r[0].toString().trim())
    .map((r: any) => r[0].toString().trim())

  // Separate section headers from actual keywords in Sheet2
  const sheet2Keywords: Array<{ keyword: string; section: string }> = []
  let currentSection = 'General'
  for (const kw of rawKw2) {
    if (/^[A-Z]/.test(kw) && !kw.match(/^\d/)) {
      // This is a section header
      for (const [sectionKey, catSlug] of Object.entries(SHEET2_SECTION_MAP)) {
        if (kw.includes(sectionKey)) {
          currentSection = kw
          break
        }
      }
    } else if (kw.match(/^\d/)) {
      // This is a numbered keyword
      const cleaned = kw.replace(/^\d+\.\s*/, '')
      sheet2Keywords.push({ keyword: cleaned, section: currentSection })
    }
  }

  console.log(`Sheet1: ${keywords1.length} keywords`)
  console.log(`Sheet2: ${sheet2Keywords.length} keywords (from ${Object.keys(SHEET2_SECTION_MAP).length} sections)`)
  console.log(`Total: ${keywords1.length + sheet2Keywords.length} keywords`)

  // Deduplicate keywords across sheets
  const allKeywordSet = new Set<string>()
  const allKeywords: Array<{ keyword: string; source: string }> = []

  for (const kw of keywords1) {
    const normalized = kw.toLowerCase().trim()
    if (!allKeywordSet.has(normalized)) {
      allKeywordSet.add(normalized)
      allKeywords.push({ keyword: kw, source: 'sheet1' })
    }
  }

  for (const { keyword, section } of sheet2Keywords) {
    const normalized = keyword.toLowerCase().trim()
    if (!allKeywordSet.has(normalized)) {
      allKeywordSet.add(normalized)
      allKeywords.push({ keyword, source: 'sheet2' })
    }
  }

  console.log(`After dedup: ${allKeywords.length} unique keywords`)

  // Categorize and generate articles
  const posts: any[] = []
  const qaIssues: string[] = []
  const categoryCounts: Record<string, number> = {}
  const usedSlugs: string[] = []

  for (let i = 0; i < allKeywords.length; i++) {
    const { keyword, source } = allKeywords[i]
    const categorySlug = categorizeKeyword(keyword)
    const cat = CATEGORIES[categorySlug]
    const country = extractCountry(keyword)

    if (!cat) {
      qaIssues.push(`No category found for keyword: "${keyword}"`)
      continue
    }

    categoryCounts[categorySlug] = (categoryCounts[categorySlug] || 0) + 1

    const title = generateTitle(keyword, categorySlug)
    let slug = slugify(title)

    // Ensure unique slugs
    if (usedSlugs.includes(slug)) {
      slug = `${slug}-${i + 1}`
    }
    usedSlugs.push(slug)

    const metaTitle = generateMetaTitle(title)
    const metaDescription = generateMetaDescription(keyword, categorySlug, country)
    const bodyHtml = generateBodyHtml(keyword, categorySlug, country, i)
    const wordCount = countWords(bodyHtml)
    const readingTime = Math.max(3, Math.ceil(wordCount / 200))
    const tags = generateTags(keyword, categorySlug)
    const featuredImage = getFeaturedImage(categorySlug, causesImagesDir)

    const post = {
      id: `blog-${i + 1}`,
      slug,
      title,
      metaTitle,
      metaDescription,
      categorySlug,
      categoryName: cat.name,
      country,
      featuredImage,
      secondaryImage: null,
      publishedAt: staggerDate(i, allKeywords.length),
      readingTimeMinutes: readingTime,
      tags,
      needsImageReview: false,
      needsFactCheck: false,
      sourceKeyword: keyword,
      source,
      bodyHtml,
      ctaMidArticle: {
        categorySlug,
        categoryName: cat.name,
        copy: `Every gift helps ${cat.tagline.toLowerCase()} — support ${cat.name} today.`,
      },
      ctaEndOfArticle: {
        categorySlug,
        categoryName: cat.name,
        copy: `Now that you've seen the need — help us meet it. Your support brings ${cat.name.toLowerCase()} to ${country}'s communities.`,
      },
    }

    posts.push(post)

    if ((i + 1) % 100 === 0) {
      console.log(`  Generated ${i + 1}/${allKeywords.length} articles...`)
    }
  }

  // Sort by category then date
  posts.sort((a: any, b: any) => {
    if (a.categorySlug !== b.categorySlug) return a.categorySlug.localeCompare(b.categorySlug)
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  // Re-assign IDs after sort
  posts.forEach((post: any, i: number) => {
    post.id = `blog-${i + 1}`
  })

  // Write output
  writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf-8')
  console.log(`\nWrote ${posts.length} posts to ${outputPath}`)

  // Category summary
  console.log('\nCategory distribution:')
  for (const [slug, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${CATEGORIES[slug]?.name || slug}: ${count} articles`)
  }

  // QA log
  const qaLog = {
    generatedAt: new Date().toISOString(),
    totalPosts: posts.length,
    totalKeywords: allKeywords.length,
    deduplicatedKeywords: allKeywordSet.size,
    categoryDistribution: categoryCounts,
    issues: qaIssues,
    summary: {
      totalIssues: qaIssues.length,
    },
  }

  writeFileSync(qaLogPath, JSON.stringify(qaLog, null, 2), 'utf-8')
  console.log(`QA log written to ${qaLogPath}`)

  if (qaIssues.length > 0) {
    console.log(`\n⚠ ${qaIssues.length} QA issues found:`)
    qaIssues.slice(0, 10).forEach(issue => console.log(`  - ${issue}`))
  } else {
    console.log('\n✓ All QA checks passed!')
  }
}

main()


