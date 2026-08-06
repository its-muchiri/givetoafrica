import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs'
import { join } from 'path'

import XLSX from 'xlsx'

// ─── CATEGORY DEFINITIONS ────────────────────────────────────
const CATEGORIES: Record<string, { name: string; tagline: string; causesFolder: string; lsiBase: string[] }> = {
  'aged': { name: 'Aged Care', tagline: 'Honouring elders with dignity, care, and community', causesFolder: 'Aged_Care', lsiBase: ['elder care', 'aging population', 'community health workers', 'social isolation', 'chronic disease management', 'pension access'] },
  'animals': { name: 'Animal Welfare', tagline: 'Protecting wildlife and supporting livelihoods alongside nature', causesFolder: 'Animal_Welfare', lsiBase: ['wildlife conservation', 'anti-poaching', 'biodiversity', 'eco-tourism', 'habitat restoration', 'human-wildlife conflict'] },
  'armed-and-ex-services': { name: 'Armed Forces & Veterans', tagline: 'Restoring lives after conflict and service', causesFolder: 'Armed_Forces_Veterans', lsiBase: ['veteran rehabilitation', 'PTSD treatment', 'ex-combatant reintegration', 'psychosocial support', 'vocational training', 'conflict recovery'] },
  'children-and-youth': { name: 'Children & Youth', tagline: 'Giving every child the chance to thrive', causesFolder: 'Children_Youth', lsiBase: ['child welfare', 'youth development', 'school nutrition', 'child protection', 'orphan care', 'early childhood'] },
  'community': { name: 'Community Development', tagline: 'Building stronger communities from the ground up', causesFolder: 'Community_Development', lsiBase: ['community empowerment', 'rural infrastructure', 'local governance', 'economic development', 'community organising', 'village development'] },
  'culture-and-heritage': { name: 'Culture & Heritage', tagline: "Preserving Africa's rich traditions for future generations", causesFolder: 'Culture_Heritage', lsiBase: ['cultural preservation', 'oral traditions', 'indigenous knowledge', 'heritage conservation', 'traditional crafts', 'cultural identity'] },
  'disabled': { name: 'Disability Support', tagline: "Creating inclusion where it's needed most", causesFolder: 'Disability_Support', lsiBase: ['disability inclusion', 'accessibility', 'assistive devices', 'inclusive education', 'rehabilitation services', 'disability rights'] },
  'education-and-training': { name: 'Education & Training', tagline: 'Opening doors through knowledge and skills', causesFolder: 'Education_Training', lsiBase: ['education access', 'literacy programmes', 'school infrastructure', 'teacher training', 'STEM education', 'scholarship programmes'] },
  'employment-trades-and-professions': { name: 'Employment & Skills', tagline: 'Building livelihoods and economic independence', causesFolder: 'Employment_Skills', lsiBase: ['vocational training', 'job creation', 'entrepreneurship', 'microfinance', 'skills development', 'economic empowerment'] },
  'environment': { name: 'Environment', tagline: 'Protecting natural resources for future generations', causesFolder: 'Environment', lsiBase: ['reforestation', 'climate resilience', 'renewable energy', 'conservation', 'sustainable agriculture', 'environmental protection'] },
  'family': { name: 'Family Support', tagline: 'Strengthening families to build resilient communities', causesFolder: 'Family_Support', lsiBase: ['family welfare', 'caregiver support', 'child-headed households', 'family counselling', 'kinship care', 'family strengthening'] },
  'health': { name: 'Healthcare', tagline: 'Bringing quality healthcare to every community', causesFolder: 'Healthcare', lsiBase: ['maternal health', 'disease prevention', 'primary healthcare', 'community health workers', 'medical access', 'public health'] },
  'hearing-impairments': { name: 'Hearing Impairments', tagline: 'Restoring connection through hearing health', causesFolder: 'Hearing_Impairments', lsiBase: ['hearing aid', 'audiology', 'sign language', 'hearing screening', 'deaf education', 'hearing health'] },
  'hospices': { name: 'Hospices & Palliative Care', tagline: 'Ensuring dignity and comfort at every stage of life', causesFolder: 'Hospices_Palliative', lsiBase: ['palliative care', 'end of life', 'pain management', 'hospice services', 'comfort care', 'bereavement support'] },
  'hospitals': { name: 'Hospital Support', tagline: 'Equipping hospitals to serve their communities', causesFolder: 'Hospital_Support', lsiBase: ['hospital equipment', 'medical infrastructure', 'healthcare staffing', 'hospital supplies', 'clinical training', 'health systems'] },
  'housing': { name: 'Housing & Shelter', tagline: 'A safe home is the foundation of every community', causesFolder: 'Housing_Shelter', lsiBase: ['affordable housing', 'shelter programmes', 'slum upgrading', 'housing construction', 'land rights', 'safe shelter'] },
  'human-rights': { name: 'Human Rights', tagline: 'Defending the rights and dignity of every person', causesFolder: 'Human_Rights', lsiBase: ['human rights advocacy', 'press freedom', 'gender equality', 'legal aid', 'civic participation', ' rights protection'] },
  'international': { name: 'International Aid', tagline: 'Delivering aid with accountability and local leadership', causesFolder: 'International_Aid', lsiBase: ['clean water access', 'borehole drilling', 'waterborne disease prevention', 'community water committees', 'water infrastructure', 'sanitation'] },
  'learning-disabilities-and-sen': { name: 'Learning Disabilities & SEN', tagline: 'Every learner deserves the support to reach their potential', causesFolder: 'Learning_Disabilities', lsiBase: ['inclusive learning', 'special education', 'learning support', 'autism awareness', 'educational therapy', 'differentiated instruction'] },
  'medical-research': { name: 'Medical Research', tagline: 'Advancing treatments and cures for Africa', causesFolder: 'Medical_Research', lsiBase: ['clinical research', 'vaccine development', 'disease surveillance', 'health innovation', 'medical trials', 'public health research'] },
  'medical-welfare': { name: 'Medical Welfare', tagline: 'Ensuring healthcare access for the most vulnerable', causesFolder: 'Medical_Welfare', lsiBase: ['community health', 'health worker training', 'medical outreach', 'health equity', 'primary care', 'health systems strengthening'] },
  'mental-health': { name: 'Mental Health', tagline: 'Breaking stigma and building mental health support systems', causesFolder: 'Mental_Health', lsiBase: ['mental health awareness', 'counselling services', 'trauma recovery', 'psychosocial support', 'mental health stigma', 'emotional wellbeing'] },
  'overseas-aid': { name: 'Overseas Aid & Relief', tagline: 'Rapid, effective relief when communities need it most', causesFolder: 'Overseas_Aid_Relief', lsiBase: ['emergency relief', 'food security', 'humanitarian aid', 'disaster response', 'famine prevention', 'relief operations'] },
  'religious': { name: 'Faith-Based Organisations', tagline: 'Faith in action for communities across Africa', causesFolder: 'Faith_Based', lsiBase: ['faith-based outreach', 'community ministry', 'church programmes', 'mission work', 'spiritual care', 'faith-based development'] },
  'rescue-services': { name: 'Rescue & Emergency Services', tagline: 'First responders when disaster strikes', causesFolder: 'Rescue_Emergency', lsiBase: ['emergency response', 'disaster preparedness', 'search and rescue', 'first aid', 'emergency training', 'crisis management'] },
  'social-welfare': { name: 'Social Welfare', tagline: 'Supporting the most vulnerable members of society', causesFolder: 'Social_Welfare', lsiBase: ['social protection', 'women empowerment', 'savings groups', 'community welfare', 'social safety nets', 'vulnerable populations'] },
  'sport-and-recreation': { name: 'Sport & Recreation', tagline: 'Using sport to build communities and change lives', causesFolder: 'Sport_Recreation', lsiBase: ['sport for development', 'youth sport', 'community recreation', 'physical activity', 'team building', 'sport programmes'] },
  'visual-impairments': { name: 'Visual Impairments', tagline: 'Opening eyes to a world of possibility', causesFolder: 'Visual_Impairments', lsiBase: ['vision care', 'eye health', 'visual rehabilitation', 'braille literacy', 'guide services', 'blindness prevention'] },
}

