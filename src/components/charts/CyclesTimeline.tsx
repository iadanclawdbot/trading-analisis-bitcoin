import { useDashboard } from '../../context/DashboardContext'
import { MarketPhase } from '../../types/market'
import { PHASE_COLORS, COLORS } from '../../constants/theme'
import { HALVINGS, BUBBLE_PEAKS, BEAR_BOTTOMS, GENESIS_TIMESTAMP, DAY_MS } from '../../constants/bitcoin'
import { computeFairValue } from '../../lib/math/regression'
import { formatPrice } from '../../lib/math/utils'

const PHASE_LABELS: Record<MarketPhase, string> = {
  [MarketPhase.ACCUMULATION]: 'Acumulación',
  [MarketPhase.BULLISH]: 'Alcista',
  [MarketPhase.DISTRIBUTION]: 'Distribución',
  [MarketPhase.BEARISH]: 'Bajista',
}

export function CyclesTimeline() {
  const { phaseResult, reconstructed, regression, residuals } = useDashboard()

  // Pronostico del proximo pico
  let nextPeak: { date: string; price: number; daysRemaining: number } | null = null
  if (reconstructed && regression && residuals) {
    const projStart = reconstructed.projectionStartIndex
    const signal = reconstructed.values
    // Buscar proximo maximo en la proyeccion
    let maxVal = -Infinity
    let maxIdx = projStart
    for (let i = projStart; i < signal.length - 1; i++) {
      if (signal[i] > maxVal && signal[i] > signal[i - 1] && signal[i] > signal[i + 1]) {
        maxVal = signal[i]
        maxIdx = i
        break // primer pico local
      }
    }
    if (maxIdx > projStart) {
      // lastDayIndex = dia del ultimo punto de datos reales
      const lastDayIndex = residuals.timestamps.length > 0
        ? Math.floor((residuals.timestamps[residuals.timestamps.length - 1] - GENESIS_TIMESTAMP) / DAY_MS)
        : 5000
      const peakDayIndex = lastDayIndex + (maxIdx - projStart)
      const peakTs = GENESIS_TIMESTAMP + peakDayIndex * DAY_MS
      const peakDate = new Date(peakTs).toISOString().slice(0, 10)
      const daysRemaining = peakDayIndex - lastDayIndex
      const peakFairValue = computeFairValue(peakDayIndex, regression)
      // El precio estimado del pico: fair value + 1.5 sigma (distribución típica)
      const estimatedPrice = peakFairValue * Math.pow(10, 1.2 * regression.sigma)
      nextPeak = { date: peakDate, price: estimatedPrice, daysRemaining }
    }
  }

  return (
    <div className="flex flex-col h-full p-3 gap-4 overflow-y-auto">
      {/* Pronostico */}
      {nextPeak && (
        <div className="border border-btc-border-2 p-3">
          <p className="text-xs font-mono uppercase tracking-widest text-btc-muted mb-2">
            Próximo Pico Estimado
          </p>
          <p className="text-base font-mono font-bold text-btc-orange tabular-nums">
            {formatPrice(nextPeak.price)}
          </p>
          <p className="text-xs font-mono text-btc-muted">
            {nextPeak.date} · {nextPeak.daysRemaining} días restantes
          </p>
          <p className="text-xs font-mono text-btc-muted/50 mt-1">
            ⚠️ Estimación especulativa basada en ciclos de Fourier
          </p>
        </div>
      )}

      {/* Barra de fases */}
      {phaseResult && (
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-btc-muted mb-2">Fases del Ciclo</p>
          {/* Barra horizontal coloreada por segmentos */}
          <div className="flex h-4 w-full overflow-hidden mb-2">
            {phaseResult.segments.slice(-50).map((seg, i) => {
              const len = seg.endIndex - seg.startIndex + 1
              const color = PHASE_COLORS[seg.phase]
              return (
                <div
                  key={i}
                  style={{ flex: len, backgroundColor: color + '80', minWidth: 1 }}
                  title={`${PHASE_LABELS[seg.phase]} (${len} días)`}
                />
              )
            })}
          </div>
          {/* Leyenda */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(PHASE_LABELS).map(([key, label]) => (
              <span key={key} className="flex items-center gap-1 text-xs font-mono text-btc-muted">
                <span
                  className="w-2 h-2 inline-block"
                  style={{ backgroundColor: PHASE_COLORS[key as MarketPhase] }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Eventos historicos */}
      <div className="flex-1">
        <p className="text-xs font-mono uppercase tracking-widest text-btc-muted mb-2">
          Eventos Históricos
        </p>
        <div className="space-y-1">
          {/* Halvings */}
          {HALVINGS.map((h) => (
            <div key={h.date} className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 inline-block flex-shrink-0" style={{ backgroundColor: COLORS.muted }} />
              <span className="text-btc-muted">{h.date}</span>
              <span className="text-btc-text">{h.label}</span>
            </div>
          ))}
          {/* Picos */}
          {BUBBLE_PEAKS.map((p) => (
            <div key={p.date} className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 inline-block flex-shrink-0 rounded-full" style={{ backgroundColor: COLORS.red }} />
              <span className="text-btc-muted">{p.date}</span>
              <span className="text-btc-red tabular-nums">Pico {formatPrice(p.price)}</span>
            </div>
          ))}
          {/* Fondos */}
          {BEAR_BOTTOMS.map((b) => (
            <div key={b.date} className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 inline-block flex-shrink-0 rounded-full" style={{ backgroundColor: COLORS.green }} />
              <span className="text-btc-muted">{b.date}</span>
              <span className="text-btc-green tabular-nums">Fondo {formatPrice(b.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
