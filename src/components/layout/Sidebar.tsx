import { useDashboard } from '../../context/DashboardContext'
import { SignalGauge } from '../sidebar/SignalGauge'
import { MetricCard } from '../sidebar/MetricCard'
import { PhaseIndicator } from '../sidebar/PhaseIndicator'
import { COLORS } from '../../constants/theme'
import { formatPrice } from '../../lib/math/utils'
import { computeFairValue } from '../../lib/math/regression'

export function Sidebar() {
  const { tradingSignal, currentPrice, regression, residuals, phaseResult, data } = useDashboard()

  const price = currentPrice?.price
  const lastPoint = data.length > 0 ? data[data.length - 1] : null
  const fairValue = lastPoint && regression
    ? computeFairValue(lastPoint.dayIndex, regression)
    : null

  const rSquared = regression?.rSquared
  const sigma = regression?.sigma
  const exponent = regression?.slope
  const currentZScore = residuals?.currentZScore
  const percentile = residuals?.percentile

  const zScoreColor =
    currentZScore === undefined || currentZScore === null
      ? COLORS.muted
      : currentZScore < -1
        ? COLORS.green
        : currentZScore > 1
          ? COLORS.red
          : COLORS.text

  return (
    <aside className="w-full h-full bg-btc-surface border-l border-btc-border overflow-y-auto flex flex-col">
      <div className="flex-shrink-0 px-3 py-2 border-b border-btc-border bg-btc-surface-2">
        <p className="text-xs font-mono uppercase tracking-widest text-btc-muted">Resumen</p>
      </div>

      <div className="flex-1">
        <SignalGauge signal={tradingSignal} />

        <MetricCard
          label="Precio Actual"
          value={price ? formatPrice(price) : '—'}
          subValue={fairValue ? `Valor justo: ${formatPrice(fairValue)}` : undefined}
          valueColor={COLORS.orange}
        />

        <MetricCard
          label="Z-Score"
          value={currentZScore !== undefined && currentZScore !== null ? currentZScore.toFixed(3) : '—'}
          subValue="Distancia del valor justo (σ)"
          valueColor={zScoreColor}
        />

        <MetricCard
          label="Percentil Histórico"
          value={percentile !== undefined && percentile !== null ? `${percentile.toFixed(1)}%` : '—'}
          subValue="Del historial de residuos"
        />

        <MetricCard
          label="R² del Modelo"
          value={rSquared !== undefined ? rSquared.toFixed(4) : '—'}
          subValue={exponent !== undefined ? `Exponente: ${exponent.toFixed(4)}` : undefined}
          valueColor={COLORS.green}
        />

        <MetricCard
          label="Sigma (σ)"
          value={sigma !== undefined ? sigma.toFixed(4) : '—'}
          subValue="Desv. estándar de residuos"
        />

        <PhaseIndicator phase={phaseResult?.currentPhase ?? null} />
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-3 py-2 border-t border-btc-border">
        <p className="text-xs font-mono text-btc-muted/50 text-center">
          Modelo matemático · No asesoramiento financiero
        </p>
      </div>
    </aside>
  )
}
