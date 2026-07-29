import { spawn } from 'child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')

const require = createRequire(import.meta.url)

const STATIC_ROUTES = [
  '/', '/about', '/causes', '/impact', '/get-involved',
  '/news', '/blog', '/contact', '/faq', '/privacy', '/terms',
]

const CATEGORY_SLUGS = [
  'aged', 'animals', 'armed-forces', 'arts-culture', 'babies-children',
  'community-development', 'disability', 'disaster-relief', 'education',
  'employment', 'environment', 'housing-homelessness', 'healthcare',
  'hearing-health', 'hospitality', 'human-rights', 'hunger',
  'infrastructure', 'medical-research', 'mental-health', 'museums-libraries',
  'oceans', 'people-of-faith', 'poverty', 'racial-justice',
  'sports-recreation', 'vision-health', 'water-sanitation',
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
  const blogCategoryRoutes = blogCategorySlugs.map(s => `/blog/category/${s}`)
  const blogPostRoutes = publishedPosts.map(p => `/blog/${p.slug}`)

  return [...STATIC_ROUTES, ...categoryRoutes, ...blogCategoryRoutes, ...blogPostRoutes]
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

async function prerender() {
  const routes = getRoutes()
  console.log(`Prerendering ${routes.length} routes...`)

  console.log('Starting preview server...')
  const server = await startPreviewServer()

  let browser
  try {
    const chromePath = getChromePath()
    console.log(`Using browser: ${chromePath}`)

    browser = await puppeteer.launch({
      executablePath: chromePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new'],
    })

    const page = await browser.newPage()
    page.setDefaultTimeout(30000)

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      const url = `http://localhost:4199${route}`
      const outPath = join(DIST, route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`)

      try {
        process.stdout.write(`  [${i + 1}/${routes.length}] ${route} `)
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
        await page.waitForSelector('#root > *', { timeout: 10000 }).catch(() => {})
        await new Promise(r => setTimeout(r, 500))

        const html = await page.content()
        mkdirSync(dirname(outPath), { recursive: true })
        writeFileSync(outPath, html)
        console.log('✓')
      } catch (err) {
        console.log(`✗ — ${err.message}`)
      }
    }

    await page.close()
    console.log('\nPrerendering complete!')
  } finally {
    if (browser) await browser.close()
    server.kill()
  }
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
