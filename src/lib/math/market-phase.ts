import { MarketPhase } from '../../types/market'
import type { MarketPhaseResult, PhaseSegment } from '../../types/market'

export function detectMarketPhases(signal: Float64Array): MarketPhaseResult {
  const L = signal.length

  // Derivada numerica con diferencias centrales
  const derivative = new Float64Array(L)
  if (L > 1) {
    derivative[0] = signal[1] - signal[0]
    for (let i = 1; i < L - 1; i++) {
      derivative[i] = (signal[i + 1] - signal[i - 1]) / 2
    }
    derivative[L - 1] = signal[L - 1] - signal[L - 2]
  }

  const phases: MarketPhase[] = new Array(L)
  for (let i = 0; i < L; i++) {
    const s = signal[i]
    const d = derivative[i]
    if (s <= 0 && d >= 0) phases[i] = MarketPhase.ACCUMULATION
    else if (s > 0 && d >= 0) phases[i] = MarketPhase.BULLISH
    else if (s > 0 && d < 0) phases[i] = MarketPhase.DISTRIBUTION
    else phases[i] = MarketPhase.BEARISH
  }

  const currentPhase = phases[L - 1] ?? MarketPhase.ACCUMULATION
  const segments = buildSegments(phases)

  return { phases, currentPhase, derivative, segments }
}

function buildSegments(phases: MarketPhase[]): PhaseSegment[] {
  const segments: PhaseSegment[] = []
  if (phases.length === 0) return segments

  let currentPhase = phases[0]
  let startIndex = 0

  for (let i = 1; i < phases.length; i++) {
    if (phases[i] !== currentPhase) {
      segments.push({ startIndex, endIndex: i - 1, phase: currentPhase })
      currentPhase = phases[i]
      startIndex = i
    }
  }
  segments.push({ startIndex, endIndex: phases.length - 1, phase: currentPhase })
  return segments
}
