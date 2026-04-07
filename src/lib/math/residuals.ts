import type { MergedDataPoint } from '../../types'
import type { RegressionResult } from '../../types/regression'
import type { ResidualData } from '../../types/market'
import { REGRESSION_MIN_DAY } from '../../constants/bitcoin'
import { log10, isFinitePositive, percentileRank } from './utils'

export function computeResiduals(
  data: MergedDataPoint[],
  reg: RegressionResult,
): ResidualData {
  const filtered = data.filter(
    (d) => d.dayIndex > REGRESSION_MIN_DAY && isFinitePositive(d.price),
  )

  const values: number[] = []
  const zScores: number[] = []
  const timestamps: number[] = []

  for (const d of filtered) {
    const logDay = log10(d.dayIndex)
    const logPricePredicted = reg.slope * logDay + reg.intercept
    const logPriceActual = log10(d.price)
    const residual = logPriceActual - logPricePredicted
    const z = reg.sigma > 0 ? residual / reg.sigma : 0

    values.push(residual)
    zScores.push(z)
    timestamps.push(d.timestamp)
  }

  const currentResidual = values[values.length - 1] ?? 0
  const currentZScore = zScores[zScores.length - 1] ?? 0

  // Percentil historico
  const sorted = [...values].sort((a, b) => a - b)
  const percentile = percentileRank(currentResidual, sorted)

  return {
    values,
    zScores,
    timestamps,
    currentResidual,
    currentZScore,
    percentile,
  }
}
