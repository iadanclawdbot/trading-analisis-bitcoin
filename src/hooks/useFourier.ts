import { useMemo, useState, useCallback } from 'react'
import type { FourierResult, ReconstructedSignal } from '../types'
import type { ResidualData } from '../types/market'
import { analyzeFourier, buildReconstructedSignal } from '../lib/math/fourier-analysis'

export interface UseFourierResult {
  fourierResult: FourierResult | null
  reconstructed: ReconstructedSignal | null
  enabledBins: Set<number>
  topComponents: FourierResult['topComponents']
  toggleBin: (bin: number) => void
  enableAll: () => void
  disableAll: () => void
}

export function useFourier(residuals: ResidualData | null): UseFourierResult {
  const fourierResult = useMemo(() => {
    if (!residuals || residuals.values.length < 32) return null
    return analyzeFourier(residuals.values)
  }, [residuals])

  const [enabledBins, setEnabledBins] = useState<Set<number>>(() => new Set())

  // Sincronizar enabledBins cuando cambia fourierResult
  const allBins = useMemo(
    () => new Set(fourierResult?.topComponents.map((c) => c.bin) ?? []),
    [fourierResult],
  )

  // Inicializar con todos activos cuando llega fourierResult nuevo
  useMemo(() => {
    if (fourierResult) {
      setEnabledBins(new Set(fourierResult.topComponents.map((c) => c.bin)))
    }
  }, [fourierResult])

  const reconstructed = useMemo(() => {
    if (!fourierResult || enabledBins.size === 0) return null
    return buildReconstructedSignal(fourierResult, enabledBins)
  }, [fourierResult, enabledBins])

  const toggleBin = useCallback((bin: number) => {
    setEnabledBins((prev) => {
      const next = new Set(prev)
      if (next.has(bin)) next.delete(bin)
      else next.add(bin)
      return next
    })
  }, [])

  const enableAll = useCallback(() => setEnabledBins(new Set(allBins)), [allBins])
  const disableAll = useCallback(() => setEnabledBins(new Set()), [])

  const topComponents = fourierResult?.topComponents ?? []
  return { fourierResult, reconstructed, enabledBins, topComponents, toggleBin, enableAll, disableAll }
}
