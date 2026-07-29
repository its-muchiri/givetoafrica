import { Link } from 'react-router-dom'
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'

const footerLinks = {
  'Causes': [
    { label: 'Education & Training', href: '/blog/category/education-and-training' },
    { label: 'Healthcare', href: '/blog/category/health' },
    { label: 'Children & Youth', href: '/blog/category/children-and-youth' },
    { label: 'Environment', href: '/blog/category/environment' },
    { label: 'Overseas Aid', href: '/blog/category/overseas-aid' },
    { label: 'All 28 Causes', href: '/charities' },
  ],
  'About': [
    { label: 'Our Story', href: '/about' },
    { label: 'Impact Report', href: '/impact' },
    { label: 'Team', href: '/about#team' },
    { label: 'Financials', href: '/impact#financials' },
    { label: 'News', href: '/news' },
  ],
  'Get Involved': [
    { label: 'Donate', href: '/donate' },
    { label: 'Volunteer', href: '/get-involved' },
    { label: 'Corporate Partnerships', href: '/get-involved#corporate' },
    { label: 'Fundraise', href: '/get-involved#fundraise' },
    { label: 'Contact Us', href: '/contact' },
  ],
  'Legal': [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/privacy#cookies' },
    { label: 'FAQ', href: '/faq' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-indigo text-white/80">
      {/* Pre-footer CTA */}
      <div className="bg-ochre-dark py-14">
        <div className="container-page text-center">
          <h3 className="font-display text-2xl font-medium text-white md:text-3xl">
            Every donation builds a brighter future
          </h3>
          <p className="mt-3 text-sm text-white/80">
            Join thousands of donors creating lasting change across Africa.
          </p>
          <Link
            to="/donate"
            className="mt-6 inline-flex items-center gap-2 rounded bg-white px-8 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-parchment"
          >
            <Heart className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            Make a Donation
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" className="h-9 w-9" aria-hidden="true" />
              <span className="font-display text-lg font-medium tracking-tight text-white">
              <span className="font-extrabold text-white">Give</span>
              <span className="font-normal text-white/80">ToAfrica</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Empowering communities across Africa through education, clean water,
              healthcare, and food security. Registered nonprofit 501(c)(3).
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <a href="mailto:info@givetoafrica.org" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <Mail className="h-4 w-4" /> info@givetoafrica.org
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <Phone className="h-4 w-4" /> +1 (234) 567-890
              </a>
              <div className="flex items-start gap-2 text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>123 Impact Avenue<br />Washington, DC 20001</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2.5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                   className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {title}
              </h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} GiveToAfrica Foundation. EIN: 12-3456789. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-2xs text-white/40 font-mono">
            <span>PCI-DSS</span>
            <span className="text-white/20">|</span>
            <span>TLS 1.3</span>
            <span className="text-white/20">|</span>
            <span>AES-256</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
