import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const BASE_URL = 'https://givetoafrica.net'

function getBlogPosts() {
  try {
    const jsonPath = join(ROOT, 'src', 'data', 'blogPosts.json')
    return JSON.parse(readFileSync(jsonPath, 'utf-8'))
  } catch {
    return []
  }
}

async function main() {
  const posts = getBlogPosts()
  const published = posts.filter((p) => p.publishedAt)

  const urls = published.map((p) => `${BASE_URL}/blog/${p.slug}`)

  const clientEmail = process.env.GOOGLE_INDEXING_API_CLIENT_EMAIL || ''
  const privateKey = (process.env.GOOGLE_INDEXING_API_PRIVATE_KEY || '').replace(/\\n/g, '\n')

  if (!clientEmail || !privateKey) {
    console.log('Skipping Google notification: GOOGLE_INDEXING_API_CLIENT_EMAIL and GOOGLE_INDEXING_API_PRIVATE_KEY are not set')
    process.exit(0)
  }

  const { google } = await import('googleapis')

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })

  const client = await auth.getClient()
  const indexing = google.indexing({ version: 'v3', auth: client })

  let submitted = 0
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
      console.log(`Submitted ${chunk.length} URLs to Google Indexing API`)
    } catch (err) {
      for (const url of chunk) {
        try {
          await indexing.urlNotifications.publish({
            requestBody: { url, type: 'URL_UPDATED' },
          })
          submitted++
        } catch {
          console.error(`Failed to submit: ${url}`)
        }
      }
    }
  }

  console.log(`Google Indexing: submitted ${submitted}/${urls.length} URLs`)
}

main()