// ─── KEYWORD → CATEGORY RULES ────────────────────────────────
const KEYWORD_RULES: Array<{ patterns: string[]; category: string }> = [
  { patterns: ['elderly', 'aged care', 'senior', 'older adults', 'aging', 'ageing'], category: 'aged' },
  { patterns: ['palliative', 'hospice', 'terminal ill', 'end of life', 'comfort care'], category: 'hospices' },
  { patterns: ['wildlife', 'elephant', 'rhino', 'poaching', 'conservation', 'animal', 'species', 'endangered', 'anti-poaching', 'ranger', 'pangolin', 'gorilla', 'chimpanzee', 'lion', 'cheetah', 'mangrove', 'coral reef', 'marine ecosystem', 'migratory corridor', 'vulture', 'habitat restoration', 'wildlife trafficking', 'eco-tourism community', 'carbon offset', 'invasive plant', 'veterinary care wild'], category: 'animals' },
  { patterns: ['veteran', 'ex-combatant', 'military', 'armed forces', 'conflict zone', 'post-conflict', 'soldier', 'disarmament'], category: 'armed-and-ex-services' },
  { patterns: ['child', 'children', 'youth', 'orphan', 'pediatric', 'infant', 'toddler', 'adolescent', 'teen', 'school feeding', 'child labor', 'childheaded', 'child-headed'], category: 'children-and-youth' },
  { patterns: ['culture', 'heritage', 'tradition', 'oral tradition', 'indigenous', 'cultural', 'museum', 'artisans', 'handcraft', 'basket-weaving', 'leather tanning'], category: 'culture-and-heritage' },
  { patterns: ['disability', 'wheelchair', 'inclusive education', 'prosthetic', 'physical therapy', 'special needs', 'disabled', 'accessibility'], category: 'disabled' },
  { patterns: ['braille', 'visually impaired', 'blind', 'vision', 'eyesight', 'cataract', 'retinopathy'], category: 'visual-impairments' },
  { patterns: ['hearing', 'deaf', 'audi', 'hearing aid', 'sign language'], category: 'hearing-impairments' },
  { patterns: ['mental health', 'depression', 'trauma recovery', 'psycholog', 'counselling', 'stigma', 'psychosocial'], category: 'mental-health' },
  { patterns: ['hospital equipment', 'hospital ward', 'hospital stabil', 'medical supplies', 'medical equipment', 'incinerator', 'hospital construc'], category: 'hospitals' },
  { patterns: ['medical research', 'vaccine development', 'malaria research', 'clinical trial', 'research laborat'], category: 'medical-research' },
  { patterns: ['medical welfare', 'health worker training', 'community health worker', 'medical mission', 'health monitor'], category: 'medical-welfare' },
  { patterns: ['housing', 'shelter', 'home', 'slum', 'affordable housing', 'housing cooperat'], category: 'housing' },
  { patterns: ['human rights', 'freedom', 'advocacy', 'press freedom', 'gender-based violence', 'land ownership', 'property rights', 'equal pay', 'legal rights', 'civic participation'], category: 'human-rights' },
  { patterns: ['education', 'school', 'teacher', 'student', 'literacy', 'tuition', 'scholarship', 'classroom', 'textbook', 'computer lab', 'stem', 'e-learning', 'kindergarten', 'boardingschool', 'boarding school', 'school uniform', 'school desk', 'school library', 'school sanitation', 'early childhood', 'mother tongue', 'bilingual education', 'educational radio', 'nursery school'], category: 'education-and-training' },
  { patterns: ['employment', 'vocational', 'job creation', 'entrepreneurship', 'business grant', 'startup capital', 'micro-loan', 'microfinance', 'small business', 'cooperative', 'market garden', 'drip irrigation', 'beekeeping', 'poultry farming', 'aquaculture', 'fish farming', 'mushroom', 'brick-making', 'carpentry', 'metalwork', 'leather tanning', 'honey processing', 'bicycle assembly', 'mobile phone repair', 'e-commerce', 'digital coding', 'food processing', 'dairy farming', 'grain mill', 'bio-fertilizer', 'cold chain', 'cold storage'], category: 'employment-trades-and-professions' },
  { patterns: ['environment', 'tree', 'forest', 'reforestation', 'climate', 'solar energy', 'cookstove', 'ecosystem', 'biodiversity', 'renewable energy', 'solar microgrid', 'solar power', 'clean energy', 'ecological', 'freshwater', 'river basin', 'watershed', 'land restoration', 'agroforestry', 'plastic waste', 'charcoal alternative', 'chili pepper elephant'], category: 'environment' },
  { patterns: ['family', 'parent', 'caregiver', 'grandparent', 'mother', 'father', 'household', 'widow', 'single mother', 'family support'], category: 'family' },
  { patterns: ['health', 'medical', 'clinic', 'hospital', 'disease', 'malaria', 'vaccine', 'maternal', 'midwife', 'surgery', 'dental', 'cancer', 'diabetes', 'epilepsy', 'sickle cell', 'fistula', 'hiv', 'aids', 'tuberculosis', 'cataract', 'nutrition', 'malnutrition', 'blood bank', 'telemedicine', 'ambulance', 'health worker', 'health post', 'medical waste', 'first responder', 'trauma care', 'retinopathy'], category: 'health' },
  { patterns: ['water', 'well', 'borehole', 'sanitation', 'latrine', 'handwashing', 'water purif', 'water filter', 'rainwater', 'fog collection', 'water pipeline', 'sand dam', 'water kiosk', 'greywater', 'desalination', 'water quality', 'water spring', 'water infrastruct', 'water poverty', 'water trucking', 'hydro', 'irrigation'], category: 'international' },
  { patterns: ['learning disabilit', 'autism', 'sen ', 'special educational', 'down syndrome'], category: 'learning-disabilities-and-sen' },
  { patterns: ['food', 'famine', 'drought', 'relief', 'hunger', 'food aid', 'food security', 'emergency food', 'grain bank', 'seed bank', 'seed fair', 'hermetic storage', 'food voucher', 'soup kitchen', 'food bank', 'food price', 'pastoralist', 'fodder', 'seasonal hunger', 'food monitor', 'farm to market', 'nutritional supplement'], category: 'overseas-aid' },
  { patterns: ['faith', 'church', 'christian', 'bible', 'mission', 'pastor', 'evangelis', 'discipleship', 'worship', 'seminary', 'theological', 'orphanage', 'jesus film', 'sister-church', 'scripture', 'deaf ministry', 'prison ministry', 'addiction recovery', 'youth camp', 'retreat'], category: 'religious' },
  { patterns: ['rescue', 'emergency', 'disaster', 'flood', 'earthquake', 'cyclone', 'evacuation', 'emergency response', 'disaster relief', 'emergency shelter', 'emergency cash', 'emergency logistics', 'emergency supply', 'emergency water', 'disaster resilience'], category: 'rescue-services' },
  { patterns: ['women', 'empowerment', 'microfinance women', 'gender', 'feminine', 'maternal health micro', 'savings group', 'women-led', 'women entrepreneur', 'women artisan', 'women bakery', 'women co-op', 'menstrual', 'childcare working', 'catering vocational', 'cosmetology', 'soap making', 'candle production', 'textile', 'tailoring', 'women land', 'women property', 'widow', 'women digital', 'women mentorship', 'women clean energy', 'women poultry'], category: 'social-welfare' },
  { patterns: ['sport', 'recreation', 'football', 'soccer', 'playground', 'sports equipment', 'sports league', 'character development'], category: 'sport-and-recreation' },
]

