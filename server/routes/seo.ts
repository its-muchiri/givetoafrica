import { Router } from 'express'
import { optimizePost } from '../lib/seo-optimizer.js'
import { submitUrl, submitUrls, isConfigured } from '../lib/google-indexer.js'

const router = Router()

router.post('/optimize', (_req, res) => {
  try {
    const { title, content, excerpt, focusKeyword, url, imageUrl, author, publishedTime, modifiedTime } = _req.body as {
      title?: string
      content?: string
      excerpt?: string
      focusKeyword?: string
      url?: string
      imageUrl?: string
      author?: string
      publishedTime?: string
      modifiedTime?: string
    }

    if (!title || !content) {
      return res.status(400).json({ error: 'title and content are required' })
    }

    const result = optimizePost({
      title,
      content,
      excerpt,
      focusKeyword,
      url,
      imageUrl,
      author,
      publishedTime,
      modifiedTime,
    })

    res.json(result)
  } catch (err: any) {
    console.error('SEO optimize error:', err?.message || err)
    res.status(500).json({ error: 'Failed to optimize post', details: err?.message })
  }
})

router.post('/optimize-all', async (_req, res) => {
  try {
    const { posts } = _req.body as { posts?: Array<{ title: string; content: string; excerpt?: string; url?: string; focusKeyword?: string }> }

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return res.status(400).json({ error: 'posts array is required' })
    }

    const results = posts.map((post) => {
      const result = optimizePost({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        focusKeyword: post.focusKeyword,
        url: post.url,
      })
      return { title: post.title, slug: result.slug, score: result.score, focusKeyword: result.focusKeyword, notes: result.notes }
    })

    const averageScore = Math.round(
      results.reduce((sum, r) => sum + r.score, 0) / Math.max(results.length, 1)
    )

    res.json({ results, averageScore, total: results.length })
  } catch (err: any) {
    console.error('SEO optimize-all error:', err?.message || err)
    res.status(500).json({ error: 'Failed to optimize posts', details: err?.message })
  }
})

router.post('/index', async (_req, res) => {
  try {
    const { url } = _req.body as { url?: string }
    if (!url) {
      return res.status(400).json({ error: 'url is required' })
    }

    const result = await submitUrl(url)
    res.json(result)
  } catch (err: any) {
    console.error('Google Index error:', err?.message || err)
    res.status(500).json({ error: 'Failed to submit URL to Google', details: err?.message })
  }
})

router.post('/index-batch', async (_req, res) => {
  try {
    const { urls } = _req.body as { urls?: string[] }
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'urls array is required' })
    }

    const result = await submitUrls(urls)
    res.json(result)
  } catch (err: any) {
    console.error('Google Index batch error:', err?.message || err)
    res.status(500).json({ error: 'Failed to submit URLs to Google', details: err?.message })
  }
})

router.get('/config-status', (_req, res) => {
  res.json({
    configured: isConfigured(),
    hasClientEmail: !!process.env.GOOGLE_INDEXING_API_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.GOOGLE_INDEXING_API_PRIVATE_KEY,
  })
})

export { router as seoRoutes }
