import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { DashboardContext } from './DashboardContext'
import { useBtcData } from '../hooks/useBtcData'
import { useCurrentPrice } from '../hooks/useCurrentPrice'
import { usePowerLaw } from '../hooks/usePowerLaw'
import { useResiduals } from '../hooks/useResiduals'
import { useFourier } from '../hooks/useFourier'
import { useMarketPhase } from '../hooks/useMarketPhase'
import { updateCurrentPrice } from '../lib/data/merge'

interface Props {
  children: ReactNode
}

export function DashboardProvider({ children }: Props) {
  const { data: rawData, status, lastUpdated, error: dataError } = useBtcData()
  const currentPrice = useCurrentPrice()

  // Actualizar datos con precio actual en vivo
  const data = useMemo(() => {
    if (currentPrice && currentPrice.price > 0) {
      return updateCurrentPrice(rawData, currentPrice.price, currentPrice.timestamp)
    }
    return rawData
  }, [rawData, currentPrice])

  const { regression, bands } = usePowerLaw(data)
  const residuals = useResiduals(data, regression)
  const fourier = useFourier(residuals)
  const { phaseResult, tradingSignal } = useMarketPhase(fourier.reconstructed, residuals)

  const value = useMemo(
    () => ({
      data,
      status,
      lastUpdated,
      currentPrice,
      dataError,
      regression,
      bands,
      residuals,
      fourierResult: fourier.fourierResult,
      reconstructed: fourier.reconstructed,
      phaseResult,
      tradingSignal,
      fourier,
    }),
    [
      data, status, lastUpdated, currentPrice, dataError,
      regression, bands, residuals, fourier,
      phaseResult, tradingSignal,
    ],
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}