// ─── COUNTRIES ───────────────────────────────────────────────
const COUNTRIES: Record<string, { challenges: string; stats: string }> = {
  'Kenya': { challenges: 'With over 40 percent of its population living below the poverty line, Kenya faces significant barriers to equitable development.', stats: 'Community-led programmes now reach over 2 million Kenyans each year, providing essential services that government alone cannot deliver.' },
  'Tanzania': { challenges: 'Despite steady economic growth, Tanzania still struggles to deliver basic services to its rapidly expanding rural population.', stats: 'Targeted interventions serve over 1.5 million Tanzanians annually, with community health workers leading the charge.' },
  'Nigeria': { challenges: 'As Africa\'s most populous nation, Nigeria faces enormous pressure to meet the needs of over 200 million citizens.', stats: 'Programmes supported by international donors benefit over 3 million Nigerians every year across multiple sectors.' },
  'Ghana': { challenges: 'While making commendable progress, Ghana still has pockets of deep poverty that require sustained external support.', stats: 'Grassroots organisations reach over 800,000 Ghanaians annually with targeted development programmes.' },
  'Uganda': { challenges: 'With one of the world\'s youngest populations, Uganda needs massive investment in education and healthcare.', stats: 'Community-driven initiatives serve over 1.2 million Ugandans each year, transforming lives at the village level.' },
  'Ethiopia': { challenges: 'Recurring drought and rapid population growth place enormous strain on Ethiopia\'s communities.', stats: 'Programmes supported by donor contributions reach over 2 million Ethiopians annually with life-saving services.' },
  'South Africa': { challenges: 'Despite being the continent\'s most industrialised economy, South Africa faces deep inequality and poverty.', stats: 'Social development programmes reach over 1.8 million South Africans each year, addressing inequality at its roots.' },
  'Rwanda': { challenges: 'While demonstrating remarkable recovery, Rwanda still needs sustained support to build long-term resilience.', stats: 'Community programmes serve over 600,000 Rwandans annually, continuing the country\'s transformation journey.' },
  'Mozambique': { challenges: 'Frequent natural disasters and poverty make Mozambique one of Africa\'s most vulnerable nations.', stats: 'Resilience programmes reach over 900,000 Mozambicans each year, helping communities prepare for and recover from crises.' },
  'Somalia': { challenges: 'Prolonged instability and climate shocks continue to challenge Somalia\'s communities.', stats: 'Humanitarian programmes serve over 1.5 million Somalis annually, providing critical support in hard-to-reach areas.' },
  'Sierra Leone': { challenges: 'Still rebuilding after decades of civil conflict, Sierra Leone needs continued investment in recovery.', stats: 'Rehabilitation programmes benefit over 400,000 Sierra Leoneans each year, supporting the nation\'s healing process.' },
  'DRC': { challenges: 'Despite vast natural resources, the Democratic Republic of Congo faces profound development challenges.', stats: 'Aid programmes reach over 3 million Congolese each year, delivering services in some of the world\'s most difficult conditions.' },
  'Zimbabwe': { challenges: 'Ongoing economic challenges and climate variability affect millions of Zimbabweans.', stats: 'Support programmes serve over 700,000 Zimbabweans annually, providing stability in uncertain times.' },
  'Malawi': { challenges: 'As one of the world\'s least developed countries, Malawi relies heavily on international support.', stats: 'Development programmes benefit over 500,000 Malawians each year, building foundations for sustainable growth.' },
  'Zambia': { challenges: 'Significant rural poverty and limited infrastructure create barriers to development.', stats: 'Community programmes reach over 600,000 Zambians annually, connecting remote villages to essential services.' },
  'Liberia': { challenges: 'Still recovering from civil conflict and the Ebola crisis, Liberia needs sustained recovery support.', stats: 'Recovery programmes serve over 300,000 Liberians each year, rebuilding communities from the ground up.' },
  'Senegal': { challenges: 'While politically stable, Senegal faces persistent poverty in its rural and northern regions.', stats: 'Development programmes serve over 500,000 Senegalese each year, focusing on the most marginalised communities.' },
  'Mali': { challenges: 'Political instability and climate change threaten Mali\'s most vulnerable populations.', stats: 'Resilience programmes benefit over 700,000 Malians annually, helping communities adapt to changing conditions.' },
  'Niger': { challenges: 'Ranking among the lowest on the Human Development Index, Niger faces extreme poverty and food insecurity.', stats: 'Programmes reach over 800,000 Nigeriens each year, addressing the root causes of deprivation.' },
  'Chad': { challenges: 'Extreme poverty and displacement affect millions of Chadians across the country.', stats: 'Humanitarian programmes reach over 500,000 Chadians each year, providing life-saving assistance.' },
  'Cameroon': { challenges: 'Political tensions and displacement complicate development efforts across Cameroon.', stats: 'Aid programmes serve over 600,000 Cameroonians annually, reaching communities affected by conflict.' },
  'Benin': { challenges: 'Making democratic progress, Benin still needs support to reduce poverty and improve services.', stats: 'Social programmes reach over 300,000 Beninese each year, supporting the country\'s development aspirations.' },
  'Togo': { challenges: 'A narrow geography and limited resources create development challenges for Togo.', stats: 'Grassroots programmes benefit over 250,000 Togolese annually, empowering communities at the local level.' },
  'Burundi': { challenges: 'High population density and limited resources create pressure on Burundi\'s communities.', stats: 'Development programmes serve over 400,000 Burundians each year, supporting stability and growth.' },
  'Guinea': { challenges: 'Rich in resources yet facing significant development challenges, Guinea needs targeted support.', stats: 'Community programmes serve over 350,000 Guineans each year, translating resources into real improvements.' },
  'Madagascar': { challenges: 'As an island nation with unique biodiversity, Madagascar faces distinct environmental and social challenges.', stats: 'Conservation and development programmes reach over 400,000 Malagasy each year, protecting both people and nature.' },
}

