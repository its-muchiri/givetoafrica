import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import Seo from '@/components/Seo'

const faqs = [
  {
    question: 'Is my donation tax-deductible?',
    answer:
      "Yes. GiveToAfrica is a registered 501(c)(3) nonprofit organization (EIN: 12-3456789). All donations made within the United States are tax-deductible to the full extent permitted by law. You will receive an automatic tax receipt via email after your donation is processed. For UK donors, our donations are Gift Aid eligible — please select the Gift Aid option during checkout so we can reclaim an additional 25p for every £1 you donate at no extra cost to you.",
  },
  {
    question: 'How is my donation used?',
    answer:
      "We are committed to full transparency. Approximately 84% of every dollar donated goes directly to our programs — education, clean water, healthcare, and food security. Our operational and fundraising costs are covered through separate funding channels. Our financial statements are audited annually by an independent firm and are publicly available on our Impact page. We publish quarterly impact reports so you can see exactly how your contribution makes a difference.",
  },
  {
    question: 'Can I set up recurring donations?',
    answer:
      "Absolutely. Monthly giving is one of the most impactful ways to support our mission — recurring donors provide 3x more impact over the course of a year compared to one-time donors. You can choose the monthly option during checkout and select any amount. You can view, pause, or cancel your recurring donation at any time through your donor portal. We'll send you a reminder email before each monthly charge so there are no surprises.",
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      "We accept four payment methods: Credit/Debit Card (Visa, Mastercard, AMEX via Stripe), PayPal (PayPal balance, cards, Venmo), Cryptocurrency (BTC, ETH, USDT, USDC via NOWPayments), and Bank Wire Transfer. All card and PayPal transactions are processed through PCI-DSS compliant providers. Cryptocurrency payments are handled by NOWPayments. Bank wire transfers are confirmed manually by our team.",
  },
  {
    id: 'refunds',
    question: 'Can I get a refund?',
    answer:
      "We understand that mistakes happen. If you made an accidental or duplicate donation, you can request a full refund within 30 calendar days of the transaction. Simply email support@givetoafrica.org with your name, email address used for the donation, and the transaction reference number. We aim to process all refund requests within 5-7 business days. Please note that for recurring donations, you can cancel future charges at any time through your donor portal. Refunds for completed charges follow the same 30-day policy.",
  },
  {
    question: 'How do I manage my recurring donation?',
    answer:
      "You can manage your recurring donations at any time through our Donor Portal. Simply visit our donor portal page and enter the email address you used when you made your donation. We'll send you a secure magic link (no password required) that logs you in instantly. From there you can update your payment method, change the donation amount, pause recurring payments, or cancel entirely. Changes take effect from the next billing cycle.",
  },
  {
    question: 'Is my data safe?',
    answer:
      "Your privacy and security are our top priority. We are fully compliant with GDPR (General Data Protection Regulation) and POPIA (Protection of Personal Information Act). We are PCI-DSS Level 1 certified for payment processing. All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We never store full credit card numbers on our servers — payment details are handled entirely by our certified payment processors. We do not sell, rent, or share your personal information with third parties for marketing purposes.",
  },
  {
    question: 'Can I donate from outside the US?',
    answer:
      "Yes! We accept donations from donors around the world. We currently support 9 currencies: USD, EUR, GBP, KES, NGN, GHS, ZAR, UGX, and TZS. You can pay via card, PayPal, cryptocurrency, or bank wire transfer. Our system automatically handles currency conversion.",
  },
  {
    question: 'How do corporate matching gifts work?',
    answer:
      "Many employers will match your charitable donations, effectively doubling your impact. During checkout, you'll find a 'Corporate Matching' field where you can enter your company name. Our team will verify the match through our partner Double the Donation and guide you through your employer's matching process. If your company has a matching gift program, we'll provide all the documentation your employer needs. If you're unsure whether your employer offers matching, enter your company name anyway — we'll check for you.",
  },
  {
    question: 'Can I donate by check or wire transfer?',
    answer:
      "Yes, we accept both checks and wire transfers for donors who prefer traditional methods. For checks, please make them payable to 'GiveToAfrica Inc.' and mail to our address: 123 Impact Avenue, Washington, DC 20001. For wire transfers, please visit our donate page for detailed banking instructions including our routing number and SWIFT code. Note that check and wire transfer donations may take 3-5 business days to process and appear in your donor account.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <><Seo
        title="FAQ — GiveToAfrica"
        description="Frequently asked questions about donating to GiveToAfrica. Learn about tax deductions, how your donation is used, and more."
        url="/faq"
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo text-white">
        <div className="container-page py-16 md:py-20">
          <span className="text-label text-ochre-light">Support</span>
          <h1 className="mt-4 font-display text-4xl font-medium md:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-xl text-lg text-white/70 leading-relaxed">
            Everything you need to know about donating, payment methods, tax receipts, and managing your giving.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 md:py-20">
        <div className="container-page mx-auto max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} id={faq.id} className="card p-0 overflow-hidden">
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-ochre-dark" />
                    <span className="text-sm font-semibold text-ink">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-ink-soft transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="border-t border-ink/8 px-5 pb-5 pt-4 pl-12">
                    <p className="text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-12 text-center card bg-parchment ring-1 ring-parchment">
            <h3 className="font-display text-xl font-medium text-ink">Still Have Questions?</h3>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              We're here to help. Reach out to our team and we'll get back to you within 24 hours.
            </p>
            <a href="/contact" className="btn-primary mt-6">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
