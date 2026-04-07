import { useRef, useEffect, useCallback } from 'react'

interface UseCanvasChartOptions {
  onDraw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
  deps?: unknown[]
}

export function useCanvasChart({ onDraw, deps = [] }: UseCanvasChartOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const cssWidth = rect.width
    const cssHeight = rect.height

    if (cssWidth === 0 || cssHeight === 0) return

    // Actualizar tamaño si es necesario
    if (canvas.width !== Math.round(cssWidth * dpr) || canvas.height !== Math.round(cssHeight * dpr)) {
      canvas.width = Math.round(cssWidth * dpr)
      canvas.height = Math.round(cssHeight * dpr)
      ctx.scale(dpr, dpr)
    }

    onDraw(ctx, cssWidth, cssHeight)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDraw, ...deps])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(draw)
    })

    observer.observe(canvas)
    draw()

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frameRef.current)
    }
  }, [draw])

  return { canvasRef, redraw: draw }
}
