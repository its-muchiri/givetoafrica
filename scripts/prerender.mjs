import { spawn } from 'child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import puppeteer from 'puppeteer-core'
import os from 'os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')

const require = createRequire(import.meta.url)

const STATIC_ROUTES = [
  '/', '/about', '/causes', '/charities', '/impact', '/get-involved',
  '/news', '/blog', '/contact', '/faq', '/privacy', '/terms',
]

const CATEGORY_SLUGS = [
  'aged', 'animals', 'armed-and-ex-services', 'children-and-youth',
  'community', 'culture-and-heritage', 'disabled', 'education-and-training',
  'employment-trades-and-professions', 'environment', 'family', 'health',
  'hearing-impairments', 'hospices', 'hospitals', 'housing', 'human-rights',
  'international', 'learning-disabilities-and-sen', 'medical-research',
  'medical-welfare', 'mental-health', 'overseas-aid', 'religious',
  'rescue-services', 'social-welfare', 'sport-and-recreation', 'visual-impairments',
]

function getChromePath() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  const envPath = process.env.PUPPETEER_CHROME_PATH || process.env.CHROME_PATH
  if (envPath && existsSync(envPath)) return envPath
  return candidates[0]
}

function getRoutes() {
  let blogPosts = []
  try {
    const jsonPath = join(ROOT, 'src', 'data', 'blogPosts.json')
    if (existsSync(jsonPath)) {
      blogPosts = JSON.parse(readFileSync(jsonPath, 'utf-8'))
    }
  } catch { }

  const publishedPosts = blogPosts.filter(
    p => !p.needsImageReview && !p.needsFactCheck
  )

  const blogCategorySlugs = [...new Set(publishedPosts.map(p => p.categorySlug))]

  const categoryRoutes = CATEGORY_SLUGS.map(s => `/causes/${s}`)
  const charityRoutes = CATEGORY_SLUGS.map(s => `/charities/${s}`)
  const blogCategoryRoutes = blogCategorySlugs.map(s => `/blog/category/${s}`)
  const blogPostRoutes = publishedPosts.map(p => `/blog/${p.slug}`)

  return [...new Set([...STATIC_ROUTES, ...categoryRoutes, ...charityRoutes, ...blogCategoryRoutes, ...blogPostRoutes])]
}

function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['vite', 'preview', '--port', '4199', '--strictPort'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    })
    let started = false
    const onData = (d) => {
      if (!started && d.toString().includes('Local:')) {
        started = true
        setTimeout(() => resolve(proc), 1000)
      }
    }
    proc.stdout.on('data', onData)
    proc.stderr.on('data', onData)
    proc.on('error', reject)
    setTimeout(() => { if (!started) resolve(proc) }, 10000)
  })
}

const BATCH_SIZE = 25

async function prerenderBatch(routes, startIndex, browser, server) {
  const endIndex = Math.min(startIndex + BATCH_SIZE, routes.length)

  for (let i = startIndex; i < endIndex; i++) {
    const route = routes[i]
    const url = `http://localhost:4199${route}`
    const outPath = join(DIST, route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`)

    let page
    try {
      page = await browser.newPage()
      page.setDefaultTimeout(30000)
      process.stdout.write(`  [${i + 1}/${routes.length}] ${route} `)
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })
      await page.waitForSelector('#root > *', { timeout: 5000 }).catch(() => {})
      await new Promise(r => setTimeout(r, 200))

      const html = await page.content()
      mkdirSync(dirname(outPath), { recursive: true })
      writeFileSync(outPath, html)
      console.log('✓')
    } catch (err) {
      console.log(`✗ — ${err.message}`)
    } finally {
      if (page) await page.close().catch(() => {})
    }
  }

  return endIndex
}

async function prerender() {
  const routes = getRoutes()
  console.log(`Prerendering ${routes.length} routes...`)

  console.log('Starting preview server...')
  const server = await startPreviewServer()

  let browser
  try {
    const chromePath = getChromePath()
    console.log(`Using browser: ${chromePath}`)

    for (let i = 0; i < routes.length; ) {
      let userDataDir
      try {
        userDataDir = mkdtempSync(join(os.tmpdir(), 'puppeteer-chrome-'))
        browser = await puppeteer.launch({
          executablePath: chromePath,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new',
            '--disable-dev-shm-usage', '--disable-web-security',
            '--disable-features=site-per-process,IsolateOrigins,site-per-process',
            '--no-first-run', '--no-default-browser-check',
            '--disable-gpu', '--disable-dev-tools'],
          userDataDir,
        })

        i = await prerenderBatch(routes, i, browser, server)
        await browser.close().catch(() => {})
        browser = null
        if (userDataDir) { try { rmSync(userDataDir, { recursive: true, force: true }) } catch {} }
        console.log(`  [Progress] ${i}/${routes.length} routes processed, refreshed browser`)
      } catch (err) {
        console.error(`Browser error at batch starting ${i}: ${err.message}`)
        if (browser) {
          await browser.close().catch(() => {})
          browser = null
        }
        if (userDataDir) { try { rmSync(userDataDir, { recursive: true, force: true }) } catch {} }
        await new Promise(r => setTimeout(r, 2000))
      }
    }

    console.log('\nPrerendering complete!')
  } finally {
    if (browser) await browser.close().catch(() => {})
    server.kill()
  }
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
