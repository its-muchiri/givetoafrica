import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroCarouselItem {
  title: string
  excerpt: string
  category: string
  image: string
  href: string
}

interface HeroBlogCarouselProps {
  items: HeroCarouselItem[]
  autoPlayMs?: number
}

export default function HeroBlogCarousel({ items, autoPlayMs = 3500 }: HeroBlogCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [progress, setProgress] = useState(0)
  const isPaused = useRef(false)
  const tickRef = useRef<ReturnType<typeof setInterval>>()
  const startRef = useRef(Date.now())

  const total = items.length

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir)
    setCurrent(((idx % total) + total) % total)
    setProgress(0)
    startRef.current = Date.now()
  }, [total])

  // Auto-advance timer
  useEffect(() => {
    tickRef.current = setInterval(() => {
      if (isPaused.current) return
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / autoPlayMs) * 100, 100)
      setProgress(pct)
      if (pct >= 100) {
        goTo((current + 1) % total, 1)
      }
    }, 30)
    return () => clearInterval(tickRef.current)
  }, [current, total, autoPlayMs, goTo])

  const pause = () => { isPaused.current = true }
  const resume = () => { isPaused.current = false }

  if (!items.length) return null
  const item = items[current]

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.95 }),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative w-full max-w-sm"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 shadow-2xl shadow-black/20 backdrop-blur-md">
          {/* Progress bar */}
          <div className="absolute left-0 top-0 z-20 h-[2px] w-full bg-white/10">
            <motion.div
              className="h-full bg-ochre-light"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.03 }}
            />
          </div>

          {/* Image with Ken Burns zoom */}
          <div className="relative h-48 overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              <motion.img
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full origin-center object-cover"
                style={{
                  animation: isPaused.current ? 'none' : 'kenBurns 6s ease-in-out infinite alternate',
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Category pill */}
            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
              {item.category}
            </span>

            {/* Slide counter */}
            <span className="absolute right-3 top-3 text-[10px] font-medium text-white/50">
              {current + 1}/{total}
            </span>
          </div>

          {/* Content */}
          <div className="p-5">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-display text-sm font-medium leading-snug text-white line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/50 line-clamp-2">
                  {item.excerpt}
                </p>
                <Link
                  to={item.href}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ochre-light transition-colors hover:text-ochre"
                >
                  Read More <ArrowRight className="h-3 w-3" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-2.5 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className="group relative h-1.5 overflow-hidden rounded-full bg-white/15 transition-all duration-300"
                style={{ width: i === current ? 28 : 6 }}
                aria-label={`Go to slide ${i + 1}`}
              >
                {i === current && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-ochre-light"
                    style={{ width: `${progress}%` }}
                  />
                )}
                {i !== current && (
                  <div className="absolute inset-0 rounded-full bg-white/40 opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(current - 1, -1)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all hover:bg-white/20 hover:text-white"
              aria-label="Previous"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button
              onClick={() => goTo(current + 1, 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all hover:bg-white/20 hover:text-white"
              aria-label="Next"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Ken Burns keyframes */}
      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
      `}</style>
    </motion.div>
  )
}
