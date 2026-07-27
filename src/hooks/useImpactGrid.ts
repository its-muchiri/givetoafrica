import { useEffect, useState, useRef, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'

interface GridNode {
  id: number
  x: number
  y: number
  active: boolean
  pulse: boolean
  idleDelay: number
}

interface UseImpactGridOptions {
  cols?: number
  rows?: number
  idlePulseCount?: number
}

export function useImpactGrid(options: UseImpactGridOptions = {}) {
  const { cols = 12, rows = 8, idlePulseCount = 2 } = options
  const reducedMotion = useReducedMotion()
  const [nodes, setNodes] = useState<GridNode[]>(() => {
    const n: GridNode[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        n.push({
          id: r * cols + c,
          x: c,
          y: r,
          active: false,
          pulse: false,
          idleDelay: Math.random() * 4000,
        })
      }
    }
    return n
  })

  const timeoutRefs = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const activateNode = useCallback((nodeId: number) => {
    if (reducedMotion) {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, active: true } : n))
      )
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) => (n.id === nodeId ? { ...n, active: false } : n))
        )
      }, 2400)
      return
    }

    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, active: true, pulse: true } : n
      )
    )

    const t = setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, pulse: false } : n
        )
      )
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === nodeId ? { ...n, active: false } : n
          )
        )
      }, 600)
    }, 2400)

    timeoutRefs.current.set(nodeId, t)
  }, [reducedMotion])

  const triggerRandomPulse = useCallback(() => {
    const nodeId = Math.floor(Math.random() * (rows * cols))
    activateNode(nodeId)
  }, [rows, cols, activateNode])

  const cleanup = useCallback(() => {
    timeoutRefs.current.forEach((t) => clearTimeout(t))
    timeoutRefs.current.clear()
  }, [])

  useEffect(() => cleanup, [cleanup])

  return { nodes, activateNode, triggerRandomPulse, cleanup, reducedMotion }
}
