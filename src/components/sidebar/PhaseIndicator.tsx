import { MarketPhase } from '../../types/market'
import { PHASE_COLORS } from '../../constants/theme'

const PHASE_LABELS: Record<MarketPhase, string> = {
  [MarketPhase.ACCUMULATION]: 'Acumulación',
  [MarketPhase.BULLISH]: 'Alcista',
  [MarketPhase.DISTRIBUTION]: 'Distribución',
  [MarketPhase.BEARISH]: 'Bajista',
}

const PHASE_DESC: Record<MarketPhase, string> = {
  [MarketPhase.ACCUMULATION]: 'Señal debajo de cero, subiendo',
  [MarketPhase.BULLISH]: 'Señal positiva, subiendo',
  [MarketPhase.DISTRIBUTION]: 'Señal positiva, bajando',
  [MarketPhase.BEARISH]: 'Señal debajo de cero, bajando',
}

interface Props {
  phase: MarketPhase | null
}

export function PhaseIndicator({ phase }: Props) {
  const phases = [
    MarketPhase.ACCUMULATION,
    MarketPhase.BULLISH,
    MarketPhase.DISTRIBUTION,
    MarketPhase.BEARISH,
  ]

  return (
    <div className="px-3 py-3 border-b border-btc-border">
      <p className="text-xs font-mono uppercase tracking-widest text-btc-muted mb-2">Fase de Mercado</p>
      <div className="space-y-1">
        {phases.map((p) => {
          const isActive = p === phase
          const color = PHASE_COLORS[p]
          return (
            <div
              key={p}
              className="flex items-center gap-2 px-2 py-1 transition-all"
              style={isActive ? { backgroundColor: color + '20' } : {}}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: isActive ? color : '#334155' }}
              />
              <div>
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color: isActive ? color : '#94a3b8' }}
                >
                  {PHASE_LABELS[p]}
                </span>
                {isActive && (
                  <p className="text-xs font-mono text-btc-muted">{PHASE_DESC[p]}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
