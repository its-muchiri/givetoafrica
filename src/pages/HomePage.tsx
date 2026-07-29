import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Seo from '@/components/Seo'
import {
  Heart, ArrowRight, Shield, Eye, Award, TrendingUp, Quote,
} from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import HeroBlogCarousel from '@/components/HeroBlogCarousel'
import BlogCarousel from '@/components/BlogCarousel'
import { categories } from '@/lib/categories'
import { images, causeImages } from '@/lib/images'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}
const wordReveal = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}
const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

const topCauses = categories.slice(0, 4)

const testimonials = [
  {
    quote: "GiveToAfrica helped us build a school in our village. Now my daughter walks to class instead of walking to fetch water. She wants to be a doctor.",
    name: "Grace Wanjiku",
    role: "Parent, Machakos County, Kenya",
  },
  {
    quote: "Since the well was built, our children no longer get sick from dirty water. The whole community gathered to celebrate the day it was finished.",
    name: "Kwame Asante",
    role: "Community Leader, Ashanti Region, Ghana",
  },
  {
    quote: "The health clinic they funded has changed everything. Women no longer have to travel 40km to see a nurse. Mothers and babies are surviving.",
    name: "Fatima Bello",
    role: "Community Health Worker, Kaduna, Nigeria",
  },
]

const trustBadges = [
  { name: 'GuideStar', badge: 'Platinum Seal' },
  { name: 'Charity Navigator', badge: '4-Star Rating' },
  { name: 'BBB', badge: 'Accredited' },
  { name: 'GlobalGiving', badge: 'Vetted' },
]

const latestStories = [
  {
    title: 'Clean Water Transforms Machakos County',
    excerpt: 'A deep-bore well providing clean, safe drinking water to over 3,000 people has changed everything in Kyaani village, Kenya.',
    date: 'June 15, 2026',
    readTime: '7 min read',
    category: 'Community Development',
    image: images.news.featured,
    href: '/blog/clean-water-transforms-machakos-county',
  },
  {
    title: 'Breaking Down Barriers for Girls in Northern Ghana',
    excerpt: 'Targeted scholarships and mentorship are helping girls stay in school and build futures their mothers never had.',
    date: 'May 28, 2026',
    readTime: '6 min read',
    category: 'Education & Training',
    image: images.news.cards[0],
    href: '/blog/education-barriers-girls-northern-ghana',
  },
  {
    title: 'Mobile Health Clinic Reaches Remote Villages',
    excerpt: 'Our mobile health unit has completed over 12,000 patient consultations across remote communities in northern Ghana.',
    date: 'April 22, 2026',
    readTime: '8 min read',
    category: 'Healthcare',
    image: images.news.cards[1],
    href: '/blog/mobile-health-clinic-remote-northern-ghana',
  },
]

export default function HomePage() {
  return (<><Seo
    title="GiveToAfrica — Empowering African Communities"
    description="Donate to verified causes across Africa. Education, clean water, healthcare, food security, and more. 100% of donations go to programs."
    url="/"
  />
  <HomePageContent /></>)
}

