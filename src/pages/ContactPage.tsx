import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import Seo from '@/components/Seo'

const subjects = [
  'General Inquiry',
  'Donation Question',
  'Partnership',
  'Media',
  'Other',
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (<><Seo
    title="Contact Us — GiveToAfrica"
    description="Get in touch with GiveToAfrica. We'd love to hear from you about donations, partnerships, media inquiries, or general questions."
    url="/contact"
  />
  <ContactContent submitted={submitted} setSubmitted={setSubmitted} /></>)
}

function ContactContent({ submitted, setSubmitted }: { submitted: boolean; setSubmitted: (v: boolean) => void }) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo text-white">
        <div className="container-page py-16 md:py-20">
          <span className="text-label text-ochre-light">Get In Touch</span>
          <h1 className="mt-4 font-display text-4xl font-medium md:text-5xl">Contact Us</h1>
          <p className="mt-4 max-w-xl text-lg text-white/70 leading-relaxed">
            Have a question, want to partner, or need help with a donation? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Contact Form */}
            <div>
              {submitted ? (
                <div className="card bg-savanna/5 ring-1 ring-savanna/8 text-center py-12">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-savanna/10 text-savanna">
                    <Send className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-medium text-ink">Message Sent!</h3>
                  <p className="mt-3 text-ink-soft leading-relaxed">
                    Thank you for reaching out. We'll get back to you within 1-2 business days.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-primary mt-8"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="label-text">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="label-text">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="label-text">Subject</label>
                    <div className="relative">
                      <select
                        id="subject"
                        required
                        className="input-field appearance-none pr-10"
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="label-text">Message</label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className="input-field resize-none"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 text-base">
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Right: Contact Info */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-display text-xl font-medium text-ink">Contact Information</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  Reach out to us through any of the channels below. Our team responds within 24 hours on business days.
                </p>
                <div className="mt-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-ochre-dark/10 text-ochre-dark">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">Email</div>
                      <a href="mailto:hello@givetoafrica.net" className="text-sm text-ochre-dark hover:text-ochre-dark font-medium">
hello@givetoafrica.net
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-savanna/5 text-savanna">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">Phone</div>
                      <a href="tel:+12025551234" className="text-sm text-ochre-dark hover:text-ochre-dark font-medium">
                        +1 (202) 555-1234
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-ochre-dark/10 text-ochre-dark">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">Address</div>
                      <p className="text-sm text-ink-soft leading-relaxed">
                        123 Impact Avenue<br />
                        Washington, DC 20001<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">Office Hours</div>
                      <p className="text-sm text-ink-soft leading-relaxed">
                        Monday – Friday: 9:00 AM – 6:00 PM (EST)<br />
                        Saturday: 10:00 AM – 2:00 PM (EST)<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="card">
                <h4 className="text-sm font-semibold text-ink">Follow Us</h4>
                <div className="mt-4 flex gap-3">
                  {[
                    { icon: Facebook, label: 'Facebook', href: '#' },
                    { icon: Twitter, label: 'Twitter', href: '#' },
                    { icon: Instagram, label: 'Instagram', href: '#' },
                    { icon: Linkedin, label: 'LinkedIn', href: '#' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-parchment text-ink-soft transition-colors hover:bg-ochre-dark/10 hover:text-ochre-dark"
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Emergency */}
              <div className="card bg-ochre-dark/5 ring-1 ring-ochre-dark/8">
                <h4 className="text-sm font-semibold text-ink">Urgent Donation Issues</h4>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  If you're experiencing an issue with a recent donation or need immediate assistance with a
                  transaction, please email{' '}
                  <a href="mailto:support@givetoafrica.net" className="font-semibold underline">
support@givetoafrica.net
                  </a>{' '}
                  with "Urgent" in the subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="pb-16 md:pb-20">
        <div className="container-page">
          <div className="card overflow-hidden p-0">
            <div className="flex h-72 items-center justify-center bg-ink/8 text-ink-soft">
              <div className="text-center">
                <MapPin className="mx-auto h-10 w-10 text-ink-soft" />
                <p className="mt-3 text-sm font-medium">Map Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
