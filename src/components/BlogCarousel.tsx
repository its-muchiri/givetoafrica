import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselItem {
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  image: string
  href: string
}

interface BlogCarouselProps {
  items: CarouselItem[]
  autoPlayMs?: number
}

export default function BlogCarousel({ items, autoPlayMs = 5000 }: BlogCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const isPaused = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)

  const total = items.length

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir)
    setCurrent(((idx % total) + total) % total)
  }, [total])

  const next = useCallback(() => {
    if (!isPaused.current) {
      goTo(current + 1, 1)
    }
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo(current - 1, -1)
  }, [current, goTo])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!isPaused.current) {
        goTo((current + 1) % total, 1)
      }
    }, autoPlayMs)
    return () => clearInterval(timerRef.current)
  }, [current, total, autoPlayMs, goTo])

  const handleMouseEnter = () => { isPaused.current = true }
  const handleMouseLeave = () => { isPaused.current = false }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDelta.current = 0
    isPaused.current = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDelta.current = e.touches[0].clientX - touchStartX.current
  }

  const handleTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 50) {
      if (touchDelta.current < 0) goTo(current + 1, 1)
      else goTo(current - 1, -1)
    }
    isPaused.current = false
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  }

  if (!items.length) return null

  const item = items[current]

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-ink/8 shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid md:grid-cols-2">
        {/* Image */}
        <div className="relative h-64 overflow-hidden md:h-auto md:min-h-[360px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.img
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              src={item.image}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center p-6 md:p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-ochre/10 px-2.5 py-0.5 text-[11px] font-semibold text-ochre-dark ring-1 ring-ochre/8">
              {item.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-ink-soft">
              <Calendar className="h-3 w-3" />
              {item.date}
            </span>
          </div>

          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="mt-4 font-display text-xl font-medium text-ink md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft line-clamp-3">
                {item.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-ink-soft">
                  <Clock className="h-3 w-3" />
                  {item.readTime}
                </span>
              </div>
              <Link
                to={item.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ochre-dark transition-colors hover:text-ochre-dark"
              >
                Read Full Story <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 md:bottom-6 md:right-6">
        <button
          onClick={prev}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-all hover:bg-white hover:shadow-md"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-ochre-dark' : 'w-1.5 bg-ink/20 hover:bg-ink/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-all hover:bg-white hover:shadow-md"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
