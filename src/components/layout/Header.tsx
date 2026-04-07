import { useDashboard } from '../../context/DashboardContext'
import { SignalType, MarketPhase } from '../../types/market'
import { formatPrice } from '../../lib/math/utils'
import { SIGNAL_COLORS, PHASE_COLORS, COLORS } from '../../constants/theme'

const SIGNAL_LABELS: Record<SignalType, string> = {
  [SignalType.STRONG_BUY]: 'COMPRA FUERTE',
  [SignalType.BUY]: 'COMPRA',
  [SignalType.HOLD]: 'HOLD',
  [SignalType.SELL]: 'VENTA',
  [SignalType.STRONG_SELL]: 'VENTA FUERTE',
}

const PHASE_LABELS: Record<MarketPhase, string> = {
  [MarketPhase.ACCUMULATION]: 'ACUMULACIÓN',
  [MarketPhase.BULLISH]: 'ALCISTA',
  [MarketPhase.DISTRIBUTION]: 'DISTRIBUCIÓN',
  [MarketPhase.BEARISH]: 'BAJISTA',
}

export function Header() {
  const { tradingSignal, currentPrice, phaseResult, status } = useDashboard()

  const price = currentPrice?.price ?? null
  const change24h = currentPrice?.change24h ?? null
  const signal = tradingSignal?.signal ?? SignalType.HOLD
  const confidence = tradingSignal?.confidence ?? 50
  const phase = phaseResult?.currentPhase ?? MarketPhase.ACCUMULATION

  const signalColor = SIGNAL_COLORS[signal] ?? COLORS.muted
  const phaseColor = PHASE_COLORS[phase] ?? COLORS.muted

  return (
    <header className="h-16 flex items-center justify-between px-4 bg-btc-surface border-b border-btc-border flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-btc-orange-dim flex items-center justify-center">
          <span className="text-btc-orange font-bold text-sm font-mono">₿</span>
        </div>
        <div>
          <p className="text-xs font-mono font-bold text-btc-text uppercase tracking-widest leading-none">
            Power Law
          </p>
          <p className="text-xs font-mono text-btc-muted leading-none mt-0.5">Dashboard</p>
        </div>
      </div>

      {/* Senal */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span
            className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 border"
            style={{ color: signalColor, borderColor: signalColor + '40', backgroundColor: signalColor + '15' }}
          >
            {SIGNAL_LABELS[signal]}
          </span>
          <span className="text-xs font-mono text-btc-muted mt-0.5">{confidence}% confianza</span>
        </div>
      </div>

      {/* Precio + Fase */}
      <div className="flex items-center gap-6">
        {/* Precio */}
        <div className="text-right">
          <p className="text-lg font-mono font-bold text-btc-orange tabular-nums">
            {price ? formatPrice(price) : '—'}
          </p>
          {change24h !== null && (
            <p
              className="text-xs font-mono tabular-nums"
              style={{ color: change24h >= 0 ? COLORS.green : COLORS.red }}
            >
              {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% 24h
            </p>
          )}
        </div>

        {/* Fase */}
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: phaseColor }}
          />
          <div>
            <p
              className="text-xs font-mono font-semibold uppercase tracking-widest"
              style={{ color: phaseColor }}
            >
              {PHASE_LABELS[phase]}
            </p>
            <p className="text-xs font-mono text-btc-muted">
              {status === 'loading' ? 'Cargando...' : status === 'partial' ? 'Datos parciales' : 'En vivo'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
