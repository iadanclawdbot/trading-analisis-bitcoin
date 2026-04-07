/**
 * Utilidades para ejes logarítmicos en Canvas 2D
 */

export interface LogTick {
  value: number // valor real (ej: 1000)
  label: string // label a mostrar (ej: "$1K")
}

/**
 * Genera ticks para un eje Y logarítmico de precios.
 * Potencias de 10 y sus intermedios (2x, 5x).
 */
export function generatePriceTicks(minPrice: number, maxPrice: number): LogTick[] {
  const ticks: LogTick[] = []
  const minExp = Math.floor(Math.log10(Math.max(minPrice, 0.001)))
  const maxExp = Math.ceil(Math.log10(maxPrice))

  for (let exp = minExp; exp <= maxExp; exp++) {
    const base = Math.pow(10, exp)
    for (const mult of [1, 2, 5]) {
      const val = base * mult
      if (val >= minPrice * 0.5 && val <= maxPrice * 2) {
        ticks.push({ value: val, label: formatPriceLabel(val) })
      }
    }
  }

  return ticks
}

/**
 * Genera ticks para el eje X (dias desde genesis → años).
 */
export interface DayTick {
  dayIndex: number
  label: string
  year: number
}

export function generateDayTicks(minDay: number, maxDay: number): DayTick[] {
  const GENESIS_YEAR = 2009
  const ticks: DayTick[] = []

  const minYear = GENESIS_YEAR + Math.floor(minDay / 365)
  const maxYear = GENESIS_YEAR + Math.ceil(maxDay / 365)

  for (let year = minYear; year <= maxYear; year++) {
    const dayIndex = (year - GENESIS_YEAR) * 365
    if (dayIndex >= minDay * 0.8 && dayIndex <= maxDay * 1.2) {
      ticks.push({ dayIndex, label: String(year), year })
    }
  }

  return ticks
}

function formatPriceLabel(price: number): string {
  if (price >= 1_000_000) return `$${price / 1_000_000}M`
  if (price >= 1_000) return `$${price / 1_000}K`
  if (price >= 1) return `$${price}`
  if (price >= 0.01) return `$${price.toFixed(2)}`
  return `$${price}`
}

/**
 * Convierte coordenada log a pixel.
 */
export function logToPixel(
  value: number,
  minLog: number,
  maxLog: number,
  pixelMin: number,
  pixelMax: number,
): number {
  const logVal = Math.log10(Math.max(value, 1e-10))
  const t = (logVal - minLog) / (maxLog - minLog)
  return pixelMin + t * (pixelMax - pixelMin)
}
