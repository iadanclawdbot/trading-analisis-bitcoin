import type { MergedDataPoint } from '../../types'
import type { PowerLawBands, RegressionResult } from '../../types'
import { COLORS } from '../../constants/theme'
import { HALVINGS, BUBBLE_PEAKS, BEAR_BOTTOMS } from '../../constants/bitcoin'
import {
  generatePriceTicks,
  generateDayTicks,
  logToPixel,
} from './axis-utils'

export interface ChartTransform {
  minDay: number
  maxDay: number
  minPrice: number
  maxPrice: number
  padding: { top: number; right: number; bottom: number; left: number }
  width: number
  height: number
}

export interface TooltipData {
  x: number
  y: number
  date: string
  price: number
  fairValue: number
  zScore: number
}

export function getDefaultTransform(data: MergedDataPoint[]): ChartTransform {
  const days = data.map((d) => d.dayIndex).filter((d) => d > 0)
  const prices = data.map((d) => d.price).filter((p) => p > 0)

  const minDay = Math.max(201, Math.min(...days))
  const maxDay = Math.max(...days) * 1.1
  const minPrice = Math.min(...prices) * 0.5
  const maxPrice = Math.max(...prices) * 3

  return {
    minDay,
    maxDay,
    minPrice,
    maxPrice: Math.max(maxPrice, 1_000_000),
    padding: { top: 20, right: 20, bottom: 50, left: 70 },
    width: 0, // se setea en render
    height: 0,
  }
}

function dataX(dayIndex: number, transform: ChartTransform): number {
  const { minDay, maxDay, padding, width } = transform
  return logToPixel(
    dayIndex,
    Math.log10(minDay),
    Math.log10(maxDay),
    padding.left,
    width - padding.right,
  )
}

function dataY(price: number, transform: ChartTransform): number {
  const { minPrice, maxPrice, padding, height } = transform
  return logToPixel(
    price,
    Math.log10(minPrice),
    Math.log10(maxPrice),
    height - padding.bottom,
    padding.top,
  )
}

