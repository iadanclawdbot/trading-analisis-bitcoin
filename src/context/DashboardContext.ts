import { createContext, useContext } from 'react'
import type { MergedDataPoint, DataStatus, CurrentPriceData } from '../types'
import type { RegressionResult, PowerLawBands } from '../types'
import type { FourierResult, ReconstructedSignal } from '../types'
import type { ResidualData, MarketPhaseResult, TradingSignal } from '../types/market'
import type { UseFourierResult } from '../hooks/useFourier'

export interface DashboardContextValue {
  // Datos
  data: MergedDataPoint[]
  status: DataStatus
  lastUpdated: Date | null
  currentPrice: CurrentPriceData | null
  dataError: string | null

  // Computados
  regression: RegressionResult | null
  bands: PowerLawBands | null
  residuals: ResidualData | null
  fourierResult: FourierResult | null
  reconstructed: ReconstructedSignal | null
  phaseResult: MarketPhaseResult | null
  tradingSignal: TradingSignal | null

  // Fourier interactivo
  fourier: UseFourierResult
}

export const DashboardContext = createContext<DashboardContextValue | null>(null)

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard debe usarse dentro de DashboardProvider')
  return ctx
}
