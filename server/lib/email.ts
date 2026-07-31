import { Resend } from 'resend'

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')
  }
  return _resend
}

interface SendReceiptEmailParams {
  to: string
  donorName: string
  amount: number
  currency: string
  receiptNumber: string
  campaignName?: string
  isRecurring: boolean
}

export async function sendReceiptEmail(params: SendReceiptEmailParams) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: params.currency,
  }).format(params.amount / 100)

  await getResend().emails.send({
            from: process.env.EMAIL_FROM || 'receipts@givetoafrica.net',
    to: params.to,
    subject: `Thank you for your donation of ${formattedAmount} - GiveToAfrica`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #ef5723; margin: 0;">Thank You, ${params.donorName}!</h1>
          <p style="color: #6d6d6d; font-size: 18px;">Your generosity makes a real difference.</p>
        </div>
        
        <div style="background: #f0faf3; border-radius: 12px; padding: 24px; margin: 20px 0;">
          <h2 style="margin: 0 0 8px; color: #1a1a1a;">Donation Receipt</h2>
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6d6d6d;">Receipt Number</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${params.receiptNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6d6d6d;">Amount</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formattedAmount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6d6d6d;">Type</td>
              <td style="padding: 8px 0; text-align: right;">${params.isRecurring ? 'Monthly Recurring' : 'One-time'}</td>
            </tr>
            ${params.campaignName ? `
            <tr>
              <td style="padding: 8px 0; color: #6d6d6d;">Campaign</td>
              <td style="padding: 8px 0; text-align: right;">${params.campaignName}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 8px 0; color: #6d6d6d;">Date</td>
              <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fef3f0; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #ef5723;">
          <p style="margin: 0; font-size: 14px; color: #7a2412;">
            <strong>Tax Information:</strong> GiveToAfrica Foundation is a registered 501(c)(3) nonprofit organization (EIN: 12-3456789). 
            This donation may be tax-deductible to the extent allowed by law. Please retain this receipt for your records.
          </p>
        </div>

        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e7e7e7; margin-top: 30px;">
          <p style="color: #888; font-size: 12px;">
            GiveToAfrica Foundation · 123 Impact Avenue, Washington DC 20001<br>
            <a href="mailto:info@givetoafrica.net" style="color: #ef5723;">info@givetoafrica.net</a>
          </p>
        </div>
      </body>
      </html>
    `,
  })
}

interface SendWelcomeEmailParams {
  to: string
  donorName: string
}

export async function sendWelcomeEmail(to: string, donorName: string) {
  await getResend().emails.send({
            from: process.env.EMAIL_FROM || 'welcome@givetoafrica.net',
    to,
    subject: `Welcome to GiveToAfrica, ${donorName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #146B38; margin: 0;">Welcome, ${donorName}!</h1>
          <p style="color: #6d6d6d; font-size: 18px;">You're now part of a global community making a real difference.</p>
        </div>

        <div style="background: #f0faf3; border-radius: 12px; padding: 24px; margin: 20px 0;">
          <h2 style="margin: 0 0 12px; color: #1a1a1a;">What Happens Next</h2>
          <ul style="font-size: 14px; line-height: 1.8; color: #333; padding-left: 20px;">
            <li>Your donation goes directly to verified programs in Africa</li>
            <li>You'll receive receipts and tax documentation automatically</li>
            <li>Monthly impact reports keep you updated on your generosity</li>
            <li>Access your donor portal anytime to track your giving</li>
          </ul>
        </div>

        <div style="text-align: center; padding: 20px 0;">
          <a href="${process.env.VITE_APP_URL}/dashboard" style="display: inline-block; background: #146B38; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600;">
            View Your Donor Portal
          </a>
        </div>

        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e7e7e7; margin-top: 30px;">
          <p style="color: #888; font-size: 12px;">
            GiveToAfrica Foundation · 123 Impact Avenue, Washington DC 20001<br>
            <a href="mailto:info@givetoafrica.net" style="color: #146B38;">info@givetoafrica.net</a>
          </p>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendNewsletterDigestEmail(to: string, subject: string, content: string) {
  await getResend().emails.send({
            from: process.env.EMAIL_FROM || 'newsletter@givetoafrica.net',
    to,
    subject: `GiveToAfrica Newsletter — ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #146B38; margin: 0;">GiveToAfrica Newsletter</h1>
          <p style="color: #6d6d6d; font-size: 18px;">${subject}</p>
        </div>

        <div style="background: #f0faf3; border-radius: 12px; padding: 24px; margin: 20px 0;">
          <div style="font-size: 14px; line-height: 1.8; color: #333;">
            ${content}
          </div>
        </div>

        <div style="text-align: center; padding: 20px 0;">
          <a href="${process.env.VITE_APP_URL}/blog" style="display: inline-block; background: #146B38; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600;">
            Read More on Our Blog
          </a>
        </div>

        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e7e7e7; margin-top: 30px;">
          <p style="color: #888; font-size: 12px;">
            You're receiving this because you subscribed to the GiveToAfrica newsletter.<br>
            <a href="${process.env.VITE_APP_URL}/unsubscribe" style="color: #146B38;">Unsubscribe</a>
          </p>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendMagicLinkEmail(email: string, token: string) {
  const magicLink = `${process.env.VITE_APP_URL}/auth/verify?token=${token}`

  await getResend().emails.send({
    from: process.env.EMAIL_FROM || 'auth@givetoafrica.net',
    to: email,
    subject: 'Sign in to GiveToAfrica',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #ef5723; margin: 0;">Sign In to GiveToAfrica</h1>
          <p style="color: #6d6d6d;">Click the button below to sign in to your donor portal.</p>
        </div>
        <div style="text-align: center; padding: 20px 0;">
          <a href="${magicLink}" style="display: inline-block; background: #ef5723; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600;">
            Sign In
          </a>
        </div>
        <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
          This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.
        </p>
      </body>
      </html>
    `,
  })
}
