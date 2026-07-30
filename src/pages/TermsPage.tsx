import Seo from '@/components/Seo'

export default function TermsPage() {
  return (
    <><Seo
        title="Terms of Service — GiveToAfrica"
        description="GiveToAfrica's terms of service govern your use of our website and services. Read our terms before donating."
        url="/terms"
      />
      <section className="bg-indigo text-white">
        <div className="container-page py-16 md:py-20">
          <span className="text-label text-ochre-light">Legal</span>
          <h1 className="mt-4 font-display text-4xl font-medium md:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-white/70">Last updated: January 15, 2025</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-page mx-auto max-w-3xl">
          <div className="space-y-10 text-sm leading-relaxed text-ink-soft">
            {/* 1. Acceptance */}
            <section>
              <h2 className="font-display text-2xl font-medium text-ink mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the GiveDirectly website (givetoafrica.net) and related services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services. These terms apply to all visitors, donors, and users of the site. We reserve the right to modify these terms at any time, and your continued use of the site constitutes acceptance of any changes.
              </p>
            </section>

            {/* 2. Donations */}
            <section>
              <h2 className="font-display text-2xl font-medium text-ink mb-3">2. Donations</h2>
              <p className="mb-3">
                All donations made through GiveDirectly are voluntary and made at the donor's discretion. By making a donation, you confirm that:
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>You are at least 18 years of age, or the age of majority in your jurisdiction.</li>
                <li>You have the legal authority to make this donation using the payment method provided.</li>
                <li>The payment information you provide is accurate and current.</li>
                <li>You understand that donations are generally non-refundable, except as outlined in our Refunds section below.</li>
              </ul>
              <p className="mt-3">
                GiveDirectly is a registered 501(c)(3) nonprofit organization. Donations made from within the United States are tax-deductible to the extent permitted by law. GiveDirectly does not provide tax, legal, or financial advice. Donors are encouraged to consult their own advisors regarding the tax implications of their donations.
              </p>
            </section>

            {/* 3. Payment Processing */}
            <section>
              <h2 className="font-display text-2xl font-medium text-ink mb-3">3. Payment Processing</h2>
              <p className="mb-3">
                Donations are processed through third-party payment providers including Stripe (cards), PayPal, and NOWPayments (cryptocurrency). Bank wire transfers are processed manually. These providers are PCI-DSS Level 1 certified. GiveDirectly does not store full credit card numbers on its servers.
              </p>
              <p className="mb-3">You agree to:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Pay all charges incurred under your account, including applicable taxes and optional processing fee contributions.</li>
                <li>Provide current, accurate, and complete payment information.</li>
                <li>Promptly update your payment information if it changes.</li>
                <li>Authorize GiveDirectly and its payment processors to charge your designated payment method for the donation amount submitted.</li>
              </ul>
              <p className="mt-3">
                Transaction fees vary by payment method and region. Donors may optionally choose to cover processing fees to ensure the full donation amount goes to the cause.
              </p>
            </section>

            {/* 4. Recurring Donations */}
            <section>
              <h2 className="font-display text-2xl font-medium text-ink mb-3">4. Recurring Donations</h2>
              <p className="mb-3">
                When you set up a recurring donation, you authorize GiveDirectly to charge your payment method on a recurring basis (typically monthly) at the amount you specified at the time of enrollment.
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Recurring charges will continue until cancelled by you through your donor portal or by contacting our support team.</li>
                <li>Cancellation must be received at least 3 business days before the next scheduled charge date to prevent that charge.</li>
                <li>If a recurring payment fails, we may retry up to 3 times within 10 business days. If all retries fail, the recurring donation will be paused, and you will be notified by email.</li>
                <li>We reserve the right to modify the amount of a recurring donation only with your prior written consent.</li>
                <li>Recurring donations may be subject to annual increases aligned with inflation, and you will be notified in advance of any such change.</li>
              </ul>
            </section>

            {/* 5. Refunds */}
            <section>
              <h2 className="font-display text-2xl font-medium text-ink mb-3">5. Refunds</h2>
              <p className="mb-3">
                GiveDirectly processes donations in good faith and generally all donations are final. However, we understand that mistakes can happen. The following refund policy applies:
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Accidental Donations:</strong> If you made a donation by mistake (wrong amount, wrong payment method), you may request a refund within 30 calendar days of the transaction date by emailing support@givetoafrica.net.</li>
                <li><strong>Duplicate Donations:</strong> If you were charged more than once for the same donation, we will promptly issue a full refund for the duplicate charge(s). Contact us with your transaction reference number.</li>
                <li><strong>Failed Recurring Charges:</strong> If a retry charge was processed but you intended to cancel, we will refund the charge if you contact us within 15 business days.</li>
                <li><strong>No Refund for Completed Transactions:</strong> Donations that have already been allocated to programs or projects are generally non-refundable. In exceptional circumstances, a refund may be considered at GiveDirectly's sole discretion.</li>
                <li>Refunds are processed using the original payment method and may take 5-10 business days to appear on your statement.</li>
              </ul>
            </section>

            {/* 6. Tax Receipts */}
            <section>
              <h2 className="font-display text-2xl font-medium text-ink mb-3">6. Tax Receipts</h2>
              <p className="mb-3">
                An automatic tax receipt is sent to the email address provided at the time of donation. Receipts for US donors confirm the tax-deductible amount as required by the IRS. For UK donors, Gift Aid declarations are submitted to HMRC on your behalf.
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>It is your responsibility to ensure your email address is correct so you receive your receipt.</li>
                <li>Duplicate receipts can be requested by contacting support@givetoafrica.net.</li>
                <li>GiveDirectly is not responsible for your individual tax situation. Please consult a qualified tax professional for advice specific to your circumstances.</li>
              </ul>
            </section>

            {/* 7. Intellectual Property */}
            <section>
              <h2 className="font-display text-2xl font-medium text-ink mb-3">7. Intellectual Property</h2>
              <p className="mb-3">
                All content on the GiveDirectly website, including but not limited to text, graphics, logos, images, videos, and software, is the property of GiveDirectly Inc. or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>You may view and download content for personal, non-commercial use only.</li>
                <li>You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any content without prior written permission.</li>
                <li>You may not use the GiveDirectly name, logo, or branding without prior written authorization.</li>
                <li>User-submitted content (donor messages, testimonials) may be used by GiveDirectly for marketing purposes unless you opt out in writing.</li>
              </ul>
            </section>

            {/* 8. Limitation of Liability */}
            <section>
              <h2 className="font-display text-2xl font-medium text-ink mb-3">8. Limitation of Liability</h2>
              <p className="mb-3">
                To the maximum extent permitted by law, GiveDirectly Inc., its directors, officers, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our website or services.
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>We do not guarantee uninterrupted or error-free operation of the website.</li>
                <li>We are not liable for any damages resulting from third-party payment processors, including declined transactions, processing delays, or unauthorized charges.</li>
                <li>Our total liability to you for any claim arising from your use of our services shall not exceed the amount of the donation that is the subject of the claim.</li>
                <li>Nothing in these terms excludes liability for fraud, willful misconduct, or any liability that cannot be excluded by applicable law.</li>
              </ul>
            </section>

            {/* 9. Governing Law */}
            <section>
              <h2 className="font-display text-2xl font-medium text-ink mb-3">9. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of the District of Columbia, United States, without regard to its conflict of laws principles. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts located in Washington, DC. If you are located in a jurisdiction outside the United States, you may also be entitled to mandatory consumer protections under the laws of your country of residence, and nothing in these terms is intended to restrict those rights.
              </p>
            </section>

            {/* 10. Contact */}
            <section>
              <h2 className="font-display text-2xl font-medium text-ink mb-3">10. Contact</h2>
              <p className="mb-3">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="rounded-xl bg-parchment p-5 space-y-2 text-sm text-ink-soft">
                <p><strong>GiveDirectly Inc.</strong></p>
                <p>123 Impact Avenue, Washington, DC 20001, United States</p>
                <p>Email: legal@givetoafrica.net</p>
                <p>Phone: +1 (202) 555-1234</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
