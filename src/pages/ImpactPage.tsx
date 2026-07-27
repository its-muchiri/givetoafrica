import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Eye, Shield, Award, TrendingUp, Download, FileText,
  ArrowRight, CheckCircle, BarChart3, Globe, Heart,
} from 'lucide-react'

const financialBreakdown = [
  { label: 'Programs & Services', pct: 84, color: 'bg-savanna', description: 'Direct impact through education, water, health, and food programs.' },
  { label: 'Fundraising', pct: 9, color: 'bg-ochre', description: 'Donor outreach and campaign management.' },
  { label: 'Administration', pct: 7, color: 'bg-ink-muted', description: 'Operations, compliance, and organizational overhead.' },
]

const ratings = [
  {
    name: 'Charity Navigator',
    badge: '4-Star Rating',
    score: '92/100',
    description: 'Highest possible rating for financial health, accountability, and transparency.',
    color: 'from-savanna/5 to-savanna/10 text-savanna-dark ring-savanna/12',
    iconColor: 'text-savanna',
  },
  {
    name: 'GuideStar',
    badge: 'Platinum Seal',
    score: 'Level 3',
    description: 'Demonstrates the highest level of transparency with comprehensive organizational data.',
    color: 'from-blue-50 to-blue-100 text-blue-700 ring-blue-200',
    iconColor: 'text-blue-600',
  },
  {
    name: 'BBB',
    badge: 'Accredited Charity',
    score: 'A+',
    description: 'Meets all 20 BBB Standards for Charity Accountability.',
    color: 'from-ochre/5 to-ochre/10 text-ochre-dark ring-ochre/12',
    iconColor: 'text-ochre',
  },
  {
    name: 'GlobalGiving',
    badge: 'Vetted Partner',
    score: 'Verified',
    description: 'Rigorously vetted partner meeting GlobalGiving\'s performance and reporting standards.',
    color: 'from-ochre/5 to-ochre/10 text-ochre-dark ring-ochre/12',
    iconColor: 'text-ochre',
  },
]

const annualReports = [
  { year: '2024', title: 'Annual Report & Financial Statements', size: '2.4 MB', date: 'March 2025' },
  { year: '2023', title: 'Annual Report & Financial Statements', size: '2.1 MB', date: 'March 2024' },
  { year: '2022', title: 'Annual Report & Financial Statements', size: '1.9 MB', date: 'March 2023' },
]

const impactStories = [
  {
    title: 'Clean Water Transforms Machakos Community',
    location: 'Machakos County, Kenya',
    before: { label: 'Water Access', value: '3km walk to nearest stream' },
    after: { label: 'Water Access', value: 'Clean well 200m from village' },
    metric: { label: 'Waterborne illness reduction', value: '73%' },
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Education Opens Doors in Rural Tanzania',
    location: 'Mbeya Region, Tanzania',
    before: { label: 'School Enrollment', value: '34% of children' },
    after: { label: 'School Enrollment', value: '91% of children' },
    metric: { label: 'Student graduation rate', value: '87%' },
    color: 'from-savanna to-savanna-dark',
  },
  {
    title: 'Mobile Health Clinic Saves Lives in Ghana',
    location: 'Northern Ghana',
    before: { label: 'Health Screenings', value: '50 per quarter' },
    after: { label: 'Health Screenings', value: '1,200 per quarter' },
    metric: { label: 'Maternal mortality reduction', value: '41%' },
    color: 'from-ochre to-ochre-dark',
  },
]

