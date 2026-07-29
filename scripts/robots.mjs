import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')

const robots = `User-agent: *
Allow: /

Sitemap: https://donatetoafrica.org/sitemap.xml`

writeFileSync(join(DIST, 'robots.txt'), robots)
console.log('Generated robots.txt')
