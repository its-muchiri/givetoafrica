import { useEffect, useRef, useCallback } from 'react'
import { useReducedMotion, motion, AnimatePresence } from 'framer-motion'
import { useImpactGrid } from '@/hooks/useImpactGrid'

interface ImpactGridProps {
  cols?: number
  rows?: number
  className?: string
  regionShape?: 'scattered' | 'clustered' | 'full'
}

export default function ImpactGrid({
  cols = 14,
  rows = 8,
  className = '',
  regionShape = 'full',
}: ImpactGridProps) {
  const { nodes, activateNode, triggerRandomPulse, cleanup, reducedMotion } = useImpactGrid({
    cols,
    rows,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Simulated demo mode: random pulses
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      triggerRandomPulse()
    }, 3000 + Math.random() * 2000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      cleanup()
    }
  }, [triggerRandomPulse, cleanup])

  // Listen for real donation events via SSE (when available)
  useEffect(() => {
    const handleDonation = (event: CustomEvent) => {
      if (event.detail?.nodeId != null) {
        activateNode(event.detail.nodeId)
      } else {
        triggerRandomPulse()
      }
    }

    window.addEventListener('donation-event' as any, handleDonation as any)
    return () => window.removeEventListener('donation-event' as any, handleDonation as any)
  }, [activateNode, triggerRandomPulse])

  const getNodeOpacity = useCallback(
    (node: typeof nodes[0]) => {
      if (regionShape === 'clustered') {
        const cx = cols / 2
        const cy = rows / 2
        const dist = Math.sqrt((node.x - cx) ** 2 + (node.y - cy) ** 2)
        const maxDist = Math.sqrt(cx * cx + cy * cy)
        if (dist / maxDist > 0.7) return 0.04
      }
      if (node.active) return 0.7
      return 0.15
    },
    [regionShape, cols, rows]
  )

  const spacing = 32

  return (
    <div
      className={`relative ${className}`}
      role="img"
      aria-label="Impact visualization — live donation activity grid"
      style={{ width: cols * spacing, height: rows * spacing }}
    >
      <svg
        width={cols * spacing}
        height={rows * spacing}
        viewBox={`0 0 ${cols * spacing} ${rows * spacing}`}
        className="absolute inset-0"
      >
        {nodes.map((node) => {
          const cx = node.x * spacing + spacing / 2
          const cy = node.y * spacing + spacing / 2
          const opacity = getNodeOpacity(node)

          return (
            <g key={node.id}>
              {/* Ripple ring on pulse */}
              {node.pulse && !reducedMotion && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill="none"
                  stroke="#C98A2C"
                  strokeWidth={1.5}
                  className="animate-ripple"
                  style={{ opacity: 0.6 }}
                />
              )}
              {/* Main dot */}
              <circle
                cx={cx}
                cy={cy}
                r={node.active ? 5 : 3}
                fill={node.active ? '#C98A2C' : '#2B3A67'}
                opacity={opacity}
                style={{
                  transition: reducedMotion
                    ? 'none'
                    : 'all var(--duration-standard) var(--ease-signature)',
                }}
              />
              {/* Idle pulse */}
              {!node.active &&
                !node.pulse &&
                node.idleDelay !== undefined &&
                node.id % Math.floor((cols * rows) / 3) === 0 && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill="#C98A2C"
                    className="animate-idle-pulse"
                    style={{
                      animationDelay: `${node.idleDelay}ms`,
                    }}
                  />
                )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