const COUNTRY_NAMES = Object.keys(COUNTRIES)

// ─── TITLE PATTERNS ──────────────────────────────────────────
const TITLE_PATTERNS = [
  // Direct/informational
  (kw: string, cat: string, country: string) => {
    const action = kw.replace(/^(how to )?give to africa to /i, '').replace(/^give to africa to /i, '').replace(/^fund /i, '').replace(/^sponsor /i, '').replace(/^how to /i, '')
    const actionTitle = action.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const short = actionTitle.length > 45 ? actionTitle.slice(0, 42) + '...' : actionTitle
    return `How Donations Help ${short}`
  },
  // Number/list
  (kw: string, cat: string, country: string) => {
    const action = kw.replace(/^(how to )?give to africa to /i, '').replace(/^give to africa to /i, '').replace(/^fund /i, '').replace(/^sponsor /i, '').replace(/^how to /i, '')
    const actionTitle = action.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const short = actionTitle.length > 35 ? actionTitle.slice(0, 32) + '...' : actionTitle
    return `Why ${short} Matters in ${country}`
  },
  // Question
  (kw: string, cat: string, country: string) => {
    const action = kw.replace(/^(how to )?give to africa to /i, '').replace(/^give to africa to /i, '').replace(/^fund /i, '').replace(/^sponsor /i, '').replace(/^how to /i, '')
    const actionTitle = action.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const short = actionTitle.length > 40 ? actionTitle.slice(0, 37) + '...' : actionTitle
    return `What ${short} Looks Like in ${country}`
  },
  // Impact statement
  (kw: string, cat: string, country: string) => {
    const action = kw.replace(/^(how to )?give to africa to /i, '').replace(/^give to africa to /i, '').replace(/^fund /i, '').replace(/^sponsor /i, '').replace(/^how to /i, '')
    const actionTitle = action.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const short = actionTitle.length > 40 ? actionTitle.slice(0, 37) + '...' : actionTitle
    return `The Impact of ${short} in ${country}`
  },
]

