import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '@/components/Seo'
import {
  Heart, ArrowRight, Users, Eye, Leaf, Award, Download,
  Building2, Mail, Phone, MapPin, Globe, BookOpen, Shield, TrendingUp,
} from 'lucide-react'
import { images } from '@/lib/images'

const timeline = [
  { year: '2015', title: 'Founded', description: 'GiveToAfrica was established with a mission to empower underserved communities across Africa through sustainable development programs.' },
  { year: '2016', title: 'First Projects', description: 'Launched our first education and clean water programs in Kenya and Ghana, reaching 500 families in the first year.' },
  { year: '2018', title: 'Continental Expansion', description: 'Expanded operations to Tanzania, Nigeria, Uganda, and South Africa. Built our 50th clean water well.' },
  { year: '2020', title: 'Healthcare Initiative', description: 'Launched mobile health clinics and community health worker training programs, serving 10,000+ patients annually.' },
  { year: '2022', title: 'Major Milestone', description: 'Reached 40,000+ lives impacted. Opened regional offices in Nairobi and Accra for faster local response.' },
  { year: '2024', title: 'Today', description: 'Operating across 12 countries with 186 completed projects, 47,500+ people helped, and $2.4M raised from 12,000+ donors worldwide.' },
]

const team = [
  { name: 'Amina Okafor', role: 'Executive Director', initials: 'AO', color: 'bg-ochre/10 text-ochre-dark' },
  { name: 'David Nkemelu', role: 'Programs Director', initials: 'DN', color: 'bg-savanna/10 text-savanna-dark' },
  { name: 'Sarah Kimani', role: 'Finance Director', initials: 'SK', color: 'bg-ochre/10 text-ochre-dark' },
  { name: 'Kwame Mensah', role: 'Communications Director', initials: 'KM', color: 'bg-blue-100 text-blue-700' },
  { name: 'Fatima Hassan', role: 'Partnerships Manager', initials: 'FH', color: 'bg-parchment text-ink' },
  { name: 'James Otieno', role: 'Field Operations Lead', initials: 'JO', color: 'bg-ink/8 text-ink-soft' },
]

const board = [
  { name: 'Dr. Ngozi Okonkwo', title: 'Board Chair', initials: 'NO' },
  { name: 'Prof. Michael Ayisi', title: 'Vice Chair', initials: 'MA' },
  { name: 'Catherine Wambui', title: 'Treasurer', initials: 'CW' },
  { name: 'Emmanuel Boateng', title: 'Secretary', initials: 'EB' },
  { name: 'Dr. Aisha Diallo', title: 'Member', initials: 'AD' },
]

