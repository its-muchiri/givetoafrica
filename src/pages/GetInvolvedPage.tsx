import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '@/components/Seo'
import toast from 'react-hot-toast'
import {
  Heart, Users, Building2, Target, ArrowRight, Check,
  Mail, Calendar, Briefcase, Star, Gift, Globe, Loader2,
} from 'lucide-react'
import { images } from '@/lib/images'

const partnershipTiers = [
  {
    tier: 'Bronze',
    donation: '$5,000+',
    color: 'from-amber-600 to-amber-700',
    ringColor: 'ring-amber-200',
    benefits: [
      'Logo on website partner page',
      'Quarterly impact reports',
      'Social media recognition',
      'Tax-deductible donation receipt',
    ],
  },
  {
    tier: 'Silver',
    donation: '$15,000+',
    color: 'from-gray-400 to-gray-500',
    ringColor: 'ring-gray-200',
    benefits: [
      'All Bronze benefits',
      'Logo on project materials',
      'Invitation to annual gala',
      'Dedicated account manager',
      'Co-branded impact stories',
    ],
  },
  {
    tier: 'Gold',
    donation: '$50,000+',
    color: 'from-yellow-500 to-yellow-600',
    ringColor: 'ring-yellow-200',
    benefits: [
      'All Silver benefits',
      'Named project sponsorship',
      'Employee volunteer programs',
      'Custom impact video',
      'Speaking opportunity at events',
      'Board meeting invitation',
    ],
  },
  {
    tier: 'Platinum',
    donation: '$100,000+',
    color: 'from-indigo to-indigo',
    ringColor: 'ring-ink/12',
    benefits: [
      'All Gold benefits',
      'Strategic partnership agreement',
      'Joint press releases',
      'Executive delegation visits',
      'Custom CSR program design',
      'Permanent naming rights',
      'Quarterly executive briefings',
    ],
  },
]

export default function GetInvolvedPage() {
  return (<><Seo
    title="Get Involved — GiveToAfrica"
    description="Partner with GiveToAfrica to empower African communities. Volunteer, sponsor a project, or become a corporate partner."
    url="/get-involved"
  />
  <GetInvolvedContent /></>)
}