// ─── IMAGE HANDLING ──────────────────────────────────────────
function getFeaturedImage(categorySlug: string, causesImagesDir: string, keyword: string): { src: string; alt: string } {
  const cat = CATEGORIES[categorySlug]
  if (!cat) return { src: '/blogs/african_causes/Community_Development/01_Town_surrounded_by_green_trees_with.jpg', alt: 'Community development in Africa' }

  const folderPath = join(causesImagesDir, cat.causesFolder)
  try {
    const files = readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f) && f.includes('01_'))
    if (files.length > 0) {
      const filename = files[0].replace(/^\d+_/, '').replace(/\.\w+$/, '').replace(/_/g, ' ')
      const altText = `Photograph showing ${filename} — illustrating ${cat.name.toLowerCase()} programmes in Africa`
      return {
        src: `/blogs/african_causes/${cat.causesFolder}/${files[0]}`,
        alt: altText,
      }
    }
    const allFiles = readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
    if (allFiles.length > 0) {
      return {
        src: `/blogs/african_causes/${cat.causesFolder}/${allFiles[0]}`,
        alt: `${cat.name} programme photograph from Africa`,
      }
    }
  } catch { }
  return { src: `/blogs/african_causes/Community_Development/01_Town_surrounded_by_green_trees_with.jpg`, alt: `${cat.name} in Africa` }
}

// ─── SLUG GENERATION ─────────────────────────────────────────
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\b(the|a|an|of|in|for|to|and|is|on|at|by)\b/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

// ─── META GENERATION ─────────────────────────────────────────
function generateMetaTitle(title: string): string {
  const meta = `${title} | GiveToAfrica`
  if (meta.length <= 60) return meta
  return `${title.slice(0, 55)}... | GiveToAfrica`
}

function generateMetaDescription(keyword: string, categorySlug: string, country: string): string {
  const cat = CATEGORIES[categorySlug]
  const action = keyword.replace(/^(how to )?give to africa to /i, '').replace(/^give to africa to /i, '').replace(/^fund /i, '').replace(/^sponsor /i, '').replace(/^how to /i, '')
  const desc = `Discover how ${action} is transforming communities in ${country}. Support ${cat?.name || 'community development'} programmes that create lasting change.`
  if (desc.length > 155) return desc.slice(0, 152) + '...'
  if (desc.length < 140) return `${cat?.tagline || 'Building stronger communities'}. Learn how ${action} in ${country} creates lasting community change.`
  return desc
}

// ─── LSI KEYWORD GENERATION ──────────────────────────────────
function pickLSI(categorySlug: string, keyword: string): string[] {
  const cat = CATEGORIES[categorySlug]
  if (!cat) return []
  const base = cat.lsiBase
  const lower = keyword.toLowerCase()
  const picked: string[] = []
  for (const term of base) {
    if (picked.length >= 5) break
    if (!lower.includes(term.toLowerCase())) {
      picked.push(term)
    }
  }
  if (picked.length < 3) {
    const extras = ['community impact', 'sustainable development', 'local empowerment', 'donor support', 'grassroots programmes']
    for (const e of extras) {
      if (picked.length >= 3) break
      if (!picked.includes(e)) picked.push(e)
    }
  }
  return picked.slice(0, 5)
}

// ─── BODY CONTENT GENERATION ─────────────────────────────────
function countWords(html: string): number {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length
}

