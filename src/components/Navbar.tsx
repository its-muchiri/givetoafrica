import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Our Work', href: '/causes' },
  { label: 'Impact', href: '/impact' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 bg-indigo text-white">
      <nav className="container-page">
        <div className="flex h-16 items-center justify-between md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-ochre text-white">
              <Heart className="h-4.5 w-4.5" fill="currentColor" strokeWidth={0} />
            </div>
            <span className="font-display text-lg font-medium tracking-tight">
              Donate<span className="text-ochre"> to Africa</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'relative rounded px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-ochre'
                      : 'text-white/70 hover:text-white'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-ochre rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/donate"
              className="btn-primary text-sm !bg-ochre !text-white hover:!bg-ochre-600"
            >
              <Heart className="h-4 w-4 btn-icon" fill="currentColor" strokeWidth={0} />
              Donate
            </Link>
            <button
              type="button"
              className="rounded p-2 text-white/70 hover:text-white lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="border-t border-white/10 pb-4 lg:hidden">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'rounded px-3 py-2.5 text-sm font-medium transition-colors',
                    location.pathname === link.href
                      ? 'bg-ochre/15 text-ochre'
                      : 'text-white/70 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
