import { google } from 'googleapis'

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

function makeIndexing(client: any) {
  return google.indexing({ version: 'v3', auth: client })
}

export async function submitUrl(url: string): Promise<{ success: boolean; error?: string }> {
  const client = getClient()
  if (!client) {
    return { success: false, error: 'Google Indexing API not configured' }
  }
  try {
    const indexing = makeIndexing(client)
    await indexing.urlNotifications.publish({
      requestBody: { url, type: 'URL_UPDATED' },
    })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) }
  }
}

export async function submitUrls(urls: string[]): Promise<{ submitted: number; failed: number; errors: string[] }> {
  const client = getClient()
  if (!client) {
    return { submitted: 0, failed: urls.length, errors: ['Google Indexing API not configured'] }
  }
  const indexing = makeIndexing(client)
  let submitted = 0
  const errors: string[] = []
  const chunks: string[][] = []
  for (let i = 0; i < urls.length; i += 50) {
    chunks.push(urls.slice(i, i + 50))
  }
  for (const chunk of chunks) {
    const results = await Promise.all(
      chunk.map(async (url) => {
        try {
          await indexing.urlNotifications.publish({
            requestBody: { url, type: 'URL_UPDATED' },
          })
          return { url, success: true }
        } catch (err: any) {
          return { url, success: false, error: err?.message || String(err) }
        }
      })
    )
    for (const result of results) {
      if (result.success) {
        submitted++
      } else {
        errors.push(`${result.url}: ${result.error}`)
      }
    }
  }
  return { submitted, failed: urls.length - submitted, errors }
}

export function isConfigured(): boolean {
  return !!CLIENT_EMAIL && !!PRIVATE_KEY
}