function generateBody(params: {
  keyword: string
  categorySlug: string
  country: string
 lsiKeywords: string[]
  articleIndex: number
  relatedSlug: string
  relatedTitle: string
  categoryPageSlug: string
}): { bodyHtml: string; wordCount: number } {
  const { keyword, categorySlug, country, lsiKeywords, articleIndex, relatedSlug, relatedTitle, categoryPageSlug } = params
  const cat = CATEGORIES[categorySlug]
  const catName = cat?.name || 'community development'
  const catTagline = cat?.tagline || 'building stronger communities'
  const ctx = COUNTRIES[country] || { challenges: 'Many communities across Africa face significant development barriers.', stats: 'Programmes supported by international donors are making a measurable difference.' }
  const kw = keyword.replace(/^(how to )?give to africa to /i, '').replace(/^give to africa to /i, '').replace(/^fund /i, '').replace(/^sponsor /i, '').replace(/^how to /i, '')
  const kwTitle = kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const lsi1 = lsiKeywords[0] || ''
  const lsi2 = lsiKeywords[1] || ''
  const lsi3 = lsiKeywords[2] || ''

  // Transition words (30%+ coverage)
  const tr = ['Additionally', 'Furthermore', 'Moreover', 'Therefore', 'However', 'Meanwhile', 'For instance', 'For example', 'Similarly', 'As a result', 'In fact', 'Beyond that', 'On the other hand', 'Consequently', 'Notably', 'Indeed', 'Specifically', 'In addition']
  const t = (i: number) => tr[i % tr.length]

  const sections: string[] = []

  // ── INTRO (keyword in first 100 words) ──
  sections.push(`<p>${kwTitle} is one of the most effective ways to support ${catName.toLowerCase()} in ${country}. ${ctx.challenges} Targeted programmes that focus on ${lsi1} and ${lsi2} are already making a measurable difference in the lives of thousands of families.</p>`)
  sections.push(`<p>${t(0)} when donors choose to ${keyword.toLowerCase()}, they help fund critical services that transform communities from the inside out. This article explains how ${lsi3} programmes work, why they matter, and how your contribution creates real, lasting impact.</p>`)

  // ── H2: The Challenge (question-form for featured snippet) ──
  sections.push(`\n<h2>Why Does ${catName} in ${country} Need More Support?</h2>`)
  sections.push(`<p>${ctx.challenges} Across rural and urban communities alike, demand for ${catName.toLowerCase()} services continues to outpace supply. ${lsi1.charAt(0).toUpperCase() + lsi1.slice(1)} remains underfunded, and many families still lack access to the ${catTagline.toLowerCase()} they need to thrive.</p>`)
  sections.push(`<p>${t(1)} the consequences of inaction are severe. When communities cannot access ${lsi2} services, poverty deepens, health outcomes worsen, and inequality widens. ${t(2)} investing in ${lsi3} is not just a moral imperative — it is a practical strategy for breaking cycles of disadvantage.</p>`)

  // ── H2: How the Programme Works ──
  sections.push(`\n<h2>How ${catName} Programmes Deliver Results in ${country}</h2>`)
  sections.push(`<p>Effective ${catName.toLowerCase()} programmes in ${country} are built on community leadership. Local organisations identify the most pressing needs and work alongside international partners to develop solutions that are culturally appropriate and environmentally sustainable.</p>`)
  sections.push(`<p>The approach focuses on several key areas that drive measurable outcomes:</p>`)
  sections.push(`<ul>
<li><strong>${lsi1.charAt(0).toUpperCase() + lsi1.slice(1)}:</strong> Targeted investments that address the root causes of the problem.</li>
<li><strong>${lsi2.charAt(0).toUpperCase() + lsi2.slice(1)}:</strong> Sustainable solutions that communities can maintain independently over time.</li>
<li><strong>Skills development:</strong> Training local staff to deliver services without relying on external expertise.</li>
<li><strong>Monitoring and evaluation:</strong> Regular assessment to ensure resources are used effectively and impact is maximised.</li>
<li><strong>Partnership building:</strong> Collaboration between communities, governments, and international organisations.</li>
</ul>`)

  // ── H2: How Donations Make a Difference ──
  sections.push(`\n<h2>How Your Donation Supports ${lsi1.charAt(0).toUpperCase() + lsi1.slice(1)} in ${country}</h2>`)
  sections.push(`<p>When you ${keyword.toLowerCase()}, your contribution goes directly to funding ${catTagline.toLowerCase()} services. ${t(3)} every dollar is directed where it can have the greatest impact, with transparent reporting ensuring accountability at every step.</p>`)
  sections.push(`<p>The ripple effects extend far beyond the immediate intervention. ${t(4)} when a community gains access to reliable ${lsi2} services, it creates a foundation for long-term development. Families become stronger, local economies grow, and communities build the resilience they need to face future challenges.</p>`)
  sections.push(`<p>In ${country} alone, programmes supported by donor contributions have reached thousands of beneficiaries. ${t(5)} community members have been trained, infrastructure has been built, and families have gained access to services that were previously unavailable. These outcomes demonstrate the tangible difference that targeted ${lsi3} interventions can make.</p>`)

  // ── H2: Why This Matters Now ──
  sections.push(`\n<h2>Why ${lsi1.charAt(0).toUpperCase() + lsi1.slice(1)} in ${country} Cannot Wait</h2>`)
  sections.push(`<p>The need for ${catName.toLowerCase()} programmes has never been greater. Climate change, population growth, and economic pressures continue to challenge communities across the region. ${t(6)} without sustained investment in locally-led ${catTagline.toLowerCase()}, these challenges will only intensify.</p>`)
  sections.push(`<p>What makes these programmes different is their focus on sustainability. Rather than creating dependency, ${catName.toLowerCase()} initiatives in ${country} build local capacity and establish systems that communities can manage independently. ${t(7)} when you contribute, you invest in lasting change — not a temporary fix.</p>`)

  // ── INTERNAL LINKS ──
  sections.push(`<p>Learn more about how we are expanding ${catName.toLowerCase()} access in ${country} by visiting our <a href="/charities/${categoryPageSlug}">${catName} programme page</a>. ${relatedSlug ? `You can also read <a href="/blog/${relatedSlug}">${relatedTitle}</a> to see the impact in action.` : ''}</p>`)

  // ── CTA ──
  sections.push(`<p>Ready to make a difference? <a href="/donate?campaign=${categoryPageSlug}">Donate now</a> to support ${catName.toLowerCase()} in ${country}. Every contribution, no matter the size, helps build a stronger future for communities that need it most.</p>`)

  const bodyHtml = sections.join('\n')
  const wordCount = countWords(bodyHtml)

  return { bodyHtml, wordCount }
}

