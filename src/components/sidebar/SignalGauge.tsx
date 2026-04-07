import { SignalType } from '../../types/market'
import type { TradingSignal } from '../../types/market'
import { SIGNAL_COLORS, COLORS } from '../../constants/theme'

const LABELS: Record<SignalType, string> = {
  [SignalType.STRONG_BUY]: 'COMPRA FUERTE',
  [SignalType.BUY]: 'COMPRA',
  [SignalType.HOLD]: 'HOLD',
  [SignalType.SELL]: 'VENTA',
  [SignalType.STRONG_SELL]: 'VENTA FUERTE',
}

interface Props {
  signal: TradingSignal | null
}

export function SignalGauge({ signal }: Props) {
  if (!signal) {
    return (
      <div className="px-3 py-4 border-b border-btc-border">
        <p className="text-xs font-mono uppercase tracking-widest text-btc-muted mb-2">Señal</p>
        <div className="h-12 bg-btc-surface-2 animate-pulse" />
      </div>
    )
  }

  const color = SIGNAL_COLORS[signal.signal] ?? COLORS.muted

  return (
    <div className="px-3 py-4 border-b border-btc-border">
      <p className="text-xs font-mono uppercase tracking-widest text-btc-muted mb-2">Señal</p>
      <div
        className="px-3 py-3 border text-center"
        style={{ borderColor: color + '40', backgroundColor: color + '15' }}
      >
        <p
          className="text-base font-mono font-bold uppercase tracking-widest"
          style={{ color }}
        >
          {LABELS[signal.signal]}
        </p>
        <p className="text-xs font-mono text-btc-muted mt-1">{signal.confidence}% confianza</p>
      </div>
      <p className="text-xs font-mono text-btc-muted mt-2 leading-relaxed">{signal.reasoning}</p>
    </div>
  )
}