function GetInvolvedContent() {
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    skills: '',
    availability: '',
  })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isVolunteerSubmitted, setIsVolunteerSubmitted] = useState(false)
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false)
  const [isVolunteerLoading, setIsVolunteerLoading] = useState(false)
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false)

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVolunteerLoading(true)
    try {
      const res = await fetch('/api/engagement/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setIsVolunteerSubmitted(true)
      toast.success('Application submitted!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application')
    } finally {
      setIsVolunteerLoading(false)
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsNewsletterLoading(true)
    try {
      const res = await fetch('/api/engagement/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Subscription failed')
      setIsNewsletterSubmitted(true)
      toast.success('Subscribed successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to subscribe')
    } finally {
      setIsNewsletterLoading(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.heroes.getInvolved})` }}
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
                <Users className="h-4 w-4" />
                Join the Movement
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 font-display text-4xl font-medium leading-tight md:text-5xl lg:text-6xl"
            >
              Get{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ochre-light to-ochre">
                Involved
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
            >
              There are many ways to make a difference beyond donating. Volunteer your skills,
              partner with us, or start your own fundraising campaign.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <a href="#volunteer" className="btn-primary px-8 py-4 text-base shadow-lg hover:shadow-xl">
                <Heart className="h-5 w-5" />
                Start Volunteering
              </a>
              <a
                href="#corporate"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Corporate Partnerships
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section id="volunteer" className="py-20 md:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="text-label text-savanna">Volunteer</span>
              <h2 className="section-heading mt-3">Share Your Skills</h2>
              <p className="section-subheading">
                Whether you're a teacher, doctor, engineer, or have any skill to share,
                our communities need your expertise. Volunteers are the backbone of our programs.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Calendar, title: 'Flexible Schedule', desc: 'Volunteer on your own time, in-person or remotely.' },
                  { icon: Globe, title: 'Global Opportunities', desc: 'Work with communities across 12 African countries.' },
                  { icon: Briefcase, title: 'Professional Growth', desc: 'Gain international experience and references.' },
                  { icon: Star, title: 'Make Real Impact', desc: 'See the direct results of your contribution.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl bg-parchment p-4 ring-1 ring-parchment">
                    <item.icon className="h-5 w-5 text-savanna" />
                    <h4 className="mt-2 text-sm font-bold text-ink">{item.title}</h4>
                    <p className="mt-1 text-xs text-ink-soft">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              {isVolunteerSubmitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-savanna/5 text-savanna">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-medium text-ink">Thank You for Volunteering!</h3>
                  <p className="mt-2 text-sm text-ink-soft">
                    We've received your application and will reach out within 5 business days.
                    Check your email for a confirmation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVolunteerSubmit} className="space-y-5">
                  <h3 className="font-display text-lg font-medium text-ink">Volunteer Application</h3>

                  <div>
                    <label className="label-text">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={volunteerForm.name}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                      className="input-field"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="label-text">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={volunteerForm.email}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="label-text">Skills & Expertise</label>
                    <textarea
                      rows={3}
                      value={volunteerForm.skills}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, skills: e.target.value })}
                      className="input-field resize-none"
                      placeholder="Tell us about your skills (e.g., teaching, medical, construction, IT)..."
                    />
                  </div>

                  <div>
                    <label className="label-text">Availability</label>
                    <select
                      value={volunteerForm.availability}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, availability: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select your availability</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="evenings">Evenings</option>
                      <option value="flexible">Flexible</option>
                      <option value="remote">Remote only</option>
                    </select>
                  </div>

                  <button type="submit" disabled={isVolunteerLoading} className="btn-primary w-full py-3 text-base">
                    {isVolunteerLoading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Partnerships */}
      <section id="corporate" className="bg-white py-20 md:py-28">
        <div className="container-page">
          <div className="text-center">
            <span className="text-label text-ochre-dark">Corporate Partnerships</span>
            <h2 className="section-heading mt-3">Partner With Us</h2>
            <p className="section-subheading mx-auto">
              Align your brand with meaningful impact. Our corporate partnerships create value
              for your business while transforming communities across Africa.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partnershipTiers.map((tier) => (
              <div key={tier.tier} className={`card ring-1 ${tier.ringColor} relative overflow-hidden`}>
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tier.color}`} />
                <h3 className="mt-2 font-display text-xl font-medium text-ink">{tier.tier}</h3>
                <div className="mt-1 font-display text-2xl font-medium text-ink">{tier.donation}</div>
                <p className="text-xs text-ink-soft">annual commitment</p>

                <ul className="mt-6 space-y-2.5">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-xs text-ink-soft">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-savanna" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="mt-6 block text-center rounded-lg border border-ink/12 px-4 py-2.5 text-sm font-medium text-ink-soft transition-all hover:bg-parchment"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Peer-to-Peer Fundraising */}
      <section id="fundraise" className="py-20 md:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-label text-savanna">Peer-to-Peer Fundraising</span>
              <h2 className="section-heading mt-3">Start Your Own Campaign</h2>
              <p className="section-subheading">
                Rally your friends, family, and colleagues around a cause you care about.
                Create a personal fundraising page and multiply your impact.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { step: '01', title: 'Create Your Page', desc: 'Set up a personal campaign page with your story and goal.' },
                  { step: '02', title: 'Share Your Link', desc: 'Share via social media, email, or messaging with friends and family.' },
                  { step: '03', title: 'Track Your Impact', desc: 'See real-time progress and receive updates on the communities you support.' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-savanna/5 font-display text-sm font-bold text-savanna ring-1 ring-savanna/8">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-ink">{item.title}</h4>
                      <p className="mt-0.5 text-xs text-ink-soft">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/donate" className="btn-primary mt-8">
                <Target className="h-4 w-4" />
                Start a Campaign
              </Link>
            </div>

            <div className="card bg-gradient-to-br from-savanna-800 to-savanna-950 text-white p-8">
              <h3 className="font-display text-xl font-medium">Why Fundraise for GiveToAfrica?</h3>
              <div className="mt-6 space-y-4">
                {[
                  '84% of funds go directly to programs',
                  'Real-time campaign tracking dashboard',
                  'Social sharing tools built in',
                  'Automatic tax receipts for all donors',
                  'Dedicated support from our team',
                  'Shareable impact updates and stories',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-savanna/90">
                    <Check className="h-4 w-4 flex-shrink-0 text-ochre-light" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-xl bg-white/10 p-4 ring-1 ring-white/10">
                <div className="text-xs text-savanna-light">Top fundraiser this month</div>
                <div className="mt-1 font-display text-lg font-medium">$12,450 raised</div>
                <div className="text-xs text-savanna-light">by Sarah M. — Build a School Campaign</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Programs */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-page">
          <div className="text-center">
            <span className="text-label text-ochre-dark">Sponsorship</span>
            <h2 className="section-heading mt-3">Sponsorship Programs</h2>
            <p className="section-subheading mx-auto">
              Create lasting legacy by sponsoring specific programs, schools, or community projects.
              Sponsors receive regular updates and recognition.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Heart,
                title: 'Sponsor a Child',
                amount: '$35/month',
                desc: 'Cover education, meals, and school supplies for one student for an entire year.',
                color: 'bg-ochre/5 text-ochre-dark ring-ochre/8',
              },
              {
                icon: Globe,
                title: 'Sponsor a Well',
                amount: '$15,000',
                desc: 'Fund the construction of a clean water well serving up to 500 people.',
                color: 'bg-blue-50 text-blue-600 ring-blue-100',
              },
              {
                icon: Building2,
                title: 'Sponsor a School',
                amount: '$75,000',
                desc: 'Build and equip a school with classrooms, furniture, and learning materials.',
                color: 'bg-savanna/5 text-savanna ring-savanna/8',
              },
            ].map((item) => (
              <div key={item.title} className="card">
                <div className={`inline-flex rounded-xl p-3 ring-1 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-ink">{item.title}</h3>
                <div className="mt-1 font-display text-xl font-medium text-ochre-dark">{item.amount}</div>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{item.desc}</p>
                <Link to="/contact" className="btn-primary mt-4 w-full text-xs py-2">
                  <Gift className="h-3.5 w-3.5" />
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="card bg-indigo text-white p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <Mail className="mx-auto h-10 w-10 text-ochre-light" />
              <h2 className="mt-4 font-display text-2xl font-medium md:text-3xl">Stay Connected</h2>
              <p className="mt-2 text-sm text-white/70">
                Get monthly updates on our impact, stories from the field, and ways to get involved.
              </p>

              {isNewsletterSubmitted ? (
                <div className="mt-6 rounded-xl bg-savanna/20 p-4 text-sm text-savanna-light ring-1 ring-savanna/30">
                  <Check className="mr-2 inline h-4 w-4" />
                  Thank you for subscribing! Check your inbox for a confirmation email.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="input-field flex-1 bg-white/10 text-white placeholder:text-white/40"
                    placeholder="Enter your email address"
                  />
                  <button type="submit" disabled={isNewsletterLoading} className="btn-primary px-6 py-3">
                    {isNewsletterLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </form>
              )}

              <p className="mt-3 text-[11px] text-white/50">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-ochre-dark via-ochre-dark to-ochre-dark py-20 md:py-28">
        <div className="container-page text-center">
          <h2 className="font-display text-3xl font-medium text-white md:text-5xl">
            Ready to Make a Difference?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Whether you volunteer, partner, or fundraise — every action creates
            lasting change in communities across Africa.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-bold text-ink shadow-xl transition-all hover:bg-parchment hover:shadow-2xl"
            >
              <Heart className="h-5 w-5" />
              Donate Now
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
