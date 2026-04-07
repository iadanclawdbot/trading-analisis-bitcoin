/**
 * Utilidades para ejes logarítmicos en Canvas 2D
 * Soporta zoom adaptivo: años → meses → semanas → días
 */

export interface LogTick {
  value: number
  label: string
}

export interface DayTick {
  dayIndex: number
  label: string
  year: number
}

const GENESIS_MS = Date.UTC(2009, 0, 3) // 3 de enero 2009 UTC
const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

/**
 * Genera ticks para un eje Y logarítmico de precios.
 * Se adapta al nivel de zoom con multipliers más finos.
 */
export function generatePriceTicks(minPrice: number, maxPrice: number): LogTick[] {
  const logRange = Math.log10(maxPrice) - Math.log10(minPrice)

  // Rango muy estrecho: usar ticks lineales
  if (logRange < 0.1) {
    return generateLinearPriceTicks(minPrice, maxPrice)
  }

  const ticks: LogTick[] = []
  const minExp = Math.floor(Math.log10(Math.max(minPrice, 0.001)))
  const maxExp = Math.ceil(Math.log10(maxPrice))

  let multipliers: number[]
  if (logRange > 2) {
    multipliers = [1, 2, 5]
  } else if (logRange > 0.5) {
    multipliers = [1, 1.5, 2, 3, 5, 7]
  } else {
    multipliers = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9]
  }

  for (let exp = minExp; exp <= maxExp; exp++) {
    const base = Math.pow(10, exp)
    for (const mult of multipliers) {
      const val = base * mult
      if (val >= minPrice * 0.8 && val <= maxPrice * 1.2) {
        ticks.push({ value: val, label: formatPriceLabel(val) })
      }
    }
  }

  return ticks
}

/**
 * Ticks lineales para rangos de precio muy estrechos (ej: $67K-$69K).
 */
function generateLinearPriceTicks(minPrice: number, maxPrice: number): LogTick[] {
  const range = maxPrice - minPrice
  const rawInterval = range / 5
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)))
  const normalized = rawInterval / magnitude
  let interval: number
  if (normalized < 1.5) interval = magnitude
  else if (normalized < 3.5) interval = 2 * magnitude
  else if (normalized < 7.5) interval = 5 * magnitude
  else interval = 10 * magnitude

  const ticks: LogTick[] = []
  const start = Math.ceil(minPrice / interval) * interval
  for (let val = start; val <= maxPrice * 1.01; val += interval) {
    ticks.push({ value: val, label: formatPriceLabel(val) })
  }
  return ticks
}

/**
 * Genera ticks para el eje X adaptivos al nivel de zoom.
 * Años → Meses → Semanas → Días
 */
export function generateDayTicks(minDay: number, maxDay: number): DayTick[] {
  const dayRange = maxDay - minDay

  if (dayRange > 730) return generateYearTicks(minDay, maxDay)
  if (dayRange > 60) return generateMonthTicks(minDay, maxDay)
  if (dayRange > 14) return generateWeekTicks(minDay, maxDay)
  return generateDailyTicks(minDay, maxDay)
}

function generateYearTicks(minDay: number, maxDay: number): DayTick[] {
  const ticks: DayTick[] = []
  const startYear = new Date(GENESIS_MS + minDay * 86400000).getUTCFullYear()
  const endYear = new Date(GENESIS_MS + maxDay * 86400000).getUTCFullYear()

  for (let year = startYear; year <= endYear + 1; year++) {
    const dayIndex = Math.floor((Date.UTC(year, 0, 1) - GENESIS_MS) / 86400000)
    if (dayIndex >= minDay * 0.8 && dayIndex <= maxDay * 1.2) {
      ticks.push({ dayIndex, label: String(year), year })
    }
  }
  return ticks
}

function generateMonthTicks(minDay: number, maxDay: number): DayTick[] {
  const ticks: DayTick[] = []
  const startDate = new Date(GENESIS_MS + minDay * 86400000)
  const endDate = new Date(GENESIS_MS + maxDay * 86400000)

  let year = startDate.getUTCFullYear()
  let month = startDate.getUTCMonth()
  const endMs = endDate.getTime() + 32 * 86400000

  while (Date.UTC(year, month, 1) <= endMs) {
    const dayIdx = Math.floor((Date.UTC(year, month, 1) - GENESIS_MS) / 86400000)
    if (dayIdx >= minDay - 30 && dayIdx <= maxDay + 30) {
      const label = month === 0
        ? String(year)
        : `${MONTH_NAMES[month]} ${String(year).slice(2)}`
      ticks.push({ dayIndex: dayIdx, label, year })
    }
    month++
    if (month > 11) { month = 0; year++ }
  }
  return ticks
}

function generateWeekTicks(minDay: number, maxDay: number): DayTick[] {
  const ticks: DayTick[] = []
  const startDay = Math.floor(minDay)
  const startDate = new Date(GENESIS_MS + startDay * 86400000)
  const dow = startDate.getUTCDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow

  for (let di = startDay + mondayOffset; di <= maxDay + 7; di += 7) {
    if (di < minDay - 7) continue
    const date = new Date(GENESIS_MS + di * 86400000)
    const label = `${date.getUTCDate()} ${MONTH_NAMES[date.getUTCMonth()]}`
    ticks.push({ dayIndex: di, label, year: date.getUTCFullYear() })
  }
  return ticks
}

function generateDailyTicks(minDay: number, maxDay: number): DayTick[] {
  const ticks: DayTick[] = []
  for (let di = Math.floor(minDay); di <= Math.ceil(maxDay); di++) {
    const date = new Date(GENESIS_MS + di * 86400000)
    const label = `${date.getUTCDate()} ${MONTH_NAMES[date.getUTCMonth()]} ${String(date.getUTCFullYear()).slice(2)}`
    ticks.push({ dayIndex: di, label, year: date.getUTCFullYear() })
  }
  return ticks
}

function formatPriceLabel(price: number): string {
  if (price >= 1_000_000) {
    const v = price / 1_000_000
    if (v >= 100) return `$${Math.round(v)}M`
    return `$${+v.toFixed(v >= 10 ? 0 : 1)}M`
  }
  if (price >= 1_000) {
    const v = price / 1_000
    if (v >= 100) return `$${Math.round(v)}K`
    return `$${+v.toFixed(v >= 10 ? 1 : 2)}K`
  }
  if (price >= 100) return `$${Math.round(price)}`
  if (price >= 1) return `$${+price.toFixed(1)}`
  if (price >= 0.01) return `$${+price.toFixed(2)}`
  return `$${price.toPrecision(2)}`
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
