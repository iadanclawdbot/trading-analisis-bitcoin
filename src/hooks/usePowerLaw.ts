import { useMemo } from 'react'
import type { MergedDataPoint } from '../types'
import type { RegressionResult, PowerLawBands } from '../types'
import { computeRegression, generateBands } from '../lib/math/regression'

export interface UsePowerLawResult {
  regression: RegressionResult | null
  bands: PowerLawBands | null
}

export function usePowerLaw(data: MergedDataPoint[]): UsePowerLawResult {
  return useMemo(() => {
    if (data.length < 50) return { regression: null, bands: null }
    const regression = computeRegression(data)
    if (!regression) return { regression: null, bands: null }
    const bands = generateBands(data, regression)
    return { regression, bands }
  }, [data])
}