export function renderPowerLaw(
  ctx: CanvasRenderingContext2D,
  data: MergedDataPoint[],
  bands: PowerLawBands | null,
  regression: RegressionResult | null,
  transform: ChartTransform,
  crosshairPos: { x: number; y: number } | null,
  lastDayIndex: number,
): void {
  const { width, height, padding } = transform
  ctx.clearRect(0, 0, width, height)

  // Fondo
  ctx.fillStyle = COLORS.surface
  ctx.fillRect(0, 0, width, height)

  // Clip al area del grafico
  ctx.save()
  ctx.rect(padding.left, padding.top, width - padding.left - padding.right, height - padding.top - padding.bottom)
  ctx.clip()

  // ---- Bands (si existen) ----
  if (bands) {
    // Banda semitransparente entre soporte y resistencia
    drawBandFill(ctx, bands, transform)
    // Linea soporte (azul)
    drawLine(ctx, bands.support.map((p) => ({ day: p.dayIndex, price: p.supportValue })), COLORS.blue, transform, true, (p) => p.day <= lastDayIndex + 730)
    // Linea resistencia (rojo)
    drawLine(ctx, bands.resistance.map((p) => ({ day: p.dayIndex, price: p.resistanceValue })), COLORS.red, transform, true, (p) => p.day <= lastDayIndex + 730)
    // Fair value (verde) — solo parte historica
    drawLine(ctx, bands.fairValue.filter(p => p.dayIndex <= lastDayIndex).map((p) => ({ day: p.dayIndex, price: p.fairValue })), COLORS.green, transform, false)
    // Proyeccion (punteado)
    drawLine(ctx, bands.fairValue.filter(p => p.dayIndex > lastDayIndex).map((p) => ({ day: p.dayIndex, price: p.fairValue })), COLORS.green, transform, true)
  }

  // ---- Halvings ----
  for (const h of HALVINGS) {
    const hDate = new Date(h.date)
    const hDay = Math.floor((hDate.getTime() - new Date('2009-01-03').getTime()) / 86400000)
    const hx = dataX(hDay, transform)
    ctx.beginPath()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = COLORS.muted + '60'
    ctx.lineWidth = 1
    ctx.moveTo(hx, padding.top)
    ctx.lineTo(hx, height - padding.bottom)
    ctx.stroke()
    ctx.setLineDash([])
    // Label
    ctx.fillStyle = COLORS.muted + '80'
    ctx.font = '9px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('H', hx, padding.top + 8)
  }

  // ---- Precio real BTC ----
  if (data.length > 1) {
    ctx.beginPath()
    ctx.strokeStyle = COLORS.orange
    ctx.lineWidth = 1.5
    ctx.setLineDash([])
    let first = true
    for (const d of data) {
      if (d.dayIndex <= 0 || d.price <= 0) continue
      const x = dataX(d.dayIndex, transform)
      const y = dataY(d.price, transform)
      if (first) { ctx.moveTo(x, y); first = false }
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // ---- Picos de burbujas ----
  for (const peak of BUBBLE_PEAKS) {
    const pDate = new Date(peak.date)
    const pDay = Math.floor((pDate.getTime() - new Date('2009-01-03').getTime()) / 86400000)
    const px = dataX(pDay, transform)
    const py = dataY(peak.price, transform)
    ctx.beginPath()
    ctx.arc(px, py, 5, 0, Math.PI * 2)
    ctx.fillStyle = COLORS.red
    ctx.fill()
    ctx.strokeStyle = COLORS.red + '60'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // ---- Fondos de bear market ----
  for (const bottom of BEAR_BOTTOMS) {
    const bDate = new Date(bottom.date)
    const bDay = Math.floor((bDate.getTime() - new Date('2009-01-03').getTime()) / 86400000)
    const bx = dataX(bDay, transform)
    const by = dataY(bottom.price, transform)
    ctx.beginPath()
    ctx.arc(bx, by, 4, 0, Math.PI * 2)
    ctx.fillStyle = COLORS.green
    ctx.fill()
  }

  // ---- Punto actual ----
  if (data.length > 0) {
    const last = data[data.length - 1]
    if (last.dayIndex > 0 && last.price > 0) {
      const cx = dataX(last.dayIndex, transform)
      const cy = dataY(last.price, transform)
      ctx.beginPath()
      ctx.arc(cx, cy, 7, 0, Math.PI * 2)
      ctx.fillStyle = COLORS.orange
      ctx.fill()
      ctx.strokeStyle = COLORS.surface
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  ctx.restore()

  // ---- Ejes ----
  drawAxes(ctx, transform, data, regression)

  // ---- Crosshair ----
  if (crosshairPos) {
    ctx.save()
    ctx.beginPath()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = COLORS.muted + '60'
    ctx.lineWidth = 1
    ctx.moveTo(crosshairPos.x, padding.top)
    ctx.lineTo(crosshairPos.x, height - padding.bottom)
    ctx.moveTo(padding.left, crosshairPos.y)
    ctx.lineTo(width - padding.right, crosshairPos.y)
    ctx.stroke()
    ctx.restore()
  }
}

function drawBandFill(
  ctx: CanvasRenderingContext2D,
  bands: PowerLawBands,
  transform: ChartTransform,
): void {
  if (bands.support.length === 0 || bands.resistance.length === 0) return

  ctx.beginPath()
  let first = true
  for (const p of bands.resistance) {
    if (p.resistanceValue <= 0 || p.dayIndex <= 0) continue
    const x = dataX(p.dayIndex, transform)
    const y = dataY(p.resistanceValue, transform)
    if (first) { ctx.moveTo(x, y); first = false }
    else ctx.lineTo(x, y)
  }
  for (let i = bands.support.length - 1; i >= 0; i--) {
    const p = bands.support[i]
    if (p.supportValue <= 0 || p.dayIndex <= 0) continue
    ctx.lineTo(dataX(p.dayIndex, transform), dataY(p.supportValue, transform))
  }
  ctx.closePath()
  ctx.fillStyle = COLORS.green + '0a'
  ctx.fill()
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  points: { day: number; price: number }[],
  color: string,
  transform: ChartTransform,
  dashed = false,
  filter?: (p: { day: number; price: number }) => boolean,
): void {
  const pts = filter ? points.filter(filter) : points
  if (pts.length < 2) return
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.setLineDash(dashed ? [5, 5] : [])
  let first = true
  for (const p of pts) {
    if (p.day <= 0 || p.price <= 0) continue
    const x = dataX(p.day, transform)
    const y = dataY(p.price, transform)
    if (first) { ctx.moveTo(x, y); first = false }
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.setLineDash([])
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  transform: ChartTransform,
  data: MergedDataPoint[],
  _regression: RegressionResult | null,
): void {
  const { padding, width, height, minDay, maxDay, minPrice, maxPrice } = transform

  ctx.font = '10px "JetBrains Mono", monospace'
  ctx.fillStyle = COLORS.muted
  ctx.strokeStyle = COLORS.border2
  ctx.lineWidth = 1

  // Eje Y (precios)
  const priceTicks = generatePriceTicks(minPrice, maxPrice)
  for (const tick of priceTicks) {
    const y = dataY(tick.value, transform)
    if (y < padding.top || y > height - padding.bottom) continue
    ctx.beginPath()
    ctx.setLineDash([2, 4])
    ctx.strokeStyle = COLORS.border + '60'
    ctx.moveTo(padding.left, y)
    ctx.lineTo(width - padding.right, y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.textAlign = 'right'
    ctx.fillText(tick.label, padding.left - 5, y + 3)
  }

  // Eje X (años)
  const dayTicks = generateDayTicks(minDay, maxDay)
  for (const tick of dayTicks) {
    const x = dataX(tick.dayIndex, transform)
    if (x < padding.left || x > width - padding.right) continue
    ctx.beginPath()
    ctx.setLineDash([2, 4])
    ctx.strokeStyle = COLORS.border + '60'
    ctx.moveTo(x, padding.top)
    ctx.lineTo(x, height - padding.bottom)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.textAlign = 'center'
    ctx.fillText(tick.label, x, height - padding.bottom + 15)
  }

  // Bordes de ejes
  ctx.strokeStyle = COLORS.border2
  ctx.lineWidth = 1
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top)
  ctx.lineTo(padding.left, height - padding.bottom)
  ctx.lineTo(width - padding.right, height - padding.bottom)
  ctx.stroke()

  void data
}

/**
 * Dado un pixel (mouseX, mouseY), encuentra el punto de datos mas cercano.
 */
export function findNearestPoint(
  mouseX: number,
  _mouseY: number,
  data: MergedDataPoint[],
  transform: ChartTransform,
): MergedDataPoint | null {
  let best: MergedDataPoint | null = null
  let bestDist = Infinity

  for (const d of data) {
    if (d.dayIndex <= 0 || d.price <= 0) continue
    const x = dataX(d.dayIndex, transform)
    const dist = Math.abs(x - mouseX)
    if (dist < bestDist) {
      bestDist = dist
      best = d
    }
  }

  return bestDist < 30 ? best : null
}
