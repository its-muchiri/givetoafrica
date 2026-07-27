export default function PrivacyPage() {
  const sections = [
    { id: 'information-we-collect', title: 'Information We Collect' },
    { id: 'how-we-use-information', title: 'How We Use Information' },
    { id: 'data-sharing', title: 'Data Sharing' },
    { id: 'international-transfers', title: 'International Transfers' },
    { id: 'data-retention', title: 'Data Retention' },
    { id: 'your-rights', title: 'Your Rights (GDPR)' },
    { id: 'popia-rights', title: 'POPIA Rights' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'security', title: 'Security' },
    { id: 'childrens-privacy', title: "Children's Privacy" },
    { id: 'changes-to-policy', title: 'Changes to This Policy' },
    { id: 'contact', title: 'Contact' },
  ]

  return (
    <>
      <section className="bg-indigo text-white">
        <div className="container-page py-16 md:py-20">
          <span className="text-label text-ochre-light">Legal</span>
          <h1 className="mt-4 font-display text-4xl font-medium md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-ink-muted">Last updated: January 15, 2025</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-page mx-auto max-w-3xl prose prose-ink">
          {/* Table of Contents */}
          <div className="card mb-10">
            <h3 className="font-display text-lg font-medium text-ink mb-3">Table of Contents</h3>
            <ol className="space-y-1.5 text-sm text-ink-soft list-decimal list-inside">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-ochre hover:text-ochre-dark transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-10 text-sm leading-relaxed text-ink-soft">
            {/* 1. Information We Collect */}
            <section id="information-we-collect">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">1. Information We Collect</h2>
              <p className="mb-3">We collect information you provide directly to us and information collected automatically when you use our services.</p>
              <h3 className="font-semibold text-ink-soft mb-2">Information You Provide</h3>
              <ul className="list-disc list-inside space-y-1.5 mb-3">
                <li><strong>Donation Information:</strong> Full name, email address, mailing address, phone number, and payment details (credit/debit card number, mobile money account, or bank account information) when you make a donation.</li>
                <li><strong>Donor Profile Information:</strong> Optional information such as your occupation, employer, and communication preferences when you create a donor account.</li>
                <li><strong>Correspondence:</strong> Information you provide when you contact us via email, contact form, or other communication channels, including your name, email address, and the content of your message.</li>
                <li><strong>Gift Aid Information:</strong> For UK donors, your home address and declaration status required to process Gift Aid claims with HMRC.</li>
              </ul>
              <h3 className="font-semibold text-ink-soft mb-2">Information Collected Automatically</h3>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Device Information:</strong> IP address, browser type and version, operating system, device type, and screen resolution.</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on pages, navigation paths, referral URLs, and interaction events (clicks, scrolls, form interactions).</li>
                <li><strong>Cookies and Similar Technologies:</strong> We use cookies, web beacons, and similar tracking technologies as described in our Cookies section below.</li>
              </ul>
            </section>

            {/* 2. How We Use Information */}
            <section id="how-we-use-information">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">2. How We Use Information</h2>
              <p className="mb-3">We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Processing Donations:</strong> To process, verify, and receipt your donations, including sending tax-deductible receipts and Gift Aid claims.</li>
                <li><strong>Donor Communication:</strong> To send you confirmation emails, tax receipts, impact reports, and program updates related to your donations.</li>
                <li><strong>Account Management:</strong> To create and manage your donor portal account, including tracking donation history and managing recurring giving.</li>
                <li><strong>Service Improvement:</strong> To analyze aggregated usage patterns to improve our website, donation experience, and communications.</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and reporting requirements for nonprofit organizations.</li>
                <li><strong>Fraud Prevention:</strong> To detect, prevent, and address fraudulent transactions and unauthorized access to donor accounts.</li>
                <li><strong>Marketing (with consent):</strong> To send newsletters and promotional communications only if you have opted in. You may unsubscribe at any time.</li>
              </ul>
            </section>

            {/* 3. Data Sharing */}
            <section id="data-sharing">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">3. Data Sharing</h2>
              <p className="mb-3">We do not sell, rent, or trade your personal information. We share data only in the following limited circumstances:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Payment Processors:</strong> We share transaction data with Stripe, Paystack, and Flutterwave solely for the purpose of processing your donation. These providers are PCI-DSS Level 1 certified and are contractually obligated to protect your data.</li>
                <li><strong>Tax Authorities:</strong> We may share donation information with the IRS (Form 990 filings) and HMRC (Gift Aid claims) as required by law.</li>
                <li><strong>Service Providers:</strong> We share data with trusted third-party providers who assist in operating our website and services (email delivery, analytics, hosting), all under strict data processing agreements.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation, or to protect the rights, property, or safety of Donate to Africa, our donors, or the public.</li>
                <li><strong>Corporate Matching:</strong> If you request a corporate matching gift, we may share your donation details with your employer's matching gift program administrator for verification purposes.</li>
              </ul>
            </section>

            {/* 4. International Transfers */}
            <section id="international-transfers">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">4. International Transfers</h2>
              <p>
                Donate to Africa operates globally and processes data in the United States and other countries where our service providers operate. When you make a donation from outside the United States, your information may be transferred to and processed in the United States, where data protection laws may differ from those in your jurisdiction.
              </p>
              <p className="mt-3">
                For transfers of personal data from the European Economic Area (EEA), United Kingdom, or South Africa, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission or equivalent safeguards to ensure adequate protection of your data. You may request a copy of these safeguards by contacting our privacy team.
              </p>
            </section>

            {/* 5. Data Retention */}
            <section id="data-retention">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">5. Data Retention</h2>
              <p className="mb-3">We retain your personal information for as long as necessary to fulfill the purposes described in this policy:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Donation Records:</strong> Retained for a minimum of 7 years to comply with IRS requirements and financial audit obligations.</li>
                <li><strong>Donor Account Data:</strong> Retained for the duration of your account's active period. Inactive accounts may be anonymized after 3 years of no activity.</li>
                <li><strong>Marketing Data:</strong> Retained until you withdraw consent. Unsubscribed email addresses are retained in a suppression list to prevent re-sending.</li>
                <li><strong>Website Analytics:</strong> Aggregated and anonymized after 26 months. Individual IP addresses are anonymized after 38 days.</li>
                <li><strong>Correspondence:</strong> Retained for 3 years from the date of the last communication to maintain service quality and legal records.</li>
              </ul>
            </section>

            {/* 6. Your Rights (GDPR) */}
            <section id="your-rights">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">6. Your Rights (GDPR)</h2>
              <p className="mb-3">
                If you are located in the European Economic Area (EEA) or the United Kingdom, you have the following rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Right of Access:</strong> You may request a copy of the personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> You may request correction of inaccurate or incomplete personal data.</li>
                <li><strong>Right to Erasure:</strong> You may request deletion of your personal data, subject to legal retention requirements.</li>
                <li><strong>Right to Restrict Processing:</strong> You may request that we limit how we use your data in certain circumstances.</li>
                <li><strong>Right to Data Portability:</strong> You may request a structured, machine-readable copy of your data to transfer to another organization.</li>
                <li><strong>Right to Object:</strong> You may object to the processing of your data for direct marketing purposes at any time.</li>
                <li><strong>Right to Withdraw Consent:</strong> Where we rely on consent, you may withdraw it at any time without affecting the lawfulness of prior processing.</li>
                <li><strong>Right to Lodge a Complaint:</strong> You have the right to file a complaint with your local data protection authority.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at privacy@donatetoafrica.org. We will respond to your request within 30 days.
              </p>
            </section>

            {/* 7. POPIA Rights */}
            <section id="popia-rights">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">7. POPIA Rights</h2>
              <p className="mb-3">
                If you are located in South Africa, the Protection of Personal Information Act (POPIA) grants you the following rights:
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Right to Access:</strong> You may request confirmation of whether we hold personal information about you and request access to that information.</li>
                <li><strong>Right to Correction:</strong> You may request the correction or deletion of personal information that is inaccurate, irrelevant, excessive, out of date, incomplete, misleading, or unlawfully obtained.</li>
                <li><strong>Right to Deletion:</strong> You may request the deletion or destruction of personal information that is no longer necessary for the purpose it was collected.</li>
                <li><strong>Right to Object:</strong> You may object to the processing of your personal information for direct marketing or other purposes on reasonable grounds.</li>
                <li><strong>Right to Complain:</strong> You may file a complaint with the Information Regulator of South Africa if you believe your rights have been violated.</li>
              </ul>
              <p className="mt-3">
                For POPIA-related inquiries, please contact our Information Officer at popia@donatetoafrica.org.
              </p>
            </section>

            {/* 8. Cookies */}
            <section id="cookies">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">8. Cookies</h2>
              <p className="mb-3">We use cookies and similar technologies to enhance your experience on our website. The types of cookies we use include:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Strictly Necessary Cookies:</strong> Required for the website to function correctly, including session management, security tokens, and CSRF protection. These cannot be disabled.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymized data. We use privacy-focused analytics tools that do not track individuals across websites.</li>
                <li><strong>Preference Cookies:</strong> Remember your settings, such as language preference and currency selection, to provide a more personalized experience.</li>
                <li><strong>Marketing Cookies:</strong> Used only if you opt in. These cookies help us measure the effectiveness of our awareness campaigns and are not used for third-party advertising.</li>
              </ul>
              <p className="mt-3">
                You can manage your cookie preferences at any time through our cookie consent banner or your browser settings. Disabling certain cookies may limit your ability to use some features of our website.
              </p>
            </section>

            {/* 9. Security */}
            <section id="security">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">9. Security</h2>
              <p className="mb-3">
                We implement robust technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>256-bit TLS encryption for all data in transit</li>
                <li>AES-256 encryption for data at rest</li>
                <li>PCI-DSS Level 1 compliance for payment processing</li>
                <li>Regular penetration testing and vulnerability assessments</li>
                <li>Strict access controls with role-based permissions</li>
                <li>Employee training on data protection and security practices</li>
                <li>Incident response procedures with breach notification within 72 hours</li>
              </ul>
              <p className="mt-3">
                While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we continuously work to improve our safeguards.
              </p>
            </section>

            {/* 10. Children's Privacy */}
            <section id="childrens-privacy">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">10. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16 without parental consent, we will take steps to delete that information promptly. If you believe that a child has provided us with personal information, please contact us at privacy@donatetoafrica.org.
              </p>
            </section>

            {/* 11. Changes to Policy */}
            <section id="changes-to-policy">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will update the "Last updated" date at the top of this page and notify registered donors via email. We encourage you to review this policy periodically. Your continued use of our services after any changes constitutes your acceptance of the updated policy.
              </p>
            </section>

            {/* 12. Contact */}
            <section id="contact">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">12. Contact</h2>
              <p className="mb-3">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="rounded-xl bg-parchment p-5 space-y-2 text-sm text-ink-soft">
                <p><strong>Donate to Africa Inc.</strong></p>
                <p>123 Impact Avenue, Washington, DC 20001, United States</p>
                <p>Email: privacy@donatetoafrica.org</p>
                <p>Phone: +1 (202) 555-1234</p>
                <p>Data Protection Officer: dpo@donatetoafrica.org</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
