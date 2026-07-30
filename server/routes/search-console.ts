import { Router } from 'express'
import { google } from 'googleapis'

const router = Router()

const CLIENT_EMAIL = process.env.GOOGLE_INDEXING_API_CLIENT_EMAIL || ''
const PRIVATE_KEY = (process.env.GOOGLE_INDEXING_API_PRIVATE_KEY || '')
  .replace(/\\n/g, '\n')

function getClient() {
  if (!CLIENT_EMAIL || !PRIVATE_KEY) return null

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })
  return auth.getClient()
}

router.post('/notify', async (_req, res) => {
  try {
    const { url } = _req.body as { url?: string }
    if (!url) {
      return res.status(400).json({ error: 'url is required' })
    }

    const client = getClient()
    if (!client) {
      return res.status(503).json({
        error: 'Google Indexing API not configured',
        configured: false,
      })
    }

    const indexing = google.indexing({ version: 'v3', auth: client })
    await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: 'URL_UPDATED',
      },
    })

    res.json({ ok: true, url, submitted: true })
  } catch (err: any) {
    console.error('Google Indexing API error:', err?.message || err)
    res.status(500).json({ error: 'Failed to submit URL to Google', details: err?.message })
  }
})

router.post('/notify-batch', async (_req, res) => {
  try {
    const { urls } = _req.body as { urls?: string[] }
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'urls array is required' })
    }

    const client = getClient()
    if (!client) {
      return res.status(503).json({
        error: 'Google Indexing API not configured',
        configured: false,
      })
    }

    const indexing = google.indexing({ version: 'v3', auth: client })
    let submitted = 0
    const failed: string[] = []

    const chunks = []
    for (let i = 0; i < urls.length; i += 100) {
      chunks.push(urls.slice(i, i + 100))
    }

    for (const chunk of chunks) {
      try {
        await indexing.urlNotifications.batchPublish({
          requestBody: { submissions: chunk.map((url) => ({ url, type: 'URL_UPDATED' })) },
        })
        submitted += chunk.length
      } catch (err) {
        for (const url of chunk) {
          try {
            await indexing.urlNotifications.publish({
              requestBody: { url, type: 'URL_UPDATED' },
            })
            submitted++
          } catch {
            failed.push(url)
          }
        }
      }
    }

    res.json({ ok: true, submitted, failed: failed.length, total: urls.length })
  } catch (err: any) {
    console.error('Google Indexing API batch error:', err?.message || err)
    res.status(500).json({ error: 'Failed to submit URLs to Google', details: err?.message })
  }
})

router.get('/status', (_req, res) => {
  const configured = !!(CLIENT_EMAIL && PRIVATE_KEY)
  res.json({ configured, hasClientEmail: !!CLIENT_EMAIL, hasPrivateKey: !!PRIVATE_KEY })
})

export { router as searchConsoleRoutes }