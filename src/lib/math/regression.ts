import type { MergedDataPoint } from '../../types'
import type { RegressionResult, PowerLawBands, PowerLawPoint } from '../../types'
import { REGRESSION_MIN_DAY, GENESIS_TIMESTAMP, DAY_MS, dateKeyFromTimestamp } from '../../constants/bitcoin'
import { SIGMA_BANDS, PROJECTION_DAYS } from '../../constants/math'
import { log10, isFinitePositive } from './utils'

interface FilteredPoint {
  dayIndex: number
  logDay: number
  logPrice: number
  timestamp: number
}

function filterData(data: MergedDataPoint[]): FilteredPoint[] {
  return data
    .filter((d) => d.dayIndex > REGRESSION_MIN_DAY && isFinitePositive(d.price))
    .map((d) => ({
      dayIndex: d.dayIndex,
      logDay: log10(d.dayIndex),
      logPrice: log10(d.price),
      timestamp: d.timestamp,
    }))
}

export function computeRegression(data: MergedDataPoint[]): RegressionResult | null {
  const pts = filterData(data)
  if (pts.length < 50) return null

  const N = pts.length
  let sumX = 0, sumY = 0, sumXX = 0, sumXY = 0, sumYY = 0

  for (const p of pts) {
    sumX += p.logDay
    sumY += p.logPrice
    sumXX += p.logDay * p.logDay
    sumXY += p.logDay * p.logPrice
    sumYY += p.logPrice * p.logPrice
  }

  const meanX = sumX / N
  const meanY = sumY / N
  const Sxx = sumXX - N * meanX * meanX
  const Sxy = sumXY - N * meanX * meanY
  const Syy = sumYY - N * meanY * meanY

  if (Sxx === 0) return null

  const slope = Sxy / Sxx
  const intercept = meanY - slope * meanX
  const rSquared = clampR2((Sxy * Sxy) / (Sxx * Syy))
  const C = Math.pow(10, intercept)

  // Calcular sigma sobre los residuos
  const residuals = pts.map((p) => p.logPrice - (slope * p.logDay + intercept))
  const sigma = Math.sqrt(residuals.reduce((acc, r) => acc + r * r, 0) / N)

  return { slope, intercept, C, rSquared, sigma, filteredCount: N }
}

function clampR2(v: number): number {
  return Math.max(0, Math.min(1, isFinite(v) ? v : 0))
}

export function computeFairValue(dayIndex: number, reg: RegressionResult): number {
  return Math.pow(10, reg.slope * log10(dayIndex) + reg.intercept)
}

export function generateBands(
  data: MergedDataPoint[],
  reg: RegressionResult,
): PowerLawBands {
  const today = Date.now()
  const lastDay = Math.floor((today - GENESIS_TIMESTAMP) / DAY_MS)
  const endDay = lastDay + PROJECTION_DAYS

  const fairValue: PowerLawPoint[] = []
  const support: PowerLawPoint[] = []
  const resistance: PowerLawPoint[] = []

  // Una muestra cada 7 dias para la linea historica
  const pts = filterData(data)
  const daySet = new Set(pts.map((p) => p.dayIndex))

  // Historico: cada 7 dias desde REGRESSION_MIN_DAY
  for (let d = REGRESSION_MIN_DAY + 1; d <= lastDay; d += 7) {
    addBandPoint(d, reg, fairValue, support, resistance)
  }
  // Asegurar el ultimo dia real
  if (lastDay > REGRESSION_MIN_DAY) {
    addBandPoint(lastDay, reg, fairValue, support, resistance)
  }

  // Proyeccion: cada 14 dias
  for (let d = lastDay + 14; d <= endDay; d += 14) {
    addBandPoint(d, reg, fairValue, support, resistance)
  }

  void daySet
  return { fairValue, support, resistance }
}

function addBandPoint(
  dayIndex: number,
  reg: RegressionResult,
  fairValue: PowerLawPoint[],
  support: PowerLawPoint[],
  resistance: PowerLawPoint[],
): void {
  const logDay = log10(dayIndex)
  const logFair = reg.slope * logDay + reg.intercept
  const ts = GENESIS_TIMESTAMP + dayIndex * DAY_MS
  const date = dateKeyFromTimestamp(ts)

  fairValue.push({ timestamp: ts, dayIndex, date, fairValue: Math.pow(10, logFair), supportValue: 0, resistanceValue: 0 })
  support.push({ timestamp: ts, dayIndex, date, fairValue: 0, supportValue: Math.pow(10, logFair - SIGMA_BANDS * reg.sigma), resistanceValue: 0 })
  resistance.push({ timestamp: ts, dayIndex, date, fairValue: 0, supportValue: 0, resistanceValue: Math.pow(10, logFair + SIGMA_BANDS * reg.sigma) })
}
