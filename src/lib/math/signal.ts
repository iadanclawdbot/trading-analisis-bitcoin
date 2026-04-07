import { MarketPhase, SignalType } from '../../types/market'
import type { TradingSignal } from '../../types/market'
import { lerp } from './utils'

export function generateTradingSignal(
  zScore: number,
  phase: MarketPhase,
  percentile: number,
): TradingSignal {
  // Senales fuertes basadas solo en z-score
  if (zScore < -1.5) {
    return {
      signal: SignalType.STRONG_BUY,
      confidence: 95,
      reasoning: 'Precio muy por debajo del valor justo (−1.5σ)',
      zScore,
      phase,
      percentile,
    }
  }

  if (zScore > 1.5) {
    return {
      signal: SignalType.STRONG_SELL,
      confidence: 95,
      reasoning: 'Precio muy por encima del valor justo (+1.5σ)',
      zScore,
      phase,
      percentile,
    }
  }

  // Senales moderadas combinando z-score + fase
  const isFavorable = phase === MarketPhase.ACCUMULATION || phase === MarketPhase.BULLISH
  const isUnfavorable = phase === MarketPhase.DISTRIBUTION || phase === MarketPhase.BEARISH

  if (zScore < 0 && isFavorable) {
    const confidence = Math.round(lerp(60, 75, Math.abs(zScore) / 1.5))
    return {
      signal: SignalType.BUY,
      confidence,
      reasoning: `Por debajo del valor justo en fase ${phaseLabel(phase)}`,
      zScore,
      phase,
      percentile,
    }
  }

  if (zScore > 1.0 && phase === MarketPhase.DISTRIBUTION) {
    return {
      signal: SignalType.SELL,
      confidence: 75,
      reasoning: 'Significativamente sobre el valor justo en distribución',
      zScore,
      phase,
      percentile,
    }
  }

  if (zScore > 0.5 && isUnfavorable) {
    const confidence = Math.round(lerp(60, 75, Math.min((zScore - 0.5) / 1.0, 1)))
    return {
      signal: SignalType.SELL,
      confidence,
      reasoning: `Sobre el valor justo en fase ${phaseLabel(phase)}`,
      zScore,
      phase,
      percentile,
    }
  }

  // Cubrir el gap: Distribution con z-score levemente positivo (0 < z <= 0.5)
  if (zScore > 0 && phase === MarketPhase.DISTRIBUTION) {
    return {
      signal: SignalType.SELL,
      confidence: Math.round(lerp(55, 60, zScore / 0.5)),
      reasoning: 'Sobre el valor justo en fase de distribución',
      zScore,
      phase,
      percentile,
    }
  }

  // Cubrir el gap: Bearish con z-score levemente negativo (-0.5 <= z < 0)
  if (zScore < 0 && phase === MarketPhase.BEARISH) {
    return {
      signal: SignalType.BUY,
      confidence: Math.round(lerp(55, 60, Math.abs(zScore) / 0.5)),
      reasoning: 'Debajo del valor justo en fase bajista',
      zScore,
      phase,
      percentile,
    }
  }

  return {
    signal: SignalType.HOLD,
    confidence: 50,
    reasoning: 'Sin señal clara — mantener posición',
    zScore,
    phase,
    percentile,
  }
}

function phaseLabel(phase: MarketPhase): string {
  const labels: Record<MarketPhase, string> = {
    [MarketPhase.ACCUMULATION]: 'acumulación',
    [MarketPhase.BULLISH]: 'alcista',
    [MarketPhase.DISTRIBUTION]: 'distribución',
    [MarketPhase.BEARISH]: 'bajista',
  }
  return labels[phase] ?? phase
}