function HomePageContent() {
  const rm = useReducedMotion()
  const fundsRaised = useCountUp(2450000)
  const peopleHelped = useCountUp(47500)
  const projectsComplete = useCountUp(186)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.heroes.home})` }}
        />
        <div className="absolute inset-0 bg-indigo/85" />
        <div className="container-page relative py-20 md:py-28 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: Text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.span variants={wordReveal} className="text-label text-ochre-light">
                Trusted by 12,000+ donors worldwide
              </motion.span>

              <motion.h1 variants={wordReveal} className="mt-6 font-display text-4xl font-medium leading-tight md:text-5xl lg:text-6xl xl:text-7xl">
                Empowering Communities.{' '}
                <span className="font-soft-italic text-ochre-light">
                  Building Futures.
                </span>
              </motion.h1>

              <motion.p variants={wordReveal} className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
                Together, we're providing education, clean water, healthcare, and food security
                to communities across Africa. Every donation creates real, measurable impact.
              </motion.p>

              <motion.div variants={wordReveal} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/donate" className="btn-primary px-8 py-4 text-base">
                  <Heart className="h-5 w-5 btn-icon" fill="currentColor" strokeWidth={0} />
                  Donate Now
                </Link>
                <Link
                  to="/causes"
                  className="inline-flex items-center justify-center gap-2 rounded border border-white/20 px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  See Our Work <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              {/* Impact Counters */}
              <motion.div variants={wordReveal} className="mt-14">
                <div className="relative overflow-hidden rounded-xl ring-1 ring-white/10">
                  <img
                    src={images.misc.fieldPhoto}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover blur-sm scale-110"
                  />
                  <div className="absolute inset-0 bg-indigo/60" />
                  <div className="relative grid grid-cols-3 gap-4 p-5">
                    {[
                      { ref: fundsRaised.ref, count: fundsRaised.count, display: `$${(fundsRaised.count / 1000000).toFixed(1)}M`, label: 'Funds Raised' },
                      { ref: peopleHelped.ref, count: peopleHelped.count, display: `${peopleHelped.count.toLocaleString()}+`, label: 'Lives Changed' },
                      { ref: projectsComplete.ref, count: projectsComplete.count, display: `${projectsComplete.count}`, label: 'Projects Completed' },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <span ref={stat.ref} className="mono-number block font-display text-2xl font-medium text-ochre-light md:text-3xl">
                          {stat.display}
                        </span>
                        <span className="mt-1 block text-xs text-white/70">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Blog Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rm ? 0 : 0.4, duration: rm ? 0 : 0.6 }}
              className="hidden lg:flex items-center justify-center"
            >
              <HeroBlogCarousel
                items={[
                  {
                    title: 'Clean Water Transforms Machakos County',
                    excerpt: 'A deep-bore well providing clean, safe drinking water to over 3,000 people in rural Kenya.',
                    category: 'Community Development',
                    image: images.news.featured,
                    href: '/blog/clean-water-transforms-machakos-county',
                  },
                  {
                    title: 'Breaking Down Barriers for Girls in Ghana',
                    excerpt: 'Targeted scholarships and mentorship are helping girls stay in school and build futures.',
                    category: 'Education & Training',
                    image: images.news.cards[0],
                    href: '/blog/education-barriers-girls-northern-ghana',
                  },
                  {
                    title: 'Mobile Health Clinic Reaches Remote Villages',
                    excerpt: 'Our mobile health unit completed over 12,000 patient consultations across northern Ghana.',
                    category: 'Healthcare',
                    image: images.news.cards[1],
                    href: '/blog/mobile-health-clinic-remote-northern-ghana',
                  },
                ]}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white py-5" style={{ borderBottom: '1px solid rgba(42,36,32,0.08)' }}>
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {trustBadges.map((badge) => (
              <div key={badge.name} className="flex items-center gap-2 opacity-40 transition-opacity hover:opacity-70">
                <Shield className="h-4 w-4 text-savanna" />
                <div>
                  <div className="text-2xs font-semibold text-ink">{badge.name}</div>
                  <div className="text-2xs text-ink-soft">{badge.badge}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Causes Section */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="py-20 md:py-28"
        style={{ background: '#FBF7F1' }}
      >
        <div className="container-page">
          <motion.div variants={fadeInUp} className="text-center">
            <span className="text-label text-ochre-dark">Our Programs</span>
            <h2 className="section-heading mt-3">Where Your Donation Goes</h2>
            <p className="section-subheading mx-auto">
              Every dollar is directed to where it's needed most. Choose a cause that resonates with you.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topCauses.map((cause) => {
              const progress = Math.round((cause.raisedAmount / cause.goalAmount) * 100)
              const causeImage = causeImages[cause.slug]
              return (
                <motion.div key={cause.slug} variants={fadeInUp}>
                  <Link
                    to={`/causes/${cause.slug}`}
                    className="group block rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                    style={{ background: '#FFFFFF', border: '1px solid #DDD0BE' }}
                  >
                    <div className="h-36 overflow-hidden bg-amber-900">
                      {causeImage ? (
                        <img
                          src={causeImage}
                          alt={cause.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <cause.icon className="h-8 w-8" style={{ color: 'rgba(255,255,255,0.3)' }} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3
                        className="text-base font-semibold leading-snug group-hover:text-orange-700 transition-colors"
                        style={{ fontFamily: 'var(--font-display-figma)', color: '#1C1612' }}
                      >
                        {cause.name}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed line-clamp-2" style={{ color: '#8A7260' }}>
                        {cause.tagline}
                      </p>
                      <div className="mt-3">
                        <div className="flex justify-between text-2xs" style={{ color: '#8A7260' }}>
                          <span>${(cause.raisedAmount / 1000).toFixed(0)}K raised</span>
                          <span className="font-medium" style={{ color: '#C2571A' }}>{progress}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 rounded-full" style={{ background: '#EDE5D8' }}>
                          <div
                            className="h-1.5 rounded-full cause-progress-fill"
                            style={{ width: `${progress}%`, background: '#C2571A' }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <motion.div variants={fadeInUp} className="mt-10 text-center">
            <Link to="/causes" className="btn-outline">
              View All 28 Causes <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="bg-white py-20 md:py-28"
        style={{ borderTop: '1px solid rgba(42,36,32,0.08)', borderBottom: '1px solid rgba(42,36,32,0.08)' }}
      >
        <div className="container-page">
          <motion.div variants={fadeInUp} className="text-center">
            <span className="text-label text-savanna">How It Works</span>
            <h2 className="section-heading mt-3">Your Donation in 3 Steps</h2>
          </motion.div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              { step: '01', title: 'Choose Your Impact', desc: 'Pick a cause and amount that matters to you — from any currency.' },
              { step: '02', title: 'Donate Securely', desc: 'Pay with card, mobile money, or bank transfer. PCI-DSS compliant.' },
              { step: '03', title: 'See Your Impact', desc: 'Receive updates, photos, and reports showing exactly how your donation helped.' },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeInUp} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-ochre-dark/10 font-mono text-xl font-medium text-ochre-dark">
                  {item.step}
                </div>
                <h3 className="mt-5 font-display text-lg font-medium text-ink">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="py-20 md:py-28"
      >
        <div className="container-page">
          <motion.div variants={fadeInUp} className="text-center">
            <span className="text-label">Stories of Impact</span>
            <h2 className="section-heading mt-3">Hear From Our Community</h2>
          </motion.div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeInUp} className="card-static p-6 relative">
                <Quote className="absolute right-5 top-5 h-6 w-6 text-ochre-dark/15" />
                <p className="relative z-10 text-sm leading-relaxed text-ink-soft">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-ochre-dark/10 font-mono text-xs font-medium text-ochre-dark">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink">{t.name}</div>
                    <div className="text-2xs text-ink-soft">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Transparency */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="bg-white py-20 md:py-28"
        style={{ borderTop: '1px solid rgba(42,36,32,0.08)' }}
      >
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div variants={fadeInUp}>
              <span className="text-label text-savanna">Transparency</span>
              <h2 className="section-heading mt-3">Every Dollar Accounted For</h2>
              <p className="section-subheading">
                We believe you deserve to know exactly where your money goes. Our financials
                are audited annually and publicly available.
              </p>
              <div className="mt-8 space-y-5">
                {[
                  { label: 'Programs & Services', pct: 84, color: 'bg-savanna' },
                  { label: 'Fundraising', pct: 9, color: 'bg-ochre' },
                  { label: 'Administration', pct: 7, color: 'bg-ink-muted' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-ink">{item.label}</span>
                      <span className="mono-number font-semibold text-ink">{item.pct}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-parchment">
                      <div className={`h-full rounded-full ${item.color} progress-stripe`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/impact" className="btn-secondary mt-8">
                <Eye className="h-4 w-4" /> View Full Financials
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, title: 'Charity Navigator', sub: '4-Star Rating', bg: 'bg-savanna/10 text-savanna' },
                { icon: Shield, title: 'PCI-DSS', sub: 'Fully Compliant', bg: 'bg-indigo/10 text-indigo' },
                { icon: TrendingUp, title: '84% to Programs', sub: 'Industry Leading', bg: 'bg-ochre-dark/10 text-ochre-dark' },
                { icon: Eye, title: 'Annual Audit', sub: 'Publicly Available', bg: 'bg-ink/5 text-ink' },
              ].map((item) => (
                <div key={item.title} className={`rounded-sm p-5 ${item.bg}`}>
                  <item.icon className="h-5 w-5" />
                  <div className="mt-3 text-sm font-medium">{item.title}</div>
                  <div className="text-2xs opacity-60">{item.sub}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Latest Stories Carousel */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label text-ochre-dark">Latest Stories</span>
            <h2 className="section-heading mt-3">From the Field</h2>
            <p className="section-subheading">
              Real updates from the communities you're helping. Every story represents
              lives changed through your generosity.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-10"
          >
            <BlogCarousel items={latestStories} />
          </motion.div>
          <div className="mt-8 text-center">
            <Link to="/news" className="btn-secondary">
              View All Stories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-ochre-dark py-20 md:py-28">
        <div className="container-page text-center">
          <h2 className="font-display text-3xl font-medium text-white md:text-5xl">
            Ready to Change a Life Today?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            It takes just 60 seconds to donate. Choose an amount, pick your method, and join
            12,000+ donors already making a difference.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded bg-white px-10 py-4 text-base font-semibold text-ink transition-all hover:bg-parchment"
            >
              <Heart className="h-5 w-5" fill="currentColor" strokeWidth={0} />
              Donate $50 Now
            </Link>
            <Link
              to="/donate?amount=5000&recurring=true"
              className="inline-flex items-center gap-2 rounded border-2 border-white/30 px-10 py-4 text-base font-medium text-white transition-all hover:bg-white/10"
            >
              Set Up Monthly Giving
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
