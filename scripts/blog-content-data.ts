export const CAT_CONTENT: Record<string, {
  intro: string[]
  challenge: { heading: string; paragraphs: string[] }
  approach: { heading: string; paragraphs: string[]; bullets: string[] }
  impact: { heading: string; paragraphs: string[] }
  tags: string[]
  titlePrefix: string
}> = {
  'aged': {
    intro: [
      'In rural {{country}}, millions of older adults face each day without access to formal healthcare, adequate nutrition, or social support systems that many take for granted. The ageing population across sub-Saharan Africa is growing faster than anywhere else on the continent, yet government pension schemes and aged care infrastructure remain woefully inadequate.',
      'Community-based elderly care programmes are stepping in to fill this critical gap, providing hands-on support to some of the most forgotten members of society. These programmes recognise that elders are not just recipients of care — they are custodians of cultural knowledge, family anchors, and community pillars who deserve dignity in their later years.',
    ],
    challenge: {
      heading: 'The Reality Facing Older Adults in {{country}}',
      paragraphs: [
        'Rural communities in {{country}} are home to some of the most vulnerable elderly populations on the continent. Many older adults live more than 30 kilometres from the nearest health facility. They walk for hours on unpaved roads to collect water, tend small plots of land with declining physical strength, and manage complex health conditions without regular medical supervision. Studies show that over 70% of older Africans have no form of pension income, leaving them entirely dependent on family members who are often equally struggling.',
        'The emotional toll is equally devastating. Isolation and loneliness affect a significant proportion of rural elders. Community gathering spaces are rare, transport is expensive or non-existent, and many older adults have lost partners and peers. Depression among the elderly is widespread but almost entirely undiagnosed and untreated.',
      ],
    },
    approach: {
      heading: 'How Community-Based Care Is Making a Difference',
      paragraphs: [
        'Effective elderly care programmes in {{country}} take a community-led approach. Trained community health workers visit older adults regularly, checking on medication adherence, monitoring chronic disease symptoms, and providing basic health assessments. These workers are drawn from the communities they serve, which means they understand local languages, cultural practices, and the specific challenges facing elders in their area.',
        'Nutrition programmes deliver monthly food parcels tailored to the dietary needs of older adults, including supplements for those managing diabetes or hypertension. Shared meals bring elders together weekly, combining nutritional support with vital social interaction that reduces depression and isolation.',
      ],
      bullets: ['Monthly nutrition parcels with age-appropriate food supplements', 'Regular home visits from trained community health workers', 'Weekly social gatherings reducing loneliness and isolation', 'Chronic disease monitoring and medication adherence support', 'Legal advocacy for pension access and land rights'],
    },
    impact: {
      heading: 'Intergenerational Programmes Bridging the Gap',
      paragraphs: [
        'One of the most innovative approaches in {{country}} involves intergenerational programmes that pair elderly community members with local youth. These programmes serve a dual purpose: they preserve valuable cultural knowledge and oral traditions while combating elder isolation. Elders share skills in traditional crafts, storytelling, and agricultural practices, while younger participants provide technology assistance, companionship, and practical help.',
        'Participants consistently show improved mood, cognitive function, and sense of purpose. Youth participants report greater respect for their elders and deeper understanding of their cultural heritage. These exchanges help address the shortage of caregivers by building a pipeline of younger community members trained in elder support.',
      ],
    },
    tags: ['elder care', 'older adults', 'rural communities', 'community health', 'social inclusion'],
    titlePrefix: 'Elderly Care Programmes Transforming Rural',
  },
  'animals': {
    intro: [
      'In {{country}}, the relationship between wildlife conservation and community livelihoods has reached a critical crossroads. The country is home to some of Africa\'s most iconic species — elephants, lions, giraffes, and rhinos — yet the communities living alongside these animals often bear the highest costs of conservation.',
      'Crop destruction, livestock predation, and restricted land use create tension between protecting wildlife and sustaining families. Innovative conservation programmes are proving that these two goals do not have to be in conflict.',
    ],
    challenge: {
      heading: 'The Conservation-Livelihoods Nexus',
      paragraphs: [
        'Traditional conservation models often treated local communities as obstacles rather than partners. Fence-and-fine approaches excluded communities from wildlife areas and criminalised traditional land uses. The result was increased human-wildlife conflict, poaching driven by desperation, and community opposition to conservation goals.',
        'Africa loses roughly 30,000 elephants annually to poaching. Human-wildlife conflict destroys livelihoods as elephants raid crops and lions kill livestock. Communities living next to wildlife bear the highest cost of conservation, yet receive the fewest benefits.',
      ],
    },
    approach: {
      heading: 'Community-Led Conservation That Works',
      paragraphs: [
        'The modern approach in {{country}} takes a fundamentally different path. Community-based natural resource management gives local people direct ownership of wildlife through conservancies. When communities benefit financially from wildlife through tourism revenue, employment, and resource access, they become the strongest advocates for conservation.',
        'Tourism revenue funds schools, clinics, and infrastructure. Lodge operators lease community land, employ local staff, and pay levies that fund development projects. These tangible benefits change how communities view the wildlife on their doorstep.',
      ],
      bullets: ['Tourism revenue funding schools, clinics, and water infrastructure', 'Direct employment as rangers, guides, and hospitality staff', 'Compensation funds for crop damage and livestock loss', 'Eco-tourism training creating new career pathways', 'Anti-poaching operations staffed by community members'],
    },
    impact: {
      heading: 'Measurable Impact on Wildlife and Communities',
      paragraphs: [
        'In areas where community-based conservation has been implemented in {{country}}, elephant populations have stabilised and in some regions are growing. Rhino numbers are recovering in well-managed conservancies. Lion and wild dog populations show signs of recovery where habitat corridors are maintained through community agreements.',
        'For communities, families report improved income, better access to education and healthcare, and renewed pride in their natural heritage. Children growing up in conservancy areas have access to education funded by tourism revenue.',
      ],
    },
    tags: ['wildlife conservation', 'community livelihoods', 'eco-tourism', 'anti-poaching', 'biodiversity'],
    titlePrefix: 'Wildlife Conservation and Community Livelihoods in',
  },
  'armed-and-ex-services': {
    intro: [
      'In {{country}}, the scars of conflict run deep — not just in the landscape but in the minds and bodies of those who fought. Ex-combatants and veterans of civil wars face a profound crisis of reintegration.',
      'After years of violence, many find themselves abandoned by the governments they served, struggling with PTSD, disability, and unemployment. Veteran rehabilitation programmes are providing a lifeline for those attempting to rebuild normal lives.',
    ],
    challenge: {
      heading: 'The Hidden Crisis of PTSD Among Veterans',
      paragraphs: [
        'Post-traumatic stress disorder affects an estimated 30-40% of ex-combatants in post-conflict African nations, yet fewer than 5% receive any mental health treatment. In {{country}}, stigma surrounding mental health means many veterans suffer in silence.',
        'Nightmares, flashbacks, hypervigilance, and emotional numbness destroy relationships and prevent economic participation. The consequences extend beyond individual suffering: families suffer when breadwinners cannot maintain employment, and communities bear the social cost when former fighters remain marginalised.',
      ],
    },
    approach: {
      heading: 'Psychosocial Support That Works',
      paragraphs: [
        'Effective veteran rehabilitation combines clinical and community-based approaches. Trained counsellors — many veterans themselves — provide trauma-informed therapy. Peer support groups bring veterans together in safe spaces to share experiences and coping strategies.',
        'Economic reintegration is the cornerstone. Programmes provide vocational training in carpentry, plumbing, electrical work, and agriculture. These practical skills give veterans a pathway to sustainable income outside military service.',
      ],
      bullets: ['One-on-one trauma counselling with trained professionals', 'Peer support groups led by fellow veterans', 'Family therapy sessions rebuilding damaged relationships', 'Vocational training providing new civilian skills', 'Micro-loan programmes supporting veteran-led businesses'],
    },
    impact: {
      heading: 'From Soldier to Citizen: Building a Future',
      paragraphs: [
        'When ex-combatants rebuild their lives, they become agents of peace in their communities. They model non-violent conflict resolution, mentor at-risk youth, and contribute to local economies. Their stories of transformation inspire others.',
        'Micro-enterprise programmes provide seed funding and business mentorship. Former combatants have launched businesses in construction, farming, transportation, and retail. The transformation from fighter to business owner benefits families and communities.',
      ],
    },
    tags: ['veteran support', 'PTSD', 'ex-combatants', 'rehabilitation', 'reintegration'],
    titlePrefix: 'Veteran Rehabilitation for Ex-Combatants in',
  },
  'children-and-youth': {
    intro: [
      'In {{country}}, millions of children face the daily reality of hunger and malnutrition. Stunting — the irreversible condition caused by chronic undernutrition — affects nearly 35% of children under five.',
      'This means over a third of {{country}}\'s youngest citizens will never reach their full potential unless urgent action is taken. Child nutrition programmes provide the intervention that families and governments cannot afford alone.',
    ],
    challenge: {
      heading: 'Understanding the Stunting Crisis',
      paragraphs: [
        'Stunting is more than being short for one\'s age. It reflects inadequate nutrition, repeated infections, and poor care practices during the critical first 1,000 days of life. A stunted child has an underdeveloped brain, weakened immune system, and reduced capacity to learn. The effects are permanent.',
        'In {{country}}, the drivers are complex. Anaemia affects over 60% of pregnant women. Exclusive breastfeeding rates remain low. Diarrhoeal diseases compound the problem as children cannot absorb nutrients they do consume.',
      ],
    },
    approach: {
      heading: 'How Nutrition Programmes Save Lives',
      paragraphs: [
        'Effective programmes operate at multiple levels. Community health workers identify malnutrition early using mid-upper arm circumference measurements. Malnourished children receive therapeutic food that restores healthy weight within weeks.',
        'School feeding programmes deliver one of the highest returns of any development intervention. When children receive a nutritious meal at school, attendance increases, dropout rates fall, and academic performance improves.',
      ],
      bullets: ['Community health worker screening for early detection', 'Therapeutic food distribution for malnourished children', 'School feeding programmes providing nutritious daily meals', 'Breastfeeding promotion and maternal nutrition education', 'Water and sanitation improvements reducing diarrhoeal disease'],
    },
    impact: {
      heading: 'The Multiplier Effect of Child Nutrition',
      paragraphs: [
        'Every dollar invested in child nutrition generates several dollars in economic returns through improved education, better health, and increased adult productivity. In {{country}}, school feeding programmes increase primary school completion rates significantly.',
        'Female teachers trained through nutrition programmes become role models. When communities see the impact of nutrition on children\'s performance and health, they become active participants in sustaining these programmes.',
      ],
    },
    tags: ['child nutrition', 'malnutrition', 'school feeding', 'child health', 'food security'],
    titlePrefix: 'Child Nutrition Programmes Fighting Hunger in',
  },
  'community': {
    intro: [
      'More than 600 million people across sub-Saharan Africa live without electricity. In rural {{country}}, entire villages navigate daily life by kerosene lamp and firelight.',
      'Community solar energy projects are bringing reliable, clean power to off-grid communities, unlocking benefits that extend far beyond illumination.',
    ],
    challenge: {
      heading: 'The Real Cost of Energy Poverty',
      paragraphs: [
        'Families in off-grid areas spend a disproportionate share of their income on lighting and charging. Kerosene for a single lamp can consume 15-20% of a household\'s daily income. These expenses consume money that could go towards food, education, or healthcare.',
        'Healthcare suffers enormously without power. Rural clinics lose vaccines and medications due to lack of refrigeration. Diagnostic equipment sits unused. Patients requiring electrical medical devices are transferred to distant hospitals at great cost and risk.',
      ],
    },
    approach: {
      heading: 'How Solar Microgrids Transform Communities',
      paragraphs: [
        'Community solar projects involve installing solar microgrids — small-scale power systems serving villages. These systems include solar panels, battery storage, and distribution infrastructure providing reliable electricity to every connected household.',
        'When electricity arrives, economic activity transforms. Tailors invest in electric sewing machines. Welders acquire power tools. Shopkeepers add refrigeration. New businesses emerge, existing enterprises grow, and employment multiplies.',
      ],
      bullets: ['Solar microgrids providing reliable electricity to entire villages', 'Health clinics able to refrigerate vaccines and operate equipment', 'Children studying and completing homework after dark', 'Small businesses extending operating hours', 'Clean energy replacing dangerous kerosene'],
    },
    impact: {
      heading: 'Sustainable Models for Long-Term Impact',
      paragraphs: [
        'Women and girls benefit disproportionately. Girls who could not study after school gain additional learning time. Women who spent hours collecting firewood redirect time to productive activities. Solar-powered water pumps reduce the burden of water collection.',
        'Community energy cooperatives manage systems, collect user fees, and maintain equipment. Revenue creates a revolving fund supporting expansion and ensuring communities are not dependent on ongoing external support.',
      ],
    },
    tags: ['solar energy', 'rural electrification', 'community development', 'clean energy', 'sustainability'],
    titlePrefix: 'Community Solar Energy Powering Rural',
  },
  'culture-and-heritage': {
    intro: [
      'Across {{country}}, centuries of oral tradition — stories, histories, songs, and knowledge passed down through generations — are disappearing at an alarming rate. As elders pass without documenting their wisdom, entire libraries of cultural knowledge vanish forever.',
      'Digital archive projects are racing against time to preserve these irreplaceable traditions, using modern technology to safeguard Africa\'s rich cultural heritage.',
    ],
    challenge: {
      heading: 'The Urgency of Documentation',
      paragraphs: [
        'Africa is home to over 2,000 distinct languages, many existing only in spoken form. Each carries unique worldview, ecological knowledge, medicinal practices, and historical memory. Linguists estimate an African language falls silent every two weeks.',
        'In {{country}}, the pace of cultural loss has accelerated. Urbanisation draws youth from rural communities. Schools teach in official languages while local tongues are sidelined. Many young people cannot speak their grandparents\' language, let alone recite the oral histories defining their community\'s identity.',
      ],
    },
    approach: {
      heading: 'How Digital Preservation Works',
      paragraphs: [
        'Community-led projects train local people to record, catalogue, and store oral traditions using accessible technology. Audio recorders and smartphones capture high-quality recordings of elders reciting stories, songs, and historical accounts.',
        'Training local youth as documentation practitioners creates a bridge between generations. Young people learn recording and archival skills while deepening their connection to cultural heritage.',
      ],
      bullets: ['Audio and video recording of oral histories, stories, and songs', 'Transcription and translation of endangered languages', 'Community archives accessible via mobile phones', 'Training local youth in documentation techniques', 'University partnerships for linguistic research'],
    },
    impact: {
      heading: 'Cultural Festivals Keeping Traditions Alive',
      paragraphs: [
        'Beyond documentation, cultural festivals play a vital role in keeping oral traditions alive. Annual gatherings bring communities to share stories, music, dance, and traditional crafts, providing platforms for elders to share knowledge and create intergenerational connections.',
        'Many festivals now incorporate digital elements, livestreaming performances and sharing recordings online to reach wider audiences, creating powerful opportunities for cultural preservation.',
      ],
    },
    tags: ['oral traditions', 'cultural preservation', 'digital archive', 'endangered languages', 'heritage'],
    titlePrefix: 'Preserving African Oral Traditions in',
  },
  'disabled': {
    intro: [
      'In {{country}}, an estimated 15% of the population lives with a disability, yet the vast majority are excluded from education, employment, and community life. Children with physical disabilities face some of the steepest barriers.',
      'Inaccessible schools, stigma, and the prohibitive cost of assistive devices mean millions of disabled children never set foot in a classroom. Inclusive education programmes are working to change this reality.',
    ],
    challenge: {
      heading: 'The Wheelchair Crisis in Africa',
      paragraphs: [
        'Across {{country}}, the need for wheelchairs far outstrips supply. Many people with mobility impairments spend their lives crawling or being carried. Standard wheelchairs are impractical on rough terrain, and specialised off-road models are prohibitively expensive.',
        'Without proper seating, people develop pressure sores, spinal deformities, and chronic pain. Children who cannot reach school cannot learn. Adults who cannot reach markets cannot earn. The absence of a mobility device cascades into every aspect of life.',
      ],
    },
    approach: {
      heading: 'Inclusive Education: More Than Just Access',
      paragraphs: [
        'True inclusive education requires physical modifications — ramps, accessible toilets, adapted furniture — and attitudinal change among teachers, students, and communities. Teachers need training in differentiated instruction and disability awareness.',
        'Community sensitisation campaigns challenge misconceptions, reduce stigma, and promote rights of disabled people. When communities see disabled peers in schools and public spaces, attitudes shift fundamentally.',
      ],
      bullets: ['Wheelchair provision including off-road models for rural terrain', 'School modifications: ramps, accessible toilets, adapted furniture', 'Teacher training in inclusive education methods', 'Disability awareness campaigns reducing stigma', 'Peer buddy systems fostering acceptance'],
    },
    impact: {
      heading: 'Disability-Led Enterprises: Economic Empowerment',
      paragraphs: [
        'Programmes focus on economic empowerment, helping people with disabilities build sustainable livelihoods. Micro-enterprise training supports disabled entrepreneurs in agriculture, tailoring, and technology. These enterprises demonstrate that disability does not equal inability.',
        'When a child with a disability gains education, the impact extends far beyond that individual. Families experience reduced caregiving burden. Community attitudes shift. Local economies benefit from untapped potential.',
      ],
    },
    tags: ['disability support', 'inclusive education', 'wheelchair access', 'accessibility', 'stigma reduction'],
    titlePrefix: 'Wheelchair Access and Inclusive Education in',
  },
  'education-and-training': {
    intro: [
      'In {{country}}, girls face a constellation of barriers to education that boys do not. Period poverty, early marriage, domestic labour expectations, and safety concerns create a landscape where girls are systematically disadvantaged.',
      'Despite making up nearly half the school-age population, girls in rural areas are significantly less likely to complete primary school. Scholarship programmes are breaking through these barriers one girl at a time.',
    ],
    challenge: {
      heading: 'Breaking the Period Poverty Barrier',
      paragraphs: [
        'Period poverty — lack of access to sanitary products, clean water, and private facilities — is one of the most overlooked barriers to girls\' education. Research shows girls miss an average of 4-5 school days per month during their periods.',
        'In {{country}}, families with limited resources prioritise boys\' education. Early marriage removes girls from school entirely. The cumulative effect is devastating: girls fall behind, lose confidence, and eventually disengage.',
      ],
    },
    approach: {
      heading: 'The Scholarship Model That Works',
      paragraphs: [
        'Comprehensive scholarships address multiple intersecting barriers. A full package includes school fee coverage, uniforms, sanitary products, mentoring, and family engagement. Distributing reusable sanitary pads and providing menstrual health education reduce absenteeism by up to 50%.',
        'Mentoring from female role models provides girls with visible examples of what education can achieve. Family engagement sessions address cultural barriers and demonstrate the returns of keeping girls in school.',
      ],
      bullets: ['Full scholarship packages covering fees, uniforms, and materials', 'Menstrual health education and sanitary product distribution', 'Mentoring from female role models in the community', 'Family engagement sessions addressing cultural barriers', 'Safety improvements including safe walking routes to school'],
    },
    impact: {
      heading: 'The Multiplier Effect of Educating Girls',
      paragraphs: [
        'Investing in girls\' education generates returns beyond the individual. Educated girls marry later, have fewer and healthier children, earn higher incomes, and invest more in their children\'s education. Each additional year increases future earnings by 10-20%.',
        'Programmes actively shift community attitudes. Parent engagement demonstrates economic returns. Community dialogues challenge harmful practices. Local champions advocate for girls\' educational rights, showing that supporting girls benefits everyone.',
      ],
    },
    tags: ['girls education', 'scholarships', 'period poverty', 'gender equality', 'secondary school'],
    titlePrefix: 'Girls Education Scholarships Changing Lives in',
  },
  'employment-trades-and-professions': {
    intro: [
      'In {{country}}, youth unemployment stands at crisis levels. An estimated 30% of young people aged 15-24 are neither in education, employment, nor training. The skills gap is significant — electricians, plumbers, and IT professionals are in high demand yet training opportunities are scarce.',
      'Vocational training programmes offer a practical pathway from unemployment to economic independence.',
    ],
    challenge: {
      heading: 'Why Traditional Education Alone Isn\'t Enough',
      paragraphs: [
        '{{country}}\'s education system prioritises academic achievement over practical skills. Students graduate without the ability to earn a living, creating a paradox: high unemployment alongside critical skills shortages.',
        'Government vocational institutions are underfunded and oversubscribed, leaving the majority of aspiring tradespeople without access to quality training.',
      ],
    },
    approach: {
      heading: 'Programmes That Match Market Demand',
      paragraphs: [
        'Successful training starts with understanding employer needs. Skills audits identify trades with highest demand. Curricula produce graduates who step directly into employment or self-employment.',
        'The most impactful programmes combine technical training with business skills, enabling graduates to secure employment or create enterprises. Apprenticeship partnerships provide real-world experience during training.',
      ],
      bullets: ['Carpentry and construction with hands-on workshop training', 'Plumbing and electrical installation certified to industry standards', 'Digital skills including coding, web design, and marketing', 'Agricultural technology and modern farming techniques', 'Business management and entrepreneurship fundamentals'],
    },
    impact: {
      heading: 'From Training to Employment: The Complete Pipeline',
      paragraphs: [
        'Graduates report dramatically improved outcomes. Within a year, the majority have secured employment or launched businesses. Incomes increase significantly, enabling them to support families and invest in communities.',
        'Entrepreneurship training creates a multiplier effect. Graduates who start businesses create employment for others — a trained carpenter hires assistants, a web developer trains apprentices. Each enterprise lifts multiple livelihoods.',
      ],
    },
    tags: ['vocational training', 'youth employment', 'skills development', 'entrepreneurship', 'apprenticeships'],
    titlePrefix: 'Youth Vocational Training Driving Employment in',
  },
  'environment': {
    intro: [
      '{{country}} sits on the frontlines of climate change, experiencing erratic rainfall, prolonged droughts, and accelerating soil degradation. Despite contributing less than 4% of global emissions, African nations bear a disproportionate burden.',
      'Reforestation and climate resilience programmes are restoring degraded landscapes while equipping communities with tools to adapt to a changing climate.',
    ],
    challenge: {
      heading: 'The Deforestation Crisis',
      paragraphs: [
        'Africa loses approximately 3.9 million hectares of forest annually. In {{country}}, deforestation is driven by agricultural expansion, charcoal production, and urban growth. Consequences include biodiversity loss, disrupted water cycles, and increased erosion.',
        'Forests regulate local climate, maintain soil moisture, and prevent erosion. When forests are removed, temperatures rise, rainfall becomes erratic, and land becomes unable to support agriculture.',
      ],
    },
    approach: {
      heading: 'Community-Led Reforestation That Works',
      paragraphs: [
        'Effective reforestation involves local people in every stage — selecting native species, establishing nurseries, planting, and long-term maintenance. This approach ensures survival rates far higher than externally imposed schemes.',
        'Climate-smart agriculture teaches drought-resistant crop varieties, water harvesting, conservation agriculture, and diversified farming systems that maintain productivity under variable conditions.',
      ],
      bullets: ['Native species selection adapted to local conditions', 'Community nurseries producing millions of seedlings annually', 'Farmer-managed natural regeneration allowing forests to regrow', 'Agroforestry systems integrating trees with crops and livestock', 'Clean cookstove distribution reducing charcoal demand'],
    },
    impact: {
      heading: 'Building Climate Resilience at Community Level',
      paragraphs: [
        'Rainwater harvesting, sand dams, and community-managed irrigation help communities store water for dry periods. In {{country}}, these interventions have transformed farming communities\' ability to survive droughts.',
        'The Great Green Wall initiative provides a continental framework. Local projects contribute to this vision while addressing specific environmental challenges, demonstrating that large-scale restoration is possible.',
      ],
    },
    tags: ['reforestation', 'climate resilience', 'environment', 'sustainability', 'conservation'],
    titlePrefix: 'Reforestation and Climate Resilience in',
  },
  'family': {
    intro: [
      'In {{country}}, the AIDS pandemic and conflicts have created a generation of orphaned children raised by elderly grandparents. These caregivers take on enormous responsibility with virtually no external support.',
      'Family support programmes provide the lifeline keeping these fragile households together.',
    ],
    challenge: {
      heading: 'The Grandparent Caregiver Crisis',
      paragraphs: [
        'Grandparent caregivers manage their own health conditions — arthritis, hypertension, HIV — while raising young children. Income-generating capacity is limited, yet household expenses have doubled or tripled.',
        'The emotional toll is significant. Grandparents mourning their own children must provide stable care while grieving. The generational gap creates challenges around communication, discipline, and modern educational requirements.',
      ],
    },
    approach: {
      heading: 'Comprehensive Family Strengthening',
      paragraphs: [
        'Effective programmes address multiple needs. Economic support — cash transfers, school fee coverage, food assistance — reduces financial pressure. Health support ensures caregivers manage their own conditions. Psychosocial support provides emotional outlets and parenting guidance.',
        'Research shows family-based care produces better outcomes than institutional care. Children develop stronger emotional bonds, perform better academically, and experience fewer mental health issues.',
      ],
      bullets: ['Monthly cash transfers covering essential expenses', 'School fee coverage ensuring children stay in education', 'Healthcare support for both caregivers and children', 'Grandparent support groups reducing isolation', 'Legal assistance securing children\'s rights'],
    },
    impact: {
      heading: 'Building Community Safety Nets',
      paragraphs: [
        'Community child protection committees identify vulnerable families early. Savings groups build financial resilience. Community health volunteers monitor the health of elderly caregivers and children alike.',
        'Legal advocacy ensures orphaned children\'s inheritance rights are protected. Community education challenges harmful practices like child labour and early marriage.',
      ],
    },
    tags: ['family support', 'orphaned children', 'grandparent caregivers', 'child welfare', 'family preservation'],
    titlePrefix: 'Family Support for Orphaned Children in',
  },
  'health': {
    intro: [
      'In rural {{country}}, the nearest health facility may be hours away on foot. For millions, accessing basic healthcare requires journeys they simply cannot afford or manage.',
      'Mobile health clinics bridge this gap, bringing essential medical services directly to communities that need them most.',
    ],
    challenge: {
      heading: 'Why People Can\'t Reach Health Facilities',
      paragraphs: [
        'Distance is only one barrier. Transport fares, consultation fees, and medication costs are prohibitive for families on less than $2 a day. Cultural barriers and gender norms prevent many from seeking care.',
        'For pregnant women, barriers can be fatal. A significant proportion of maternal deaths occur because women cannot reach facilities in time for emergency obstetric care.',
      ],
    },
    approach: {
      heading: 'How Mobile Clinics Work',
      paragraphs: [
        'Mobile clinics visit remote villages every 2-4 weeks, equipped with diagnostic tools, essential medicines, and trained health workers. Services include consultations, immunisation, antenatal care, malaria testing, and health education.',
        'Community health workers (CHWs) serve as the link between communities and formal healthcare. They conduct household visits, identify problems early, and refer complex cases. Their local knowledge and trusted relationships are invaluable.',
      ],
      bullets: ['Scheduled visits to remote villages on regular cycles', 'Basic diagnostics: blood pressure, malaria tests, pregnancy tests', 'Essential medicines for malaria, respiratory infections, diarrhoea', 'Immunisation services for children and pregnant women', 'Health education on hygiene, nutrition, and disease prevention'],
    },
    impact: {
      heading: 'The Ripple Effect of Healthcare Access',
      paragraphs: [
        'When a clinic arrives, patients treated for malaria return to work and school. Immunised children are protected from deadly diseases. Health education creates lasting behaviour change.',
        'Communities with active CHWs show higher immunisation rates, better maternal health, and reduced child mortality. CHWs play a vital role in spreading knowledge about disease prevention and hygiene.',
      ],
    },
    tags: ['mobile health', 'rural healthcare', 'community health', 'healthcare access', 'community health workers'],
    titlePrefix: 'Mobile Health Clinics Reaching Remote Villages in',
  },
  'hearing-impairments': {
    intro: [
      'In {{country}}, an estimated 4 million people live with significant hearing loss, yet fewer than 5% have access to hearing aids. In rural communities, the figure is even lower.',
      'A device costing a fraction of a smartphone can restore connection to the world — but for most in {{country}}, it remains out of reach.',
    ],
    challenge: {
      heading: 'The Hearing Aid Gap in Africa',
      paragraphs: [
        'Africa has fewer than 200 audiologists for the entire continent. Hearing health services are concentrated in urban centres. Hearing aids cost hundreds of dollars — several months\' income for rural families.',
        'Causes include chronic ear infections in children, noise exposure, age-related deterioration, and infections. Many causes are preventable with basic healthcare.',
      ],
    },
    approach: {
      heading: 'Effective Hearing Aid Distribution Models',
      paragraphs: [
        'Successful programmes combine device distribution with screening, fitting, follow-up, and education. Mobile screening camps visit communities, identify hearing loss, and provide on-the-spot assessments.',
        'Programmes invest in sign language training for families and teachers. When families communicate with deaf members, isolation decreases. When teachers learn inclusive pedagogy, deaf children gain education.',
      ],
      bullets: ['Mobile screening camps identifying hearing loss', 'Professional hearing aid fitting by trained technicians', 'Maintenance training ensuring long-term device use', 'Sign language training for families and communities', 'Follow-up visits and ongoing support'],
    },
    impact: {
      heading: 'The Economic Impact of Hearing Health',
      paragraphs: [
        'Restoring hearing has immediate economic benefits. Adults return to work, communicate with colleagues, and participate in economic life. Recipients report improved employment outcomes and higher incomes.',
        'Community awareness campaigns challenge stigma. In many communities, deafness is attributed to curses. By providing accurate information and demonstrating deaf individuals\' capabilities, attitudes shift.',
      ],
    },
    tags: ['hearing aids', 'hearing loss', 'deaf community', 'sign language', 'hearing health'],
    titlePrefix: 'Hearing Aid Distribution Across Rural',
  },
  'hospices': {
    intro: [
      'In {{country}}, the vast majority of people with terminal illnesses die in pain. Palliative care is virtually unavailable outside major cities.',
      'Cancer patients, people with advanced HIV/AIDS, and those with other terminal conditions suffer unnecessarily because pain management services do not exist in their communities.',
    ],
    challenge: {
      heading: 'The Pain Management Crisis',
      paragraphs: [
        'Access to pain medication is severely restricted. Morphine and strong opioids — essential for severe pain — are tightly regulated due to misuse concerns. Patients are denied medication that would relieve their suffering.',
        'Families watching loved ones suffer experience their own trauma. Caregivers have no training in pain management or symptom support. The psychological toll is immense.',
      ],
    },
    approach: {
      heading: 'Home-Based Palliative Care',
      paragraphs: [
        'Community-based programmes bring pain management and emotional support to patients\' homes. Trained workers visit regularly, assess pain, administer medication, and guide family caregivers.',
        'Culturally sensitive care respects local beliefs about death and dying. Programmes work with traditional healers and community leaders to integrate palliative care with existing cultural practices.',
      ],
      bullets: ['Regular home visits by trained palliative care workers', 'Pain assessment and opioid access advocacy', 'Family caregiver training in symptom management', 'Emotional and spiritual support for patients and families', 'Bereavement counselling for families after loss'],
    },
    impact: {
      heading: 'Dignity in Death: A Fundamental Right',
      paragraphs: [
        'When patients receive palliative care, families spend meaningful time together, resolve conflicts, and prepare for death with peace of mind. Bereavement support helps families rebuild their lives.',
        'Advocacy for policy change works with governments to reform drug regulations, increase morphine access, and integrate palliative care into national health systems.',
      ],
    },
    tags: ['palliative care', 'end-of-life care', 'pain management', 'hospice care', 'dignity'],
    titlePrefix: 'Palliative Care Bringing Dignity to',
  },
  'hospitals': {
    intro: [
      'In {{country}}, doctors and nurses perform duties without basic equipment needed to diagnose and treat patients safely. Surgeons operate by phone light. Maternity wards lack sterile delivery kits.',
      'The shortage of medical equipment is a silent crisis costing lives every day.',
    ],
    challenge: {
      heading: 'The Equipment Desert',
      paragraphs: [
        'The gap is about fundamentals. Hospitals that cannot monitor blood pressure cannot manage emergencies. Facilities without oxygen concentrators cannot support respiratory patients. Clinics without sterilisation equipment risk infections.',
        'Consequences are measured in preventable deaths. Maternal mortality remains high because workers lack complication-management equipment. Diagnostic delays occur because laboratories lack basic equipment.',
      ],
    },
    approach: {
      heading: 'Strategic Equipment Provision',
      paragraphs: [
        'Effective programmes conduct needs assessments, prioritise durable equipment suited to local conditions, and ensure installation and training. Equipment without training is expensive furniture.',
        'Supply chain support is critical — a ventilator without oxygen, a diagnostic machine without reagents, or surgical instruments without sterilisation chemicals are useless.',
      ],
      bullets: ['Facility needs assessments identifying specific gaps', 'Procurement of durable, climate-appropriate equipment', 'Installation by qualified biomedical technicians', 'Staff training on operation and maintenance', 'Local supply chains for consumables and spare parts'],
    },
    impact: {
      heading: 'Impact on Patient Outcomes',
      paragraphs: [
        'Facilities report reduced maternal and child mortality, improved diagnostic accuracy, and shorter recovery times. Staff morale improves when workers have the tools they need.',
        'Patients travel shorter distances for services previously available only at distant referral hospitals. The economic impact includes reduced travel costs and time for patients and families.',
      ],
    },
    tags: ['hospital equipment', 'medical donations', 'healthcare infrastructure', 'medical training', 'patient outcomes'],
    titlePrefix: 'Hospital Equipment Saving Lives in',
  },
  'housing': {
    intro: [
      'In {{country}}, millions live in informal settlements — makeshift shelters of corrugated metal and plastic sheeting lacking clean water, sanitation, and structural safety.',
      'Affordable housing and slum upgrading programmes build safe, durable homes that give families security to build better lives.',
    ],
    challenge: {
      heading: 'The Human Cost of Inadequate Housing',
      paragraphs: [
        'Living in slum conditions affects every aspect of life. Children suffer respiratory illness, diarrhoeal disease, and malnutrition. Women face safety risks. Families spend hours collecting water. The cumulative effect is a cycle of poverty that is extremely difficult to break.',
        'Fires are a particular danger. Closely packed flammable structures combined with open cooking fires mean a small fire can destroy hundreds of homes in minutes.',
      ],
    },
    approach: {
      heading: 'Community-Driven Housing Solutions',
      paragraphs: [
        'Effective programmes involve residents in planning, design, and construction. This ensures homes meet actual needs and are maintained by invested residents.',
        'Slum upgrading improves entire settlements with infrastructure — pathways, drainage, lighting, water points. Combined with tenure security, improvements encourage residents to invest in communities.',
      ],
      bullets: ['Community-driven planning and design', 'Construction using locally sourced, durable materials', 'Infrastructure: water, sanitation, lighting, drainage', 'Land rights advocacy securing tenure', 'Disaster-resilient building training'],
    },
    impact: {
      heading: 'Securing Land Rights: The Foundation',
      paragraphs: [
        'Without secure tenure, improvements are precarious. When families know they will not be evicted, they invest in homes, send children to school, and participate in community life with confidence.',
        'Property values increase, local businesses grow, and new economic opportunities emerge. The investment in upgrading pays for itself many times over.',
      ],
    },
    tags: ['affordable housing', 'slum upgrading', 'urban poverty', 'land rights', 'community development'],
    titlePrefix: 'Affordable Housing and Slum Upgrading in',
  },
  'human-rights': {
    intro: [
      'In {{country}}, fundamental human rights and press freedom face increasing pressure. Journalists are detained for reporting. Activists are threatened for demanding accountability.',
      'Human rights advocacy organisations provide legal defence, protection, and amplification for those whose rights are under threat.',
    ],
    challenge: {
      heading: 'Press Freedom Under Threat',
      paragraphs: [
        'Press freedom has deteriorated. Journalists investigating corruption face harassment, legal threats, and violence. When citizens cannot access independent information, they cannot make informed governance decisions.',
        'Digital restrictions — monitoring, shutdowns, cybercrime laws — restrict online expression. The right to information essential for democracy is increasingly threatened.',
      ],
    },
    approach: {
      heading: 'Legal Defence for Rights Defenders',
      paragraphs: [
        'Organisations provide free legal clinics for detained journalists, imprisoned activists, and communities facing forced eviction. Strategic litigation challenges unconstitutional laws.',
        'Community rights education equips people with knowledge of their fundamental rights. When people understand their rights, they are better equipped to claim them and hold duty-bearers accountable.',
      ],
      bullets: ['Free legal representation for detained journalists and activists', 'Strategic litigation challenging unconstitutional laws', 'Emergency protection for threatened rights defenders', 'Documentation of human rights violations', 'Community legal education on fundamental rights'],
    },
    impact: {
      heading: 'Empowering Communities Through Rights Education',
      paragraphs: [
        'Women\'s rights advocacy addresses gender-based violence, land inheritance, political participation, and economic empowerment. Legal aid combined with awareness campaigns creates immediate protection and long-term cultural change.',
        'International solidarity provides protection when domestic mechanisms fail. Documentation and lobbying create pressure for systemic reform.',
      ],
    },
    tags: ['human rights', 'press freedom', 'legal defence', 'activism', 'civil liberties'],
    titlePrefix: 'Human Rights and Press Freedom in',
  },
  'international': {
    intro: [
      'In rural {{country}}, millions walk hours daily to collect water from rivers and unprotected springs. The water they carry is often contaminated with bacteria causing cholera, typhoid, and diarrhoeal disease.',
      'Clean water well construction projects bring safe, reliable water sources directly to villages that need them most.',
    ],
    challenge: {
      heading: 'The Hidden Burden of Water Collection',
      paragraphs: [
        'Women and girls spend 2-4 hours daily collecting water. Carrying heavy containers causes chronic back pain and injury. Isolated collection points present safety risks including gender-based violence.',
        'Diarrhoeal diseases from contaminated water are the second leading cause of death in children under five. Chronic exposure causes environmental enteropathy impairing nutrient absorption and contributing to stunting.',
      ],
    },
    approach: {
      heading: 'How Well Construction Works',
      paragraphs: [
        'Projects drill boreholes reaching underground aquifers and construct protected well heads with hand pumps. Hydrogeological surveys identify optimal locations.',
        'Community water user committees collect fees, manage maintenance, and handle repairs. Training local mechanics in pump maintenance creates self-sufficiency.',
      ],
      bullets: ['Hydrogeological surveys identifying optimal drilling locations', 'Borehole drilling reaching reliable underground aquifers', 'Protected well head construction preventing contamination', 'Hand pump installation for hygienic water access', 'Community committees overseeing maintenance'],
    },
    impact: {
      heading: 'WASH: The Complete Package',
      paragraphs: [
        'Programmes combine well construction with Water, Sanitation, and Hygiene interventions. Hygiene education maximises health benefits. Sanitation improvements reduce contamination.',
        'Schools near wells show improved attendance. Health clinics maintain hygiene standards. Women and girls gain productive hours. Communities gather around wells, creating social connections.',
      ],
    },
    tags: ['clean water', 'well construction', 'WASH', 'water access', 'community development'],
    titlePrefix: 'Clean Water Well Construction in Rural',
  },
  'learning-disabilities-and-sen': {
    intro: [
      'In {{country}}, children on the autism spectrum face a triple burden: their condition\'s challenges, absence of services, and deep stigma surrounding developmental disabilities.',
      'Most autistic children go undiagnosed until school age. Those diagnosed lack access to therapy, education, or community support needed to thrive.',
    ],
    challenge: {
      heading: 'The Diagnostic Desert',
      paragraphs: [
        'Getting diagnosed is a journey most families cannot complete. The few autism-expert clinicians are in capital cities behind paywalls. In rural areas, autism is misattributed to spiritual causes, leading to harmful treatments and shame.',
        'Early intervention from 18 months significantly improves outcomes. Without it, children miss developmental windows, develop challenging behaviours, and the gap between potential and reality widens.',
      ],
    },
    approach: {
      heading: 'Building Diagnostic Capacity',
      paragraphs: [
        'Community-based screening uses simple, culturally appropriate tools. Trained health workers identify early signs. Children screening positive are referred for formal assessment.',
        'Parent-mediated intervention multiplies impact. Training parents to implement therapy at home achieves outcomes comparable to professional therapy when implemented consistently.',
      ],
      bullets: ['Community-based screening using culturally appropriate tools', 'Training health workers to identify early autism signs', 'Formal diagnostic assessments by trained clinicians', 'Early intervention: speech, occupational, and behavioural therapy', 'Parent training programmes empowering families'],
    },
    impact: {
      heading: 'Inclusive Education: Making Schools Work',
      paragraphs: [
        'Teacher training covers understanding autism, adapting methods, managing sensory needs, and creating supportive environments. Simple adjustments transform educational outcomes.',
        'Inclusive classrooms benefit all students. The empathy, patience, and differentiated instruction that help autistic learners also improve the experience for neurotypical peers.',
      ],
    },
    tags: ['autism', 'special educational needs', 'inclusive education', 'early intervention', 'therapy'],
    titlePrefix: 'Autism Spectrum Support Services in',
  },
  'medical-research': {
    intro: [
      'Malaria remains one of {{country}}\'s greatest health challenges, killing over 600,000 people annually — predominantly children under five in sub-Saharan Africa.',
      'Groundbreaking research programmes are developing new vaccines, treatments, and diagnostics that could save millions of lives.',
    ],
    challenge: {
      heading: 'The Vaccine Challenge',
      paragraphs: [
        'Developing a malaria vaccine has proven extraordinarily difficult. The parasite has a complex life cycle with multiple stages, each presenting different targets. It continuously mutates, evading immune responses.',
        'Malaria\'s burden in {{country}} is staggering — significant proportions of outpatient visits, hospital admissions, and child deaths. Beyond mortality, it imposes enormous economic costs through lost productivity.',
      ],
    },
    approach: {
      heading: 'African-Led Research Makes a Difference',
      paragraphs: [
        'African researchers in endemic areas have direct access to affected populations, enabling relevant clinical trials. Local understanding of transmission patterns informs study design.',
        'Drug resistance is an increasing concern. Programmes monitor resistance, develop alternative combinations, and investigate novel therapeutics. Vector research explores gene drives, biological larvicides, and innovative control methods.',
      ],
      bullets: ['Next-generation malaria vaccine clinical trials', 'Drug resistance monitoring and new treatments', 'Novel diagnostic tools for earlier detection', 'Vector biology research on mosquito behaviour', 'Implementation research optimising intervention delivery'],
    },
    impact: {
      heading: 'From Research to Impact',
      paragraphs: [
        'Clinical trial sites serve as healthcare delivery points for local communities. Research training builds the next generation of African scientists.',
        'The ultimate measure is impact on human health. Every finding translated into policy and practice brings {{country}} closer to eliminating malaria as a public health threat.',
      ],
    },
    tags: ['malaria research', 'vaccine development', 'medical research', 'clinical trials', 'public health'],
    titlePrefix: 'Malaria Research and Vaccine Development in',
  },
  'medical-welfare': {
    intro: [
      'In {{country}}, the gap between healthcare need and provision is measured in lives. For every doctor serving rural communities, tens of thousands depend on them.',
      'Community health workers bridge this gap — locally recruited individuals providing frontline healthcare. Training programmes save lives across {{country}}.',
    ],
    challenge: {
      heading: 'The Healthcare Workforce Crisis',
      paragraphs: [
        'Government facilities are chronically understaffed, with rural posts vacant for years. Training a doctor takes over a decade and costs hundreds of thousands of dollars resources most systems lack.',
        'CHWs diagnose and treat common illnesses, conduct antenatal checks, administer vaccinations, provide health education, and maintain records. Where clinics are hours away, CHWs are the only healthcare.',
      ],
    },
    approach: {
      heading: 'Training That Makes a Difference',
      paragraphs: [
        'Training combines theoretical knowledge with practical skills: symptom assessment, referrals, medication management, and health education. Communication skills — explaining in local languages and building trust — are crucial.',
        'Regular supervision, refresher training, and clinical mentorship maintain skills. Supply chain management ensures CHWs have medicines and equipment they need.',
      ],
      bullets: ['Comprehensive diagnosis and treatment training', 'Practical skills: wound care, vital signs, medication management', 'Health education techniques for community campaigns', 'Supply chain management for essential medicines', 'Data collection and disease surveillance'],
    },
    impact: {
      heading: 'Retention: Keeping CHWs in Service',
      paragraphs: [
        'Without adequate compensation, many leave for better-paying work. Effective programmes address this through stipends, incentives, career progression, and community recognition.',
        'The impact ripples through communities. Timely treatment saves children. Antenatal care ensures safer deliveries. Health education creates lasting behaviour change.',
      ],
    },
    tags: ['community health workers', 'health training', 'primary healthcare', 'health workforce', 'rural health'],
    titlePrefix: 'Community Health Worker Training in',
  },
  'mental-health': {
    intro: [
      'In {{country}}, mental illness is one of the most misunderstood and stigmatised conditions. People with depression, anxiety, and psychosis face discrimination, exclusion, and dangerous traditional treatments.',
      'Stigma prevents millions from seeking help, creating a silent crisis. Mental health programmes are breaking these barriers.',
    ],
    challenge: {
      heading: 'Understanding the Stigma',
      paragraphs: [
        'Stigma operates at multiple levels: individuals hide symptoms, families lock away members with severe illness, and communities exclude those with mental health conditions.',
        'Africa has fewer than 0.1 psychiatrists per 100,000 people. In {{country}}, services are concentrated in a single facility. Stigma means even available services go unused.',
      ],
    },
    approach: {
      heading: 'Breaking Stigma Through Dialogue',
      paragraphs: [
        'Anti-stigma programmes use community theatre, radio, and forums for safe discussion. People with lived experience share stories, humanising conditions and demonstrating recovery is possible.',
        'Trained community mental health workers provide counselling and psychosocial support. Integration into primary healthcare ensures routine treatment access.',
      ],
      bullets: ['Community theatre and storytelling challenging stigma', 'Radio programmes in local languages', 'Peer support groups for affected individuals', 'Training community leaders as mental health champions', 'Integration into primary healthcare'],
    },
    impact: {
      heading: 'The Economic Case for Investment',
      paragraphs: [
        'Mental health conditions cost {{country}} billions in lost productivity and healthcare. Depression alone is a leading cause of disability. Investment generates significant returns.',
        'Communities receiving anti-stigma education show improved attitudes. People are more likely to seek treatment, families are more supportive, and social exclusion gradually diminishes.',
      ],
    },
    tags: ['mental health', 'stigma reduction', 'community mental health', 'counselling', 'awareness'],
    titlePrefix: 'Mental Health Stigma Reduction in',
  },
  'overseas-aid': {
    intro: [
      'In {{country}}, prolonged drought has pushed communities to the brink of famine. Crops have failed, livestock perished, and families survive on one meal a day or less.',
      'Emergency food relief is the difference between life and death for millions in drought-affected regions.',
    ],
    challenge: {
      heading: 'The Anatomy of a Food Crisis',
      paragraphs: [
        'Food crises develop gradually but escalate rapidly. Poor rainfall leads to crop failure. Food stocks deplete. Malnutrition rises among children and pregnant women.',
        'In {{country}}, communities dependent on subsistence farming have lost primary food sources. Families eat planting seeds, sell last livestock, and migrate to overcrowded urban areas.',
      ],
    },
    approach: {
      heading: 'Rapid Response That Saves Lives',
      paragraphs: [
        'Pre-positioned supplies distribute within hours. Mobile teams reach affected communities using trucks, boats, and donkey carts. The goal is reaching the most vulnerable before malnutrition becomes life-threatening.',
        'Programmes combine emergency distributions with livelihood recovery — seeds, tools, agricultural training. Cash transfers stimulate local markets while giving families dignity.',
      ],
      bullets: ['Emergency food distributions with calorie-dense rations', 'Therapeutic feeding for severely malnourished children', 'Supplementary feeding for pregnant and lactating women', 'Cash transfers enabling local food purchases', 'Water trucking and sanitation preventing disease outbreaks'],
    },
    impact: {
      heading: 'Preparedness: Reducing Future Impact',
      paragraphs: [
        'Pre-positioned stocks, trained disaster response teams, and early warning systems reduce the human and financial cost of future crises.',
        'Community-based targeting ensures relief reaches the most vulnerable. Trained committees identify households with greatest food insecurity.',
      ],
    },
    tags: ['emergency food relief', 'drought response', 'food security', 'humanitarian aid', 'famine prevention'],
    titlePrefix: 'Emergency Food Relief for Drought-Hit',
  },
  'religious': {
    intro: [
      'Across {{country}}, faith-based organisations are among the most trusted institutions serving vulnerable communities. Churches, mosques, and interfaith groups operate schools, clinics, and social services reaching millions.',
      'Programmes strengthen these organisations with resources and training to expand their vital work.',
    ],
    challenge: {
      heading: 'The Untapped Potential of Faith Communities',
      paragraphs: [
        'FBOs are embedded in communities, trusted by populations, and have mobilisable infrastructure. In many rural areas, the local church or mosque is the only functioning institution.',
        'Despite advantages, many lack organisational structures, financial systems, and governance frameworks. Leaders trained in theology lack project management and programme design skills.',
      ],
    },
    approach: {
      heading: 'Strengthening FBO Capacity',
      paragraphs: [
        'Capacity building provides training in organisational management, financial governance, programme design, and monitoring. This professionalises operations while maintaining community-centred approaches.',
        'Interfaith programmes build social cohesion through joint community service, breaking barriers and building trust across religious lines.',
      ],
      bullets: ['Organisational governance and management training', 'Financial management and accountability systems', 'Programme design and monitoring training', 'Infrastructure improvements for service delivery', 'Interfaith dialogue and cooperation programmes'],
    },
    impact: {
      heading: 'Sustainability: Beyond Donations',
      paragraphs: [
        'Diversifying income through social enterprise, agriculture, and income-generating activities builds financial resilience. Churches and mosques with farms or workshops fund services independently.',
        'Religious leaders trained as mediators contribute to community peace-building. Joint declarations against violence build consensus around coexistence.',
      ],
    },
    tags: ['faith-based organisations', 'community development', 'interfaith cooperation', 'social cohesion', 'FBO'],
    titlePrefix: 'Faith-Based Community Development in',
  },
  'rescue-services': {
    intro: [
      '{{country}} faces devastating flood events. When cyclones strike, low-lying communities are submerged within hours. Families are trapped, cut off from help, facing drowning and waterborne disease.',
      'Emergency response teams trained in flood rescue are the difference between life and death.',
    ],
    challenge: {
      heading: 'The Emergency Response Gap',
      paragraphs: [
        'Professional rescue services are concentrated in urban centres. Rural areas have virtually no formal emergency response capability. Communities rescue themselves using whatever materials are available.',
        'Drowning is the leading cause of death in floods, yet many victims could be saved with timely rescue. Waterborne diseases spread rapidly where sanitation is destroyed.',
      ],
    },
    approach: {
      heading: 'Training Community First Responders',
      paragraphs: [
        'Programmes train community volunteers in water rescue, first aid, emergency communication, and evacuation. They are equipped with life jackets, throw bags, and communication devices.',
        'Pre-positioned emergency supplies — food, water, shelter, medical supplies — enable immediate relief without waiting for external supply chains.',
      ],
      bullets: ['First responder training in water rescue and emergency response', 'Emergency equipment: life jackets, rescue boats, first aid kits', 'Motorcycle ambulance networks for rapid medical transport', 'Emergency communication systems coordinating response', 'Disaster preparedness training reducing vulnerability'],
    },
    impact: {
      heading: 'Recovery and Resilience Building',
      paragraphs: [
        'After waters recede, communities need transitional shelter, livelihood recovery, and psychosocial support. Longer-term investments in infrastructure and flood-resistant construction reduce future impact.',
        'Communities with preparedness plans experience significantly lower loss of life and property damage.',
      ],
    },
    tags: ['flood response', 'emergency services', 'disaster preparedness', 'first responders', 'rescue'],
    titlePrefix: 'Flood Disaster Emergency Response in',
  },
  'social-welfare': {
    intro: [
      'In {{country}}, women bear a disproportionate poverty burden. They work longer hours, earn less, and have limited control over finances. Cultural norms and economic exclusion keep millions in dependence.',
      'Women\'s empowerment through savings groups and cooperatives gives women financial tools, knowledge, and confidence to transform their lives.',
    ],
    challenge: {
      heading: 'The Power of Savings Groups',
      paragraphs: [
        'Women own a fraction of the land men do, have limited credit access, and are concentrated in lowest-paying sectors. Income earned is often handed to male family members.',
        'Savings groups — village savings and loan associations — are among the most effective empowerment tools. Groups of 15-30 women save regularly, lend at modest interest, and share financial education.',
      ],
    },
    approach: {
      heading: 'How Cooperatives Create Collective Power',
      paragraphs: [
        'Cooperatives pool resources for larger investments, negotiate better prices, and access collective credit. The impact extends beyond finances: women gain confidence, leadership skills, and social networks.',
        'Financial literacy training transforms approach to every aspect of life — budgeting, saving, investing, and economic decision-making.',
      ],
      bullets: ['Weekly savings meetings building financial discipline', 'Internal lending for business and emergencies', 'Financial literacy training on budgeting and investing', 'Cooperative enterprises enabling collective production', 'Leadership development creating community leaders'],
    },
    impact: {
      heading: 'Economic Independence Changes Everything',
      paragraphs: [
        'Women with income have greater household decision-making power. They invest more in children\'s nutrition, education, and healthcare. They are less vulnerable to domestic violence and more able to leave abusive relationships.',
        'Savings group networks become channels for information sharing, collective action, and mutual support during crises, reducing vulnerability and strengthening community cohesion.',
      ],
    },
    tags: ['women empowerment', 'savings groups', 'cooperatives', 'economic independence', 'gender equality'],
    titlePrefix: "Women's Empowerment Through Savings Groups in",
  },
  'sport-and-recreation': {
    intro: [
      'In {{country}}, young people face a shrinking recreational landscape. Urbanisation replaced open fields. Facilities are scarce. Unemployment leaves youth with limited constructive outlets.',
      'Youth sports programmes use sport to build healthier communities, develop life skills, and create positive futures.',
    ],
    challenge: {
      heading: 'The Youth Inactivity Crisis',
      paragraphs: [
        'Physical inactivity is rising as urbanisation changes lifestyles. Young people spend more time sedentary, leading to rising obesity, diabetes, and mental health conditions.',
        'Without constructive activities, idle youth are vulnerable to gang involvement, substance abuse, and early sexual activity.',
      ],
    },
    approach: {
      heading: 'Sport as a Vehicle for Change',
      paragraphs: [
        'Effective programmes embed life skills — health, leadership, gender equality, financial literacy — into sports sessions, reaching young people who might not engage with traditional education.',
        'Coach training creates local employment. Women\'s sports programmes challenge gender barriers, creating safe spaces for female participation.',
      ],
      bullets: ['Regular sports leagues in multiple disciplines', 'Life skills education embedded in sports programming', 'Coach and referee training creating local employment', "Women's sports programmes breaking gender barriers", 'Facility construction providing community spaces'],
    },
    impact: {
      heading: 'Community Facilities: The Foundation',
      paragraphs: [
        'Sports infrastructure is participation\'s foundation. Without playing fields, courts, and equipment, motivated young people still cannot participate.',
        'Community-managed facilities become social hubs beyond sport — hosting events, storing project materials, and serving as meeting spaces with returns extending far beyond athletics.',
      ],
    },
    tags: ['youth sports', 'community building', 'life skills', 'sports facilities', 'youth development'],
    titlePrefix: 'Youth Sports Programmes Building Community in',
  },
  'visual-impairments': {
    intro: [
      'In {{country}}, visually impaired children face a stark choice: learn braille or remain functionally illiterate. The vast majority have no access to braille instruction.',
      'Braille literacy programmes provide the skills visually impaired children need to access information, communicate, and build independent futures.',
    ],
    challenge: {
      heading: 'The Braille Gap',
      paragraphs: [
        'Specialised schools for the blind are few, poorly resourced, and far from rural communities. Mainstream teachers have no braille training. Without braille, children cannot keep up and eventually drop out.',
        'Braille production faces challenges: expensive presses, specialised translation skills, and diversity of local languages mean materials in official languages may not serve all students.',
      ],
    },
    approach: {
      heading: 'Building Braille Literacy From the Ground Up',
      paragraphs: [
        'Programmes train teachers in braille and adaptive pedagogy, produce materials in local languages, and work with families to build awareness and support.',
        'Technology expands access: screen readers on smartphones, audio books, and digital braille displays. Training programmes teach visually impaired people to use these tools effectively.',
      ],
      bullets: ['Teacher training in braille and adaptive pedagogy', 'Braille materials produced in local languages', 'Early identification and intervention for vision loss', 'Family education and support', 'Assistive technology training including screen readers'],
    },
    impact: {
      heading: 'School Screening: Identifying Children Early',
      paragraphs: [
        'School screening checks vision and identifies children needing assessment. Those with vision loss are referred for treatment and connected with braille instruction.',
        'Eye health programmes address correctable conditions: reading glasses, infection treatment, and vitamin A supplementation prevent avoidable vision loss and support all students.',
      ],
    },
    tags: ['braille literacy', 'visual impairment', 'blind education', 'inclusive education', 'assistive technology'],
    titlePrefix: 'Braille Literacy for Visually Impaired Children in',
  },
}
