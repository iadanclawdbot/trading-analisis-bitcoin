export const COLORS = {
  bg: '#020617',
  surface: '#0f172a',
  surface2: '#1e293b',
  border: '#1e293b',
  border2: '#334155',
  text: '#f8fafc',
  muted: '#94a3b8',
  orange: '#f97316',
  orangeDim: '#7c3f0a',
  green: '#22c55e',
  greenDim: '#14532d',
  red: '#ef4444',
  redDim: '#7f1d1d',
  blue: '#3b82f6',
  blueDim: '#1e3a5f',
  violet: '#8b5cf6',
  teal: '#14b8a6',
  amber: '#f59e0b',
  pink: '#ec4899',
  indigo: '#6366f1',
} as const

export const HARMONIC_COLORS = [
  COLORS.orange,
  COLORS.blue,
  COLORS.green,
  COLORS.violet,
  COLORS.pink,
  COLORS.teal,
  COLORS.amber,
  COLORS.indigo,
]

export const PHASE_COLORS: Record<string, string> = {
  accumulation: COLORS.blue,
  bullish: COLORS.green,
  distribution: COLORS.orange,
  bearish: COLORS.red,
}

export const SIGNAL_COLORS: Record<string, string> = {
  strong_buy: COLORS.green,
  buy: '#86efac',
  hold: COLORS.muted,
  sell: '#fca5a5',
  strong_sell: COLORS.red,
}

// Tema para lightweight-charts (sin crosshair.vertLine.width que es LineWidth, no number)
export const CHART_THEME = {
  layout: {
    background: { color: '#0f172a' },
    textColor: '#94a3b8',
    fontSize: 11,
    fontFamily: '"JetBrains Mono", monospace',
  },
  grid: {
    vertLines: { color: '#1e293b' },
    horzLines: { color: '#1e293b' },
  },
  timeScale: {
    borderColor: '#1e293b',
  },
  rightPriceScale: {
    borderColor: '#1e293b',
  },
}