const values = [
  {
    icon: Users,
    title: 'Community-Led',
    description: 'Every project starts with community input. We don\'t impose solutions — we listen, collaborate, and support communities in building what they need most.',
    color: 'bg-ochre/5 text-ochre-dark ring-ochre/8',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Every dollar is tracked and publicly reported. Our financials are independently audited annually, and donors receive detailed impact updates.',
    color: 'bg-savanna/5 text-savanna-dark ring-savanna/8',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'We build programs that outlast our involvement. From training local leaders to establishing maintenance funds, our projects are designed to endure.',
    color: 'bg-ochre/5 text-ochre-dark ring-ochre/8',
  },
  {
    icon: Heart,
    title: 'Dignity',
    description: 'We treat every person as a partner, not a recipient. Our programs empower people to lead their own development with pride and agency.',
    color: 'bg-blue-50 text-blue-600 ring-blue-100',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function AboutPage() {
  return (<><Seo
    title="About GiveToAfrica — Our Mission & Team"
    description="Learn about GiveToAfrica's mission to empower African communities through education, clean water, healthcare, and food security. Meet our team and see our impact."
    url="/about"
  />
  <AboutContent /></>)
}

function AboutContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.heroes.about})` }}
        />
        <div className="absolute inset-0 bg-indigo/85" />
        <div className="container-page relative py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-ochre-light backdrop-blur-sm"
            >
              <Globe className="h-4 w-4" />
              Serving 12 countries across Africa
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 font-display text-4xl font-medium leading-tight md:text-5xl lg:text-6xl"
            >
              Empowering Communities to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ochre-light to-ochre">
                Build Their Own Futures
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl"
            >
            Since 2015, GiveToAfrica has partnered with communities across Africa to 
deliver
              education, clean water, healthcare, and food security — with dignity, transparency,
              and lasting impact at the center of everything we do.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Link to="/donate" className="btn-primary px-8 py-4 text-base shadow-lg hover:shadow-xl">
                <Heart className="h-5 w-5" />
                Support Our Mission
              </Link>
              <Link
                to="/causes"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                See Our Work
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-label text-ochre-dark">Our Mission</span>
            <h2 className="section-heading mt-3">What Drives Us Forward</h2>
            <p className="section-subheading mx-auto">
              We believe every community deserves the resources, knowledge, and support to thrive —
              not just survive. GiveToAfrica exists to make that belief a reality.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((v) => (
              <motion.div key={v.title} variants={item} className="card">
                <div className={`inline-flex rounded-xl p-3 ring-1 ${v.color}`}>
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Photo Banner */}
      <section className="relative h-64 overflow-hidden md:h-80">
        <img src={images.about.team2} alt="Children in our programs" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-indigo/30" />
      </section>

      {/* Timeline */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-label text-savanna">Our Journey</span>
            <h2 className="section-heading mt-3">A Decade of Impact</h2>
            <p className="section-subheading mx-auto">
              From a small idea to a continental movement — here's how we've grown to serve communities across Africa.
            </p>
          </motion.div>

          <div className="relative mt-14">
            <div className="absolute left-4 top-0 h-full w-px bg-ink/12 md:left-1/2 md:-translate-x-px" />
            <div className="space-y-12">
              {timeline.map((event, i) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start md:items-center`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} pl-12 md:pl-0`}>
                    <span className="text-sm font-bold text-ochre-dark">{event.year}</span>
                    <h3 className="mt-1 font-display text-lg font-medium text-ink">{event.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{event.description}</p>
                  </div>
                  <div className="absolute left-4 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-ochre-dark shadow-sm md:relative md:left-auto md:translate-x-0">
                    <span className="text-[10px] font-bold text-white">{i + 1}</span>
                  </div>
                  <div className="hidden flex-1 md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-label text-ochre-dark">Our People</span>
            <h2 className="section-heading mt-3">Meet the Team</h2>
            <p className="section-subheading mx-auto">
              Passionate professionals dedicated to creating lasting change across the continent.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {team.map((member) => (
              <motion.div key={member.name} variants={item} className="card text-center">
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold ${member.color}`}>
                  {member.initials}
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-ink">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-ochre-dark">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-label text-savanna">Governance</span>
            <h2 className="section-heading mt-3">Board of Directors</h2>
            <p className="section-subheading mx-auto">
              Our board provides strategic oversight and ensures our mission stays at the center of every decision.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {board.map((member) => (
              <motion.div key={member.name} variants={item} className="card text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink/8 text-lg font-bold text-ink-soft">
                  {member.initials}
                </div>
                <h3 className="mt-3 font-display text-base font-medium text-ink">{member.name}</h3>
                <p className="mt-1 text-xs font-medium text-ink-soft">{member.title}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Transparency & Trust */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-label text-ochre-dark">Trust & Accountability</span>
              <h2 className="section-heading mt-3">Built on Integrity</h2>
              <p className="section-subheading">
                We hold ourselves to the highest standards of transparency and accountability,
                because your trust is the foundation of our work.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: Award, label: 'Charity Navigator', value: '4-Star Rating', color: 'bg-savanna/5 text-savanna' },
                  { icon: Shield, label: 'PCI-DSS', value: 'Fully Compliant', color: 'bg-blue-50 text-blue-600' },
                  { icon: TrendingUp, label: 'Program Spending', value: '84% to Programs', color: 'bg-ochre/5 text-ochre-dark' },
                  { icon: Eye, label: 'Annual Audit', value: 'Publicly Available', color: 'bg-ochre/5 text-ochre-dark' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{item.label}</div>
                      <div className="text-xs text-ink-soft">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl bg-indigo p-8 md:p-10 text-white"
            >
              <h3 className="font-display text-xl font-medium">Download Our Annual Report</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Get the full picture of our programs, finances, and impact. Our 2024 Annual Report
                includes audited financials, project outcomes, and stories from the communities we serve.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { label: '2024 Annual Report (PDF)', size: '2.4 MB' },
                  { label: '2024 Audited Financials (PDF)', size: '1.1 MB' },
                  { label: 'Impact Summary 2024 (PDF)', size: '890 KB' },
                ].map((doc) => (
                  <button
                    key={doc.label}
                    className="flex w-full items-center gap-3 rounded-xl bg-white/5 p-3 text-left ring-1 ring-white/10 transition-all hover:bg-white/10"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-ochre/20 text-ochre-light">
                      <Download className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{doc.label}</div>
                        <div className="text-xs text-white/60">{doc.size}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Registration Details */}
      <section className="bg-white py-16 border-t border-ink/8">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-center font-display text-2xl font-medium text-ink">Organizational Details</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div className="card text-center">
                <Building2 className="mx-auto h-8 w-8 text-ochre-dark" />
                <h3 className="mt-3 font-display text-base font-medium text-ink">Legal Registration</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  Registered 501(c)(3) nonprofit organization.<br />
                  EIN: 82-4573910
                </p>
              </div>
              <div className="card text-center">
                <MapPin className="mx-auto h-8 w-8 text-savanna" />
                <h3 className="mt-3 font-display text-base font-medium text-ink">Headquarters</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  1200 Innovation Drive, Suite 400<br />
                  Washington, DC 20001, USA
                </p>
              </div>
              <div className="card text-center">
                <Globe className="mx-auto h-8 w-8 text-ochre-dark" />
                <h3 className="mt-3 font-display text-base font-medium text-ink">Regional Offices</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  Nairobi, Kenya &amp; Accra, Ghana<br />
                  Serving 12 countries across Africa
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-ink-soft">
              <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-ochre-dark" /> info@givetoafrica.net</span>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-savanna" /> +1 (202) 555-0187</span>
              <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-ochre-dark" /> Annual reports publicly available</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-ochre-dark via-ochre-dark to-ochre-dark py-20 md:py-28">
        <div className="container-page text-center">
          <h2 className="font-display text-3xl font-medium text-white md:text-5xl">
            Join Us in Building a Better Future
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Whether you donate, volunteer, or spread the word — your support helps communities
            across Africa write their own success stories.
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