export default function ImpactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo text-white">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />
        <div className="container-page relative py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-ochre-light backdrop-blur-sm">
                <Eye className="h-4 w-4" />
                Full Transparency
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 font-display text-4xl font-medium leading-tight md:text-5xl lg:text-6xl"
            >
              Impact &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ochre-light to-ochre">
                Transparency
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
            >
              We believe every donor deserves to know exactly how their contribution creates change.
              Our financials are independently audited and publicly available.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <a href="#financials" className="btn-primary px-8 py-4 text-base shadow-lg hover:shadow-xl">
                <BarChart3 className="h-5 w-5" />
                View Financial Breakdown
              </a>
              <Link
                to="/donate"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Donate Now
                <Heart className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Financial Breakdown */}
      <section id="financials" className="py-20 md:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="text-label text-savanna">Where Your Money Goes</span>
              <h2 className="section-heading mt-3">Financial Breakdown</h2>
              <p className="section-subheading">
                We maintain one of the lowest overhead rates in the nonprofit sector, ensuring
                the vast majority of every dollar goes directly to programs.
              </p>

              <div className="mt-10 space-y-6">
                {financialBreakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-ink-soft">{item.label}</span>
                      <span className="font-bold text-ink">{item.pct}%</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-ink/8">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-ink-soft">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-indigo text-white p-8">
              <h3 className="font-display text-xl font-medium">84 Cents of Every Dollar</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                Goes directly to programs and services. That's among the highest in the nonprofit industry.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: 'Programs', value: '84%', icon: TrendingUp },
                  { label: 'Fundraising', value: '9%', icon: BarChart3 },
                  { label: 'Admin', value: '7%', icon: FileText },
                  { label: 'Annual Audit', value: 'Yes', icon: Shield },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                    <stat.icon className="h-5 w-5 text-ochre-light" />
                    <div className="mt-2 font-display text-lg font-medium">{stat.value}</div>
                    <div className="text-xs text-ink-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third-Party Ratings */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-page">
          <div className="text-center">
            <span className="text-label text-ochre">Verified Trust</span>
            <h2 className="section-heading mt-3">Third-Party Ratings</h2>
            <p className="section-subheading mx-auto">
              Independent organizations evaluate our performance, governance, and transparency so you can donate with confidence.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ratings.map((rating) => (
              <div key={rating.name} className="card group">
                <div className={`inline-flex rounded-xl p-3 ring-1 bg-gradient-to-br ${rating.color}`}>
                  <Award className={`h-6 w-6 ${rating.iconColor}`} />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-ink">{rating.name}</h3>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-savanna/5 px-2.5 py-0.5 text-xs font-semibold text-savanna-dark ring-1 ring-savanna/8">
                  <CheckCircle className="h-3 w-3" />
                  {rating.badge}
                </div>
                <div className="mt-3 font-display text-2xl font-medium text-ink">{rating.score}</div>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{rating.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audited Financials */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="text-label text-savanna">Audited Financials</span>
              <h2 className="section-heading mt-3">Download Our Reports</h2>
              <p className="section-subheading">
                Our financial statements are independently audited by Deloitte annually.
                Every report is reviewed for accuracy, compliance, and accountability.
              </p>
            </div>

            <div className="space-y-4">
              {annualReports.map((report) => (
                <div key={report.year} className="card flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-savanna/5 text-savanna">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-ink">
                        {report.year} {report.title}
                      </h4>
                      <p className="text-xs text-ink-soft">
                        Published {report.date} &middot; {report.size}
                      </p>
                    </div>
                  </div>
                  <button className="btn-outline flex-shrink-0 px-4 py-2 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stories with Outcomes */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-page">
          <div className="text-center">
            <span className="text-label text-ochre">Stories with Outcomes</span>
            <h2 className="section-heading mt-3">Real Impact, Measured Results</h2>
            <p className="section-subheading mx-auto">
              We track and measure the impact of every program to ensure your donation creates
              meaningful, lasting change.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {impactStories.map((story) => (
              <div key={story.title} className="card">
                <div className={`h-2 -mx-6 -mt-6 rounded-t-2xl bg-gradient-to-r ${story.color}`} />
                <h3 className="mt-4 font-display text-lg font-medium text-ink">{story.title}</h3>
                <p className="text-xs text-ink-soft">{story.location}</p>

                <div className="mt-6 space-y-3">
                  <div className="rounded-lg bg-red-50 p-3 ring-1 ring-red-100">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500">Before</span>
                    <div className="mt-1 text-xs font-medium text-ink-soft">
                      {story.before.label}: {story.before.value}
                    </div>
                  </div>
                  <div className="rounded-lg bg-savanna/5 p-3 ring-1 ring-savanna/8">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-savanna">After</span>
                    <div className="mt-1 text-xs font-medium text-ink-soft">
                      {story.after.label}: {story.after.value}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-parchment p-3 text-center ring-1 ring-ink/8">
                  <div className="text-xs text-ink-soft">{story.metric.label}</div>
                  <div className="mt-1 font-display text-2xl font-medium text-ink">{story.metric.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-ochre via-ochre-dark to-ochre py-20 md:py-28">
        <div className="container-page text-center">
          <h2 className="font-display text-3xl font-medium text-white md:text-5xl">
            See Your Donation in Action
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Every dollar you give creates measurable, lasting change. Join thousands of
            donors who trust us to make an impact.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-bold text-ochre shadow-xl transition-all hover:bg-parchment hover:shadow-2xl"
            >
              <Heart className="h-5 w-5" />
              Donate Now
            </Link>
            <Link
              to="/get-involved"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Get Involved
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
