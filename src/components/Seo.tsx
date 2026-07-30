import { useEffect } from 'react'

const SITE_URL = 'https://givetoafrica.net'

interface SeoProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  publishedTime?: string
  section?: string
  tags?: string[]
}

export default function Seo({ title, description, image, url, type = 'website', publishedTime, section, tags }: SeoProps) {
  useEffect(() => {
    const defaultTitle = 'GiveToAfrica — Empowering African Communities'
    const defaultDesc = 'Donate to verified causes across Africa. Education, clean water, healthcare, food security, and more.'

    document.title = title || defaultTitle

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      const selector = attr === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`
      let el = document.querySelector(selector) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.content = content
    }

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
      if (!el) {
        el = document.createElement('link')
        el.rel = rel
        document.head.appendChild(el)
      }
      el.href = href
    }

    setMeta('name', 'description', description || defaultDesc)
    setMeta('property', 'og:title', title || defaultTitle)
    setMeta('property', 'og:description', description || defaultDesc)
    if (image) setMeta('property', 'og:image', image.startsWith('http') ? image : `${SITE_URL}${image}`)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', url ? `${SITE_URL}${url}` : SITE_URL)
    setMeta('property', 'og:site_name', 'GiveToAfrica')
    setMeta('property', 'og:locale', 'en_US')
    if (publishedTime) setMeta('property', 'article:published_time', publishedTime)
    if (section) setMeta('property', 'article:section', section)
    if (tags) tags.forEach(t => setMeta('property', 'article:tag', t))
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title || defaultTitle)
    setMeta('name', 'twitter:description', description || defaultDesc)
    if (image) setMeta('name', 'twitter:image', image.startsWith('http') ? image : `${SITE_URL}${image}`)

    setLink('canonical', url ? `${SITE_URL}${url}` : SITE_URL)
  }, [title, description, image, url, type, publishedTime, section, tags?.join(',')])

  return null
}
