import { useMemo } from 'react'
import type { ReconstructedSignal } from '../types'
import type { ResidualData, MarketPhaseResult, TradingSignal } from '../types/market'
import { detectMarketPhases } from '../lib/math/market-phase'
import { generateTradingSignal } from '../lib/math/signal'
import { MarketPhase } from '../types/market'

export interface UseMarketPhaseResult {
  phaseResult: MarketPhaseResult | null
  tradingSignal: TradingSignal | null
}

export function useMarketPhase(
  reconstructed: ReconstructedSignal | null,
  residuals: ResidualData | null,
): UseMarketPhaseResult {
  return useMemo(() => {
    if (!reconstructed || !residuals) return { phaseResult: null, tradingSignal: null }

    const phaseResult = detectMarketPhases(reconstructed.values)
    const signal = generateTradingSignal(
      residuals.currentZScore,
      phaseResult.currentPhase ?? MarketPhase.ACCUMULATION,
      residuals.percentile,
    )

    return { phaseResult, tradingSignal: signal }
  }, [reconstructed, residuals])
}
