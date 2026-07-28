import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Calendar, Tag, Clock, Search,
} from 'lucide-react'
import { images } from '@/lib/images'

const categories = ['All', 'Field Update', 'Impact Story', 'News', 'Annual Report']

const featuredArticle = {
  title: 'New Water Well Serves 3,000 in Machakos County',
  excerpt: 'A new deep-bore water well in Machakos County, Kenya, is providing clean, safe drinking water to over 3,000 people — eliminating a daily 3km walk to the nearest water source for hundreds of families.',
  date: 'January 15, 2025',
  category: 'Field Update',
  readTime: '5 min read',
  image: images.news.featured,
}

const articles = [
  {
    title: 'Class of 2024: 247 Students Graduate from Our Partner Schools',
    excerpt: 'This year marks our largest graduating class yet, with students from Kenya, Tanzania, and Ghana completing secondary education through our scholarship program.',
    date: 'December 20, 2024',
    category: 'Impact Story',
    readTime: '4 min read',
    image: images.news.cards[0],
  },
  {
    title: 'Mobile Health Clinic Reaches Remote Villages in Northern Ghana',
    excerpt: 'Our mobile health unit has completed its first 6 months of operation, providing over 1,200 health screenings to communities with no access to healthcare.',
    date: 'November 8, 2024',
    category: 'Field Update',
    readTime: '6 min read',
    image: images.news.cards[1],
  },
  {
    title: 'Community Farming Initiative Doubles Harvest in Rural Tanzania',
    excerpt: 'Through training in modern farming techniques and access to improved seeds, 150 farming families in Mbeya have doubled their crop yields.',
    date: 'October 22, 2024',
    category: 'Impact Story',
    readTime: '5 min read',
    image: images.news.cards[2],
  },
  {
    title: 'Emergency Response: Flood Relief in Mozambique',
    excerpt: 'Following devastating floods in Sofala Province, our emergency team distributed emergency supplies to 800 displaced families within 72 hours.',
    date: 'September 14, 2024',
    category: 'News',
    readTime: '3 min read',
    image: images.news.cards[3],
  },
  {
    title: 'Annual Report 2024: A Year of Growth and Impact',
    excerpt: 'Our 2024 annual report highlights a record year: 47,500 lives touched, 186 projects completed, and $2.4M raised across 12 countries.',
    date: 'March 1, 2025',
    category: 'Annual Report',
    readTime: '8 min read',
    image: images.news.cards[4],
  },
  {
    title: 'New Scholarship Program Launches in Senegal',
    excerpt: 'We\'re excited to announce a new partnership with the Senegalese Ministry of Education to provide 200 scholarships for girls in rural communities.',
    date: 'August 5, 2024',
    category: 'News',
    readTime: '4 min read',
    image: images.news.cards[5],
  },
]

const categoryColors: Record<string, string> = {
  'Field Update': 'bg-savanna/5 text-savanna-dark ring-savanna/8',
  'Impact Story': 'bg-ochre/5 text-ochre-dark ring-ochre/8',
  'News': 'bg-blue-50 text-blue-700 ring-blue-100',
  'Annual Report': 'bg-ochre/5 text-ochre-dark ring-ochre/8',
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.heroes.news})` }}
        />
        <div className="absolute inset-0 bg-indigo/85" />
        <div className="container-page relative py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-ochre-light backdrop-blur-sm">
                <Tag className="h-4 w-4" />
                News & Updates
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 font-display text-4xl font-medium leading-tight md:text-5xl lg:text-6xl"
            >
              Stories of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ochre-light to-ochre">
                Impact
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
            >
              Read the latest updates from the field, learn about our impact, and stay informed
              about the communities we serve.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12 md:py-16">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card group overflow-hidden p-0"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 lg:p-10">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${categoryColors[featuredArticle.category]}`}>
                    <Tag className="h-3 w-3" />
                    {featuredArticle.category}
                  </span>
                   <span className="flex items-center gap-1 text-xs text-ink-soft">
                    <Calendar className="h-3 w-3" />
                    {featuredArticle.date}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-medium text-ink md:text-3xl">
                  {featuredArticle.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {featuredArticle.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-ink-soft">
                    <Clock className="h-3 w-3" />
                    {featuredArticle.readTime}
                  </span>
                  <Link
                    to="#"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-ochre-dark transition-colors hover:text-ochre-dark"
                  >
                    Read Full Story
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter & Articles Grid */}
      <section className="pb-20 md:pb-28">
        <div className="container-page">
          {/* Search & Filter */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="Search articles..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-ink text-white'
                      : 'bg-ink/8 text-ink-soft hover:bg-ink/12'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, i) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card group overflow-hidden p-0"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-350 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${categoryColors[article.category] || 'bg-parchment text-ink-soft ring-ink/8'}`}>
                      <Tag className="h-3 w-3" />
                      {article.category}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-medium text-ink leading-snug">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4">
                    <div className="flex items-center gap-3 text-xs text-ink-soft">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <Link
                    to="#"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-ochre-dark transition-colors hover:text-ochre-dark"
                  >
                    Read More
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-ink-soft">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