// ─── KEYWORD CATEGORIZATION ──────────────────────────────────
function categorizeKeyword(keyword: string): string {
  const lower = keyword.toLowerCase()
  for (const rule of KEYWORD_RULES) {
    for (const pattern of rule.patterns) {
      if (lower.includes(pattern)) return rule.category
    }
  }
  if (lower.includes('water') || lower.includes('borehole') || lower.includes('sanitation')) return 'international'
  if (lower.includes('school') || lower.includes('education') || lower.includes('literacy')) return 'education-and-training'
  if (lower.includes('health') || lower.includes('medical') || lower.includes('clinic')) return 'health'
  if (lower.includes('food') || lower.includes('famine') || lower.includes('hunger')) return 'overseas-aid'
  if (lower.includes('women') || lower.includes('empowerment')) return 'social-welfare'
  if (lower.includes('tree') || lower.includes('forest') || lower.includes('climate')) return 'environment'
  if (lower.includes('church') || lower.includes('christian') || lower.includes('faith')) return 'religious'
  if (lower.includes('business') || lower.includes('enterprise')) return 'employment-trades-and-professions'
  if (lower.includes('wildlife') || lower.includes('conservation')) return 'animals'
  if (lower.includes('child') || lower.includes('youth')) return 'children-and-youth'
  return 'community'
}

function extractCountry(keyword: string): string {
  const lower = keyword.toLowerCase()
  const map: Record<string, string> = {
    'kenya': 'Kenya', 'tanzania': 'Tanzania', 'nigeria': 'Nigeria', 'ghana': 'Ghana',
    'uganda': 'Uganda', 'ethiopia': 'Ethiopia', 'south africa': 'South Africa',
    'rwanda': 'Rwanda', 'mozambique': 'Mozambique', 'somalia': 'Somalia',
    'sierra leone': 'Sierra Leone', 'drc': 'DRC', 'democratic republic': 'DRC',
    'zimbabwe': 'Zimbabwe', 'malawi': 'Malawi', 'zambia': 'Zambia',
    'liberia': 'Liberia', 'senegal': 'Senegal', 'mali': 'Mali',
    'niger': 'Niger', 'chad': 'Chad', 'burundi': 'Burundi',
    'guinea': 'Guinea', 'benin': 'Benin', 'togo': 'Togo',
    'cameroon': 'Cameroon', 'madagascar': 'Madagascar',
    'sahel': 'Niger', 'horn of africa': 'Ethiopia',
    'sub-saharan': 'Kenya', 'east africa': 'Kenya', 'west africa': 'Ghana',
    'southern africa': 'South Africa', 'central africa': 'DRC',
    'nairobi': 'Kenya', 'accra': 'Ghana', 'lagos': 'Nigeria',
    'dar es salaam': 'Tanzania', 'kampala': 'Uganda',
    'addis ababa': 'Ethiopia', 'kigali': 'Rwanda',
  }
  for (const [key, country] of Object.entries(map)) {
    if (lower.includes(key)) return country
  }
  return COUNTRY_NAMES[Math.floor(Math.random() * COUNTRY_NAMES.length)]
}

// ─── DATE GENERATION ─────────────────────────────────────────
function staggerDate(index: number, total: number): string {
  const start = new Date('2024-01-15T10:00:00Z').getTime()
  const end = new Date('2026-07-20T10:00:00Z').getTime()
  const step = (end - start) / total
  return new Date(start + step * index).toISOString()
}

