export const MarketPhase = {
  ACCUMULATION: 'accumulation',
  BULLISH: 'bullish',
  DISTRIBUTION: 'distribution',
  BEARISH: 'bearish',
} as const
export type MarketPhase = (typeof MarketPhase)[keyof typeof MarketPhase]

export interface PhaseSegment {
  startIndex: number
  endIndex: number
  phase: MarketPhase
  startDate?: string
  endDate?: string
}

export const SignalType = {
  STRONG_BUY: 'strong_buy',
  BUY: 'buy',
  HOLD: 'hold',
  SELL: 'sell',
  STRONG_SELL: 'strong_sell',
} as const
export type SignalType = (typeof SignalType)[keyof typeof SignalType]

export interface TradingSignal {
  signal: SignalType
  confidence: number // 0-100
  reasoning: string
  zScore: number
  phase: MarketPhase
  percentile: number
}

export interface ResidualData {
  values: number[] // residuos log10 de cada punto filtrado
  zScores: number[] // residuo / sigma
  timestamps: number[] // timestamps correspondientes
  currentResidual: number
  currentZScore: number
  percentile: number
}

export interface MarketPhaseResult {
  phases: MarketPhase[] // fase para cada punto de la senal reconstruida
  currentPhase: MarketPhase
  derivative: Float64Array
  segments: PhaseSegment[]
}

export interface NextPeakForecast {
  estimatedDate: string
  estimatedPrice: number
  daysRemaining: number
}
