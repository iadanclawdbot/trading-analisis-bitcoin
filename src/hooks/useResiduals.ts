import { useMemo } from 'react'
import type { MergedDataPoint } from '../types'
import type { RegressionResult } from '../types'
import type { ResidualData } from '../types/market'
import { computeResiduals } from '../lib/math/residuals'

export function useResiduals(
  data: MergedDataPoint[],
  regression: RegressionResult | null,
): ResidualData | null {
  return useMemo(() => {
    if (!regression || data.length === 0) return null
    return computeResiduals(data, regression)
  }, [data, regression])
}