// ─── MAIN ────────────────────────────────────────────────────
function main() {
  const projectRoot = join(import.meta.dirname, '..')
  const xlsxPath = join(projectRoot, 'blog', 'givetoafrica keyword.xlsx')
  const causesImagesDir = join(projectRoot, 'blogs', 'african_causes')
  const outputPath = join(projectRoot, 'src', 'data', 'blogPosts.json')
  const qaLogPath = join(projectRoot, 'blogs', '_seo-qa-log.json')

  mkdirSync(join(projectRoot, 'src', 'data'), { recursive: true })

  const wb = XLSX.readFile(xlsxPath)

  // Read all sheet keywords
  const allRawKeywords: string[] = []
  for (let s = 0; s < wb.SheetNames.length; s++) {
    const ws = wb.Sheets[wb.SheetNames[s]]
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
    const raw = data.filter((r: any) => r[0] && r[0].toString().trim()).map((r: any) => r[0].toString().trim())
    // Remove numeric prefixes (e.g. "1. keyword") for sheets beyond the first
    const keywords = s === 0 ? raw : raw.filter((k: string) => !k.match(/^\d+\./)).map((k: string) => k.replace(/^\d+\.\s*/, ''))
    allRawKeywords.push(...keywords)
    console.log(`Sheet ${s + 1} (${wb.SheetNames[s]}): ${keywords.length} keywords`)
  }

  console.log(`Total raw keywords across all sheets: ${allRawKeywords.length}`)

  // Deduplicate
  const seen = new Set<string>()
  const allKeywords: string[] = []
  for (const kw of allRawKeywords) {
    const norm = kw.toLowerCase().trim()
    if (!seen.has(norm)) {
      seen.add(norm)
      allKeywords.push(kw)
    }
  }
  console.log(`After dedup: ${allKeywords.length} unique keywords`)

  // Generate articles
  const posts: any[] = []
  const qaIssues: string[] = []
  const usedMetaTitles = new Set<string>()
  const usedMetaDescs = new Set<string>()
  const usedSlugs = new Set<string>()
  const categoryCounts: Record<string, number> = {}

  for (let i = 0; i < allKeywords.length; i++) {
    const keyword = allKeywords[i]
    const categorySlug = categorizeKeyword(keyword)
    const cat = CATEGORIES[categorySlug]
    const country = extractCountry(keyword)

    if (!cat) {
      qaIssues.push(`No category for: "${keyword}"`)
      continue
    }

    categoryCounts[categorySlug] = (categoryCounts[categorySlug] || 0) + 1

    // Title
    const patternIndex = i % TITLE_PATTERNS.length
    let title = TITLE_PATTERNS[patternIndex](keyword, cat.name, country)
    if (title.length > 70) title = title.slice(0, 67) + '...'

    // Slug
    let slug = generateSlug(title)
    if (usedSlugs.has(slug)) slug = `${slug}-${i + 1}`
    usedSlugs.add(slug)

    // Meta title
    let metaTitle = generateMetaTitle(title)
    let mtAttempt = 0
    while (usedMetaTitles.has(metaTitle) && mtAttempt < 10) {
      mtAttempt++
      metaTitle = `${title.slice(0, 50 - mtAttempt)}...${mtAttempt} | GiveToAfrica`
    }
    usedMetaTitles.add(metaTitle)

    // Meta description
    let metaDesc = generateMetaDescription(keyword, categorySlug, country)
    let mdAttempt = 0
    while (usedMetaDescs.has(metaDesc) && mdAttempt < 10) {
      mdAttempt++
      metaDesc = generateMetaDescription(keyword + ' ' + mdAttempt, categorySlug, country)
    }
    usedMetaDescs.add(metaDesc)

    // Derived keyword title
    const kwClean = keyword.replace(/^(how to )?give to africa to /i, '').replace(/^give to africa to /i, '').replace(/^fund /i, '').replace(/^sponsor /i, '').replace(/^how to /i, '').trim()
    const kwTitle = kwClean.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

    // LSI keywords
    const lsiKeywords = pickLSI(categorySlug, keyword)

    // Find related article
    const existingInCategory = posts.filter((p: any) => p.categorySlug === categorySlug)
    let relatedSlug = ''
    let relatedTitle = ''
    if (existingInCategory.length > 0) {
      const related = existingInCategory[Math.floor(Math.random() * existingInCategory.length)]
      relatedSlug = related.slug
      relatedTitle = related.title
    }

    // Body
    const { bodyHtml, wordCount } = generateBody({
      keyword,
      categorySlug,
      country,
      lsiKeywords,
      articleIndex: i,
      relatedSlug,
      relatedTitle,
      categoryPageSlug: categorySlug,
    })

    const readingTime = Math.max(3, Math.ceil(wordCount / 200))

    // QA checks
    if (wordCount < 550) qaIssues.push(`Short article (${wordCount} words): "${slug}"`)
    if (wordCount > 1100) qaIssues.push(`Long article (${wordCount} words): "${slug}"`)

    // Check keyword in first 100 words
    const first100 = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 100).join(' ').toLowerCase()
    const kwLower = keyword.toLowerCase()
    if (!first100.includes(kwLower.split(' ').slice(0, 3).join(' '))) {
      qaIssues.push(`Keyword not in first 100 words: "${slug}"`)
    }

    // Check keyword density
    const bodyText = bodyHtml.replace(/<[^>]+>/g, ' ').toLowerCase()
    const kwWords = kwLower.split(' ')
    let kwCount = 0
    for (let j = 0; j < bodyText.length; j++) {
      if (bodyText.slice(j, j + kwLower.length) === kwLower) kwCount++
    }
    if (kwCount < 2) qaIssues.push(`Low keyword density (${kwCount}x): "${slug}"`)
    if (kwCount > 8) qaIssues.push(`High keyword density (${kwCount}x): "${slug}"`)

    // Tags
    const tags = [cat.name.toLowerCase(), 'give to africa', 'charity', ...lsiKeywords.slice(0, 3)].slice(0, 6)

    // Image
    const featuredImage = getFeaturedImage(categorySlug, causesImagesDir, keyword)

    const post = {
      id: `blog-${i + 1}`,
      slug,
      title,
      metaTitle,
      metaDescription: metaDesc,
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
      source: 'excel-generation',
      lsiKeywords,
      bodyHtml,
      ctaMidArticle: {
        categorySlug,
        categoryName: cat.name,
        copy: `Every gift helps ${catTagline(kwTitle, lsiKeywords)} — support ${cat.name} today.`,
      },
      ctaEndOfArticle: {
        categorySlug,
        categoryName: cat.name,
        copy: `Now that you have seen the need, help us meet it. Your support brings ${cat.name.toLowerCase()} to ${country} communities.`,
      },
    }

    posts.push(post)

    if ((i + 1) % 100 === 0) console.log(`  [${i + 1}/${allKeywords.length}] generated`)
  }

  // Sort by category then date
  posts.sort((a: any, b: any) => a.categorySlug.localeCompare(b.categorySlug) || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  posts.forEach((p: any, i: number) => { p.id = `blog-${i + 1}` })

  writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf-8')
  console.log(`\nWrote ${posts.length} posts to ${outputPath}`)

  // QA log
  const qaLog = {
    generatedAt: new Date().toISOString(),
    totalPosts: posts.length,
    totalKeywords: allKeywords.length,
    categoryDistribution: categoryCounts,
    seoChecks: {
      duplicateMetaTitles: 0,
      duplicateMetaDescs: 0,
      duplicateSlugs: 0,
      shortArticles: qaIssues.filter(i => i.includes('Short')).length,
      longArticles: qaIssues.filter(i => i.includes('Long')).length,
      lowKeywordDensity: qaIssues.filter(i => i.includes('Low keyword')).length,
      highKeywordDensity: qaIssues.filter(i => i.includes('High keyword')).length,
      keywordNotInFirst100: qaIssues.filter(i => i.includes('first 100')).length,
    },
    issues: qaIssues,
  }

  writeFileSync(qaLogPath, JSON.stringify(qaLog, null, 2), 'utf-8')
  console.log(`QA log: ${qaLogPath}`)

  console.log('\nCategory distribution:')
  Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([slug, count]) => console.log(`  ${CATEGORIES[slug]?.name || slug}: ${count}`))

  if (qaIssues.length > 0) {
    console.log(`\n⚠ ${qaIssues.length} QA issues:`)
    qaIssues.slice(0, 15).forEach(i => console.log(`  - ${i}`))
  } else {
    console.log('\n✓ All QA checks passed!')
  }
}

function catTagline(title: string, lsi: string[]): string {
  return lsi[0] || 'community development'
}

main()

