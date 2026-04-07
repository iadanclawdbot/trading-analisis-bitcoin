import { useCallback, useRef, useState } from 'react'
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

export function PowerLawCanvas() {
  const { data, bands, regression } = useDashboard()
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; point: MergedDataPoint
  } | null>(null)
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null)
  const transformRef = useRef<ChartTransform | null>(null)

  const lastDayIndex = data.length > 0 ? data[data.length - 1].dayIndex : 0

  const onDraw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      if (data.length === 0) return
      const transform = { ...getDefaultTransform(data), width, height }
      transformRef.current = transform
      renderPowerLaw(ctx, data, bands, regression, transform, crosshair, lastDayIndex)
    },
    [data, bands, regression, crosshair, lastDayIndex],
  )

  const { canvasRef } = useCanvasChart({ onDraw, deps: [data, bands, regression, crosshair] })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
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
    [data, canvasRef],
  )

  const handleMouseLeave = useCallback(() => {
    setCrosshair(null)
    setTooltip(null)
  }, [])

  const fairValue =
    tooltip && regression
      ? computeFairValue(tooltip.point.dayIndex, regression)
      : null

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'block' }}
      />

      {/* Tooltip */}
      {tooltip && (
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
