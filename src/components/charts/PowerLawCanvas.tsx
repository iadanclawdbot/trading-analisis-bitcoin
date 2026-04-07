import { useCallback, useRef, useState, useEffect } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { useCanvasChart } from '../../hooks/useCanvasChart'
import {
  renderPowerLaw,
  getDefaultTransform,
  findNearestPoint,
} from '../../lib/canvas/power-law-renderer'
import type { ChartTransform } from '../../lib/canvas/power-law-renderer'
import type { MergedDataPoint } from '../../types'
import { formatPrice } from '../../lib/math/utils'
import { computeFairValue } from '../../lib/math/regression'

interface ZoomState {
  minDay: number
  maxDay: number
  minPrice: number
  maxPrice: number
}

export function PowerLawCanvas() {
  const { data, bands, regression } = useDashboard()
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; point: MergedDataPoint
  } | null>(null)
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null)
  const [zoomState, setZoomState] = useState<ZoomState | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const transformRef = useRef<ChartTransform | null>(null)
  const zoomRef = useRef<ZoomState | null>(null)
  const dragStartRef = useRef<{ x: number; y: number; zoom: ZoomState } | null>(null)

  const lastDayIndex = data.length > 0 ? data[data.length - 1].dayIndex : 0

  // Mantener ref sincronizado con state
  zoomRef.current = zoomState

  const onDraw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      if (data.length === 0) return
      const defaultT = getDefaultTransform(data)
      const zoom = zoomRef.current
      const transform: ChartTransform = {
        ...defaultT,
        ...(zoom ?? {}),
        width,
        height,
      }
      transformRef.current = transform
      renderPowerLaw(ctx, data, bands, regression, transform, crosshair, lastDayIndex)
    },
    [data, bands, regression, crosshair, lastDayIndex, zoomState],
  )

  const { canvasRef } = useCanvasChart({
    onDraw,
    deps: [data, bands, regression, crosshair, zoomState],
  })

  // Wheel zoom (listener manual para passive: false)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const t = transformRef.current
      if (!t) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const { padding, width, height } = t

      const chartW = width - padding.left - padding.right
      const chartH = height - padding.top - padding.bottom
      if (chartW <= 0 || chartH <= 0) return

      const z = zoomRef.current ?? {
        minDay: t.minDay, maxDay: t.maxDay,
        minPrice: t.minPrice, maxPrice: t.maxPrice,
      }

      const factor = e.deltaY > 0 ? 1.1 : 1 / 1.1

      const logMinDay = Math.log10(z.minDay)
      const logMaxDay = Math.log10(z.maxDay)
      const logMinPrice = Math.log10(z.minPrice)
      const logMaxPrice = Math.log10(z.maxPrice)

      // Posicion del mouse en espacio normalizado [0, 1]
      const nx = Math.max(0, Math.min(1, (mouseX - padding.left) / chartW))
      const ny = Math.max(0, Math.min(1, (mouseY - padding.top) / chartH))

      // Coordenadas log en la posicion del mouse
      const logDayAtMouse = logMinDay + nx * (logMaxDay - logMinDay)
      const logPriceAtMouse = logMaxPrice + ny * (logMinPrice - logMaxPrice)

      // Zoom centrado en el mouse
      const newLogMinDay = logDayAtMouse - (logDayAtMouse - logMinDay) * factor
      const newLogMaxDay = logDayAtMouse + (logMaxDay - logDayAtMouse) * factor
      const newLogMinPrice = logPriceAtMouse - (logPriceAtMouse - logMinPrice) * factor
      const newLogMaxPrice = logPriceAtMouse + (logMaxPrice - logPriceAtMouse) * factor

      // Limites de zoom (permite hasta nivel diario)
      const dayRange = newLogMaxDay - newLogMinDay
      const priceRange = newLogMaxPrice - newLogMinPrice
      if (dayRange < 0.0003 || dayRange > 5 || priceRange < 0.005 || priceRange > 12) return

      const newZoom: ZoomState = {
        minDay: Math.pow(10, newLogMinDay),
        maxDay: Math.pow(10, newLogMaxDay),
        minPrice: Math.pow(10, newLogMinPrice),
        maxPrice: Math.pow(10, newLogMaxPrice),
      }
      zoomRef.current = newZoom
      setZoomState(newZoom)
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', handleWheel)
  }, [canvasRef])

  // Mouseup global para terminar drag fuera del canvas
  useEffect(() => {
    if (!isDragging) return
    const handleUp = () => {
      setIsDragging(false)
      dragStartRef.current = null
    }
    window.addEventListener('mouseup', handleUp)
    return () => window.removeEventListener('mouseup', handleUp)
  }, [isDragging])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return
    const t = transformRef.current
    if (!t) return

    setIsDragging(true)
    setCrosshair(null)
    setTooltip(null)

    const z = zoomRef.current ?? {
      minDay: t.minDay, maxDay: t.maxDay,
      minPrice: t.minPrice, maxPrice: t.maxPrice,
    }
    dragStartRef.current = { x: e.clientX, y: e.clientY, zoom: { ...z } }
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Modo drag: pan
      if (isDragging && dragStartRef.current) {
        const t = transformRef.current
        if (!t) return

        const dx = e.clientX - dragStartRef.current.x
        const dy = e.clientY - dragStartRef.current.y
        const z = dragStartRef.current.zoom
        const { padding, width, height } = t
        const chartW = width - padding.left - padding.right
        const chartH = height - padding.top - padding.bottom
        if (chartW <= 0 || chartH <= 0) return

        const logMinDay = Math.log10(z.minDay)
        const logMaxDay = Math.log10(z.maxDay)
        const logMinPrice = Math.log10(z.minPrice)
        const logMaxPrice = Math.log10(z.maxPrice)

        const dLogDay = -(dx / chartW) * (logMaxDay - logMinDay)
        const dLogPrice = (dy / chartH) * (logMaxPrice - logMinPrice)

        const newZoom: ZoomState = {
          minDay: Math.pow(10, logMinDay + dLogDay),
          maxDay: Math.pow(10, logMaxDay + dLogDay),
          minPrice: Math.pow(10, logMinPrice + dLogPrice),
          maxPrice: Math.pow(10, logMaxPrice + dLogPrice),
        }
        zoomRef.current = newZoom
        setZoomState(newZoom)
        return
      }

      // Modo normal: crosshair + tooltip
      const canvas = canvasRef.current
      if (!canvas || !transformRef.current) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setCrosshair({ x, y })
      const point = findNearestPoint(x, y, data, transformRef.current)
      if (point) setTooltip({ x, y, point })
      else setTooltip(null)
    },
    [isDragging, data, canvasRef],
  )

  const handleMouseLeave = useCallback(() => {
    setCrosshair(null)
    setTooltip(null)
    if (isDragging) {
      setIsDragging(false)
      dragStartRef.current = null
    }
  }, [isDragging])

  const handleDoubleClick = useCallback(() => {
    zoomRef.current = null
    setZoomState(null)
  }, [])

  const fairValue =
    tooltip && regression
      ? computeFairValue(tooltip.point.dayIndex, regression)
      : null

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          display: 'block',
          cursor: isDragging ? 'grabbing' : 'crosshair',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
      />

      {/* Tooltip */}
      {tooltip && !isDragging && (
        <div
          className="absolute pointer-events-none bg-btc-surface-2 border border-btc-border-2 px-2 py-1.5 text-xs font-mono z-10"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 50,
            minWidth: 140,
            transform: tooltip.x > 400 ? 'translateX(-120%)' : undefined,
          }}
        >
          <p className="text-btc-muted">{tooltip.point.date}</p>
          <p className="text-btc-orange font-semibold tabular-nums">
            {formatPrice(tooltip.point.price)}
          </p>
          {fairValue && (
            <p className="text-btc-muted">
              Justo: {formatPrice(fairValue)}
            </p>
          )}
        </div>
      )}

      {/* Boton reset zoom */}
      {zoomState && (
        <button
          onClick={handleDoubleClick}
          className="absolute top-2 right-2 bg-btc-surface border border-btc-border px-2 py-1 text-xs font-mono text-btc-muted hover:text-btc-text z-10"
        >
          Restablecer
        </button>
      )}

      {/* Leyenda */}
      <div className="absolute bottom-2 right-2 flex items-center gap-3 text-xs font-mono text-btc-muted">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-btc-green inline-block" />
          Valor justo
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-btc-blue inline-block" />
          Soporte
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-btc-red inline-block" />
          Resistencia
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-btc-orange inline-block" />
          Precio BTC
        </span>
      </div>
    </div>
  )
}
